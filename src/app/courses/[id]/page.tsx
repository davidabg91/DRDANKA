"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, setDoc, updateDoc, getDoc as getDoc2 } from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { Course } from "@/lib/courseTypes";
import { BookOpen, ShieldCheck, ChevronRight, ArrowLeft, CreditCard, X, CheckCircle, Loader2 } from "lucide-react";

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
  const router = useRouter();
  const courseId = params?.id;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buying, setBuying] = useState(false);

  // Test-checkout modal state
  const [testOpen, setTestOpen] = useState(false);
  const [testCardNumber, setTestCardNumber] = useState("4242 4242 4242 4242");
  const [testCardExpiry, setTestCardExpiry] = useState("12 / 30");
  const [testCardCvc, setTestCardCvc] = useState("123");
  const [testPassword, setTestPassword] = useState("");
  const [testStatus, setTestStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [testError, setTestError] = useState("");

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
   * TEST mode "payment". Validates the prefilled fake card (4242…) and the
   * buyer's chosen password, then runs the grant flow client-side:
   *   1. Creates Firebase Auth account (or signs in if it exists)
   *   2. Adds courseId to /users/{email}.purchasedCourseIds
   *   3. Redirects to /profile
   *
   * No Firebase Admin SDK and no Stripe credentials required.
   */
  const handleTestPay = async () => {
    if (!course) return;
    const email = buyerEmail.trim().toLowerCase();
    const cleanCard = testCardNumber.replace(/\s+/g, "");
    if (cleanCard !== "4242424242424242") {
      setTestError("Тестов режим — използвайте картата 4242 4242 4242 4242.");
      return;
    }
    if (testPassword.length < 6) {
      setTestError("Паролата трябва да е поне 6 символа.");
      return;
    }
    setTestError("");
    setTestStatus("processing");

    try {
      // Try to create the auth account; if it exists, just sign in.
      try {
        await createUserWithEmailAndPassword(auth, email, testPassword);
      } catch (err: any) {
        if (err?.code === "auth/email-already-in-use") {
          try {
            await signInWithEmailAndPassword(auth, email, testPassword);
          } catch (signinErr: any) {
            if (signinErr?.code === "auth/invalid-credential" || signinErr?.code === "auth/wrong-password") {
              throw new Error(
                `За email ${email} вече има акаунт от предишен опит, но въведената парола е различна. ` +
                `Използвайте оригиналната парола или опитайте с друг email адрес (или нулирайте паролата от /profile → „Забравена парола").`
              );
            }
            throw signinErr;
          }
        } else {
          throw err;
        }
      }

      // Now we're signed in — update or create our user doc.
      const userRef = doc(db, "users", email);
      const existing = await getDoc2(userRef);
      if (existing.exists()) {
        const data = existing.data() as any;
        const already: string[] = data.purchasedCourseIds || [];
        if (!already.includes(course.id)) {
          await updateDoc(userRef, { purchasedCourseIds: [...already, course.id] });
        }
      } else {
        await setDoc(userRef, {
          email,
          firmName: "",
          eik: "",
          contact: "",
          phone: "",
          niche: "",
          desc: "",
          address: "",
          manager: "",
          status: "approved",
          role: "user",
          assignedDocs: [],
          messages: [],
          purchasedCourseIds: [course.id],
        });
      }

      setTestStatus("success");
      setTimeout(() => router.push("/profile"), 1500);
    } catch (err: any) {
      console.error("Test pay error:", err);
      setTestError(err?.message || "Неуспешно тестово плащане");
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
                  На този адрес ще получите достъп до материала след успешно плащане.
                </p>
              </div>

              <button
                onClick={handleBuy}
                disabled={buying || !buyerEmail}
                className="relative overflow-hidden w-full px-6 py-4 bg-brand-gold hover:bg-brand-gold-light disabled:opacity-50 disabled:cursor-not-allowed text-brand-dark font-bold text-sm uppercase tracking-widest rounded-full shadow-lg shadow-brand-gold/20 hover:shadow-xl hover:shadow-brand-gold/35 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer group"
              >
                {buying ? "Пренасочване…" : CHECKOUT_MODE === "test" ? "Купи с карта (тест)" : "Купи с карта"}
                {!buying && <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />}
              </button>

              {CHECKOUT_MODE === "test" && (
                <div className="text-[10px] bg-amber-50 border border-amber-200 text-amber-900 rounded-lg px-3 py-2 leading-relaxed">
                  <strong>Тестов режим:</strong> плащането НЕ е реално. Карта <code className="font-mono">4242 4242 4242 4242</code>, всяка бъдеща дата, всеки CVC.
                </div>
              )}

              <div className="flex items-start gap-2 text-[10px] text-brand-dark/50 leading-relaxed">
                <ShieldCheck className="h-4 w-4 text-brand-gold/70 shrink-0 mt-0.5" />
                <span>
                  Материалът се чете онлайн в защитения ви профил — не се сваля на компютъра.
                </span>
              </div>
            </div>
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
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-gold">Тестов режим</div>
                  <div className="font-serif text-lg font-bold">Плащане с карта</div>
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
                <div className="text-center py-8 space-y-3">
                  <CheckCircle className="h-14 w-14 text-green-500 mx-auto" />
                  <h3 className="font-serif text-xl font-bold text-brand-green">Плащането е успешно!</h3>
                  <p className="text-sm text-brand-dark/60">Пренасочваме Ви към профила…</p>
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

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/60">Номер на карта</label>
                    <input
                      type="text"
                      value={testCardNumber}
                      onChange={(e) => setTestCardNumber(e.target.value)}
                      className="w-full text-sm px-4 py-3 rounded-xl border border-brand-green/15 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold bg-white font-mono tracking-wider"
                      disabled={testStatus === "processing"}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/60">Валидна до</label>
                      <input
                        type="text"
                        value={testCardExpiry}
                        onChange={(e) => setTestCardExpiry(e.target.value)}
                        className="w-full text-sm px-4 py-3 rounded-xl border border-brand-green/15 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold bg-white font-mono"
                        disabled={testStatus === "processing"}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/60">CVC</label>
                      <input
                        type="text"
                        value={testCardCvc}
                        onChange={(e) => setTestCardCvc(e.target.value)}
                        className="w-full text-sm px-4 py-3 rounded-xl border border-brand-green/15 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold bg-white font-mono"
                        disabled={testStatus === "processing"}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-3 border-t border-brand-green/5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/60">Изберете парола за акаунта си</label>
                    <input
                      type="password"
                      value={testPassword}
                      onChange={(e) => setTestPassword(e.target.value)}
                      placeholder="мин. 6 символа"
                      className="w-full text-sm px-4 py-3 rounded-xl border border-brand-green/15 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold bg-white"
                      disabled={testStatus === "processing"}
                    />
                    <p className="text-[10px] text-brand-dark/50">С тази парола ще влизате в профила си.</p>
                  </div>

                  {testError && (
                    <div className="text-[11px] bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2">
                      {testError}
                    </div>
                  )}

                  <button
                    onClick={handleTestPay}
                    disabled={testStatus === "processing"}
                    className="w-full px-6 py-4 bg-brand-gold hover:bg-brand-gold-light disabled:opacity-60 disabled:cursor-not-allowed text-brand-dark font-bold text-sm uppercase tracking-widest rounded-full shadow-lg shadow-brand-gold/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {testStatus === "processing" ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Обработка…
                      </>
                    ) : (
                      <>Плати {course.priceEur.toFixed(2)} €</>
                    )}
                  </button>

                  <p className="text-[10px] text-center text-brand-dark/40">
                    Тестов режим — никаква реална сума не се таксува.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
