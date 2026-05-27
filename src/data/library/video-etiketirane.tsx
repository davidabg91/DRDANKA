import Link from "next/link";
import Image from "next/image";
import { PlayCircle, CheckCircle, Award, BookOpen, Clock, Sparkles, ShieldCheck, HelpCircle } from "lucide-react";
import type { LibraryMaterial } from "./types";

function VideoEtiketiranePage() {
  return (
    <div className="space-y-12">
      {/* Featured Certificate Panel */}
      <section className="relative bg-white border border-brand-green/10 rounded-3xl p-6 sm:p-8 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 rounded-full blur-3xl" />
        <div className="md:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-gold/10 text-brand-gold text-[10px] font-black uppercase tracking-wider">
            <Award className="h-3.5 w-3.5" />
            Сертификат от д-р Данка Николова
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-green leading-tight">
            Удостоверете Вашите професионални познания
          </h2>
          <p className="text-sm text-brand-dark/70 leading-relaxed">
            След като изгледате всички 22 видео лекции и попълните успешно краткия тест, ще получите персонален сертификат за завършено обучение по етикетиране на храните, лично издаден и подписан от ветеринарния лекар д-р Данка Николова.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {[
              "Сертификат, подписан от д-р Николова",
              "Удостоверява обучението пред БАБХ",
              "Професионално признание в сектора",
              "Бързо издаване по имейл (PDF)",
            ].map(item => (
              <div key={item} className="flex items-center gap-2 text-xs text-brand-dark/80 font-medium">
                <CheckCircle className="h-4 w-4 text-brand-gold shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="md:col-span-5 relative flex justify-center">
          <div className="relative group overflow-hidden rounded-2xl border-2 border-brand-gold/30 shadow-lg hover:border-brand-gold transition-all duration-300 max-w-sm w-full aspect-[4/3] bg-brand-light">
            <Image
              src="/viber_image_2026-05-20_23-01-44-208.jpg"
              alt="Сертификат за обучение по етикетиране на храни"
              fill
              sizes="(max-width: 768px) 100vw, 30vw"
              className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-4">
              <span className="text-[10px] text-white/90 font-bold uppercase tracking-wider flex items-center gap-1">
                <Award className="h-3.5 w-3.5 text-brand-gold" /> Образец на сертификата
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Stats / Highlights */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { icon: PlayCircle, label: "22 Видео урока", desc: "Подробни лекции с видео екрани" },
          { icon: Sparkles, label: "Практически примери", desc: "Стъпка по стъпка реални етикети" },
          { icon: Clock, label: "Достъп 24/7", desc: "Учете в удобно за Вас време" }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-brand-green/5 p-6 shadow-md flex items-start gap-4">
            <div className="p-3 bg-brand-gold/10 text-brand-gold rounded-xl shrink-0">
              <stat.icon className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-brand-green text-sm">{stat.label}</h4>
              <p className="text-[11px] text-brand-dark/60 leading-normal">{stat.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Course Program / Syllabus */}
      <section className="space-y-6">
        <div className="border-b border-brand-green/5 pb-3">
          <h2 className="font-serif text-2xl font-bold text-brand-green flex items-center gap-2.5">
            <span className="p-2 bg-brand-gold/10 text-brand-gold rounded-xl"><BookOpen className="h-5 w-5" /></span>
            Програма на видео обучението
          </h2>
          <p className="text-xs text-brand-dark/50 mt-1">22 лекции, разделени в тематични модули с реални казуси от практиката</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              module: "Модул 1: Правна рамка и Задължителни елементи",
              lectures: [
                "Въведение в Регламент (ЕС) № 1169/2011.",
                "Списък на задължителните данни върху етикета.",
                "Езикови изисквания и минимална височина на шрифта."
              ]
            },
            {
              module: "Модул 2: Съставки и Алергени (Критичен контрол)",
              lectures: [
                "Подреждане на съставките по низходящ ред на теглото.",
                "Обозначаване и графично подчертаване на алергени.",
                "Количествено изразяване на съставки (QUID изчисления)."
              ]
            },
            {
              module: "Модул 3: Дати и Условия на съхранение",
              lectures: [
                "„Най-добър до“ срещу „Използвай до“ – как да изберете правилно.",
                "Специфични указания за съхранение и употреба.",
                "Обозначаване на партида и държава на произход."
              ]
            },
            {
              module: "Модул 4: Хранителна декларация и Калкулации",
              lectures: [
                "Задължителната таблица с хранителни стойности.",
                "Как да изчислите стойностите (лаборатория срещу калкулация).",
                "Изключения от изискването за хранителна декларация."
              ]
            }
          ].map((mod, modIdx) => (
            <div key={modIdx} className="bg-white rounded-2xl border border-brand-green/5 p-5 shadow-sm space-y-4 hover:border-brand-gold/25 transition-all">
              <h3 className="font-serif text-sm font-bold text-brand-green border-b border-brand-green/5 pb-2 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-brand-green/5 text-brand-green text-[10px] font-bold flex items-center justify-center shrink-0">{modIdx + 1}</span>
                {mod.module}
              </h3>
              <ul className="space-y-2">
                {mod.lectures.map((lec, lecIdx) => (
                  <li key={lecIdx} className="text-xs text-brand-dark/70 flex items-start gap-2 leading-relaxed">
                    <PlayCircle className="h-4 w-4 text-brand-gold shrink-0 mt-0.5" />
                    <span>{lec}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Certification Path Walkthrough */}
      <section className="bg-brand-green text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.02] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-2xl space-y-6">
          <h3 className="font-serif text-2xl font-bold">Как протича обучението и сертифицирането?</h3>
          <div className="space-y-4 text-sm text-white/80">
            {[
              { title: "1. Закупуване на достъп", text: "След успешно плащане получавате незабавен линк към папка с 22-те видео лекции и теста в Google Drive." },
              { title: "2. Преглед на лекциите", text: "Изгледайте кратките и практически насочени видео лекции от всяко устройство (телефон, таблет или компютър)." },
              { title: "3. Изпълнение на онлайн тест", text: "След последната лекция попълнете теста в папката, за да проверите и затвърдите наученото." },
              { title: "4. Издаване на сертификат", text: "След успешно преминаване на теста, д-р Николова ще изготви и изпрати Вашия личен сертификат по имейл." }
            ].map((step, idx) => (
              <div key={idx} className="flex gap-4">
                <span className="w-8 h-8 rounded-full bg-white/10 text-brand-gold font-bold flex items-center justify-center shrink-0 border border-white/10">{idx + 1}</span>
                <div className="space-y-1">
                  <h5 className="font-bold text-white">{step.title}</h5>
                  <p className="leading-relaxed text-xs text-white/70">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Questions Section */}
      <section className="bg-white rounded-3xl border border-brand-green/5 p-6 sm:p-8 flex items-start gap-4 shadow-md">
        <HelpCircle className="h-6 w-6 text-brand-gold shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-brand-green text-sm">Имате въпроси за курса или сертификата?</p>
          <p className="text-xs text-brand-dark/60 leading-relaxed">
            Ако имате допълнителни въпроси преди покупка, можете да се свържете с д-р Николова от страницата за контакти. Обучението е съобразено изцяло с актуалните изисквания на БАБХ и Регламент 1169.
          </p>
        </div>
      </section>

      <p className="text-center text-xs text-brand-dark/50">
        Искате да зададете въпрос директно?{" "}
        <Link href="/contact" className="text-brand-gold hover:underline font-bold">
          Пишете на д-р Николова →
        </Link>
      </p>
    </div>
  );
}

export const videoEtiketirane: LibraryMaterial = {
  slug: "video-etiketirane",
  title: "Практическо видео обучение по етикетиране на храните",
  tagline:
    "22 детайлни видео лекции с практически примери за производители и търговци на храни. Включва сертификат от д-р Николова след решаване на теста.",
  priceEur: 99.9,
  type: "video",
  contentUrl: "https://drive.google.com/drive/folders/1oZ-0OaHEbLF1YTH3Q45MTsOm0xbv0hUd",
  card: {
    cover: "/Gemini_Generated_Image_bowz91bowz91bowz.png",
    badge: "Сертификат",
    accent: "gold",
  },
  page: VideoEtiketiranePage,
  metaDescription:
    "Практическо видео обучение по етикетиране на храни от д-р Данка Николова. 22 лекции, примери и издаване на сертификат от д-р Николова след тест.",
};
