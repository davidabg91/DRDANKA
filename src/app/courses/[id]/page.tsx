"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Course } from "@/lib/courseTypes";
import { BookOpen, ShieldCheck, ChevronRight, ArrowLeft } from "lucide-react";

export default function CourseDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const courseId = params?.id;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    if (!courseId) return;
    (async () => {
      try {
        const snap = await getDoc(doc(db, "courses", courseId));
        setCourse(snap.exists() ? (snap.data() as Course) : null);
      } catch (err) {
        console.error("Course load error:", err);
        setCourse(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [courseId]);

  const handleBuy = async () => {
    const email = buyerEmail.trim().toLowerCase();
    if (!email || !/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
      alert("Моля въведете валиден email адрес — там ще получите линка за достъп.");
      return;
    }
    if (!course) return;
    setBuying(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: course.id, buyerEmail: email }),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `${res.status}`);
      }
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Stripe не върна валиден checkout URL");
      }
    } catch (err: any) {
      alert("Грешка при стартиране на плащането: " + (err?.message || err));
    } finally {
      setBuying(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-brand-light flex items-center justify-center text-brand-dark/50 text-sm">Зареждане…</div>;
  }
  if (!course || !course.published) {
    return (
      <div className="min-h-screen bg-brand-light flex flex-col items-center justify-center gap-3 p-8 text-center">
        <BookOpen className="h-10 w-10 text-brand-gold/40" />
        <p className="text-brand-dark/70">Този курс не съществува или е скрит от каталога.</p>
        <Link href="/bookstore" className="text-xs font-bold uppercase tracking-wider text-brand-gold hover:underline cursor-pointer">
          ← Към каталога
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-brand-light min-h-screen pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link href="/bookstore" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-dark/60 hover:text-brand-gold transition-colors cursor-pointer mb-6">
          <ArrowLeft className="h-3.5 w-3.5" />
          Каталог
        </Link>

        <div className="bg-white rounded-3xl shadow-md border border-brand-green/5 overflow-hidden grid grid-cols-1 lg:grid-cols-2">
          <div className="aspect-[4/3] lg:aspect-auto bg-gradient-to-br from-brand-green/10 to-brand-gold/10 flex items-center justify-center">
            {course.coverImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={course.coverImageUrl} alt={course.title} className="w-full h-full object-cover" />
            ) : (
              <BookOpen className="h-24 w-24 text-brand-green/30" />
            )}
          </div>

          <div className="p-6 sm:p-10 space-y-5 flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-gold">
              Дигитална Книжарница
            </span>
            <h1 className="font-serif text-3xl font-bold text-brand-green leading-tight">{course.title}</h1>
            <p className="text-sm text-brand-dark/70 leading-relaxed">{course.description}</p>

            {course.longDescription && (
              <div className="text-sm text-brand-dark/80 leading-relaxed border-t border-brand-green/5 pt-4 space-y-2 whitespace-pre-wrap">
                {course.longDescription}
              </div>
            )}

            <div className="mt-auto pt-6 border-t border-brand-green/5 space-y-4">
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/40 block">Цена</span>
                  <span className="font-serif text-4xl font-bold text-brand-gold">{course.priceEur.toFixed(2)}<span className="text-base text-brand-dark/50 font-sans ml-1">€</span></span>
                </div>
                <span className="text-[10px] text-brand-dark/40 font-mono">{course.fileSizeMb} MB · PDF</span>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/60">Вашият email *</label>
                <input
                  type="email"
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="text-sm px-4 py-3 rounded-xl border border-brand-green/15 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold bg-white"
                  disabled={buying}
                />
                <p className="text-[10px] text-brand-dark/50 leading-relaxed">
                  На този адрес ще получите линка за достъп до материала след успешно плащане.
                </p>
              </div>

              <button
                onClick={handleBuy}
                disabled={buying || !buyerEmail}
                className="relative overflow-hidden w-full px-6 py-4 bg-brand-gold hover:bg-brand-gold-light disabled:opacity-50 disabled:cursor-not-allowed text-brand-dark font-bold text-sm uppercase tracking-widest rounded-full shadow-lg shadow-brand-gold/20 hover:shadow-xl hover:shadow-brand-gold/35 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer group"
              >
                {buying ? "Пренасочване към Stripe…" : "Купи с карта"}
                {!buying && <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />}
              </button>

              <div className="flex items-start gap-2 text-[10px] text-brand-dark/50 leading-relaxed">
                <ShieldCheck className="h-4 w-4 text-brand-gold/70 shrink-0 mt-0.5" />
                <span>
                  Плащането е защитено със Stripe. Не съхраняваме данни от карта. Материалът се чете онлайн в защитения ви профил —
                  не се сваля на компютъра.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
