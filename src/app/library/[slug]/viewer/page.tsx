"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { auth, storage, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { ref as storageRef, getBlob, getDownloadURL } from "firebase/storage";
import { collection, query, where, getDocs, doc, getDoc, limit } from "firebase/firestore";
import { findLibraryMaterial, isBundle } from "@/data/library";
import { useTypeOverrides, resolveType } from "@/lib/typeOverrides";
import { findMatchingCourse } from "@/lib/courseTypes";
import { isVideoEmbed, formatVideoEmbedUrl } from "@/lib/videoUtils";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, ArrowLeft, Lock, Download, BookOpen, Gift, CheckCheck } from "lucide-react";

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

  const [pdfFile, setPdfFile] = useState<string | Blob | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [mediaKind, setMediaKind] = useState<"pdf" | "video" | null>(null);
  const [email, setEmail] = useState<string>("");
  const [authReady, setAuthReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(0.5);
  const [isBundleHub, setIsBundleHub] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const pdfOptions = useMemo(() => ({
    disableAutoFetch: true,
    disableStream: false,
  }), []);

  useEffect(() => {
    if (!slug) return;

    // Effective type decides which file to try first; we still fall back to the
    // other kind so an override mismatch never blocks a real upload.
    const codeType = (material?.type === "video" ? "video" : "pdf") as "pdf" | "video";
    const preferred = resolveType(slug, typeOverrides, codeType);
    const order: Array<"pdf" | "video"> = preferred === "video" ? ["video", "pdf"] : ["pdf", "video"];

    const unsub = onAuthStateChanged(auth, async (user) => {
      setAuthReady(true);
      if (!user || !user.email) {
        setPdfFile(null);
        setVideoUrl(null);
        return;
      }
      setEmail(user.email);

      // Handle bundle packages (e.g. all 3 parts of the Bible)
      if (isBundle(slug)) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.email.toLowerCase()));
          const purchased: string[] = userDoc.data()?.purchasedCourseIds || [];
          const isAdmin = user.email.toLowerCase() === "d.nikolova.haccp@gmail.com";
          const hasAccess =
            isAdmin ||
            purchased.some(
              (id) =>
                id === slug ||
                id === "prakticheska-biblia-chast-1" ||
                id === "prakticheska-biblia-chast-2" ||
                id === "prakticheska-biblia-chast-3"
            );
          if (hasAccess) {
            setIsBundleHub(true);
            return;
          } else {
            setLoadError(
              "Нямате достъп до този пакет. Ако вече сте го заплатили, моля изчакайте потвърждение от администратора."
            );
            return;
          }
        } catch (e: any) {
          setLoadError("Грешка при проверка на достъпа: " + (e?.message || e));
          return;
        }
      }

      // Pre-load course data to resolve modern dynamic items paths
      let courseData: any = null;
      try {
        const coursesSnap = await getDocs(collection(db, "courses"));
        const allDb = coursesSnap.docs.map(d => ({ id: d.id, ...d.data() } as any));
        courseData = findMatchingCourse({ slug, id: slug, title: material?.title }, allDb);
        const hasVideoLessons = !!(courseData?.items && courseData.items.some((it: any) => it.type === "video"));
        if (hasVideoLessons && courseData?.items && courseData.items.length > 1) {
          window.location.replace(`/courses/${courseData.slug || courseData.id || slug}/viewer`);
          return;
        }
      } catch (e) {
        console.warn("Could not check courses in Firestore:", e);
      }

// Local IndexedDB caching helper to save bandwidth and load instantly
async function getCachedBlob(key: string): Promise<Blob | null> {
  if (typeof window === "undefined" || !window.indexedDB) return null;
  return new Promise((resolve) => {
    try {
      const req = indexedDB.open("danka_viewer_cache", 1);
      req.onupgradeneeded = () => {
        req.result.createObjectStore("blobs");
      };
      req.onsuccess = () => {
        const db = req.result;
        try {
          const tx = db.transaction("blobs", "readonly");
          const store = tx.objectStore("blobs");
          const getReq = store.get(key);
          getReq.onsuccess = () => resolve(getReq.result || null);
          getReq.onerror = () => resolve(null);
        } catch {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

async function setCachedBlob(key: string, blob: Blob): Promise<void> {
  if (typeof window === "undefined" || !window.indexedDB) return;
  try {
    const req = indexedDB.open("danka_viewer_cache", 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore("blobs");
    };
    req.onsuccess = () => {
      const db = req.result;
      try {
        const tx = db.transaction("blobs", "readwrite");
        tx.objectStore("blobs").put(blob, key);
      } catch {}
    };
  } catch {}
}

      const tryLoad = async (kind: "pdf" | "video") => {
        const fileName = kind === "pdf" ? "file.pdf" : "file.mp4";
        const cacheKey = `library_${slug}_${fileName}`;

        // 1. Try local cache first for PDF
        if (kind === "pdf") {
          const cached = await getCachedBlob(cacheKey);
          if (cached) {
            setPdfFile(cached);
            setMediaKind("pdf");
            return;
          }
        }

        // Direct embed URL (Bunny.net Stream, YouTube, Vimeo) for video materials
        if (kind === "video") {
          if (material?.contentUrl && material.contentUrl !== "#") {
            setVideoUrl(material.contentUrl);
            setMediaKind("video");
            return;
          }
          if (courseData?.externalUrl) {
            setVideoUrl(courseData.externalUrl);
            setMediaKind("video");
            return;
          }
          if (courseData?.items && Array.isArray(courseData.items)) {
            const extVid = courseData.items.find((it: any) => it.type === "video" && it.externalUrl);
            if (extVid?.externalUrl) {
              setVideoUrl(extVid.externalUrl);
              setMediaKind("video");
              return;
            }
          }
        }

        // Candidates for where this file might be stored:
        const candidatePaths: string[] = [];

        // Dynamic items uploaded via course editor (e.g. courses/slug/items/item_....pdf)
        if (courseData?.items && Array.isArray(courseData.items)) {
          for (const it of courseData.items) {
            if (it.filePath) {
              const lower = it.filePath.toLowerCase();
              const isPdf = lower.endsWith(".pdf") || it.type === "pdf";
              const isVid = lower.endsWith(".mp4") || lower.endsWith(".mov") || lower.endsWith(".webm") || it.type === "video";
              if ((kind === "pdf" && isPdf) || (kind === "video" && isVid)) {
                candidatePaths.push(it.filePath);
              }
            }
          }
        }

        // Legacy course single filePath
        if (courseData?.filePath) {
          const lower = courseData.filePath.toLowerCase();
          const isPdf = lower.endsWith(".pdf") || courseData.type === "pdf";
          const isVid = lower.endsWith(".mp4") || lower.endsWith(".mov") || lower.endsWith(".webm") || courseData.type === "video";
          if ((kind === "pdf" && isPdf) || (kind === "video" && isVid)) {
            candidatePaths.push(courseData.filePath);
          }
        }

        // Standard conventions
        candidatePaths.push(`courses/${slug}/${fileName}`);
        candidatePaths.push(`library/${slug}/${fileName}`);
        if (courseData?.id && courseData.id !== slug) {
          candidatePaths.push(`courses/${courseData.id}/${fileName}`);
          candidatePaths.push(`library/${courseData.id}/${fileName}`);
        }

        const uniqueCandidates = Array.from(new Set(candidatePaths));

        for (const p of uniqueCandidates) {
          try {
            const ref = storageRef(storage, p);
            const streamUrl = await getDownloadURL(ref);
            if (streamUrl) {
              if (kind === "pdf") {
                setPdfFile(streamUrl);
                setMediaKind("pdf");
                return;
              } else {
                setVideoUrl(streamUrl);
                setMediaKind("video");
                return;
              }
            }
          } catch {
            // continue to next candidate
          }
        }

        // Fallbacks if not found directly
        if (material?.downloadUrl && material.downloadUrl !== "#") {
          window.location.href = material.downloadUrl;
          return;
        }

        if (courseData?.externalUrl) {
          window.location.href = courseData.externalUrl;
          return;
        }

        throw new Error("Файлът не е намерен на сървъра.");
      };

      let lastErr: any = null;
      for (const kind of order) {
        try {
          await tryLoad(kind);
          lastErr = null;
          break;
        } catch (err: any) {
          lastErr = err;
          // object-not-found or quota-exceeded → try the other kind; anything else → stop.
          if (err?.code !== "storage/object-not-found" && err?.code !== "storage/quota-exceeded") break;
        }
      }
      if (lastErr) {
        if (material?.downloadUrl && material.downloadUrl !== "#") {
          window.location.href = material.downloadUrl;
          return;
        }
        const msg = lastErr?.code === "storage/unauthorized"
          ? "Нямате достъп до този материал. Ако сте го закупили, моля излезте и влезте отново."
          : lastErr?.code === "storage/object-not-found"
            ? "Материалът все още не е качен. Свържете се с д-р Николова."
            : lastErr?.code === "storage/quota-exceeded"
              ? "Файловият сървър временно надвиши лимита на трафика за деня. Моля, свържете се с д-р Николова за директен алтернативен достъп или опитайте отново."
              : lastErr?.message || "Грешка при зареждане";
        setLoadError(msg);
      }
    });

    return () => {
      unsub();
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
      <div className="min-h-screen bg-brand-light flex flex-col items-center justify-center gap-4 p-8 text-center max-w-md mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-brand-gold/10 text-brand-gold flex items-center justify-center">
          <Lock className="h-7 w-7" />
        </div>
        <p className="text-brand-dark/80 text-sm leading-relaxed">{loadError}</p>
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          {material?.downloadUrl && material.downloadUrl !== "#" && (
            <a
              href={material.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-gold text-brand-dark font-bold text-xs uppercase tracking-wider hover:bg-brand-gold-dark hover:text-white transition-all shadow-md"
            >
              <Download className="h-4 w-4" />
              Отвори през Google Drive
            </a>
          )}
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-green text-white font-bold text-xs uppercase tracking-wider hover:bg-brand-green/90 transition-all shadow-md"
          >
            Свържи се с д-р Николова
          </Link>
        </div>
        <Link href="/profile" className="text-xs font-bold uppercase tracking-wider text-brand-dark/50 hover:text-brand-gold hover:underline mt-2">
          ← Към профила
        </Link>
      </div>
    );
  }

  if (isBundleHub) {
    return (
      <div className="min-h-screen bg-brand-light pb-24">
        {/* Header */}
        <div className="bg-brand-green text-white py-4 px-4 sm:px-8 border-b border-brand-gold/20 flex items-center justify-between">
          <Link
            href="/profile"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white/80 hover:text-brand-gold transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Към профила
          </Link>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-gold hidden sm:inline">
            Пълен пакет
          </span>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8">
          <div className="text-center space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-gold/15 border border-brand-gold/30 text-brand-dark text-[10px] font-black uppercase tracking-wider">
              <CheckCheck className="h-3.5 w-3.5 text-brand-gold" />
              Всички 3 части са отключени
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-green">
              {material.title}
            </h1>
            <p className="text-sm text-brand-dark/70 max-w-2xl mx-auto leading-relaxed">
              Изберете коя част желаете да четете или изтеглете работните материали от бутоните по-долу:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Part 1 */}
            <div className="bg-white rounded-3xl border border-brand-green/15 p-6 shadow-md flex flex-col justify-between space-y-4 hover:shadow-xl transition-shadow">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-brand-gold block">Част I</span>
                <h3 className="font-serif text-lg font-bold text-brand-green leading-snug">
                  Основи и изграждане на системата за самоконтрол
                </h3>
                <p className="text-xs text-brand-dark/65 leading-relaxed">
                  Откъде да започнете, кои ДПХП са приложими и как да организирате записите.
                </p>
              </div>
              <div className="space-y-2 pt-2 border-t border-brand-green/5">
                <Link
                  href="/library/prakticheska-biblia-chast-1/viewer"
                  className="inline-flex items-center justify-center gap-1.5 w-full py-3 px-4 bg-brand-green hover:bg-brand-green/90 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow text-center"
                >
                  <BookOpen className="h-4 w-4" /> Чети Част I в четеца
                </Link>
                <a
                  href="https://drive.google.com/file/d/13xOUsJPL--w7gyRbsK8Bjyi_Qfl1e0-R/view?usp=drive_link"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-3 bg-brand-gold/15 hover:bg-brand-gold/25 text-brand-dark font-bold text-[10px] uppercase tracking-wider rounded-xl transition-colors border border-brand-gold/30 text-center"
                >
                  <Gift className="h-3.5 w-3.5 text-brand-gold" /> Бонус: Грешки при записите
                </a>
              </div>
            </div>

            {/* Part 2 */}
            <div className="bg-white rounded-3xl border border-brand-green/15 p-6 shadow-md flex flex-col justify-between space-y-4 hover:shadow-xl transition-shadow">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-brand-gold block">Част II</span>
                <h3 className="font-serif text-lg font-bold text-brand-green leading-snug">
                  Добри хигиенни и производствени практики и НАССР
                </h3>
                <p className="text-xs text-brand-dark/65 leading-relaxed">
                  Продължение — от нормативните изисквания към практическото прилагане в обекта.
                </p>
              </div>
              <div className="pt-2 border-t border-brand-green/5">
                <Link
                  href="/library/prakticheska-biblia-chast-2/viewer"
                  className="inline-flex items-center justify-center gap-1.5 w-full py-3 px-4 bg-brand-green hover:bg-brand-green/90 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow text-center"
                >
                  <BookOpen className="h-4 w-4" /> Чети Част II в четеца
                </Link>
              </div>
            </div>

            {/* Part 3 */}
            <div className="bg-white rounded-3xl border border-brand-green/15 p-6 shadow-md flex flex-col justify-between space-y-4 hover:shadow-xl transition-shadow">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-brand-gold block">Част III</span>
                <h3 className="font-serif text-lg font-bold text-brand-green leading-snug">
                  Приложения: заповеди, дневници и чек листи
                </h3>
                <p className="text-xs text-brand-dark/65 leading-relaxed">
                  Готови работни образци и бланки, подредени по номерата на ДПХП.
                </p>
              </div>
              <div className="pt-2 border-t border-brand-green/5">
                <Link
                  href="/library/prakticheska-biblia-chast-3/viewer"
                  className="inline-flex items-center justify-center gap-1.5 w-full py-3 px-4 bg-brand-green hover:bg-brand-green/90 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow text-center"
                >
                  <BookOpen className="h-4 w-4" /> Чети Част III в четеца
                </Link>
              </div>
            </div>
          </div>
        </div>
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
            <button onClick={() => setScale(s => Math.max(0.2, Math.round((s - 0.1) * 10) / 10))} className="text-white/80 hover:text-brand-gold p-1 cursor-pointer" aria-label="Намали"><ZoomOut className="h-4 w-4" /></button>
            <span className="text-[10px] font-mono">{Math.round(scale * 100)}%</span>
            <button onClick={() => setScale(s => Math.min(2.5, Math.round((s + 0.1) * 10) / 10))} className="text-white/80 hover:text-brand-gold p-1 cursor-pointer" aria-label="Увеличи"><ZoomIn className="h-4 w-4" /></button>
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
                options={pdfOptions}
                onLoadSuccess={({ numPages }) => setPageCount(numPages)}
                onLoadError={(err) => setLoadError(err.message)}
              >
                <Page pageNumber={pageNumber} scale={scale} renderTextLayer={false} renderAnnotationLayer={false} />
              </Document>
            </div>
          )}

          {mediaKind === "video" && videoUrl && (
            isVideoEmbed(videoUrl) ? (
              <div className={`relative w-full aspect-video min-w-[320px] sm:min-w-[640px] md:min-w-[850px] max-w-5xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 transition-all duration-200 ${isScreenBlurred ? "opacity-0 blur-xl" : "opacity-100"}`}>
                <iframe
                  src={formatVideoEmbedUrl(videoUrl)}
                  loading="lazy"
                  className="w-full h-full border-0 absolute inset-0"
                  allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
                  allowFullScreen
                />
              </div>
            ) : (
              <video
                src={videoUrl}
                preload="metadata"
                controls
                controlsList="nodownload noplaybackrate"
                disablePictureInPicture
                playsInline
                onContextMenu={(e) => e.preventDefault()}
                className={`block max-w-full max-h-[80vh] bg-black transition-all duration-200 ${isScreenBlurred ? "opacity-0 blur-xl" : "opacity-100"}`}
              />
            )
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
