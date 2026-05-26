"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { auth, db, storage } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs, limit } from "firebase/firestore";
import { ref as storageRef, getBlob } from "firebase/storage";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, ArrowLeft, Lock } from "lucide-react";

// Load the worker from CDN matched to the exact version react-pdf is using.
// Avoids the "API version X does not match Worker version Y" mismatch when
// pdfjs-dist and react-pdf resolve to different versions in node_modules.
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

/**
 * Protected PDF reader.
 * - User must be authenticated.
 * - Fetches a 1-hour signed URL from /api/courses/{id}/url.
 * - Renders with react-pdf; no native browser download/print toolbar.
 * - Watermark overlay shows the viewer's email on every page.
 */
export default function CourseViewerPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const courseId = params?.id;

  const [pdfFile, setPdfFile] = useState<Blob | null>(null);
  const [email, setEmail] = useState<string>("");
  const [authReady, setAuthReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.2);
  const containerRef = useRef<HTMLDivElement>(null);

  // Listen to auth state; fetch PDF directly via Firebase Storage.
  // Storage rules verify the buyer owns the course (cross-check Firestore),
  // so no Admin SDK / API route is needed.
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setAuthReady(true);
      if (!user || !user.email) {
        setPdfFile(null);
        return;
      }
      setEmail(user.email);
      try {
        // 1. Load course doc — try slug first, fall back to doc id.
        let courseData: { filePath?: string; externalUrl?: string; type?: "pdf" | "link" } | null = null;
        const slugQ = query(collection(db, "courses"), where("slug", "==", courseId as string), limit(1));
        const bySlug = await getDocs(slugQ);
        if (!bySlug.empty) {
          courseData = bySlug.docs[0].data() as typeof courseData;
        } else {
          const courseSnap = await getDoc(doc(db, "courses", courseId as string));
          if (courseSnap.exists()) courseData = courseSnap.data() as typeof courseData;
        }
        if (!courseData) {
          throw new Error("Курсът не съществува");
        }
        // External link course → redirect to the URL instead of rendering PDF.
        if ((courseData.type ?? "pdf") === "link" && courseData.externalUrl) {
          window.location.href = courseData.externalUrl;
          return;
        }
        if (!courseData.filePath) {
          throw new Error("Курсът няма прикачен файл.");
        }
        // 2. Download the PDF as a Blob through the Firebase SDK. Storage rules
        //    deny this unless the caller is admin OR has purchasedCourseIds
        //    containing this courseId. Using getBlob (not getDownloadURL+fetch)
        //    avoids the browser CORS preflight on firebasestorage.googleapis.com.
        const blob = await getBlob(storageRef(storage, courseData.filePath));
        setPdfFile(blob);
      } catch (err: any) {
        const msg = err?.code === "storage/unauthorized"
          ? "Нямате достъп до този курс. Ако сте го закупили, моля излезте и влезте отново."
          : err?.message || "Грешка при зареждане на курса";
        setLoadError(msg);
      }
    });
    return unsub;
  }, [courseId]);

  // Disable common save shortcuts. NOT a real defense but stops casual users.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && ["s", "p"].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
    };
    const onCtx = (e: MouseEvent) => e.preventDefault();
    window.addEventListener("keydown", onKey);
    containerRef.current?.addEventListener("contextmenu", onCtx);
    return () => {
      window.removeEventListener("keydown", onKey);
      containerRef.current?.removeEventListener("contextmenu", onCtx);
    };
  }, []);

  const onLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setPageCount(numPages);
    setPageNumber(1);
  }, []);

  if (!authReady) {
    return <div className="min-h-screen flex items-center justify-center text-brand-dark/50">Проверка на достъпа…</div>;
  }

  if (!email) {
    return (
      <div className="min-h-screen bg-brand-light flex flex-col items-center justify-center gap-3 p-8 text-center">
        <Lock className="h-10 w-10 text-brand-gold/50" />
        <p className="text-brand-dark/70 text-sm">За да отворите курса, моля влезте в профила си.</p>
        <Link href="/profile" className="text-xs font-bold uppercase tracking-wider text-brand-gold hover:underline cursor-pointer">
          Към вход →
        </Link>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-brand-light flex flex-col items-center justify-center gap-3 p-8 text-center">
        <Lock className="h-10 w-10 text-red-500/70" />
        <p className="text-brand-dark/70 text-sm font-medium">Нямате достъп до този курс.</p>
        <p className="text-xs text-brand-dark/50 max-w-md">{loadError}</p>
        <Link href="/bookstore" className="text-xs font-bold uppercase tracking-wider text-brand-gold hover:underline cursor-pointer">
          ← Към каталога
        </Link>
      </div>
    );
  }

  if (!pdfFile) {
    return <div className="min-h-screen flex items-center justify-center text-brand-dark/50">Зареждане на курса…</div>;
  }

  return (
    <div className="bg-brand-dark min-h-screen text-white" ref={containerRef}>
      {/* Toolbar (custom — no download/print) */}
      <div className="sticky top-0 z-30 bg-brand-green/95 backdrop-blur-md border-b border-brand-gold/20 px-4 py-3 flex items-center justify-between gap-3 print:hidden">
        <Link href="/profile" className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-white/70 hover:text-brand-gold transition-colors cursor-pointer">
          <ArrowLeft className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Към профила</span>
        </Link>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setPageNumber(p => Math.max(1, p - 1))}
            disabled={pageNumber <= 1}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            aria-label="Предишна страница"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="font-mono tabular-nums min-w-[64px] text-center">{pageNumber} / {pageCount || "…"}</span>
          <button
            onClick={() => setPageNumber(p => Math.min(pageCount, p + 1))}
            disabled={pageNumber >= pageCount}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            aria-label="Следваща страница"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setScale(s => Math.max(0.6, s - 0.2))}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
            aria-label="Намали"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <span className="font-mono tabular-nums min-w-[48px] text-center">{Math.round(scale * 100)}%</span>
          <button
            onClick={() => setScale(s => Math.min(3, s + 0.2))}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
            aria-label="Увеличи"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Page area + repeating watermark */}
      <div className="relative flex justify-center py-6 select-none">
        <div className="relative">
          <Document
            file={pdfFile}
            onLoadSuccess={onLoadSuccess}
            onLoadError={(err) => setLoadError(err.message)}
            loading={<div className="text-white/60 text-sm">Зареждане на страница…</div>}
            error={<div className="text-red-300 text-sm">Грешка при четенето на PDF файла.</div>}
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              className="shadow-2xl"
            />
          </Document>

          {/* Watermark overlay — pointer-events:none so it doesn't intercept anything,
              tiles the page with the viewer's email + date. */}
          <div
            className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden"
            aria-hidden="true"
          >
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-6 gap-4 rotate-[-30deg] opacity-15">
              {Array.from({ length: 12 }).map((_, i) => (
                <span key={i} className="text-brand-dark text-[11px] font-bold whitespace-nowrap">
                  {email} · {new Date().toLocaleDateString("bg-BG")}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="text-center text-[10px] text-white/40 pb-6 px-4">
        Този материал е защитен с авторски права. Достъп само за {email}. Разпространението е забранено.
      </div>
    </div>
  );
}
