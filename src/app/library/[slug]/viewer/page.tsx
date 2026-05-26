"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { auth, storage } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { ref as storageRef, getBlob } from "firebase/storage";
import { findLibraryMaterial } from "@/data/library";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, ArrowLeft, Lock } from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

/**
 * Protected PDF reader for library materials.
 *
 * The PDF lives at `library/<slug>/file.pdf` in Firebase Storage and is
 * gated by Storage Rules (admin OR slug ∈ user.purchasedCourseIds).
 * Reads as a Blob via Firebase SDK so the browser never sees a direct URL.
 */
export default function LibraryViewerPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const slug = params?.slug;
  const material = slug ? findLibraryMaterial(slug) : undefined;

  const [pdfFile, setPdfFile] = useState<Blob | null>(null);
  const [email, setEmail] = useState<string>("");
  const [authReady, setAuthReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.2);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!slug) return;
    const unsub = onAuthStateChanged(auth, async (user) => {
      setAuthReady(true);
      if (!user || !user.email) {
        setPdfFile(null);
        return;
      }
      setEmail(user.email);
      try {
        const blob = await getBlob(storageRef(storage, `library/${slug}/file.pdf`));
        setPdfFile(blob);
      } catch (err: any) {
        const msg = err?.code === "storage/unauthorized"
          ? "Нямате достъп до този материал. Ако сте го закупили, моля излезте и влезте отново."
          : err?.code === "storage/object-not-found"
            ? "Материалът все още не е качен. Свържете се с д-р Николова."
            : err?.message || "Грешка при зареждане";
        setLoadError(msg);
      }
    });
    return unsub;
  }, [slug]);

  // Block save / print shortcuts and right-click — not real defense but stops casual users.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && ["s", "p"].includes(e.key.toLowerCase())) e.preventDefault();
    };
    const onCtx = (e: MouseEvent) => e.preventDefault();
    window.addEventListener("keydown", onKey);
    containerRef.current?.addEventListener("contextmenu", onCtx);
    return () => {
      window.removeEventListener("keydown", onKey);
      containerRef.current?.removeEventListener("contextmenu", onCtx);
    };
  }, []);

  if (!material) {
    return (
      <div className="min-h-screen bg-brand-light flex flex-col items-center justify-center gap-3 p-8 text-center">
        <Lock className="h-10 w-10 text-brand-gold/40" />
        <p className="text-brand-dark/70">Този материал не съществува.</p>
        <Link href="/library" className="text-xs font-bold uppercase tracking-wider text-brand-gold hover:underline cursor-pointer">← Към каталога</Link>
      </div>
    );
  }
  if (!authReady) {
    return <div className="min-h-screen flex items-center justify-center text-brand-dark/50">Зареждане…</div>;
  }
  if (!email) {
    return (
      <div className="min-h-screen bg-brand-light flex flex-col items-center justify-center gap-3 p-8 text-center">
        <Lock className="h-10 w-10 text-brand-gold/40" />
        <p className="text-brand-dark/70">Моля влезте в профила си.</p>
        <Link href="/profile" className="text-xs font-bold uppercase tracking-wider text-brand-gold hover:underline cursor-pointer">→ Към портала</Link>
      </div>
    );
  }
  if (loadError) {
    return (
      <div className="min-h-screen bg-brand-light flex flex-col items-center justify-center gap-3 p-8 text-center max-w-md mx-auto">
        <Lock className="h-10 w-10 text-brand-gold/40" />
        <p className="text-brand-dark/70 text-sm">{loadError}</p>
        <Link href="/profile" className="text-xs font-bold uppercase tracking-wider text-brand-gold hover:underline cursor-pointer">← Към профила</Link>
      </div>
    );
  }
  if (!pdfFile) {
    return <div className="min-h-screen flex items-center justify-center text-brand-dark/50">Зареждане на материала…</div>;
  }

  return (
    <div className="min-h-screen bg-brand-dark text-white">
      {/* Toolbar */}
      <div className="sticky top-0 z-30 bg-brand-green/95 backdrop-blur border-b border-brand-gold/20 px-4 py-3 flex items-center justify-between gap-3 print:hidden">
        <Link href="/profile" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white/80 hover:text-brand-gold transition-colors cursor-pointer">
          <ArrowLeft className="h-3.5 w-3.5" />
          Към профила
        </Link>
        <div className="font-serif text-sm font-bold truncate flex-1 text-center px-3">{material.title}</div>
        <div className="flex items-center gap-2">
          <button onClick={() => setScale(s => Math.max(0.5, s - 0.2))} className="text-white/80 hover:text-brand-gold p-1 cursor-pointer" aria-label="Намали"><ZoomOut className="h-4 w-4" /></button>
          <span className="text-[10px] font-mono">{Math.round(scale * 100)}%</span>
          <button onClick={() => setScale(s => Math.min(2.5, s + 0.2))} className="text-white/80 hover:text-brand-gold p-1 cursor-pointer" aria-label="Увеличи"><ZoomIn className="h-4 w-4" /></button>
          <div className="w-px h-4 bg-white/20 mx-1" />
          <button onClick={() => setPageNumber(p => Math.max(1, p - 1))} disabled={pageNumber <= 1} className="text-white/80 hover:text-brand-gold disabled:opacity-30 p-1 cursor-pointer" aria-label="Предишна"><ChevronLeft className="h-4 w-4" /></button>
          <span className="text-[10px] font-mono">{pageNumber} / {pageCount || "…"}</span>
          <button onClick={() => setPageNumber(p => Math.min(pageCount, p + 1))} disabled={pageNumber >= pageCount} className="text-white/80 hover:text-brand-gold disabled:opacity-30 p-1 cursor-pointer" aria-label="Следваща"><ChevronRight className="h-4 w-4" /></button>
        </div>
      </div>

      {/* PDF + watermark overlay */}
      <div ref={containerRef} className="relative max-w-5xl mx-auto py-8 px-4">
        <div className="relative bg-white rounded shadow-2xl mx-auto" style={{ width: "fit-content" }}>
          <Document
            file={pdfFile}
            onLoadSuccess={({ numPages }) => setPageCount(numPages)}
            onLoadError={(err) => setLoadError(err.message)}
          >
            <Page pageNumber={pageNumber} scale={scale} renderTextLayer={false} renderAnnotationLayer={false} />
          </Document>
          {/* Watermark overlay */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center select-none">
            <div className="text-brand-dark/10 font-serif text-2xl sm:text-4xl rotate-[-30deg] whitespace-nowrap font-bold tracking-wide">
              {email} · {new Date().toLocaleDateString("bg-BG")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
