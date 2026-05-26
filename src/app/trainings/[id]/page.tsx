"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { doc, getDoc, setDoc, collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Training } from "@/lib/trainingTypes";
import {
  Award, ArrowRight, ArrowLeft, CheckCircle, Video, Calendar, X, CreditCard,
  Loader2, ShieldCheck, ExternalLink, Copy, BookOpen,
} from "lucide-react";

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
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [cardExpiry, setCardExpiry] = useState("12 / 30");
  const [cardCvc, setCardCvc] = useState("123");
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [copyDone, setCopyDone] = useState(false);

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
    setStatus("idle"); setError(""); setCopyDone(false);
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
    const cleanCard = cardNumber.replace(/\s+/g, "");
    if (cleanCard !== "4242424242424242") {
      setError("Тестов режим — използвайте картата 4242 4242 4242 4242.");
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
        status: "paid",
        paidAt: new Date().toISOString(),
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

  const copyVideoUrl = async () => {
    if (!training?.videoUrl) return;
    try {
      await navigator.clipboard.writeText(training.videoUrl);
      setCopyDone(true);
      setTimeout(() => setCopyDone(false), 2000);
    } catch { /* ignore */ }
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link href="/trainings" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-dark/60 hover:text-brand-gold transition-colors cursor-pointer mb-6">
          <ArrowLeft className="h-3.5 w-3.5" />
          Към курсовете
        </Link>

        <div className="bg-white rounded-3xl shadow-md border border-brand-green/5 overflow-hidden grid grid-cols-1 lg:grid-cols-2 lg:items-start">
          {/* Cover */}
          <div className="relative aspect-[4/3] bg-gradient-to-br from-brand-green/10 to-brand-gold/10 flex items-center justify-center">
            {training.coverImageUrl ? (
              <Image
                src={training.coverImageUrl}
                alt={training.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
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
                {training.type === "video" ? <><Video className="h-3 w-3" /> Видео обучение</> : <><Award className="h-3 w-3" /> Онлайн лекция</>}
              </span>
              {training.hasCertificate && (
                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-brand-gold text-brand-dark px-2.5 py-1.5 rounded-full shadow-sm">
                  <Award className="h-3 w-3" /> Сертификат
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-10 space-y-5 flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-gold">
              Специализиран курс
            </span>
            <h1 className="font-serif text-3xl font-bold text-brand-green leading-tight">{training.title}</h1>
            <p className="text-sm text-brand-dark/70 leading-relaxed">{training.shortDesc}</p>

            {training.longDescription && (
              <div className="text-sm text-brand-dark/80 leading-relaxed border-t border-brand-green/5 pt-4 space-y-3 whitespace-pre-wrap">
                {training.longDescription}
              </div>
            )}

            {training.bullets && training.bullets.length > 0 && (
              <div className="space-y-2 border-t border-brand-green/5 pt-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/40">Какво включва обучението</p>
                <ul className="space-y-1.5">
                  {training.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-brand-dark/80">
                      <CheckCircle className="h-4 w-4 text-brand-gold shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {training.hasCertificate && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-900 leading-relaxed">
                <strong>🏆 Сертификат:</strong> За издаване на сертификат е задължително успешното решаване на всички възложени тестове в Клиентския Портал.
              </div>
            )}

            <div className="mt-auto pt-6 border-t border-brand-green/5 space-y-4">
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/40 block">Цена</span>
                  <span className="font-serif text-4xl font-bold text-brand-gold">{training.priceEur.toFixed(2)}<span className="text-base text-brand-dark/50 font-sans ml-1">€</span></span>
                </div>
                <span className="text-[10px] text-brand-dark/40 font-mono">
                  {training.type === "video" ? "Незабавен достъп" : "По уговорка"}
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

              <div className="flex items-start gap-2 text-[10px] text-brand-dark/50 leading-relaxed">
                <ShieldCheck className="h-4 w-4 text-brand-gold/70 shrink-0 mt-0.5" />
                <span>
                  {training.type === "video"
                    ? "След плащане получавате незабавно линк за гледане на обучението."
                    : "След плащане Д-р Николова ще се свърже с Вас, за да уточни датите за онлайн обучението."}
                </span>
              </div>
            </div>
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
                  <h3 className="font-serif text-xl font-bold text-brand-green">Записването е успешно!</h3>
                  <p className="text-sm text-brand-dark/70 leading-relaxed">
                    Благодарим за записването за <strong>{training.title}</strong>.
                  </p>

                  {training.type === "video" && training.videoUrl ? (
                    <div className="bg-brand-light/50 border border-brand-green/15 rounded-xl p-4 text-left space-y-3">
                      <div className="flex items-center gap-2">
                        <Video className="h-5 w-5 text-brand-gold" />
                        <span className="text-xs font-black uppercase tracking-wider text-brand-green">Линк за видеото</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={training.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 text-xs text-brand-green underline underline-offset-2 break-all hover:text-brand-gold transition-colors"
                        >
                          {training.videoUrl}
                        </a>
                        <button onClick={copyVideoUrl} className="shrink-0 text-[10px] font-bold uppercase tracking-wider px-3 py-2 rounded-lg border border-brand-green/20 text-brand-green hover:bg-brand-green hover:text-white transition-colors cursor-pointer" title="Копирай линка">
                          {copyDone ? <CheckCircle className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                      <a href={training.videoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex w-full items-center justify-center gap-2 px-4 py-3 rounded-full bg-brand-gold text-brand-dark font-bold text-xs uppercase tracking-widest hover:bg-brand-gold-light transition-colors cursor-pointer">
                        Отвори обучението
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                      <p className="text-[10px] text-brand-dark/60 leading-relaxed">
                        <strong>Запазете този линк</strong> — можете да гледате обучението по всяко време.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-brand-light/50 border border-brand-green/10 rounded-xl p-4 text-left text-xs text-brand-dark/70 space-y-2">
                      <p className="flex items-start gap-2">
                        <Calendar className="h-4 w-4 text-brand-gold shrink-0 mt-0.5" />
                        <span><strong className="text-brand-green">Следваща стъпка:</strong> Д-р Данка Николова ще се свърже с Вас на посочения email и телефон, за да уточни датите за онлайн обучението.</span>
                      </p>
                    </div>
                  )}

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

                  {error && (
                    <div className="text-[11px] bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2">{error}</div>
                  )}

                  <button
                    onClick={submitEnrollment}
                    disabled={status === "processing"}
                    className="w-full px-6 py-4 bg-brand-gold hover:bg-brand-gold-light disabled:opacity-60 disabled:cursor-not-allowed text-brand-dark font-bold text-sm uppercase tracking-widest rounded-full shadow-lg shadow-brand-gold/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {status === "processing" ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Обработка…</>
                    ) : (
                      <>Запиши се и плати {training.priceEur.toFixed(2)} €</>
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
