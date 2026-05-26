"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Award, ArrowRight, CheckCircle, Video, Calendar, X, CreditCard, Loader2,
  ShieldCheck, ExternalLink, Copy,
} from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useTrainings } from "@/lib/firebaseHooks";
import { Training } from "@/lib/trainingTypes";

/**
 * /trainings — public catalog of specialized online courses.
 *
 * Mirrors the design language of /bookstore. Trainings are managed by admin
 * via /profile → 'Обучения & Записани'. After payment, type='video' rows show
 * the videoUrl in the success screen; type='zoom' rows display the standard
 * 'Dr. Danka will contact you' message.
 */
export default function TrainingsCatalogPage() {
  const { trainings, loading } = useTrainings(true);

  const [enrollFor, setEnrollFor] = useState<Training | null>(null);
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

  const validEmail = (s: string) => /^[^@]+@[^@]+\.[^@]+$/.test(s);

  const openEnroll = (t: Training) => {
    setEnrollFor(t);
    setName(""); setEmail(""); setPhone(""); setCompany("");
    setStatus("idle"); setError(""); setCopyDone(false);
  };
  const closeEnroll = () => {
    if (status === "processing") return;
    setEnrollFor(null);
    setStatus("idle");
  };

  const submitEnrollment = async () => {
    if (!enrollFor) return;
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
        trainingId: enrollFor.id,
        trainingTitle: enrollFor.title,
        trainingType: enrollFor.type,
        fullName: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        company: company.trim() || "",
        priceEur: enrollFor.priceEur,
        status: "paid",
        paidAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };
      if (enrollFor.type === "video" && enrollFor.videoUrl) {
        payload.videoUrl = enrollFor.videoUrl;
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
    if (!enrollFor?.videoUrl) return;
    try {
      await navigator.clipboard.writeText(enrollFor.videoUrl);
      setCopyDone(true);
      setTimeout(() => setCopyDone(false), 2000);
    } catch { /* ignore */ }
  };

  return (
    <div className="bg-brand-light min-h-screen pb-24">
      <section className="bg-brand-green text-white py-16 border-b border-brand-gold/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-brand-gold">
            <Video className="h-3.5 w-3.5" />
            Специализирани онлайн курсове
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold">
            Курсове по безопасност на храните
          </h1>
          <p className="text-sm sm:text-base text-white/70 max-w-2xl mx-auto font-light">
            Онлайн обучения и лекции, провеждани лично от д-р Николова. След успешно решаване на тестовете в
            портала получавате официален сертификат за преминато обучение.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {loading ? (
          <div className="bg-white rounded-2xl shadow-md p-10 text-center text-brand-dark/50 text-sm">
            Зареждане на курсовете…
          </div>
        ) : trainings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-10 text-center space-y-2">
            <Award className="h-10 w-10 text-brand-gold/50 mx-auto" />
            <p className="text-brand-dark/60 text-sm">В момента няма публикувани курсове. Скоро ще има!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {trainings.map(t => (
              <Link
                key={t.id}
                href={`/trainings/${t.slug || t.id}`}
                className="group relative bg-white rounded-3xl border border-brand-green/10 hover:border-brand-gold/50 overflow-hidden shadow-md hover:shadow-2xl hover:shadow-brand-gold/20 hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer text-left"
              >
                {/* Cover */}
                <div className="relative aspect-[4/3] bg-gradient-to-br from-brand-green/15 to-brand-gold/15 overflow-hidden">
                  {t.coverImageUrl ? (
                    <Image
                      src={t.coverImageUrl}
                      alt={t.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative">
                        <div className="absolute inset-0 rounded-2xl bg-brand-gold/30 blur-2xl animate-pulse" />
                        {t.type === "video"
                          ? <Video className="relative h-20 w-20 text-brand-green/40" strokeWidth={1.5} />
                          : <Award className="relative h-20 w-20 text-brand-green/40" strokeWidth={1.5} />}
                      </div>
                    </div>
                  )}

                  {/* Subtle bottom gradient */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/30 to-transparent" />

                  {/* Floating chips */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider bg-white/95 backdrop-blur-sm text-brand-green px-2.5 py-1 rounded-full shadow-sm">
                      {t.type === "video" ? <><Video className="h-3 w-3" /> Видео</> : <><Award className="h-3 w-3" /> Онлайн</>}
                    </span>
                    {t.hasCertificate && (
                      <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider bg-brand-gold text-brand-dark px-2.5 py-1 rounded-full shadow-sm">
                        <Award className="h-3 w-3" /> Сертификат
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6 flex flex-col flex-1 gap-3">
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-green leading-snug group-hover:text-brand-gold transition-colors">
                    {t.title}
                  </h3>
                  <p className="text-xs text-brand-dark/60 leading-relaxed line-clamp-2 flex-1">
                    {t.shortDesc}
                  </p>

                  <div className="flex items-end justify-between pt-4 mt-auto border-t border-brand-green/5">
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-brand-dark/40 block leading-none">Цена</span>
                      <span className="font-serif text-2xl sm:text-3xl font-bold text-brand-gold leading-tight">
                        {t.priceEur.toFixed(2)}<span className="text-sm text-brand-dark/50 font-sans ml-0.5">€</span>
                      </span>
                    </div>
                    <span className="relative overflow-hidden inline-flex items-center gap-1.5 px-4 py-2.5 bg-brand-green group-hover:bg-brand-gold text-white group-hover:text-brand-dark font-bold text-[10px] uppercase tracking-widest rounded-full shadow-md group-hover:shadow-lg group-hover:shadow-brand-gold/40 transition-all duration-300">
                      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 pointer-events-none" />
                      Виж
                      <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ─────────── ENROLLMENT MODAL ─────────── */}
      {enrollFor && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl my-8 overflow-hidden">
            <div className="relative bg-gradient-to-br from-brand-green to-brand-green/80 text-white p-6 pr-16 flex items-start gap-3">
              <div className="p-2.5 bg-white/10 rounded-xl shrink-0">
                <Video className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-gold">Записване</div>
                <div className="font-serif text-base sm:text-lg font-bold leading-snug break-words">{enrollFor.title}</div>
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
                    Благодарим за записването за <strong>{enrollFor.title}</strong>.
                  </p>

                  {enrollFor.type === "video" && enrollFor.videoUrl ? (
                    <div className="bg-brand-light/50 border border-brand-green/15 rounded-xl p-4 text-left space-y-3">
                      <div className="flex items-center gap-2">
                        <Video className="h-5 w-5 text-brand-gold" />
                        <span className="text-xs font-black uppercase tracking-wider text-brand-green">Линк за видеото</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={enrollFor.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 text-xs text-brand-green underline underline-offset-2 break-all hover:text-brand-gold transition-colors"
                        >
                          {enrollFor.videoUrl}
                        </a>
                        <button onClick={copyVideoUrl} className="shrink-0 text-[10px] font-bold uppercase tracking-wider px-3 py-2 rounded-lg border border-brand-green/20 text-brand-green hover:bg-brand-green hover:text-white transition-colors cursor-pointer" title="Копирай линка">
                          {copyDone ? <CheckCircle className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                      <a href={enrollFor.videoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex w-full items-center justify-center gap-2 px-4 py-3 rounded-full bg-brand-gold text-brand-dark font-bold text-xs uppercase tracking-widest hover:bg-brand-gold-light transition-colors cursor-pointer">
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

                  {enrollFor.hasCertificate && (
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
                    <span className="font-serif text-2xl font-bold text-brand-gold whitespace-nowrap ml-3">{enrollFor.priceEur.toFixed(2)} €</span>
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
                      <>Запиши се и плати {enrollFor.priceEur.toFixed(2)} €</>
                    )}
                  </button>

                  <p className="text-[10px] text-center text-brand-dark/50 leading-relaxed">
                    <ShieldCheck className="h-3 w-3 inline text-brand-gold mr-1" />
                    {enrollFor.type === "video"
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
