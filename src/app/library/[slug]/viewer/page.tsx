"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { auth, storage, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { ref as storageRef, getBlob } from "firebase/storage";
import { collection, query, where, getDocs, doc, getDoc, limit } from "firebase/firestore";
import { findLibraryMaterial } from "@/data/library";
import { useTypeOverrides, resolveType } from "@/lib/typeOverrides";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, ArrowLeft, Lock } from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

/**
 * Protected reader for library materials (PDF or video).
 *
 * The file lives at `library/<slug>/file.pdf` OR `library/<slug>/file.mp4` in
 * Firebase Storage and is gated by Storage Rules (admin OR slug ∈
 * user.purchasedCourseIds). It is read as a Blob via the Firebase SDK so the
 * browser never sees a shareable direct URL, and rendered inline with a
 * per-user watermark. There is no download control and save/print shortcuts
 * and the context menu are blocked — best-effort protection (a determined user
 * can still screen-record, but casual copying is stopped).
 */
export default function LibraryViewerPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;
  const material = slug ? findLibraryMaterial(slug) : undefined;
  const { overrides: typeOverrides } = useTypeOverrides();

  const [pdfFile, setPdfFile] = useState<Blob | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [mediaKind, setMediaKind] = useState<"pdf" | "video" | null>(null);
  const [email, setEmail] = useState<string>("");
  const [authReady, setAuthReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.2);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!slug) return;
    // Effective type decides which file to try first; we still fall back to the
    // other kind so an override mismatch never blocks a real upload.
    const codeType = (material?.type === "video" ? "video" : "pdf") as "pdf" | "video";
    const preferred = resolveType(slug, typeOverrides, codeType);
    const order: Array<"pdf" | "video"> = preferred === "video" ? ["video", "pdf"] : ["pdf", "video"];

    let objectUrl: string | null = null;

    const unsub = onAuthStateChanged(auth, async (user) => {
      setAuthReady(true);
      if (!user || !user.email) {
        setPdfFile(null);
        setVideoUrl(null);
        return;
      }
      setEmail(user.email);

      const tryLoad = async (kind: "pdf" | "video") => {
        const fileName = kind === "pdf" ? "file.pdf" : "file.mp4";
        try {
          const blob = await getBlob(storageRef(storage, `library/${slug}/${fileName}`));
          if (kind === "pdf") {
            setPdfFile(blob);
          } else {
            objectUrl = URL.createObjectURL(blob);
            setVideoUrl(objectUrl);
          }
          setMediaKind(kind);
          return;
        } catch (err: any) {
          if (err?.code !== "storage/object-not-found") throw err;
          // Fallback to Firestore dbCourses collection
          const slugQ = query(collection(db, "courses"), where("slug", "==", slug), limit(1));
          const bySlug = await getDocs(slugQ);
          let courseData: any = null;
          if (!bySlug.empty) {
            courseData = bySlug.docs[0].data();
          } else {
            const snap = await getDoc(doc(db, "courses", slug));
            if (snap.exists()) courseData = snap.data();
          }
          if (courseData?.filePath) {
            const blob = await getBlob(storageRef(storage, courseData.filePath));
            setPdfFile(blob);
            setMediaKind("pdf");
            return;
          }
          if (courseData?.externalUrl) {
            window.location.href = courseData.externalUrl;
            return;
          }
          throw err;
        }
      };

      let lastErr: any = null;
      for (const kind of order) {
        try {
          await tryLoad(kind);
          lastErr = null;
          break;
        } catch (err: any) {
          lastErr = err;
          // object-not-found → try the other kind; anything else → stop.
          if (err?.code !== "storage/object-not-found") break;
        }
      }
      if (lastErr) {
        const msg = lastErr?.code === "storage/unauthorized"
          ? "Нямате достъп до този материал. Ако сте го закупили, моля излезте и влезте отново."
          : lastErr?.code === "storage/object-not-found"
            ? "Материалът все още не е качен. Свържете се с д-р Николова."
            : lastErr?.message || "Грешка при зареждане";
        setLoadError(msg);
      }
    });

    return () => {
      unsub();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [slug, material, typeOverrides]);

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
  }, [mediaKind]);

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
  if (!pdfFile && !videoUrl) {
    return <div className="min-h-screen flex items-center justify-center text-brand-dark/50">Зареждане на материала…</div>;
  }

  return (
    <div className="min-h-screen bg-brand-dark text-white">
      {/* Hide print dialog */}
      <style jsx global>{`
        @media print {
          body { display: none !important; }
        }
      `}</style>

      {/* Toolbar */}
      <div className="sticky top-0 z-30 bg-brand-green/95 backdrop-blur border-b border-brand-gold/20 px-4 py-3 flex items-center justify-between gap-3 print:hidden">
        <Link href="/profile" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white/80 hover:text-brand-gold transition-colors cursor-pointer">
          <ArrowLeft className="h-3.5 w-3.5" />
          Към профила
        </Link>
        <div className="font-serif text-sm font-bold truncate flex-1 text-center px-3">{material.title}</div>
        {mediaKind === "pdf" ? (
          <div className="flex items-center gap-2">
            <button onClick={() => setScale(s => Math.max(0.5, s - 0.2))} className="text-white/80 hover:text-brand-gold p-1 cursor-pointer" aria-label="Намали"><ZoomOut className="h-4 w-4" /></button>
            <span className="text-[10px] font-mono">{Math.round(scale * 100)}%</span>
            <button onClick={() => setScale(s => Math.min(2.5, s + 0.2))} className="text-white/80 hover:text-brand-gold p-1 cursor-pointer" aria-label="Увеличи"><ZoomIn className="h-4 w-4" /></button>
            <div className="w-px h-4 bg-white/20 mx-1" />
            <button onClick={() => setPageNumber(p => Math.max(1, p - 1))} disabled={pageNumber <= 1} className="text-white/80 hover:text-brand-gold disabled:opacity-30 p-1 cursor-pointer" aria-label="Предишна"><ChevronLeft className="h-4 w-4" /></button>
            <span className="text-[10px] font-mono">{pageNumber} / {pageCount || "…"}</span>
            <button onClick={() => setPageNumber(p => Math.min(pageCount, p + 1))} disabled={pageNumber >= pageCount} className="text-white/80 hover:text-brand-gold disabled:opacity-30 p-1 cursor-pointer" aria-label="Следваща"><ChevronRight className="h-4 w-4" /></button>
          </div>
        ) : (
          <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">Видео</span>
        )}
      </div>

      {/* Content + watermark overlay */}
      <div ref={containerRef} className="relative max-w-5xl mx-auto py-8 px-4 select-none">
        <div className="relative bg-white rounded shadow-2xl mx-auto overflow-hidden min-h-[500px]" style={{ width: "fit-content", WebkitTouchCallout: "none" }}>
          
          {/* Blackout overlay when window loses focus (Snipping tool active) */}
          {isScreenBlurred && (
            <div className="absolute inset-0 z-50 bg-brand-dark flex flex-col items-center justify-center p-8 text-center text-white space-y-3">
              <Lock className="h-10 w-10 text-brand-gold" />
              <h3 className="font-serif text-base font-bold text-brand-gold">Защита на съдържанието</h3>
              <p className="text-xs text-white/70 max-w-xs">
                Материалът е скрит при загуба на фокус. Върнете се в браузъра, за да продължите четенето.
              </p>
            </div>
          )}

          {/* Protection overlay for the PDF */}
          {mediaKind === "pdf" && (
            <div className="absolute inset-0 z-10 bg-transparent select-none" style={{ WebkitTouchCallout: "none" }} />
          )}

          {mediaKind === "pdf" && pdfFile && (
            <div className={`pointer-events-none select-none transition-all duration-200 ${isScreenBlurred ? "opacity-0 blur-xl" : "opacity-100"}`}>
              <Document
                file={pdfFile}
                onLoadSuccess={({ numPages }) => setPageCount(numPages)}
                onLoadError={(err) => setLoadError(err.message)}
              >
                <Page pageNumber={pageNumber} scale={scale} renderTextLayer={false} renderAnnotationLayer={false} />
              </Document>
            </div>
          )}

          {mediaKind === "video" && videoUrl && (
            <video
              src={videoUrl}
              controls
              controlsList="nodownload noplaybackrate"
              disablePictureInPicture
              onContextMenu={(e) => e.preventDefault()}
              className={`block max-w-full max-h-[80vh] bg-black transition-all duration-200 ${isScreenBlurred ? "opacity-0 blur-xl" : "opacity-100"}`}
            />
          )}

          {/* Watermark grid overlay */}
          <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center overflow-hidden select-none" aria-hidden="true">
            <div className="absolute inset-[-50%] grid grid-cols-2 sm:grid-cols-3 gap-10 sm:gap-16 rotate-[-25deg] opacity-25 text-black font-mono text-[11px] font-black uppercase tracking-wider">
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className="whitespace-nowrap bg-yellow-200/40 text-black px-3 py-1.5 rounded border border-black/15 shadow-sm">
                  ЛИЧНО КОПИЕ: {email} • www.haccpspokoystvie.bg
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
