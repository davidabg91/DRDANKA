"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { findLiveCourse } from "@/data/live-courses";
import { usePriceOverrides, resolvePrice } from "@/lib/priceOverrides";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import {
  ArrowLeft, ArrowRight, Video, Award, X, CreditCard, Loader2,
  ShieldCheck, CheckCircle, Calendar, Users, MessageSquare,
} from "lucide-react";

export default function LiveCourseDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;
  const course = slug ? findLiveCourse(slug) : undefined;
  const { overrides } = usePriceOverrides();
  const livePrice = course ? resolvePrice(course.slug, overrides, course.priceEur) : 0;

  const [enrollOpen, setEnrollOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [cardExpiry, setCardExpiry] = useState("12 / 30");
  const [cardCvc, setCardCvc] = useState("123");
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [error, setError] = useState("");

  if (!course) {
    return (
      <div className="min-h-screen bg-brand-light flex flex-col items-center justify-center gap-3 p-8 text-center">
        <Video className="h-10 w-10 text-brand-gold/40" />
        <p className="text-brand-dark/70">Този курс не съществува.</p>
        <Link href="/live" className="text-xs font-bold uppercase tracking-wider text-brand-gold hover:underline cursor-pointer">
          ← Към live курсовете
        </Link>
      </div>
    );
  }

  const validEmail = (s: string) => /^[^@]+@[^@]+\.[^@]+$/.test(s);

  const submitEnrollment = async () => {
    if (!name.trim() || !validEmail(email) || !phone.trim()) {
      setError("Моля попълнете име, валиден email и телефон.");
      return;
    }
    if (cardNumber.replace(/\s+/g, "") !== "4242424242424242") {
      setError("Тестов режим — използвайте картата 4242 4242 4242 4242.");
      return;
    }
    setError("");
    setStatus("processing");
    try {
      const id = `enroll_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      await setDoc(doc(db, "enrollments", id), {
        id,
        trainingId: course.slug,
        trainingTitle: course.title,
        trainingType: course.platform === "zoom" ? "zoom" : "video",
        fullName: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        company: company.trim() || "",
        priceEur: livePrice,
        status: "paid",
        paidAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      });
      setStatus("success");
    } catch (err: any) {
      console.error("Live enrollment error:", err);
      setError(err?.message || "Грешка при записването.");
      setStatus("error");
    }
  };

  const Page = course.page;

  return (
    <div className="bg-brand-light min-h-screen pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        <Link href="/live" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-dark/60 hover:text-brand-gold transition-colors cursor-pointer">
          <ArrowLeft className="h-3.5 w-3.5" />
          Към live курсовете
        </Link>

        {/* HERO */}
        <div className="bg-white rounded-3xl shadow-lg border border-brand-green/5 overflow-hidden grid grid-cols-1 lg:grid-cols-12 lg:items-stretch">
          <div className="relative aspect-[4/3] lg:aspect-auto lg:col-span-5 bg-gradient-to-br from-brand-green/10 to-brand-gold/10 flex items-center justify-center overflow-hidden">
            {course.card.cover ? (
              <Image src={course.card.cover} alt={course.title} fill sizes="(max-width: 1024px) 100vw, 42vw" className="object-cover object-left" priority />
            ) : (
              <Video className="h-24 w-24 text-brand-green/30" strokeWidth={1.5} />
            )}
            <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-white/95 backdrop-blur-sm text-brand-green px-2.5 py-1.5 rounded-full shadow-sm">
                <Video className="h-3 w-3" /> {course.platform === "zoom" ? "Zoom" : "Google Meet"}
              </span>
              {course.hasCertificate && (
                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-brand-gold text-brand-dark px-2.5 py-1.5 rounded-full shadow-sm">
                  <Award className="h-3 w-3" /> Сертификат
                </span>
              )}
            </div>
          </div>

          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col gap-5">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-gold">Live с д-р Николова</span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-green leading-tight">{course.title}</h1>
            <div className="w-12 h-0.5 bg-brand-gold/60 rounded-full" />
            <p className="text-sm sm:text-base text-brand-dark/70 leading-relaxed">{course.tagline}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-brand-dark/70">
              {course.format && (
                <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-brand-gold shrink-0" />{course.format}</div>
              )}
              {course.groupSize && (
                <div className="flex items-center gap-2"><Users className="h-4 w-4 text-brand-gold shrink-0" />{course.groupSize}</div>
              )}
            </div>

            {course.nextBatch && (
              <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-3 text-xs leading-relaxed">
                <strong>📅 {course.nextBatch}</strong>
              </div>
            )}

            <div className="mt-auto pt-6 border-t border-brand-green/5 space-y-3">
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/40 block">Цена</span>
                  <span className="font-serif text-4xl font-bold text-brand-gold">{livePrice.toFixed(2)}<span className="text-base text-brand-dark/50 font-sans ml-1">€</span></span>
                </div>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-brand-dark/50 bg-brand-light/60 px-3 py-1.5 rounded-full">
                  <Calendar className="h-3 w-3 text-brand-gold" /> По уговорка
                </span>
              </div>
              <button
                onClick={() => { setEnrollOpen(true); setStatus("idle"); setError(""); }}
                className="group relative overflow-hidden w-full px-6 py-4 bg-brand-gold hover:bg-brand-gold-light text-brand-dark font-bold text-sm uppercase tracking-widest rounded-full shadow-lg shadow-brand-gold/20 hover:shadow-xl hover:shadow-brand-gold/35 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 pointer-events-none" />
                Запиши се за следваща група
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
              <div className="flex items-start gap-2 text-[10px] text-brand-dark/50 leading-relaxed">
                <ShieldCheck className="h-4 w-4 text-brand-gold/70 shrink-0 mt-0.5" />
                <span>След записване д-р Николова Ви пише с дата при сформирана група.</span>
              </div>
            </div>
          </div>
        </div>

        {/* CUSTOM CONTENT */}
        <Page />
      </div>

      {/* ─── ENROLLMENT MODAL ─── */}
      {enrollOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl my-8 overflow-hidden">
            <div className="relative bg-gradient-to-br from-brand-green to-brand-green/80 text-white p-6 pr-16 flex items-start gap-3">
              <div className="p-2.5 bg-white/10 rounded-xl shrink-0"><Video className="h-5 w-5" /></div>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-gold">Записване</div>
                <div className="font-serif text-base sm:text-lg font-bold leading-snug break-words">{course.title}</div>
              </div>
              <button
                onClick={() => { if (status !== "processing") { setEnrollOpen(false); setStatus("idle"); } }}
                aria-label="Затвори"
                className="absolute top-4 right-4 inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer shrink-0"
              ><X className="h-5 w-5" /></button>
            </div>

            <div className="p-6 space-y-4">
              {status === "success" ? (
                <div className="text-center py-4 space-y-3">
                  <CheckCircle className="h-14 w-14 text-green-500 mx-auto" />
                  <h3 className="font-serif text-xl font-bold text-brand-green">Записването е успешно!</h3>
                  <p className="text-sm text-brand-dark/70 leading-relaxed">
                    Благодарим за записването за <strong>{course.title}</strong>.
                  </p>
                  <div className="bg-brand-light/50 border border-brand-green/10 rounded-xl p-4 text-left text-xs text-brand-dark/70">
                    <p className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-brand-gold shrink-0 mt-0.5" />
                      <span><strong className="text-brand-green">Следваща стъпка:</strong> Д-р Данка Николова ще се свърже с Вас при сформирана група, за да уточни датите на live сесиите.</span>
                    </p>
                  </div>
                  <button onClick={() => { setEnrollOpen(false); setStatus("idle"); }} className="px-6 py-3 rounded-full bg-brand-green text-white font-bold text-xs uppercase tracking-wider hover:bg-brand-green/90 transition-colors cursor-pointer">Затвори</button>
                </div>
              ) : (
                <>
                  <div className="bg-brand-light/50 rounded-xl p-4 border border-brand-green/5 flex items-center justify-between">
                    <span className="text-sm font-bold text-brand-green">Цена</span>
                    <span className="font-serif text-2xl font-bold text-brand-gold whitespace-nowrap ml-3">{livePrice.toFixed(2)} €</span>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/60">Име и фамилия *</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Иван Петров" className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-brand-green/15 focus:outline-none focus:border-brand-gold bg-white" disabled={status === "processing"} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/60">Email *</label>
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-brand-green/15 focus:outline-none focus:border-brand-gold bg-white" disabled={status === "processing"} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/60">Телефон *</label>
                      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0888123456" className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-brand-green/15 focus:outline-none focus:border-brand-gold bg-white font-mono" disabled={status === "processing"} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/60">Фирма (по желание)</label>
                    <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Ресторант Витоша ЕООД" className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-brand-green/15 focus:outline-none focus:border-brand-gold bg-white" disabled={status === "processing"} />
                  </div>
                  <div className="border-t border-brand-green/5 pt-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-brand-gold" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-brand-green">Плащане с карта</span>
                      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 ml-auto">Тестов режим</span>
                    </div>
                    <input type="text" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-brand-green/15 focus:outline-none focus:border-brand-gold bg-white font-mono tracking-wider" disabled={status === "processing"} />
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} className="text-sm px-3.5 py-2.5 rounded-xl border border-brand-green/15 focus:outline-none focus:border-brand-gold bg-white font-mono" disabled={status === "processing"} placeholder="MM / YY" />
                      <input type="text" value={cardCvc} onChange={(e) => setCardCvc(e.target.value)} className="text-sm px-3.5 py-2.5 rounded-xl border border-brand-green/15 focus:outline-none focus:border-brand-gold bg-white font-mono" disabled={status === "processing"} placeholder="CVC" />
                    </div>
                  </div>
                  {error && <div className="text-[11px] bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2">{error}</div>}
                  <button onClick={submitEnrollment} disabled={status === "processing"} className="w-full px-6 py-4 bg-brand-gold hover:bg-brand-gold-light disabled:opacity-60 disabled:cursor-not-allowed text-brand-dark font-bold text-sm uppercase tracking-widest rounded-full shadow-lg shadow-brand-gold/20 transition-all flex items-center justify-center gap-2 cursor-pointer">
                    {status === "processing" ? (<><Loader2 className="h-4 w-4 animate-spin" /> Обработка…</>) : (<>Запиши се и плати {livePrice.toFixed(2)} €</>)}
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
