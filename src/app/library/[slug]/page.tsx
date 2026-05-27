"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter, notFound } from "next/navigation";
import { findLibraryMaterial } from "@/data/library";
import { usePriceOverrides, resolvePrice } from "@/lib/priceOverrides";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import {
  ArrowLeft, ArrowRight, BookOpen, Video, X, CreditCard, Loader2,
  ShieldCheck, CheckCircle, Sparkles,
} from "lucide-react";

const CHECKOUT_MODE: "test" | "stripe" =
  (process.env.NEXT_PUBLIC_CHECKOUT_MODE as "test" | "stripe") || "test";

export default function LibraryMaterialPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const slug = params?.slug;
  const material = slug ? findLibraryMaterial(slug) : undefined;
  const { overrides } = usePriceOverrides();
  const livePrice = material ? resolvePrice(material.slug, overrides, material.priceEur) : 0;

  // Hooks must be called unconditionally — declare them before any early return.
  const [buyOpen, setBuyOpen] = useState(false);
  const [buyEmail, setBuyEmail] = useState("");
  const [buyPassword, setBuyPassword] = useState("");
  const [buyCard, setBuyCard] = useState("4242 4242 4242 4242");
  const [buyExpiry, setBuyExpiry] = useState("12 / 30");
  const [buyCvc, setBuyCvc] = useState("123");
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [error, setError] = useState("");

  if (!material) {
    return (
      <div className="min-h-screen bg-brand-light flex flex-col items-center justify-center gap-3 p-8 text-center">
        <BookOpen className="h-10 w-10 text-brand-gold/40" />
        <p className="text-brand-dark/70">Този материал не съществува.</p>
        <Link href="/library" className="text-xs font-bold uppercase tracking-wider text-brand-gold hover:underline cursor-pointer">
          ← Към каталога
        </Link>
      </div>
    );
  }

  const handleBuy = async () => {
    const email = buyEmail.trim().toLowerCase();
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
      setError("Моля въведете валиден email адрес.");
      return;
    }
    if (CHECKOUT_MODE === "test") {
      const clean = buyCard.replace(/\s+/g, "");
      if (clean !== "4242424242424242") {
        setError("Тестов режим — използвайте картата 4242 4242 4242 4242.");
        return;
      }
      if (buyPassword.length < 6) {
        setError("Паролата трябва да е поне 6 символа.");
        return;
      }
    }
    setError("");
    setStatus("processing");
    try {
      try {
        await createUserWithEmailAndPassword(auth, email, buyPassword);
      } catch (err: any) {
        if (err?.code === "auth/email-already-in-use") {
          try {
            await signInWithEmailAndPassword(auth, email, buyPassword);
          } catch {
            throw new Error(`За email ${email} вече има акаунт от предишен опит, но паролата е различна. Опитайте друг email или нулирайте паролата от /profile.`);
          }
        } else {
          throw err;
        }
      }

      const userRef = doc(db, "users", email);
      const existing = await getDoc(userRef);
      if (existing.exists()) {
        const data = existing.data() as any;
        const already: string[] = data.purchasedCourseIds || [];
        if (!already.includes(material.slug)) {
          await updateDoc(userRef, { purchasedCourseIds: [...already, material.slug] });
        }
      } else {
        await setDoc(userRef, {
          email,
          firmName: "", eik: "", contact: "", phone: "", niche: "",
          desc: "", address: "", manager: "",
          status: "approved",
          subscriptionStatus: "none",
          role: "user",
          assignedDocs: [],
          messages: [],
          purchasedCourseIds: [material.slug],
        });
      }

      setStatus("success");
      setTimeout(() => router.push("/profile"), 1500);
    } catch (err: any) {
      console.error("Library purchase error:", err);
      setError(err?.message || "Грешка при покупката.");
      setStatus("error");
    }
  };

  const Page = material.page;

  if (material.slug === "video-etiketirane") {
    return (
      <div className="bg-brand-light min-h-screen pb-24">
        {/* Immersive Full-Screen Hero */}
        <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden">
          {/* Background Image - Full screen */}
          {material.card.cover ? (
            <div className="absolute inset-0">
              <Image
                src={material.card.cover}
                alt={material.title}
                fill
                className="object-cover object-top sm:object-[center_15%]"
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
              <Link href="/library" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-gold hover:text-white transition-colors cursor-pointer backdrop-blur-sm bg-black/20 px-3.5 py-2 rounded-full border border-white/10 w-fit">
                <ArrowLeft className="h-3.5 w-3.5" />
                Към каталога
              </Link>

              <div className="space-y-5">
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider bg-white/10 backdrop-blur-md border border-white/20 text-white px-3 py-1.5 rounded-full shadow-lg">
                    {material.type === "video" ? <><Video className="h-3.5 w-3.5 text-brand-gold" /> Видео Обучение</> : <><BookOpen className="h-3.5 w-3.5 text-brand-gold" /> Практически Наръчник</>}
                  </span>
                  {material.card.badge && (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider bg-brand-gold text-brand-dark px-3 py-1.5 rounded-full shadow-lg shadow-brand-gold/20">
                      <Sparkles className="h-3.5 w-3.5" /> {material.card.badge}
                    </span>
                  )}
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight drop-shadow-xl">
                  {material.title}
                </h1>
                <div className="w-16 h-1 bg-brand-gold rounded-full shadow-[0_0_15px_rgba(212,175,55,0.5)]" />
                <p className="text-lg sm:text-xl text-white/80 leading-relaxed max-w-2xl drop-shadow-md font-light">
                  {material.tagline}
                </p>
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
                  <div className="mb-6 pb-6 border-b border-white/10">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/50 block mb-2">Инвестиция във Вашия бизнес</span>
                    <div className="flex items-end gap-3 mb-3">
                      <div className="flex flex-col">
                        {material.originalPriceEur && overrides?.[material.slug] !== 0 && (
                          <span className="font-serif text-lg sm:text-xl text-white/40 line-through decoration-red-500/70 decoration-2 leading-none mb-1">
                            {material.originalPriceEur.toFixed(2)} €
                          </span>
                        )}
                        <span className="font-serif text-5xl sm:text-6xl font-bold text-brand-gold leading-none drop-shadow-md">
                          {livePrice.toFixed(2)}<span className="text-2xl text-brand-gold/70 font-sans ml-1">€</span>
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-[11px] text-white/70 leading-relaxed">
                      <ShieldCheck className="h-4 w-4 text-brand-gold shrink-0 mt-0.5" />
                      <span>Сигурно еднократно плащане с карта. Незабавен достъп през Вашия профил завинаги.</span>
                    </div>
                  </div>

                  {/* Buy Button */}
                  <button
                    onClick={() => { setBuyOpen(true); setStatus("idle"); setError(""); }}
                    className="group/btn relative overflow-hidden w-full px-6 py-4 sm:py-5 bg-brand-gold hover:bg-white text-brand-dark font-black text-sm uppercase tracking-widest rounded-2xl shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all duration-500 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-brand-dark/10 to-transparent skew-x-12 pointer-events-none" />
                    Купи и започни сега
                    <ArrowRight className="h-4.5 w-4.5 transition-transform duration-300 group-hover/btn:translate-x-1.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Course Content Wrapper */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 relative z-20">
          <Page />
        </div>

        {/* ─── BUY MODAL ─── */}
        {buyOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl my-8 overflow-hidden">
              <div className="relative bg-gradient-to-br from-brand-green to-brand-green/80 text-white p-6 pr-16 flex items-start gap-3">
                <div className="p-2.5 bg-white/10 rounded-xl shrink-0"><CreditCard className="h-5 w-5" /></div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-gold">{CHECKOUT_MODE === "test" ? "Тестов режим" : "Покупка"}</div>
                  <div className="font-serif text-base sm:text-lg font-bold leading-snug break-words">{material.title}</div>
                </div>
                <button
                  onClick={() => { if (status !== "processing") { setBuyOpen(false); setStatus("idle"); } }}
                  aria-label="Затвори"
                  className="absolute top-4 right-4 inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer shrink-0"
                ><X className="h-5 w-5" /></button>
              </div>

              <div className="p-6 space-y-4">
                {status === "success" ? (
                  <div className="text-center py-6 space-y-3">
                    <CheckCircle className="h-14 w-14 text-green-500 mx-auto" />
                    <h3 className="font-serif text-xl font-bold text-brand-green">Покупката е успешна!</h3>
                    <p className="text-sm text-brand-dark/70">Пренасочваме Ви към профила Ви…</p>
                  </div>
                ) : (
                  <>
                    <div className="bg-brand-light/50 rounded-xl p-4 border border-brand-green/5 flex items-start justify-between">
                      <span className="text-sm font-bold text-brand-green mt-2">Цена</span>
                      <div className="flex flex-col items-end">
                        {material.originalPriceEur && (
                          <span className="font-serif text-base text-brand-dark/40 line-through decoration-red-500/60 decoration-2 leading-none mb-1">
                            {material.originalPriceEur.toFixed(2)} €
                          </span>
                        )}
                        <span className="font-serif text-2xl sm:text-3xl font-bold text-brand-gold whitespace-nowrap leading-none">
                          {livePrice.toFixed(2)} €
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/60">Email *</label>
                      <input type="email" value={buyEmail} onChange={(e) => setBuyEmail(e.target.value)} placeholder="name@example.com" className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-brand-green/15 focus:outline-none focus:border-brand-gold bg-white" disabled={status === "processing"} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/60">Парола за акаунта *</label>
                      <input type="password" value={buyPassword} onChange={(e) => setBuyPassword(e.target.value)} placeholder="мин. 6 символа" className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-brand-green/15 focus:outline-none focus:border-brand-gold bg-white" disabled={status === "processing"} />
                    </div>
                    <div className="border-t border-brand-green/5 pt-3 space-y-2">
                      <input type="text" value={buyCard} onChange={(e) => setBuyCard(e.target.value)} className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-brand-green/15 focus:outline-none focus:border-brand-gold bg-white font-mono tracking-wider" disabled={status === "processing"} />
                      <div className="grid grid-cols-2 gap-3">
                        <input type="text" value={buyExpiry} onChange={(e) => setBuyExpiry(e.target.value)} className="text-sm px-3.5 py-2.5 rounded-xl border border-brand-green/15 focus:outline-none focus:border-brand-gold bg-white font-mono" disabled={status === "processing"} placeholder="MM / YY" />
                        <input type="text" value={buyCvc} onChange={(e) => setBuyCvc(e.target.value)} className="text-sm px-3.5 py-2.5 rounded-xl border border-brand-green/15 focus:outline-none focus:border-brand-gold bg-white font-mono" disabled={status === "processing"} placeholder="CVC" />
                      </div>
                    </div>
                    {error && <div className="text-[11px] bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2">{error}</div>}
                    <button onClick={handleBuy} disabled={status === "processing"} className="w-full px-6 py-4 bg-brand-gold hover:bg-brand-gold-light disabled:opacity-60 disabled:cursor-not-allowed text-brand-dark font-bold text-sm uppercase tracking-widest rounded-full shadow-lg shadow-brand-gold/20 transition-all flex items-center justify-center gap-2 cursor-pointer">
                      {status === "processing" ? (<><Loader2 className="h-4 w-4 animate-spin" /> Обработка…</>) : (<>Плати {livePrice.toFixed(2)} €</>)}
                    </button>
                    {CHECKOUT_MODE === "test" && (
                      <p className="text-[10px] text-center text-brand-dark/40">
                        Тестов режим — никаква реална сума не се таксува.
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-brand-light min-h-screen pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        <Link href="/library" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-dark/60 hover:text-brand-gold transition-colors cursor-pointer">
          <ArrowLeft className="h-3.5 w-3.5" />
          Към книжарницата
        </Link>

        {/* HERO */}
        <div className="bg-white rounded-3xl shadow-lg border border-brand-green/5 overflow-hidden grid grid-cols-1 lg:grid-cols-12 lg:items-stretch">
          <div className="relative aspect-[4/3] lg:aspect-auto lg:col-span-5 bg-gradient-to-br from-brand-green/10 to-brand-gold/10 flex items-center justify-center overflow-hidden">
            {material.card.cover ? (
              <Image
                src={material.card.cover}
                alt={material.title}
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-contain sm:p-2 lg:p-0"
                priority
              />
            ) : (
              material.type === "video"
                ? <Video className="h-24 w-24 text-brand-green/30" strokeWidth={1.5} />
                : <BookOpen className="h-24 w-24 text-brand-green/30" strokeWidth={1.5} />
            )}
            <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-white/95 backdrop-blur-sm text-brand-green px-2.5 py-1.5 rounded-full shadow-sm">
                {material.type === "video" ? <><Video className="h-3 w-3" /> Видео</> : <><BookOpen className="h-3 w-3" /> PDF</>}
              </span>
              {material.card.badge && (
                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-brand-gold text-brand-dark px-2.5 py-1.5 rounded-full shadow-sm">
                  <Sparkles className="h-3 w-3" /> {material.card.badge}
                </span>
              )}
            </div>
          </div>
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col gap-5">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-gold">Дигитална Книжарница</span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-green leading-tight">{material.title}</h1>
            <div className="w-12 h-0.5 bg-brand-gold/60 rounded-full" />
            <p className="text-sm sm:text-base text-brand-dark/70 leading-relaxed">{material.tagline}</p>

            <div className="mt-auto pt-6 border-t border-brand-green/5 space-y-3">
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/40 block mb-1">Цена</span>
                  <div className="flex flex-col">
                    {material.originalPriceEur && (
                      <span className="font-serif text-xl sm:text-2xl text-brand-dark/40 line-through decoration-red-500/60 decoration-2 leading-none mb-1">
                        {material.originalPriceEur.toFixed(2)}€
                      </span>
                    )}
                    <span className="font-serif text-4xl sm:text-5xl font-bold text-brand-gold leading-none">
                      {livePrice.toFixed(2)}<span className="text-xl sm:text-2xl text-brand-dark/50 font-sans ml-1">€</span>
                    </span>
                  </div>
                </div>
                <span className="text-[10px] text-brand-dark/40 font-mono">
                  {material.type === "video" ? "Видео достъп" : "PDF за четене"}
                </span>
              </div>
              <button
                onClick={() => { setBuyOpen(true); setStatus("idle"); setError(""); }}
                className="group relative overflow-hidden w-full px-6 py-4 bg-brand-gold hover:bg-brand-gold-light text-brand-dark font-bold text-sm uppercase tracking-widest rounded-full shadow-lg shadow-brand-gold/20 hover:shadow-xl hover:shadow-brand-gold/35 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 pointer-events-none" />
                Купи и започни сега
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
              <div className="flex items-start gap-2 text-[10px] text-brand-dark/50 leading-relaxed">
                <ShieldCheck className="h-4 w-4 text-brand-gold/70 shrink-0 mt-0.5" />
                <span>Достъп веднага след плащане в защитения Ви профил.</span>
              </div>
            </div>
          </div>
        </div>

        {/* CUSTOM CONTENT */}
        <Page />
      </div>

      {/* ─── BUY MODAL ─── */}
      {buyOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl my-8 overflow-hidden">
            <div className="relative bg-gradient-to-br from-brand-green to-brand-green/80 text-white p-6 pr-16 flex items-start gap-3">
              <div className="p-2.5 bg-white/10 rounded-xl shrink-0"><CreditCard className="h-5 w-5" /></div>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-gold">{CHECKOUT_MODE === "test" ? "Тестов режим" : "Покупка"}</div>
                <div className="font-serif text-base sm:text-lg font-bold leading-snug break-words">{material.title}</div>
              </div>
              <button
                onClick={() => { if (status !== "processing") { setBuyOpen(false); setStatus("idle"); } }}
                aria-label="Затвори"
                className="absolute top-4 right-4 inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer shrink-0"
              ><X className="h-5 w-5" /></button>
            </div>

            <div className="p-6 space-y-4">
              {status === "success" ? (
                <div className="text-center py-6 space-y-3">
                  <CheckCircle className="h-14 w-14 text-green-500 mx-auto" />
                  <h3 className="font-serif text-xl font-bold text-brand-green">Покупката е успешна!</h3>
                  <p className="text-sm text-brand-dark/70">Пренасочваме Ви към профила Ви…</p>
                </div>
              ) : (
                <>
                  <div className="bg-brand-light/50 rounded-xl p-4 border border-brand-green/5 flex items-start justify-between">
                    <span className="text-sm font-bold text-brand-green mt-2">Цена</span>
                    <div className="flex flex-col items-end">
                      {material.originalPriceEur && (
                        <span className="font-serif text-base text-brand-dark/40 line-through decoration-red-500/60 decoration-2 leading-none mb-1">
                          {material.originalPriceEur.toFixed(2)} €
                        </span>
                      )}
                      <span className="font-serif text-2xl sm:text-3xl font-bold text-brand-gold whitespace-nowrap leading-none">
                        {livePrice.toFixed(2)} €
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/60">Email *</label>
                    <input type="email" value={buyEmail} onChange={(e) => setBuyEmail(e.target.value)} placeholder="name@example.com" className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-brand-green/15 focus:outline-none focus:border-brand-gold bg-white" disabled={status === "processing"} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/60">Парола за акаунта *</label>
                    <input type="password" value={buyPassword} onChange={(e) => setBuyPassword(e.target.value)} placeholder="мин. 6 символа" className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-brand-green/15 focus:outline-none focus:border-brand-gold bg-white" disabled={status === "processing"} />
                  </div>
                  <div className="border-t border-brand-green/5 pt-3 space-y-2">
                    <input type="text" value={buyCard} onChange={(e) => setBuyCard(e.target.value)} className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-brand-green/15 focus:outline-none focus:border-brand-gold bg-white font-mono tracking-wider" disabled={status === "processing"} />
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" value={buyExpiry} onChange={(e) => setBuyExpiry(e.target.value)} className="text-sm px-3.5 py-2.5 rounded-xl border border-brand-green/15 focus:outline-none focus:border-brand-gold bg-white font-mono" disabled={status === "processing"} placeholder="MM / YY" />
                      <input type="text" value={buyCvc} onChange={(e) => setBuyCvc(e.target.value)} className="text-sm px-3.5 py-2.5 rounded-xl border border-brand-green/15 focus:outline-none focus:border-brand-gold bg-white font-mono" disabled={status === "processing"} placeholder="CVC" />
                    </div>
                  </div>
                  {error && <div className="text-[11px] bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2">{error}</div>}
                  <button onClick={handleBuy} disabled={status === "processing"} className="w-full px-6 py-4 bg-brand-gold hover:bg-brand-gold-light disabled:opacity-60 disabled:cursor-not-allowed text-brand-dark font-bold text-sm uppercase tracking-widest rounded-full shadow-lg shadow-brand-gold/20 transition-all flex items-center justify-center gap-2 cursor-pointer">
                    {status === "processing" ? (<><Loader2 className="h-4 w-4 animate-spin" /> Обработка…</>) : (<>Плати {livePrice.toFixed(2)} €</>)}
                  </button>
                  {CHECKOUT_MODE === "test" && (
                    <p className="text-[10px] text-center text-brand-dark/40">
                      Тестов режим — никаква реална сума не се таксува.
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
