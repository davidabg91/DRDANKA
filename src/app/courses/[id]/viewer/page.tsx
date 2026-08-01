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
          courseData = bySlug.docs[0].data() as { filePath?: string; externalUrl?: string; type?: "pdf" | "link" };
        } else {
          const courseSnap = await getDoc(doc(db, "courses", courseId as string));
          if (courseSnap.exists()) {
            courseData = courseSnap.data() as { filePath?: string; externalUrl?: string; type?: "pdf" | "link" };
          }
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

  const [isScreenBlurred, setIsScreenBlurred] = useState(false);

  // Blur / blackout on window blur or visibility change (mitigates snipping tools)
  useEffect(() => {
    const handleBlur = () => setIsScreenBlurred(true);
    const handleFocus = () => setIsScreenBlurred(false);
    const handleVisibility = () => {
      if (document.visibilityState === "hidden") {
        setIsScreenBlurred(true);
      } else {
        setIsScreenBlurred(false);
      }
    };

    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  // Block save / print shortcuts, PrintScreen, and right-click
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (
        key === "printscreen" ||
        e.code === "PrintScreen" ||
        ((e.ctrlKey || e.metaKey) && ["s", "p", "u", "i"].includes(key)) ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && ["s", "3", "4", "c", "i"].includes(key))
      ) {
        e.preventDefault();
        e.stopPropagation();
        setIsScreenBlurred(true);
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText("").catch(() => {});
        }
        setTimeout(() => setIsScreenBlurred(false), 2500);
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "PrintScreen" || e.code === "PrintScreen") {
        setIsScreenBlurred(true);
        setTimeout(() => setIsScreenBlurred(false), 2500);
      }
    };
    const onCtx = (e: MouseEvent) => e.preventDefault();

    window.addEventListener("keydown", onKey, true);
    window.addEventListener("keyup", onKeyUp, true);
    const node = containerRef.current;
    node?.addEventListener("contextmenu", onCtx);
    return () => {
      window.removeEventListener("keydown", onKey, true);
      window.removeEventListener("keyup", onKeyUp, true);
      node?.removeEventListener("contextmenu", onCtx);
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
      {/* Hide print dialog */}
      <style jsx global>{`
        @media print {
          body { display: none !important; }
        }
      `}</style>

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
        <div className="relative overflow-hidden min-h-[500px]" style={{ WebkitTouchCallout: "none" }}>
          
          {/* Blackout overlay when window loses focus (Snipping tool active) */}
          {isScreenBlurred && (
            <div className="absolute inset-0 z-50 bg-brand-dark flex flex-col items-center justify-center p-8 text-center text-white space-y-3">
              <Lock className="h-10 w-10 text-brand-gold" />
              <h3 className="font-serif text-base font-bold text-brand-gold">Защита на съдържанието</h3>
              <p className="text-xs text-white/70 max-w-xs">
                Курсът е скрит при загуба на фокус. Върнете се в браузъра, за да продължите четенето.
              </p>
            </div>
          )}

          {/* Protection overlay that intercepts right-click/long-press */}
          <div className="absolute inset-0 z-10 bg-transparent select-none" style={{ WebkitTouchCallout: "none" }} />

          <div className={`pointer-events-none select-none transition-all duration-200 ${isScreenBlurred ? "opacity-0 blur-xl" : "opacity-100"}`}>
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
          </div>

          {/* Dense Watermark Grid Overlay */}
          <div
            className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center overflow-hidden select-none"
            aria-hidden="true"
          >
            <div className="absolute inset-[-50%] grid grid-cols-2 sm:grid-cols-3 gap-10 sm:gap-16 rotate-[-25deg] opacity-25 text-black font-mono text-[11px] font-black uppercase tracking-wider">
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className="whitespace-nowrap bg-yellow-200/40 text-black px-3 py-1.5 rounded border border-black/15 shadow-sm">
                  ЛИЧНО КОПИЕ: {email}
                </div>
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
