"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { doc, getDoc, setDoc, collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Course } from "@/lib/courseTypes";
import { BookOpen, ShieldCheck, ChevronRight, ArrowLeft, Landmark, X, CheckCircle, Loader2 } from "lucide-react";
import BankTransferNotice from "@/components/BankTransferNotice";

/**
 * Course detail + buy flow.
 *
 * Two checkout modes:
 *   - REAL  (Stripe): POSTs /api/checkout, redirects to Stripe-hosted page.
 *           Requires STRIPE_SECRET_KEY + FIREBASE_SERVICE_ACCOUNT env vars.
 *   - TEST  (in-app fake card form): grants access entirely from the client,
 *           via Firebase Auth + Firestore writes — no server credentials needed.
 *
 * Toggle via env: NEXT_PUBLIC_CHECKOUT_MODE=test  (defaults to test today).
 */
const CHECKOUT_MODE: "test" | "stripe" =
  (process.env.NEXT_PUBLIC_CHECKOUT_MODE as "test" | "stripe") || "test";

export default function CourseDetailPage() {
  const params = useParams<{ id: string }>();
  const courseId = params?.id;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buying, setBuying] = useState(false);

  // Bank-transfer request modal state
  const [testOpen, setTestOpen] = useState(false);
  const [testStatus, setTestStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [testError, setTestError] = useState("");

  useEffect(() => {
    if (!courseId) return;
    (async () => {
      try {
        // Try slug lookup first (SEO-friendly URLs), fall back to doc id
        // for legacy /courses/<doc_id> links.
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

  const validEmail = (s: string) => /^[^@]+@[^@]+\.[^@]+$/.test(s);

  const handleBuy = async () => {
    const email = buyerEmail.trim().toLowerCase();
    if (!validEmail(email)) {
      alert("Моля въведете валиден email адрес — там ще получите линка за достъп.");
      return;
    }
    if (!course) return;

    if (CHECKOUT_MODE === "test") {
      setTestOpen(true);
      return;
    }

    // REAL Stripe flow
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

  /**
   * Bank-transfer access request. Records the buyer's request so д-р Данка
   * Николова can confirm the payment and manually grant access (add the courseId
   * to /users/{email}.purchasedCourseIds from the admin panel). No instant
   * access is granted — the client pays by bank transfer first.
   */
  const handleRequestAccess = async () => {
    if (!course) return;
    const email = buyerEmail.trim().toLowerCase();
    if (!validEmail(email)) {
      setTestError("Моля въведете валиден email адрес.");
      return;
    }
    setTestError("");
    setTestStatus("processing");
    try {
      const id = `enroll_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      await setDoc(doc(db, "enrollments", id), {
        id,
        trainingId: course.id,
        trainingTitle: course.title,
        trainingType: "course",
        fullName: "",
        email,
        phone: "",
        company: "",
        priceEur: course.priceEur,
        status: "awaiting_payment",
        createdAt: new Date().toISOString(),
      });
      setTestStatus("success");
    } catch (err: any) {
      console.error("Access request error:", err);
      setTestError(err?.message || "Грешка при изпращане на заявката. Опитайте отново.");
      setTestStatus("error");
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        <Link href="/bookstore" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-dark/60 hover:text-brand-gold transition-colors cursor-pointer">
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
              </div>

              <button
                onClick={handleBuy}
                disabled={buying || !buyerEmail}
                className="relative overflow-hidden w-full px-6 py-4 bg-brand-gold hover:bg-brand-gold-light disabled:opacity-50 disabled:cursor-not-allowed text-brand-dark font-bold text-sm uppercase tracking-widest rounded-full shadow-lg shadow-brand-gold/20 hover:shadow-xl hover:shadow-brand-gold/35 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer group"
              >
                {buying ? "Обработка…" : "Заяви достъп"}
                {!buying && <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />}
              </button>

              <div className="text-[10px] bg-brand-green/5 border border-brand-green/15 text-brand-dark/70 rounded-lg px-3 py-2 leading-relaxed">
                Плащането е по банков път. След заявката ще получите данните за превод; достъпът се активира след постъпване на сумата.
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

      {/* ─────────── TEST CHECKOUT MODAL ─────────── */}
      {testOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-br from-brand-green to-brand-green/80 text-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/10 rounded-xl">
                  <Landmark className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-gold">Плащане по банков път</div>
                  <div className="font-serif text-lg font-bold">Заявка за достъп</div>
                </div>
              </div>
              <button
                onClick={() => { if (testStatus !== "processing") { setTestOpen(false); setTestStatus("idle"); } }}
                className="text-white/60 hover:text-white p-1 rounded-full cursor-pointer"
                aria-label="Затвори"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {testStatus === "success" ? (
                <div className="space-y-4">
                  <div className="text-center space-y-2">
                    <CheckCircle className="h-14 w-14 text-green-500 mx-auto" />
                    <h3 className="font-serif text-xl font-bold text-brand-green">Заявката е приета!</h3>
                    <p className="text-sm text-brand-dark/70 leading-relaxed">
                      За да получите достъп до <strong>{course.title}</strong>, направете банков превод по сметката по-долу. <strong className="text-brand-green">Веднага след като плащането постъпи, д-р Данка Николова ще активира достъпа Ви</strong> и ще Ви уведоми на <span className="font-semibold">{buyerEmail.trim().toLowerCase()}</span>.
                    </p>
                  </div>
                  <BankTransferNotice amount={`${course.priceEur.toFixed(2)} €`} reference={`${buyerEmail.trim().toLowerCase()} — ${course.title}`} />
                  <button
                    onClick={() => { setTestOpen(false); setTestStatus("idle"); }}
                    className="w-full px-6 py-3 rounded-full bg-brand-green text-white font-bold text-xs uppercase tracking-wider hover:bg-brand-green/90 transition-colors cursor-pointer"
                  >
                    Затвори
                  </button>
                </div>
              ) : (
                <>
                  <div className="bg-brand-light/50 rounded-xl p-4 space-y-1 border border-brand-green/5">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-brand-dark/50">Поръчка</span>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-brand-green truncate">{course.title}</span>
                      <span className="font-serif text-lg font-bold text-brand-gold whitespace-nowrap ml-3">{course.priceEur.toFixed(2)} €</span>
                    </div>
                  </div>

                  <div className="bg-brand-light/40 rounded-xl px-4 py-2 flex items-center justify-between border border-brand-green/5">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-brand-dark/50">Email за достъп</span>
                    <span className="text-sm font-semibold text-brand-green truncate ml-3">{buyerEmail.trim().toLowerCase()}</span>
                  </div>

                  <div className="flex items-start gap-2 text-[11px] text-brand-dark/60 leading-relaxed">
                    <Landmark className="h-4 w-4 text-brand-gold shrink-0 mt-0.5" />
                    <span>Плащането е по банков път. След изпращане на заявката ще видите данните за превод. Достъпът се активира след постъпване на плащането.</span>
                  </div>

                  {testError && (
                    <div className="text-[11px] bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2">
                      {testError}
                    </div>
                  )}

                  <button
                    onClick={handleRequestAccess}
                    disabled={testStatus === "processing"}
                    className="w-full px-6 py-4 bg-brand-gold hover:bg-brand-gold-light disabled:opacity-60 disabled:cursor-not-allowed text-brand-dark font-bold text-sm uppercase tracking-widest rounded-full shadow-lg shadow-brand-gold/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {testStatus === "processing" ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Изпращане…
                      </>
                    ) : (
                      <>Изпрати заявка за достъп</>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
