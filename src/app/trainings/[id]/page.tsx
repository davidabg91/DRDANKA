"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { doc, getDoc, setDoc, collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Training } from "@/lib/trainingTypes";
import {
  Award, ArrowRight, ArrowLeft, CheckCircle, Video, Calendar, X, Landmark,
  Loader2, ShieldCheck, BookOpen,
} from "lucide-react";
import BankTransferNotice from "@/components/BankTransferNotice";

/**
 * /trainings/[id] — detail page for a specialized training.
 *
 * Mirrors /courses/[id]: cover on the left, title + long description +
 * bullets on the right, enrollment modal triggered by 'Запиши се'.
 */

export default function TrainingDetailPage() {
  const params = useParams<{ id: string }>();
  const trainingId = params?.id;

  const [training, setTraining] = useState<Training | null>(null);
  const [loading, setLoading] = useState(true);

  // Enrollment modal state
  const [enrollOpen, setEnrollOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!trainingId) return;
    (async () => {
      try {
        // Slug lookup with fallback to doc id for legacy URLs.
        const q = query(collection(db, "trainings"), where("slug", "==", trainingId), limit(1));
        const bySlug = await getDocs(q);
        if (!bySlug.empty) {
          setTraining(bySlug.docs[0].data() as Training);
        } else {
          const snap = await getDoc(doc(db, "trainings", trainingId));
          setTraining(snap.exists() ? (snap.data() as Training) : null);
        }
      } catch (err) {
        console.error("Training load error:", err);
        setTraining(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [trainingId]);

  const validEmail = (s: string) => /^[^@]+@[^@]+\.[^@]+$/.test(s);

  const openEnroll = () => {
    setName(""); setEmail(""); setPhone(""); setCompany("");
    setStatus("idle"); setError("");
    setEnrollOpen(true);
  };
  const closeEnroll = () => {
    if (status === "processing") return;
    setEnrollOpen(false);
    setStatus("idle");
  };

  const submitEnrollment = async () => {
    if (!training) return;
    if (!name.trim() || !validEmail(email) || !phone.trim()) {
      setError("Моля попълнете име, валиден email и телефон.");
      return;
    }
    setError("");
    setStatus("processing");
    try {
      const enrollmentId = `enroll_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const payload: any = {
        id: enrollmentId,
        trainingId: training.id,
        trainingTitle: training.title,
        trainingType: training.type,
        fullName: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        company: company.trim() || "",
        priceEur: training.priceEur,
        status: "awaiting_payment",
        createdAt: new Date().toISOString(),
      };
      if (training.type === "video" && training.videoUrl) {
        payload.videoUrl = training.videoUrl;
      }
      await setDoc(doc(db, "enrollments", enrollmentId), payload);
      setStatus("success");
    } catch (err: any) {
      console.error("Enrollment error:", err);
      setError(err?.message || "Грешка при записването. Опитайте отново.");
      setStatus("error");
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-brand-light flex items-center justify-center text-brand-dark/50 text-sm">Зареждане…</div>;
  }
  if (!training || !training.published) {
    return (
      <div className="min-h-screen bg-brand-light flex flex-col items-center justify-center gap-3 p-8 text-center">
        <BookOpen className="h-10 w-10 text-brand-gold/40" />
        <p className="text-brand-dark/70">Този курс не съществува или е скрит от каталога.</p>
        <Link href="/trainings" className="text-xs font-bold uppercase tracking-wider text-brand-gold hover:underline cursor-pointer">
          ← Към каталога
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-brand-light min-h-screen pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        <Link href="/trainings" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-dark/60 hover:text-brand-gold transition-colors cursor-pointer">
          <ArrowLeft className="h-3.5 w-3.5" />
          Към курсовете
        </Link>

        {/* ─── HERO CARD: cover + summary + buy ─── */}
        <div className="bg-white rounded-3xl shadow-lg border border-brand-green/5 overflow-hidden grid grid-cols-1 lg:grid-cols-12 lg:items-stretch">
          {/* Cover (5/12) */}
          <div className="relative aspect-[4/3] lg:aspect-auto lg:col-span-5 bg-gradient-to-br from-brand-green/10 to-brand-gold/10 flex items-center justify-center overflow-hidden">
            {training.coverImageUrl ? (
              <Image
                src={training.coverImageUrl}
                alt={training.title}
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="relative">
                <div className="absolute inset-0 rounded-3xl bg-brand-gold/30 blur-2xl animate-pulse" />
                {training.type === "video"
                  ? <Video className="relative h-24 w-24 text-brand-green/40" strokeWidth={1.5} />
                  : <Award className="relative h-24 w-24 text-brand-green/40" strokeWidth={1.5} />}
              </div>
            )}
            {/* Floating chips */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-white/95 backdrop-blur-sm text-brand-green px-2.5 py-1.5 rounded-full shadow-sm">
                {training.type === "video" ? <><Video className="h-3 w-3" /> Видео</> : <><Award className="h-3 w-3" /> Онлайн</>}
              </span>
              {training.hasCertificate && (
                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-brand-gold text-brand-dark px-2.5 py-1.5 rounded-full shadow-sm">
                  <Award className="h-3 w-3" /> Сертификат
                </span>
              )}
            </div>
          </div>

          {/* Summary + Buy (7/12) */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col gap-5">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-gold">
              Специализиран курс
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-green leading-tight">{training.title}</h1>
            <div className="w-12 h-0.5 bg-brand-gold/60 rounded-full" />
            <p className="text-sm sm:text-base text-brand-dark/70 leading-relaxed">{training.shortDesc}</p>

            {training.bullets && training.bullets.length > 0 && (
              <ul className="space-y-2 mt-1">
                {training.bullets.slice(0, 4).map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-brand-dark/80">
                    <CheckCircle className="h-4 w-4 text-brand-gold shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Price + Buy stripe */}
            <div className="mt-auto pt-6 border-t border-brand-green/5 space-y-3">
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/40 block">Цена</span>
                  <span className="font-serif text-4xl font-bold text-brand-gold">{training.priceEur.toFixed(2)}<span className="text-base text-brand-dark/50 font-sans ml-1">€</span></span>
                </div>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-brand-dark/50 bg-brand-light/60 px-3 py-1.5 rounded-full">
                  {training.type === "video" ? <><Video className="h-3 w-3 text-brand-gold" /> Видео обучение</> : <><Calendar className="h-3 w-3 text-brand-gold" /> По уговорка</>}
                </span>
              </div>
              <button
                onClick={openEnroll}
                className="group relative overflow-hidden w-full px-6 py-4 bg-brand-gold hover:bg-brand-gold-light text-brand-dark font-bold text-sm uppercase tracking-widest rounded-full shadow-lg shadow-brand-gold/20 hover:shadow-xl hover:shadow-brand-gold/35 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 pointer-events-none" />
                Запиши се за курса
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>

        {/* ─── LONG DESCRIPTION (only when admin filled it) ─── */}
        {training.longDescription && (
          <div className="bg-white rounded-3xl shadow-md border border-brand-green/5 p-6 sm:p-10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-gold/10 text-brand-gold flex items-center justify-center">
                <BookOpen className="h-5 w-5" />
              </div>
              <h2 className="font-serif text-xl font-bold text-brand-green">За обучението</h2>
            </div>
            <div className="text-sm sm:text-base text-brand-dark/80 leading-relaxed whitespace-pre-wrap">
              {training.longDescription}
            </div>
          </div>
        )}

        {/* ─── ALL BULLETS (if more than 4) ─── */}
        {training.bullets && training.bullets.length > 4 && (
          <div className="bg-white rounded-3xl shadow-md border border-brand-green/5 p-6 sm:p-10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-gold/10 text-brand-gold flex items-center justify-center">
                <CheckCircle className="h-5 w-5" />
              </div>
              <h2 className="font-serif text-xl font-bold text-brand-green">Какво включва обучението</h2>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {training.bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-brand-dark/80">
                  <CheckCircle className="h-4 w-4 text-brand-gold shrink-0 mt-0.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ─── CERTIFICATE NOTICE ─── */}
        {training.hasCertificate && (
          <div className="bg-gradient-to-br from-amber-50 to-brand-gold/10 border border-amber-200 rounded-3xl p-6 sm:p-8 flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-gold text-brand-dark flex items-center justify-center shrink-0 shadow-md">
              <Award className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <p className="font-serif text-lg font-bold text-brand-green">Сертификат от д-р Данка Николова</p>
              <p className="text-sm text-brand-dark/70 leading-relaxed">
                След успешното решаване на тестовете в Клиентския Портал, ще получите личен сертификат, подписан от д-р Николова, който да удостовери Вашите знания.
              </p>
            </div>
          </div>
        )}

        {/* ─── BOTTOM TRUST ROW ─── */}
        <div className="bg-white rounded-3xl shadow-md border border-brand-green/5 p-6 sm:p-8 flex items-start gap-4">
          <ShieldCheck className="h-6 w-6 text-brand-gold shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-brand-green text-sm">Сигурно записване</p>
            <p className="text-xs text-brand-dark/60 leading-relaxed">
              {training.type === "video"
                ? "След плащане получавате незабавно линк за гледане на обучението на посочения email."
                : "След плащане Д-р Николова ще се свърже с Вас, за да уточни датите за онлайн обучението."}
            </p>
          </div>
        </div>
      </div>

      {/* ─────────── ENROLLMENT MODAL ─────────── */}
      {enrollOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl my-8 overflow-hidden">
            <div className="relative bg-gradient-to-br from-brand-green to-brand-green/80 text-white p-6 pr-16 flex items-start gap-3">
              <div className="p-2.5 bg-white/10 rounded-xl shrink-0">
                <Video className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-gold">Записване</div>
                <div className="font-serif text-base sm:text-lg font-bold leading-snug break-words">{training.title}</div>
              </div>
              <button
                onClick={closeEnroll}
                aria-label="Затвори"
                className="absolute top-4 right-4 inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer shrink-0"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {status === "success" ? (
                <div className="text-center py-4 space-y-3">
                  <CheckCircle className="h-14 w-14 text-green-500 mx-auto" />
                  <h3 className="font-serif text-xl font-bold text-brand-green">Заявката е приета!</h3>
                  <p className="text-sm text-brand-dark/70 leading-relaxed">
                    Благодарим за заявката за <strong>{training.title}</strong>. За да потвърдите записването, направете банков превод по сметката по-долу. <strong className="text-brand-green">Веднага след като плащането постъпи, д-р Данка Николова ще се свърже с Вас</strong> и ще активира достъпа Ви до обучението.
                  </p>

                  <BankTransferNotice amount={`${training.priceEur.toFixed(2)} €`} reference={`${name.trim()} — ${training.title}`} />

                  {training.hasCertificate && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-left text-xs text-amber-900">
                      <strong>Сертификат:</strong> Издава се след успешно решаване на тестовете в Клиентския Портал.
                    </div>
                  )}

                  <button onClick={closeEnroll} className="px-6 py-3 rounded-full bg-brand-green text-white font-bold text-xs uppercase tracking-wider hover:bg-brand-green/90 transition-colors cursor-pointer">
                    Затвори
                  </button>
                </div>
              ) : (
                <>
                  <div className="bg-brand-light/50 rounded-xl p-4 border border-brand-green/5 flex items-center justify-between">
                    <span className="text-sm font-bold text-brand-green">Цена за обучението</span>
                    <span className="font-serif text-2xl font-bold text-brand-gold whitespace-nowrap ml-3">{training.priceEur.toFixed(2)} €</span>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/60">Име и фамилия *</label>
                      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Иван Петров" className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-brand-green/15 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold bg-white" disabled={status === "processing"} />
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
                  </div>

                  <div className="border-t border-brand-green/5 pt-4 flex items-start gap-2 text-[11px] text-brand-dark/60 leading-relaxed">
                    <Landmark className="h-4 w-4 text-brand-gold shrink-0 mt-0.5" />
                    <span>Плащането е по банков път. След изпращане на заявката ще видите данните за превод. Достъпът се активира след постъпване на плащането.</span>
                  </div>

                  {error && (
                    <div className="text-[11px] bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2">{error}</div>
                  )}

                  <button
                    onClick={submitEnrollment}
                    disabled={status === "processing"}
                    className="w-full px-6 py-4 bg-brand-gold hover:bg-brand-gold-light disabled:opacity-60 disabled:cursor-not-allowed text-brand-dark font-bold text-sm uppercase tracking-widest rounded-full shadow-lg shadow-brand-gold/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {status === "processing" ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Изпращане…</>
                    ) : (
                      <>Изпрати заявка за записване</>
                    )}
                  </button>

                  <p className="text-[10px] text-center text-brand-dark/50 leading-relaxed">
                    <ShieldCheck className="h-3 w-3 inline text-brand-gold mr-1" />
                    {training.type === "video"
                      ? "След плащане ще получите линк за гледане на обучението."
                      : "След плащане ще получите потвърждение и Д-р Николова ще се свърже с Вас за уточняване на датите."}
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
