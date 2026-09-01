"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { doc, getDoc, collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Course } from "@/lib/courseTypes";
import { BookOpen, ShieldCheck, ChevronRight, ArrowLeft } from "lucide-react";
import PackagePurchaseModal from "@/components/PackagePurchaseModal";

export default function CourseDetailPage() {
  const params = useParams<{ id: string }>();
  const courseId = params?.id;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [buyOpen, setBuyOpen] = useState(false);

  useEffect(() => {
    if (!courseId) return;
    (async () => {
      try {
        const q = query(collection(db, "courses"), where("slug", "==", courseId), limit(1));
        const bySlug = await getDocs(q);
        if (!bySlug.empty) {
          setCourse(bySlug.docs[0].data() as Course);
        } else {
          const snap = await getDoc(doc(db, "courses", courseId));
          setCourse(snap.exists() ? (snap.data() as Course) : null);
        }
      } catch (err) {
        console.error("Course load error:", err);
        setCourse(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [courseId]);

  if (loading) {
    return <div className="min-h-screen bg-brand-light flex items-center justify-center text-brand-dark/50 text-sm">Зареждане…</div>;
  }
  if (!course || !course.published) {
    return (
      <div className="min-h-screen bg-brand-light flex flex-col items-center justify-center gap-3 p-8 text-center">
        <BookOpen className="h-10 w-10 text-brand-gold/40" />
        <p className="text-brand-dark/70">Този курс не съществува или е скрит от каталога.</p>
        <Link href="/library" className="text-xs font-bold uppercase tracking-wider text-brand-gold hover:underline cursor-pointer">
          ← Към каталога
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-brand-light min-h-screen pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        <Link href="/library" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-dark/60 hover:text-brand-gold transition-colors cursor-pointer">
          <ArrowLeft className="h-3.5 w-3.5" />
          Каталог
        </Link>

        {/* ─── HERO CARD: cover + summary + buy ─── */}
        <div className="bg-white rounded-3xl shadow-lg border border-brand-green/5 overflow-hidden grid grid-cols-1 lg:grid-cols-12 lg:items-stretch">
          {/* Cover (5/12) */}
          <div className="relative aspect-[4/3] lg:aspect-auto lg:col-span-5 bg-gradient-to-br from-brand-green/10 to-brand-gold/10 flex items-center justify-center overflow-hidden">
            {course.coverImageUrl ? (
              <Image
                src={course.coverImageUrl}
                alt={course.title}
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover"
                priority
              />
            ) : (
              <BookOpen className="h-24 w-24 text-brand-green/30" />
            )}
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-white/95 backdrop-blur-sm text-brand-green px-2.5 py-1.5 rounded-full shadow-sm">
                <BookOpen className="h-3 w-3" />
                {(course.type ?? "pdf") === "link" ? "Външен курс" : "PDF Наръчник"}
              </span>
            </div>
          </div>

          {/* Summary + Buy (7/12) */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col gap-5">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-gold">
              Дигитална Книжарница
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-green leading-tight">{course.title}</h1>
            <div className="w-12 h-0.5 bg-brand-gold/60 rounded-full" />
            <p className="text-sm sm:text-base text-brand-dark/70 leading-relaxed">{course.description}</p>

            <div className="mt-auto pt-6 border-t border-brand-green/5 space-y-3">
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/40 block">Цена</span>
                  <span className="font-serif text-4xl font-bold text-brand-gold">{course.priceEur.toFixed(2)}<span className="text-base text-brand-dark/50 font-sans ml-1">€</span></span>
                </div>
                <span className="text-[10px] text-brand-dark/40 font-mono">
                  {(course.type ?? "pdf") === "link" ? "Външен курс" : `${course.fileSizeMb ?? 0} MB · PDF`}
                </span>
              </div>

              <button
                onClick={() => setBuyOpen(true)}
                className="relative overflow-hidden w-full px-6 py-4 bg-brand-gold hover:bg-brand-gold-light text-brand-dark font-bold text-sm uppercase tracking-widest rounded-full shadow-lg shadow-brand-gold/20 hover:shadow-xl hover:shadow-brand-gold/35 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer group"
              >
                Купи с банков превод
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="text-[10px] bg-brand-green/5 border border-brand-green/15 text-brand-dark/70 rounded-lg px-3 py-2 leading-relaxed">
                Плащането е по банков път. След заявката ще видите данните за превод; след одобрение от д-р Николова материалът се отключва в профила Ви.
              </div>
            </div>
          </div>
        </div>

        {/* ─── LONG DESCRIPTION ─── */}
        {course.longDescription && (
          <div className="bg-white rounded-3xl shadow-md border border-brand-green/5 p-6 sm:p-10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-gold/10 text-brand-gold flex items-center justify-center">
                <BookOpen className="h-5 w-5" />
              </div>
              <h2 className="font-serif text-xl font-bold text-brand-green">За материала</h2>
            </div>
            <div className="text-sm sm:text-base text-brand-dark/80 leading-relaxed whitespace-pre-wrap">
              {course.longDescription}
            </div>
          </div>
        )}

        {/* ─── TRUST ROW ─── */}
        <div className="bg-white rounded-3xl shadow-md border border-brand-green/5 p-6 sm:p-8 flex items-start gap-4">
          <ShieldCheck className="h-6 w-6 text-brand-gold shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-brand-green text-sm">Сигурен достъп след покупка</p>
            <p className="text-xs text-brand-dark/60 leading-relaxed">
              Материалът се чете онлайн в защитения Ви профил — не се сваля на компютъра. На посочения email ще получите линк за достъп.
            </p>
          </div>
        </div>
      </div>

      <PackagePurchaseModal
        open={buyOpen}
        onClose={() => setBuyOpen(false)}
        packageId={course.id}
        packageTitle={course.title}
        packageKind="library"
        contentType={course.type === "link" ? "video" : "pdf"}
        priceEur={course.priceEur}
      />
    </div>
  );
}

