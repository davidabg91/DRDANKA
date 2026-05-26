"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  GraduationCap, BookOpen, Award, ArrowRight, CheckCircle, Building,
  Video, Calendar, X, CreditCard, Loader2, ShieldCheck, ExternalLink, Copy,
} from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useTrainings } from "@/lib/firebaseHooks";
import { Training } from "@/lib/trainingTypes";

/**
 * /training — landing for the digital bookstore and specialized online trainings.
 *
 * Trainings are now stored in Firestore /trainings (managed by admin in
 * /profile → Курсове/Обучения tab). Two delivery types are supported:
 *
 *   - 'zoom':  live online lecture; after payment admin contacts buyer for dates.
 *   - 'video': pre-recorded; after payment buyer immediately receives videoUrl.
 *
 * Certificate (when training.hasCertificate) is issued by Dr. Danka after the
 * trainee passes the tests assigned in the Client Portal.
 */

export default function TrainingPage() {
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
      // Snapshot videoUrl into the enrollment so the buyer keeps access if admin later edits/removes it.
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
      {/* Hero */}
      <section className="bg-brand-green text-white py-16 border-b border-brand-gold/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-brand-gold">
            <GraduationCap className="h-3.5 w-3.5" />
            Обучения & Материали
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
            Обучения за хранителен бизнес
          </h1>
          <p className="text-sm sm:text-base text-white/70 max-w-2xl mx-auto font-light leading-relaxed">
            Подгответе персонала, документацията и обекта си за изискванията на БАБХ. Изберете между специализирани
            онлайн курсове със сертификат или дигитални наръчници от книжарницата.
          </p>
        </div>
      </section>

      {/* Two-card CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/bookstore"
          className="group bg-white rounded-2xl border border-brand-green/10 p-8 space-y-4 shadow-md hover:shadow-xl hover:border-brand-gold/40 transition-all duration-300 cursor-pointer flex flex-col"
        >
          <div className="p-3 bg-brand-gold/10 text-brand-gold rounded-xl w-fit">
            <BookOpen className="h-7 w-7" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-brand-green group-hover:text-brand-gold transition-colors">
            Дигитална Книжарница
          </h2>
          <p className="text-sm text-brand-dark/70 leading-relaxed flex-1">
            Готови наръчници, шаблони и обучителни материали. Купуват се онлайн с карта, четат се веднага в защитения
            ви профил. Идеално за самоподготовка преди инспекция.
          </p>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-green group-hover:text-brand-gold transition-colors">
            Виж каталога <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </span>
        </Link>

        <a
          href="#specialized-courses"
          className="group bg-white rounded-2xl border border-brand-green/10 p-8 space-y-4 shadow-md hover:shadow-xl hover:border-brand-gold/40 transition-all duration-300 cursor-pointer flex flex-col"
        >
          <div className="p-3 bg-brand-green/10 text-brand-green rounded-xl w-fit">
            <Video className="h-7 w-7" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-brand-green group-hover:text-brand-gold transition-colors">
            Специализирани курсове по безопасност
          </h2>
          <p className="text-sm text-brand-dark/70 leading-relaxed flex-1">
            Онлайн обучения и лекции, провеждани лично от д-р Николова. След успешно решаване на тестовете в
            портала получавате официален сертификат за преминато обучение.
          </p>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-green group-hover:text-brand-gold transition-colors">
            Виж курсовете <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </span>
        </a>
      </section>

      {/* Specialized trainings list */}
      <section id="specialized-courses" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 space-y-8 scroll-mt-20">
        <div className="text-center space-y-2">
          <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-brand-gold">
            <Video className="h-3.5 w-3.5" />
            Онлайн обучения със сертификат
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-brand-green">Специализирани курсове по безопасност</h3>
          <p className="text-sm text-brand-dark/60 max-w-2xl mx-auto">
            Запишете се сега, заплатете онлайн и започнете обучението. Д-р Николова ще се свърже с Вас при нужда от
            уточнения по графика.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {loading && (
            <div className="text-center text-sm text-brand-dark/50 py-12">Зареждане на курсовете…</div>
          )}
          {!loading && trainings.length === 0 && (
            <div className="text-center text-sm text-brand-dark/50 py-12 italic">
              В момента няма налични онлайн обучения. Скоро ще добавим нови курсове.
            </div>
          )}
          {!loading && trainings.map((t) => (
            <div key={t.id} className="bg-white rounded-3xl border border-brand-green/5 shadow-md overflow-hidden grid grid-cols-1 md:grid-cols-3 hover:shadow-xl transition-shadow duration-300">
              {t.coverImageUrl ? (
                <div className="md:col-span-1 relative aspect-[4/3] md:aspect-auto md:min-h-[280px] bg-gradient-to-br from-brand-green/10 to-brand-gold/10 overflow-hidden">
                  <Image
                    src={t.coverImageUrl}
                    alt={t.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white space-y-1">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] bg-brand-gold text-brand-dark px-2 py-1 rounded-full">
                      {t.type === "video" ? <><Video className="h-3 w-3" /> Видео</> : <><Award className="h-3 w-3" /> Онлайн</>}
                    </span>
                    {t.hasCertificate && (
                      <div className="text-[9px] font-bold uppercase tracking-wider text-white/90 pt-1 flex items-center gap-1">
                        <Award className="h-3 w-3 text-brand-gold" /> Със сертификат
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="md:col-span-1 bg-gradient-to-br from-brand-green/10 to-brand-gold/10 flex items-center justify-center p-8">
                  <div className="text-center space-y-2">
                    <div className="inline-flex p-4 bg-white rounded-2xl shadow-md">
                      {t.type === "video" ? <Video className="h-10 w-10 text-brand-gold" /> : <Award className="h-10 w-10 text-brand-gold" />}
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-gold pt-2">
                      {t.type === "video" ? "Видео обучение" : "Онлайн лекция"}
                    </div>
                    {t.hasCertificate && (
                      <div className="text-[9px] font-bold uppercase tracking-wider text-brand-green/70">
                        Със сертификат
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="md:col-span-2 p-6 sm:p-8 space-y-4">
                <h4 className="font-serif text-xl sm:text-2xl font-bold text-brand-green leading-tight">{t.title}</h4>
                <p className="text-sm text-brand-dark/70 leading-relaxed">{t.shortDesc}</p>
                {t.bullets.length > 0 && (
                  <ul className="space-y-1.5">
                    {t.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-brand-dark/80">
                        <CheckCircle className="h-4 w-4 text-brand-gold shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {t.hasCertificate && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-[11px] text-amber-900 leading-relaxed">
                    <strong>Сертификат:</strong> За издаване на сертификат е задължително успешното решаване на всички възложени тестове в Клиентския Портал.
                  </div>
                )}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2 border-t border-brand-green/5">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/40 block">Цена</span>
                    <span className="font-serif text-3xl font-bold text-brand-gold">
                      {t.priceEur.toFixed(2)}<span className="text-base text-brand-dark/50 font-sans ml-1">€</span>
                    </span>
                  </div>
                  <button
                    onClick={() => openEnroll(t)}
                    className="px-6 py-3 bg-brand-gold hover:bg-brand-gold-light text-brand-dark font-bold text-xs uppercase tracking-widest rounded-full shadow-lg shadow-brand-gold/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Запиши се
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* What you get */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 space-y-8">
        <div className="text-center space-y-2">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-brand-green">Какво получавате</h3>
          <p className="text-sm text-brand-dark/60 max-w-2xl mx-auto">
            Независимо коя форма изберете, материалите ни се основават на актуалните регулации и над 20 години
            практика в консултирането на хранителни обекти.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: Award, title: "Сертификат", text: "Официален документ след успешни тестове в портала." },
            { icon: CheckCircle, title: "Актуални документи", text: "Шаблони, които отговарят на последните изисквания на БАБХ." },
            { icon: Building, title: "Практически примери", text: "Реални казуси от ресторанти, цехове и магазини." },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="bg-white rounded-2xl border border-brand-green/5 p-6 space-y-3 shadow-sm">
              <div className="p-2.5 bg-brand-gold/10 text-brand-gold rounded-xl w-fit">
                <Icon className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-brand-green">{title}</h4>
              <p className="text-xs text-brand-dark/60 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────── ENROLLMENT MODAL ─────────── */}
      {enrollFor && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl my-8 overflow-hidden">
            <div className="bg-gradient-to-br from-brand-green to-brand-green/80 text-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/10 rounded-xl">
                  <Video className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-gold">Записване</div>
                  <div className="font-serif text-lg font-bold truncate">{enrollFor.title}</div>
                </div>
              </div>
              <button onClick={closeEnroll} className="text-white/60 hover:text-white p-1 rounded-full cursor-pointer">
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
                        <strong>Запазете този линк</strong> — изпратили сме копие и на посочения email. Можете да гледате обучението по всяко време.
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
                      <strong>🏆 Сертификат:</strong> Издава се след успешно решаване на тестовете, които ще получите в Клиентския Портал.
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
