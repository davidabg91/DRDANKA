"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter, notFound } from "next/navigation";
import { findLibraryMaterial } from "@/data/library";
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
                className="object-cover"
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
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/40 block">Цена</span>
                  <span className="font-serif text-4xl font-bold text-brand-gold">{material.priceEur.toFixed(2)}<span className="text-base text-brand-dark/50 font-sans ml-1">€</span></span>
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
                  <div className="bg-brand-light/50 rounded-xl p-4 border border-brand-green/5 flex items-center justify-between">
                    <span className="text-sm font-bold text-brand-green">Цена</span>
                    <span className="font-serif text-2xl font-bold text-brand-gold whitespace-nowrap ml-3">{material.priceEur.toFixed(2)} €</span>
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
                    {status === "processing" ? (<><Loader2 className="h-4 w-4 animate-spin" /> Обработка…</>) : (<>Плати {material.priceEur.toFixed(2)} €</>)}
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
