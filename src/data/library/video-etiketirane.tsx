import Link from "next/link";
import Image from "next/image";
import { PlayCircle, CheckCircle, Award, BookOpen, Clock, FileCheck, ShieldCheck, HelpCircle } from "lucide-react";
import type { LibraryMaterial } from "./types";
import type { CourseMaterialItem } from "@/lib/courseTypes";

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
              src="/video-etiketirane-still.webp"
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
          { icon: FileCheck, label: "Практически примери", desc: "Стъпка по стъпка реални етикети" },
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
              { title: "1. Закупуване на достъп", text: "След като направите банков превод и плащането постъпи, д-р Николова активира достъпа Ви и получавате линк към папка с 22-те видео лекции и теста в Google Drive." },
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

export const videoEtiketiraneLessons: CourseMaterialItem[] = [
  {
    id: "lesson_1",
    title: "Урок 1: Въведение в Регламент (ЕС) № 1169/2011 и основни изисквания",
    type: "video",
    externalUrl: "https://iframe.mediadelivery.net/embed/748739/ef5fee01-7157-4f62-9194-e398ba2d1de5",
    order: 1,
  },
  {
    id: "lesson_2",
    title: "Урок 2: Списък на задължителните данни върху етикета на храните",
    type: "video",
    externalUrl: "https://iframe.mediadelivery.net/embed/748739/e801ee65-0f01-49fe-b864-4fcf3c83e060",
    order: 2,
  },
  {
    id: "lesson_3",
    title: "Урок 3: Наименование на храната – законово, обичайно и описателно",
    type: "video",
    externalUrl: "https://iframe.mediadelivery.net/embed/748739/95c38d14-10f2-4a9b-a5b2-76000a428cc9",
    order: 3,
  },
  {
    id: "lesson_4",
    title: "Урок 4: Списък на съставките и низходящ ред на влагане",
    type: "video",
    externalUrl: "https://iframe.mediadelivery.net/embed/748739/62b76d6d-2ee9-4dc7-b43a-680cdc1d7f18",
    order: 4,
  },
  {
    id: "lesson_5",
    title: "Урок 5: Обозначаване и графично подчертаване на алергени",
    type: "video",
    externalUrl: "https://iframe.mediadelivery.net/embed/748739/53e06e59-b2cb-430e-b378-da7528ac9f1e",
    order: 5,
  },
  {
    id: "lesson_6",
    title: "Урок 6: Количествено изразяване на съставките (QUID изчисления)",
    type: "video",
    externalUrl: "https://iframe.mediadelivery.net/embed/748739/5b946c24-221d-4d39-abab-f49d27724b7b",
    order: 6,
  },
  {
    id: "lesson_7",
    title: "Урок 7: Нетно количество, отцедено тегло и глазура",
    type: "video",
    externalUrl: "https://iframe.mediadelivery.net/embed/748739/78bec605-acb8-45a6-80d6-d60220d48611",
    order: 7,
  },
  {
    id: "lesson_8",
    title: "Урок 8: Срок на трайност: „Най-добър до“ срещу „Използвай до“",
    type: "video",
    externalUrl: "https://iframe.mediadelivery.net/embed/748739/a399d614-5e60-4c02-99d5-e5173038d0b9",
    order: 8,
  },
  {
    id: "lesson_9",
    title: "Урок 9: Специфични условия за съхранение и указания за употреба",
    type: "video",
    externalUrl: "https://iframe.mediadelivery.net/embed/748739/56afb8fc-6cf5-487e-9cc8-4313b5a2e2b2",
    order: 9,
  },
  {
    id: "lesson_10",
    title: "Урок 10: Име, търговско наименование и адрес на стопанския субект",
    type: "video",
    externalUrl: "https://iframe.mediadelivery.net/embed/748739/dd849045-e80f-4948-9ef5-fc076fcf7f9c",
    order: 10,
  },
  {
    id: "lesson_11",
    title: "Урок 11: Страна на произход и място на произход на основната съставка",
    type: "video",
    externalUrl: "https://iframe.mediadelivery.net/embed/748739/e4ba0d72-ca63-4885-9d23-5202b976d7ae",
    order: 11,
  },
  {
    id: "lesson_12",
    title: "Урок 12: Маркировка за идентифициране на партидата (L-партида)",
    type: "video",
    externalUrl: "https://iframe.mediadelivery.net/embed/748739/6db33a10-ac51-4aa1-a0f7-a1a4ec046888",
    order: 12,
  },
  {
    id: "lesson_13",
    title: "Урок 13: Инструкции за употреба при необходимост",
    type: "video",
    externalUrl: "https://iframe.mediadelivery.net/embed/748739/52cc0f6d-660c-4c71-adaf-9ccc73c1751e",
    order: 13,
  },
  {
    id: "lesson_14",
    title: "Урок 14: Действително алкохолно съдържание при напитки над 1.2 обемни %",
    type: "video",
    externalUrl: "https://iframe.mediadelivery.net/embed/748739/63373ee7-74e8-4905-ad2e-d5605e782c28",
    order: 14,
  },
  {
    id: "lesson_15",
    title: "Урок 15: Задължителна таблица с хранителна декларация (Big 7)",
    type: "video",
    externalUrl: "https://iframe.mediadelivery.net/embed/748739/fd36aaad-23de-4ea9-abae-5aae8caaf19c",
    order: 15,
  },
  {
    id: "lesson_16",
    title: "Урок 16: Изчисляване на хранителните стойности – лабораторни анализи vs калкулация",
    type: "video",
    externalUrl: "https://iframe.mediadelivery.net/embed/748739/2aa8f6fc-1433-4316-a3a3-1672dfa31794",
    order: 16,
  },
  {
    id: "lesson_17",
    title: "Урок 17: Допълнителни форми на изразяване (на порция, РКП / RI)",
    type: "video",
    externalUrl: "https://iframe.mediadelivery.net/embed/748739/6c247e92-7552-40aa-8a35-9fa7765d1824",
    order: 17,
  },
  {
    id: "lesson_18",
    title: "Урок 18: Изключения от изискването за хранителна декларация (Приложение V)",
    type: "video",
    externalUrl: "https://iframe.mediadelivery.net/embed/748739/fdf2f666-9eed-45e8-8c37-a4a3a8b1dfc4",
    order: 18,
  },
  {
    id: "lesson_19",
    title: "Урок 19: Езикови изисквания и минимална височина на шрифта (1.2 mm / 0.9 mm)",
    type: "video",
    externalUrl: "https://iframe.mediadelivery.net/embed/748739/f95095fe-8533-4144-9c6c-539e62200610",
    order: 19,
  },
  {
    id: "lesson_20",
    title: "Урок 20: Доброволна информация, хранителни и здравни претенции",
    type: "video",
    externalUrl: "https://iframe.mediadelivery.net/embed/748739/2f96bb28-322c-48d7-a002-e5dd25e7b283",
    order: 20,
  },
  {
    id: "lesson_21",
    title: "Урок 21: Чести грешки при етикетирането и санкции от БАБХ при проверки",
    type: "video",
    externalUrl: "https://iframe.mediadelivery.net/embed/748739/20178302-80d6-4f57-b27b-2575565229af",
    order: 21,
  },
  {
    id: "lesson_22",
    title: "Урок 22: Практически пример за цялостен етикет, чек-лист и тест за сертификат",
    type: "video",
    externalUrl: "https://iframe.mediadelivery.net/embed/748739/9bdd128b-c7fe-4143-8ebc-0301a07d4811",
    order: 22,
  },
];

export const videoEtiketirane: LibraryMaterial = {
  slug: "video-etiketirane",
  title: "Практическо видео обучение по етикетиране на храните",
  tagline:
    "22 детайлни видео лекции с практически примери за производители и търговци на храни. Включва сертификат от д-р Николова след решаване на теста.",
  priceEur: 99.9,
  type: "video",
  category: "training",
  contentUrl: "https://iframe.mediadelivery.net/embed/748739/ef5fee01-7157-4f62-9194-e398ba2d1de5",
  items: videoEtiketiraneLessons,
  card: {
    cover: "/cover-video-etiketirane.webp",
    badge: "22 видео урока · Сертификат",
    accent: "gold",
  },
  page: VideoEtiketiranePage,
  metaDescription:
    "Практическо видео обучение по етикетиране на храни от д-р Данка Николова. 22 лекции, примери и издаване на сертификат от д-р Николова след тест.",
  seoTitle: "Практическо видео обучение по етикетиране на храните — 22 видео урока",
};
