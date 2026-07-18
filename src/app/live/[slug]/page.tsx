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
  ArrowLeft, ArrowRight, Video, Award, X, Landmark, Loader2,
  ShieldCheck, CheckCircle, Calendar, Users, MessageSquare,
} from "lucide-react";
import BankTransferNotice from "@/components/BankTransferNotice";

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
        status: "awaiting_payment",
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
      {/* Immersive Full-Screen Hero */}
      <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image - Full screen */}
        {course.card.cover ? (
          <div className="absolute inset-0 w-full h-full">
            <Image
              src={course.card.cover}
              alt={course.title}
              fill
              className={`object-cover ${course.slug === 'haccp-dhpp-praktika' ? 'object-top' : 'object-center sm:object-[center_15%]'}`}
              priority
            />
            {/* Gradient Overlay to ensure text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/70 to-brand-dark/40 lg:bg-gradient-to-r lg:from-brand-dark lg:via-brand-dark/80 lg:to-transparent" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-green to-brand-dark" />
        )}

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          
          {/* Left content (Title, details) */}
          <div className="lg:col-span-7 space-y-8">
            <Link href="/live" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-gold hover:text-white transition-colors cursor-pointer backdrop-blur-sm bg-black/20 px-3.5 py-2 rounded-full border border-white/10 w-fit">
              <ArrowLeft className="h-3.5 w-3.5" />
              Към live курсовете
            </Link>

            <div className="space-y-5">
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider bg-white/10 backdrop-blur-md border border-white/20 text-white px-3 py-1.5 rounded-full shadow-lg">
                  <Video className="h-3.5 w-3.5 text-brand-gold" /> {course.platform === "zoom" ? "Zoom Live Сесия" : "Google Meet Сесия"}
                </span>
                {course.hasCertificate && (
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider bg-brand-gold text-brand-dark px-3 py-1.5 rounded-full shadow-lg shadow-brand-gold/20">
                    <Award className="h-3.5 w-3.5" /> Сертификат
                  </span>
                )}
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight drop-shadow-xl">
                {course.title}
              </h1>
              <div className="w-16 h-1 bg-brand-gold rounded-full shadow-[0_0_15px_rgba(212,175,55,0.5)]" />
              <p className="text-lg sm:text-xl text-white/80 leading-relaxed max-w-2xl drop-shadow-md font-light">
                {course.tagline}
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                {course.format && (
                  <div className="flex items-center gap-2 text-white/90 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10">
                    <Calendar className="h-5 w-5 text-brand-gold shrink-0" />
                    <span className="text-sm font-medium">{course.format}</span>
                  </div>
                )}
                {course.groupSize && (
                  <div className="flex items-center gap-2 text-white/90 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10">
                    <Users className="h-5 w-5 text-brand-gold shrink-0" />
                    <span className="text-sm font-medium">{course.groupSize}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right content: Glassmorphism Checkout Panel */}
          <div className="lg:col-span-5">
            <div className="bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_0_40px_rgba(0,0,0,0.3)] rounded-3xl p-6 sm:p-8 relative overflow-hidden group">
              {/* Subtle animated glow inside panel */}
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-brand-gold/20 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-700 pointer-events-none" />
              <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-brand-green/30 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-700 pointer-events-none" />
              
              <div className="relative z-10 flex flex-col h-full">
                {/* Price Section */}
                <div className="mb-6 pb-6 border-b border-white/10 space-y-4">
                  {course.nextBatch && (
                    <div className="bg-brand-gold text-brand-dark rounded-xl p-3 text-xs font-bold leading-relaxed shadow-sm">
                      📅 {course.nextBatch}
                    </div>
                  )}
                  
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/50 block mb-2">Инвестиция във Вашия бизнес</span>
                    <div className="flex items-end gap-3 mb-3">
                      <div className="flex flex-col">
                        <span className="font-serif text-5xl sm:text-6xl font-bold text-brand-gold leading-none drop-shadow-md flex items-end gap-3">
                          <span>{livePrice.toFixed(2)}<span className="text-2xl text-brand-gold/70 font-sans ml-1">€</span></span>
                          {course.originalPriceEur && (
                            <span className="text-xl sm:text-2xl font-sans font-medium text-white/40 line-through mb-2">
                              {course.originalPriceEur.toFixed(2)}€
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Buy Button */}
                <button
                  onClick={() => { setEnrollOpen(true); setStatus("idle"); setError(""); }}
                  className="group/btn relative overflow-hidden w-full px-6 py-4 sm:py-5 bg-brand-gold hover:bg-white text-brand-dark font-black text-sm uppercase tracking-widest rounded-2xl shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all duration-500 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-brand-dark/10 to-transparent skew-x-12 pointer-events-none" />
                  Запази своето място
                  <ArrowRight className="h-4.5 w-4.5 transition-transform duration-300 group-hover/btn:translate-x-1.5" />
                </button>
                <div className="flex items-start gap-2 mt-4 text-[11px] text-white/70 leading-relaxed">
                  <ShieldCheck className="h-4 w-4 text-brand-gold shrink-0 mt-0.5" />
                  <span>Сигурно плащане. След записване д-р Николова ще се свърже с Вас.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content Wrapper */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 relative z-20">
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
                  <h3 className="font-serif text-xl font-bold text-brand-green">Заявката е приета!</h3>
                  <p className="text-sm text-brand-dark/70 leading-relaxed">
                    Благодарим за заявката за <strong>{course.title}</strong>. За да потвърдите мястото си, направете банков превод по сметката по-долу. <strong className="text-brand-green">Веднага след като плащането постъпи, д-р Данка Николова ще се свърже с Вас</strong> за уточняване на датите на live сесиите и достъпа.
                  </p>
                  <BankTransferNotice amount={`${livePrice.toFixed(2)} €`} reference={`${name.trim()} — ${course.title}`} />
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
                  <div className="border-t border-brand-green/5 pt-4 flex items-start gap-2 text-[11px] text-brand-dark/60 leading-relaxed">
                    <Landmark className="h-4 w-4 text-brand-gold shrink-0 mt-0.5" />
                    <span>Плащането е по банков път. След изпращане на заявката ще видите данните за превод. Мястото се запазва след постъпване на плащането.</span>
                  </div>
                  {error && <div className="text-[11px] bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2">{error}</div>}
                  <button onClick={submitEnrollment} disabled={status === "processing"} className="w-full px-6 py-4 bg-brand-gold hover:bg-brand-gold-light disabled:opacity-60 disabled:cursor-not-allowed text-brand-dark font-bold text-sm uppercase tracking-widest rounded-full shadow-lg shadow-brand-gold/20 transition-all flex items-center justify-center gap-2 cursor-pointer">
                    {status === "processing" ? (<><Loader2 className="h-4 w-4 animate-spin" /> Изпращане…</>) : (<>Изпрати заявка за записване</>)}
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
