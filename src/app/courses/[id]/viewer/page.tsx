"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { auth, db, storage } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs, limit } from "firebase/firestore";
import { ref as storageRef, getBlob } from "firebase/storage";
import { Course, CourseMaterialItem } from "@/lib/courseTypes";
import {
  ChevronLeft, ChevronRight, ZoomIn, ZoomOut, ArrowLeft, Lock,
  Video, FileText, ExternalLink, PlayCircle, List
} from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function CourseViewerPage() {
  const params = useParams<{ id: string }>();
  const courseId = params?.id;

  const [course, setCourse] = useState<Course | null>(null);
  const [items, setItems] = useState<CourseMaterialItem[]>([]);
  const [activeItemIndex, setActiveItemIndex] = useState<number>(0);

  // Active item state
  const [pdfFile, setPdfFile] = useState<Blob | null>(null);
  const [videoBlobUrl, setVideoBlobUrl] = useState<string | null>(null);
  const [loadingItem, setLoadingItem] = useState(false);

  const [email, setEmail] = useState<string>("");
  const [authReady, setAuthReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.2);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);

  // Load course doc from Firestore
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setAuthReady(true);
      if (!user || !user.email) {
        setCourse(null);
        return;
      }
      setEmail(user.email);
      try {
        let courseData: Course | null = null;
        const slugQ = query(collection(db, "courses"), where("slug", "==", courseId as string), limit(1));
        const bySlug = await getDocs(slugQ);
        if (!bySlug.empty) {
          courseData = { id: bySlug.docs[0].id, ...bySlug.docs[0].data() } as Course;
        } else {
          const courseSnap = await getDoc(doc(db, "courses", courseId as string));
          if (courseSnap.exists()) {
            courseData = { id: courseSnap.id, ...courseSnap.data() } as Course;
          }
        }
        if (!courseData) {
          throw new Error("Курсът не съществува");
        }
        setCourse(courseData);

        // Build list of items: if course.items exists, use it; else convert legacy single-file course
        if (courseData.items && courseData.items.length > 0) {
          const sorted = [...courseData.items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
          setItems(sorted);
        } else if (courseData.filePath) {
          const isVid = courseData.filePath.endsWith(".mp4") || courseData.type === "video";
          setItems([
            {
              id: "legacy_1",
              title: courseData.title || "Материал към курса",
              type: isVid ? "video" : "pdf",
              filePath: courseData.filePath,
              fileSizeMb: courseData.fileSizeMb,
              order: 1,
            },
          ]);
        } else if (courseData.externalUrl) {
          setItems([
            {
              id: "legacy_link",
              title: courseData.title || "Външно обучение",
              type: "link",
              externalUrl: courseData.externalUrl,
              order: 1,
            },
          ]);
        }
      } catch (err: any) {
        const msg = err?.code === "storage/unauthorized"
          ? "Нямате достъп до този курс. Ако сте го закупили, моля излезте и влезте отново."
          : err?.message || "Грешка при зареждане на курса";
        setLoadError(msg);
      }
    });
    return unsub;
  }, [courseId]);

  // Load content for activeItem
  useEffect(() => {
    if (items.length === 0) return;
    const current = items[activeItemIndex] || items[0];
    if (!current) return;

    let activeObjectUrl: string | null = null;
    let cancelled = false;

    const loadContent = async () => {
      setLoadingItem(true);
      setPdfFile(null);
      setVideoBlobUrl(null);
      setPageNumber(1);

      try {
        if (current.type === "pdf" && current.filePath) {
          const blob = await getBlob(storageRef(storage, current.filePath));
          if (!cancelled) setPdfFile(blob);
        } else if (current.type === "video" && current.filePath) {
          const blob = await getBlob(storageRef(storage, current.filePath));
          if (!cancelled) {
            activeObjectUrl = URL.createObjectURL(blob);
            setVideoBlobUrl(activeObjectUrl);
          }
        }
      } catch (err: any) {
        if (!cancelled) {
          const msg = err?.code === "storage/unauthorized"
            ? "Нямате права за отваряне на този материал."
            : err?.message || "Грешка при зареждане на файла.";
          setLoadError(msg);
        }
      } finally {
        if (!cancelled) setLoadingItem(false);
      }
    };

    loadContent();

    return () => {
      cancelled = true;
      if (activeObjectUrl) URL.revokeObjectURL(activeObjectUrl);
    };
  }, [items, activeItemIndex]);

  const [isScreenBlurred, setIsScreenBlurred] = useState(false);

  // Anti-snipping & security protections
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

  // Block print/copy/dev shortcuts
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
    return <div className="min-h-screen bg-[#07130F] flex items-center justify-center text-white/50">Проверка на достъпа…</div>;
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
        <Link href="/profile" className="text-xs font-bold uppercase tracking-wider text-brand-gold hover:underline cursor-pointer">
          ← Към профила
        </Link>
      </div>
    );
  }

  const activeItem = items[activeItemIndex];
  const hasMultipleItems = items.length > 1;

  return (
    <div className="bg-[#0A1813] min-h-screen text-white flex flex-col select-none" ref={containerRef}>
      <style jsx global>{`
        @media print {
          body { display: none !important; }
        }
      `}</style>

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#0E221B]/95 backdrop-blur-md border-b border-brand-gold/20 px-4 py-3 flex items-center justify-between gap-3 print:hidden">
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/profile" className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-white/70 hover:text-brand-gold transition-colors cursor-pointer shrink-0">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Профил</span>
          </Link>
          <div className="h-4 w-px bg-white/10 hidden sm:block" />
          <div className="min-w-0">
            <h1 className="text-xs sm:text-sm font-bold text-white truncate">{course?.title || "Обучение"}</h1>
            {activeItem && (
              <p className="text-[10px] text-brand-gold truncate flex items-center gap-1.5 font-medium">
                {activeItem.type === "video" ? <Video className="h-3 w-3 shrink-0" /> : activeItem.type === "pdf" ? <FileText className="h-3 w-3 shrink-0" /> : <ExternalLink className="h-3 w-3 shrink-0" />}
                {activeItem.title}
              </p>
            )}
          </div>
        </div>

        {/* Toolbar Center / Controls */}
        <div className="flex items-center gap-2">
          {activeItem?.type === "pdf" && pdfFile && (
            <>
              <div className="flex items-center gap-1 text-xs bg-black/30 px-2 py-1 rounded-lg border border-white/10">
                <button
                  onClick={() => setPageNumber(p => Math.max(1, p - 1))}
                  disabled={pageNumber <= 1}
                  className="p-1 rounded hover:bg-white/10 disabled:opacity-30 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="font-mono text-[11px] tabular-nums px-1">{pageNumber} / {pageCount || "…"}</span>
                <button
                  onClick={() => setPageNumber(p => Math.min(pageCount, p + 1))}
                  disabled={pageNumber >= pageCount}
                  className="p-1 rounded hover:bg-white/10 disabled:opacity-30 transition-colors cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="hidden md:flex items-center gap-1 text-xs bg-black/30 px-2 py-1 rounded-lg border border-white/10">
                <button onClick={() => setScale(s => Math.max(0.6, s - 0.2))} className="p-1 hover:bg-white/10 rounded cursor-pointer">
                  <ZoomOut className="h-3.5 w-3.5" />
                </button>
                <span className="font-mono text-[10px]">{Math.round(scale * 100)}%</span>
                <button onClick={() => setScale(s => Math.min(3, s + 0.2))} className="p-1 hover:bg-white/10 rounded cursor-pointer">
                  <ZoomIn className="h-3.5 w-3.5" />
                </button>
              </div>
            </>
          )}

          {hasMultipleItems && (
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                sidebarOpen ? "bg-brand-gold text-brand-dark border-brand-gold" : "bg-white/10 text-white border-white/20 hover:bg-white/20"
              }`}
            >
              <List className="h-4 w-4" />
              <span className="hidden sm:inline">Уроци ({items.length})</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Body with Split Player & Playlist */}
      <div className="flex-1 flex flex-col lg:flex-row relative overflow-hidden">
        {/* Active Item View Area */}
        <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-y-auto min-h-[70vh]">
          {/* Snipping tool blackout */}
          {isScreenBlurred && (
            <div className="absolute inset-0 z-50 bg-[#0A1813] flex flex-col items-center justify-center p-8 text-center text-white space-y-3">
              <Lock className="h-10 w-10 text-brand-gold" />
              <h3 className="font-serif text-base font-bold text-brand-gold">Защита на съдържанието</h3>
              <p className="text-xs text-white/70 max-w-xs">
                Курсът е защитен с авторски права. Върнете се в прозореца, за да продължите.
              </p>
            </div>
          )}

          {loadingItem ? (
            <div className="flex flex-col items-center gap-3 py-20 text-white/60 text-xs">
              <div className="w-8 h-8 rounded-full border-2 border-brand-gold border-t-transparent animate-spin" />
              Зареждане на урока…
            </div>
          ) : activeItem?.type === "video" ? (
            /* Video Player with Protection Watermark */
            <div className="w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative">
              {videoBlobUrl ? (
                <div className="relative group">
                  <video
                    src={videoBlobUrl}
                    controls
                    controlsList="nodownload noplaybackrate"
                    disablePictureInPicture
                    className="w-full aspect-video max-h-[75vh] object-contain bg-black"
                  />
                  {/* Subtle dynamic watermark */}
                  <div className="pointer-events-none absolute bottom-14 right-4 z-20 bg-black/60 text-white/50 text-[10px] font-mono px-2.5 py-1 rounded backdrop-blur-sm border border-white/10">
                    Лично копие: {email}
                  </div>
                </div>
              ) : activeItem.externalUrl ? (
                <div className="p-8 text-center space-y-4">
                  <PlayCircle className="h-12 w-12 text-brand-gold mx-auto" />
                  <h3 className="text-base font-bold">{activeItem.title}</h3>
                  <p className="text-xs text-white/70">Този видео урок се хоства на защитен външен сървър.</p>
                  <a
                    href={activeItem.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl bg-brand-gold text-brand-dark hover:bg-brand-gold-light transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" /> Отвори видеото
                  </a>
                </div>
              ) : (
                <div className="p-12 text-center text-white/50 text-xs">Видеото се обработва…</div>
              )}
            </div>
          ) : activeItem?.type === "pdf" ? (
            /* PDF Document Viewer with Dense Repeating Watermarks */
            <div className="relative overflow-hidden min-h-[500px] flex justify-center w-full">
              <div className={`transition-all duration-200 ${isScreenBlurred ? "opacity-0 blur-xl" : "opacity-100"}`}>
                {pdfFile && (
                  <Document
                    file={pdfFile}
                    onLoadSuccess={onLoadSuccess}
                    onLoadError={(err) => setLoadError(err.message)}
                    loading={<div className="text-white/60 text-xs py-12">Зареждане на PDF наръчника…</div>}
                    error={<div className="text-red-300 text-xs py-12">Грешка при отваряне на PDF файла.</div>}
                  >
                    <Page
                      pageNumber={pageNumber}
                      scale={scale}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      className="shadow-2xl rounded-lg overflow-hidden"
                    />
                  </Document>
                )}
              </div>

              {/* Watermark Grid */}
              <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center overflow-hidden" aria-hidden="true">
                <div className="absolute inset-[-50%] grid grid-cols-2 sm:grid-cols-3 gap-12 rotate-[-25deg] opacity-25 text-black font-mono text-[10px] font-black uppercase">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div key={i} className="whitespace-nowrap bg-yellow-200/40 text-black px-3 py-1.5 rounded border border-black/15 shadow-sm">
                      ЛИЧНО КОПИЕ: {email}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : activeItem?.type === "link" ? (
            /* External Link Material */
            <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-2xl p-8 text-center space-y-4">
              <ExternalLink className="h-12 w-12 text-brand-gold mx-auto" />
              <h3 className="text-base font-bold text-white">{activeItem.title}</h3>
              <p className="text-xs text-white/70 leading-relaxed">
                Този модул съдържа интерактивен материал на външна платформа.
              </p>
              {activeItem.externalUrl && (
                <a
                  href={activeItem.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl bg-brand-gold text-brand-dark hover:bg-brand-gold-light transition-colors"
                >
                  <ExternalLink className="h-4 w-4" /> Към материала
                </a>
              )}
            </div>
          ) : (
            <div className="text-xs text-white/50">Няма избран урок.</div>
          )}

          {/* Bottom Next / Prev Controls */}
          {hasMultipleItems && (
            <div className="w-full max-w-4xl flex items-center justify-between gap-4 mt-6 pt-4 border-t border-white/10 text-xs">
              <button
                onClick={() => setActiveItemIndex(i => Math.max(0, i - 1))}
                disabled={activeItemIndex <= 0}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Предишен урок</span>
              </button>

              <span className="text-[11px] text-white/50 font-mono">
                Урок {activeItemIndex + 1} от {items.length}
              </span>

              <button
                onClick={() => setActiveItemIndex(i => Math.min(items.length - 1, i + 1))}
                disabled={activeItemIndex >= items.length - 1}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-gold text-brand-dark hover:bg-brand-gold-light disabled:opacity-30 disabled:cursor-not-allowed font-bold transition-colors cursor-pointer"
              >
                <span>Следващ урок</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </main>

        {/* Right Sidebar / Playlist Drawer */}
        {hasMultipleItems && sidebarOpen && (
          <aside className="w-full lg:w-80 bg-[#0E221B] border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col shrink-0">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-brand-gold">Съдържание на курса</h2>
                <p className="text-[10px] text-white/50">{items.length} лекции & материали</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1.5 max-h-[50vh] lg:max-h-[calc(100vh-80px)]">
              {items.map((it, idx) => {
                const isActive = idx === activeItemIndex;
                return (
                  <button
                    key={it.id || idx}
                    onClick={() => setActiveItemIndex(idx)}
                    className={`w-full text-left p-3 rounded-xl flex items-start gap-3 transition-all cursor-pointer border ${
                      isActive
                        ? "bg-brand-gold/15 border-brand-gold text-white font-bold shadow-sm"
                        : "bg-white/5 border-transparent text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                      isActive ? "bg-brand-gold text-brand-dark" : "bg-black/40 text-brand-gold"
                    }`}>
                      {it.type === "video" ? <Video className="h-4 w-4" /> : it.type === "pdf" ? <FileText className="h-4 w-4" /> : <ExternalLink className="h-4 w-4" />}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] uppercase font-mono text-white/40">Урок {idx + 1}</span>
                        {it.duration && <span className="text-[9px] text-brand-gold/80 font-mono">{it.duration}</span>}
                      </div>
                      <div className="text-xs leading-snug line-clamp-2 mt-0.5">{it.title}</div>
                      <div className="text-[9px] text-white/40 uppercase mt-1">
                        {it.type === "video" ? "Видео лекция" : it.type === "pdf" ? "PDF Наръчник" : "Външен материал"}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>
        )}
      </div>

      <footer className="text-center text-[10px] text-white/40 py-3 border-t border-white/5 px-4 print:hidden">
        Този материал е защитен с авторски права. Достъп само за {email}. Разпространението е забранено.
      </footer>
    </div>
  );
}
