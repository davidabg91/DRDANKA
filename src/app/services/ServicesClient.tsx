"use client";

import { useState } from "react";
import Link from "next/link";
import { PLANS } from "@/lib/plans";
import {
  FileText,
  ShieldCheck,
  ShieldAlert,
  BookOpen,
  ClipboardList,
  Award,
  ListTodo,
  FileSpreadsheet,
  Check,
  ArrowRight,
  ArrowDown,
  TrendingUp,
  Video,
  FileCheck,
  Gift,
  Phone,
  Tag,
  Store,
  Globe,
  Smartphone,
} from "lucide-react";

interface ServiceItem {
  /** Anchor id — the situation picker links straight to the card. */
  id: string;
  title: string;
  badge: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>> | any;
  desc: string;
  scope: string[];
  benefits: string;
  /** Dedicated landing page, when the service has one. Renders the card title
   *  as a link so the deeper page is reachable by crawlers and by clients. */
  href?: string;
}

const SERVICES: ServiceItem[] = [
  {
    id: "haccp",
    title: "Разработка и внедряване на HACCP (НАССР / ХАСЕП) система",
    badge: "Задължително по закон",
    icon: ShieldCheck,
    href: "/haccp-sistema",
    desc: "Анализ на опасностите и критичните контролни точки. Разработване, внедряване и подготовка на пълна документация за БАБХ съгласно Закона за храните и Регламент (ЕО) № 852/2004. Стандартен срок 5–10 работни дни.",
    scope: [
      "Анализ на опасностите и ККТ контрол",
      "Разработване на ДПХП процедури",
      "Мониторингови дневници и инструкции",
      "Индивидуален план за обекта",
    ],
    benefits: "100% законова защита от санкции и спиране на дейност.",
  },
  {
    id: "iso-ifs",
    title: "ISO 22000 и IFS Food",
    badge: "Международен стандарт",
    icon: Award,
    desc: "Внедряване на международни стандарти за безопасност на храните. Задължително за износ и работа с търговски вериги.",
    scope: [
      "Предварителен одит на готовността",
      "Документална система ISO/IFS",
      "Вътрешни одити и обучение",
      "Съдействие при сертификация",
    ],
    benefits: "Достъп до международни пазари и големи супермаркети.",
  },
  {
    id: "gmp-dphp",
    title: "GMP и ДПХП процедури",
    badge: "Производство и хигиена",
    icon: ClipboardList,
    desc: "Внедряване на изисквания за инфраструктура, контрол на вредителите, лична хигиена и дезинфекционни планове.",
    scope: [
      "Технологично разпределение на площите",
      "Програми за почистване и ДДД",
      "Входящ контрол и проследимост",
      "Изисквания за работно облекло",
    ],
    benefits: "Максимална хигиена и предотвратяване на замърсявания.",
  },
  {
    id: "tehnologichni-karti",
    title: "Технологични карти и рецептури",
    badge: "Регламент 1169/2011",
    icon: FileSpreadsheet,
    desc: "Изготвяне на задължителни технологични карти за ястия и продукти, съобразени с изискванията за етикетиране.",
    scope: [
      "Описание на производствения процес",
      "Физико-химични показатели",
      "Обозначаване на алергени и срокове",
      "Инструкции за съхранение",
    ],
    benefits: "Пълно съответствие при продажба и етикетиране.",
  },
  {
    id: "babh-nov-obekt",
    title: "Документация за БАБХ (нов обект)",
    badge: "Нови обекти",
    icon: FileText,
    desc: "Подготовка на целия пакет документи, необходим за регистрация и отваряне на нов хранителен обект в БАБХ.",
    scope: [
      "Уведомление по чл. 26 от Закона за храните",
      "Папки със системи за самоконтрол",
      "Дезинфекционни и хигиенни планове",
      "Съдействие при първоначален оглед",
    ],
    benefits: "Бързо отваряне без забавяне поради пропуски.",
  },
  {
    id: "odit-aktualizaciya",
    title: "Одити и актуализация на HACCP",
    badge: "Контрол и превенция",
    icon: ListTodo,
    desc: "Независим одит на съществуващи системи, отстраняване на предписания от БАБХ и актуализация при промяна в менюто.",
    scope: [
      "Преглед за откриване на пропуски",
      "Актуализация при нови технологии",
      "Коригиране след инспекции",
      "Абонаментна поддръжка",
    ],
    benefits: "Гаранция за пълна готовност при всяка проверка.",
  },
  {
    id: "alergeni",
    title: "Изготвяне на меню с алергени",
    badge: "Задължително по закон",
    icon: Tag,
    desc: "Анализ на рецептите и съставяне на легални обозначения, легенда и информационна папка за 14-те основни алергена.",
    scope: [
      "Анализ на съставките и алергените",
      "Писмена легенда за главното меню",
      "Информационна папка за клиентите",
      "Обучение за кръстосано замърсяване",
    ],
    benefits: "Пълно съответствие и защита на здравето на клиентите.",
  },
];

/** "Where do I start?" — each situation points at the services that answer it. */
const SITUATIONS = [
  {
    id: "new",
    label: "Отварям нов обект",
    icon: Store,
    lead: "За да отворите без забавяне, Ви трябват регистрация в БАБХ и работеща система за самоконтрол още от първия ден.",
    picks: [
      { title: "Документация за БАБХ (нов обект)", note: "Целият пакет документи за регистрация", href: "#babh-nov-obekt" },
      { title: "HACCP система", note: "Задължителна по закон, срок 5–10 работни дни", href: "#haccp" },
      { title: "Технологични карти", note: "За всяко ястие и продукт", href: "#tehnologichni-karti" },
      { title: "Меню с алергени", note: "Обозначения за 14-те основни алергена", href: "#alergeni" },
    ],
  },
  {
    id: "inspection",
    label: "Предстои проверка или имам предписание",
    icon: ShieldAlert,
    lead: "Първо откриваме пропуските, после ги отстраняваме — преди инспекторите да са ги видели.",
    picks: [
      { title: "Проверка преди проверката", note: "Одит на място с писмен доклад", href: "#proverka-predi-proverkata" },
      { title: "Одити и актуализация на HACCP", note: "Отстраняване на предписания от БАБХ", href: "#odit-aktualizaciya" },
    ],
  },
  {
    id: "export",
    label: "Работя с вериги или изнасям",
    icon: Globe,
    lead: "Търговските вериги и износът изискват международен стандарт над базовата HACCP система.",
    picks: [
      { title: "ISO 22000 и IFS Food", note: "От предварителен одит до сертификация", href: "#iso-ifs" },
      { title: "GMP и ДПХП процедури", note: "Хигиена, ДДД и проследимост", href: "#gmp-dphp" },
    ],
  },
  {
    id: "digital",
    label: "Искам ред в дневниците",
    icon: Smartphone,
    lead: "Дневниците се попълват с един клик, а системата напомня за сроковете вместо Вас.",
    picks: [
      { title: "Система „Дигитално Спокойствие“", note: "Месечен абонамент, 14 дни безплатен тест", href: "#vip-system" },
      { title: "Обучения за персонала", note: "С удостоверение, онлайн или присъствено", href: "#obucheniya" },
    ],
  },
];

const STEPS = [
  { num: "01", title: "Свързвате се с нас", desc: "Безплатен 10-минутен разговор, в който описвате обекта и казуса си." },
  { num: "02", title: "Получавате оферта", desc: "Индивидуална оферта до 24 часа, съобразена с Вашия обект." },
  { num: "03", title: "Разработваме и внедряваме", desc: "Подготвяме документацията и обучаваме екипа да работи с нея." },
];

const JUMP_LINKS = [
  { label: "Откъде да започна", href: "#nasoki" },
  { label: "Одит преди проверка", href: "#proverka-predi-proverkata" },
  { label: "Абонамент", href: "#vip-system" },
  { label: "Всички услуги", href: "#katalog" },
  { label: "Обучения", href: "#obucheniya" },
];

function SectionTitle({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <div className="max-w-3xl mb-8 sm:mb-10">
      <div className="flex items-center gap-3 mb-3">
        <span aria-hidden className="h-px w-8 bg-brand-gold-dark" />
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-gold-dark">{eyebrow}</span>
      </div>
      <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-green leading-tight">{title}</h2>
      {subtitle && <p className="mt-3 text-base text-brand-dark/70 leading-relaxed">{subtitle}</p>}
    </div>
  );
}

export default function ServicesClient() {
  const [situationId, setSituationId] = useState(SITUATIONS[0].id);
  const situation = SITUATIONS.find((s) => s.id === situationId) ?? SITUATIONS[0];

  return (
    <div className="min-h-screen bg-brand-light">
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative overflow-hidden bg-[#0A1F18] border-b border-brand-gold/20">
        <div aria-hidden className="absolute -right-64 -top-72 w-[52rem] h-[52rem] rounded-full border border-brand-gold/15 pointer-events-none" />
        <div aria-hidden className="absolute -right-40 -top-48 w-[38rem] h-[38rem] rounded-full border border-brand-gold/10 pointer-events-none" />
        <div aria-hidden className="absolute -right-10 -top-16 w-[22rem] h-[22rem] rounded-full bg-brand-gold/[0.06] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex items-center gap-3 mb-5">
            <span aria-hidden className="h-px w-8 bg-brand-gold" />
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-gold">Какво предлагаме</span>
          </div>
          <h1 className="font-logo text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.08] max-w-4xl">
            Професионални услуги по <span className="text-brand-gold italic font-medium">безопасност</span> на храните
          </h1>
          <p className="mt-5 text-lg text-white/75 leading-relaxed max-w-2xl">
            Индивидуални консултации, проектиране, одити и дигитална поддръжка на Вашите системи за самоконтрол. 27 години опит.
          </p>

          <nav aria-label="Раздели на страницата" className="mt-8 flex flex-wrap gap-2.5">
            {JUMP_LINKS.map((j) => (
              <a
                key={j.href}
                href={j.href}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/20 text-sm font-medium text-white/85 hover:border-brand-gold hover:text-brand-gold transition-colors"
              >
                {j.label} <ArrowDown className="h-3.5 w-3.5" />
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* ═══════════════ 1. WHERE DO I START — situation picker ═══════════════ */}
      <section id="nasoki" className="scroll-mt-24 py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            eyebrow="Откъде да започна"
            title="Изберете Вашата ситуация"
            subtitle="Не е нужно да познавате наредбите. Посочете какво Ви предстои и ще видите кои услуги Ви трябват."
          />

          <div className="reveal rounded-3xl bg-[#FFFDF9] border border-brand-green/10 shadow-[0_18px_50px_rgba(10,31,24,0.06)] overflow-hidden grid grid-cols-1 lg:grid-cols-12">
            {/* Situations */}
            <div role="tablist" aria-label="Ситуации" className="lg:col-span-5 p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 content-start bg-brand-green/[0.04] lg:border-r border-brand-green/10">
              {SITUATIONS.map((s) => {
                const Icon = s.icon;
                const active = s.id === situation.id;
                return (
                  <button
                    key={s.id}
                    role="tab"
                    aria-selected={active}
                    onClick={() => setSituationId(s.id)}
                    className={`flex items-center gap-3.5 text-left rounded-2xl px-4 py-4 transition-all duration-200 cursor-pointer ${
                      active
                        ? "bg-brand-green text-white shadow-lg"
                        : "text-brand-green hover:bg-brand-green/[0.07]"
                    }`}
                  >
                    <span className={`shrink-0 p-2.5 rounded-xl ${active ? "bg-brand-gold text-brand-dark" : "bg-[#FFFDF9] border border-brand-green/10"}`}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="font-semibold text-[15px] leading-snug flex-1">{s.label}</span>
                    <ArrowRight className={`h-4 w-4 shrink-0 hidden lg:block transition-opacity ${active ? "opacity-100 text-brand-gold" : "opacity-0"}`} />
                  </button>
                );
              })}
            </div>

            {/* Recommendation */}
            <div role="tabpanel" key={situation.id} className="animate-hero-card lg:col-span-7 p-6 sm:p-8 lg:p-10">
              <p className="font-serif text-xl sm:text-2xl text-brand-green leading-snug">{situation.lead}</p>
              <p className="mt-6 mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-brand-gold-dark">Препоръчваме Ви</p>
              <ol className="space-y-2.5">
                {situation.picks.map((p, i) => (
                  <li key={p.href}>
                    <a
                      href={p.href}
                      className="group flex items-center gap-4 rounded-2xl border border-brand-green/10 hover:border-brand-gold bg-white/60 hover:bg-brand-gold/10 px-4 py-3.5 transition-colors"
                    >
                      <span className="font-serif text-lg font-bold text-brand-gold-dark w-6 shrink-0">{i + 1}</span>
                      <span className="flex-1 min-w-0">
                        <span className="block font-semibold text-brand-green leading-snug">{p.title}</span>
                        <span className="block text-sm text-brand-dark/65 mt-0.5">{p.note}</span>
                      </span>
                      <ArrowRight className="h-4 w-4 text-brand-gold-dark shrink-0 transition-transform group-hover:translate-x-1" />
                    </a>
                  </li>
                ))}
              </ol>
              <p className="mt-6 text-sm text-brand-dark/65">
                Не откривате своя случай?{" "}
                <Link href="/consultations#booking" className="font-semibold text-brand-green underline decoration-brand-gold underline-offset-4 hover:text-brand-gold-dark">
                  Запазете безплатен 10-минутен разговор
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ 2. THE TWO KEY SERVICES ═══════════════ */}
      <section className="pb-14 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            eyebrow="Най-търсени"
            title="Двете услуги за пълна защита"
            subtitle="Еднократен одит, който открива пропуските, и абонамент, който поддържа документацията Ви изрядна всеки ден."
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* KEY SERVICE 1: Проверка преди проверката */}
            <article id="proverka-predi-proverkata" className="reveal scroll-mt-24 relative overflow-hidden rounded-3xl bg-[#0A1F18] text-white p-7 sm:p-9 flex flex-col border border-brand-gold/25">
              <div aria-hidden className="absolute -right-24 -top-24 w-72 h-72 rounded-full border border-brand-gold/15 pointer-events-none" />
              <div className="relative flex-1">
                <span className="inline-flex text-xs font-semibold uppercase tracking-[0.14em] text-brand-gold">Одит на място</span>
                <h3 className="mt-2 font-serif text-2xl sm:text-3xl font-bold leading-tight">Проверка преди проверката</h3>

                <div className="mt-5 flex items-baseline gap-2">
                  <span className="font-serif text-4xl sm:text-5xl font-bold text-brand-gold whitespace-nowrap">150–300 €</span>
                  <span className="text-sm text-white/60">според обекта</span>
                </div>

                <p className="mt-5 text-base text-white/80 leading-relaxed">
                  Независим професионален одит на Вашия обект <strong className="text-brand-gold font-semibold">преди инспекцията на БАБХ</strong> — открийте пропуските първи с гаранция за съответствие.
                </p>

                <p className="mt-6 mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-white/50">Какво включва одитът</p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2.5 text-[15px] text-white/90">
                  {[
                    "Внедрена HACCP и ДПХП система",
                    "Сграден фонд и потоци на работа",
                    "Задължителни дневници и записи",
                    "Етикетиране и проследимост",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 text-brand-gold shrink-0 mt-1" strokeWidth={2.5} /> {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-white/[0.06] border border-white/10 p-4">
                    <span className="font-semibold text-sm flex items-center gap-2"><FileCheck className="h-4 w-4 text-brand-gold" /> Получавате</span>
                    <p className="mt-1.5 text-sm text-white/70 leading-relaxed">Подробен писмен доклад с несъответствията и план с коригиращи действия.</p>
                  </div>
                  <div className="rounded-2xl bg-brand-gold/10 border border-brand-gold/30 p-4">
                    <span className="font-semibold text-sm text-brand-gold flex items-center gap-2"><Gift className="h-4 w-4" /> Бонус</span>
                    <p className="mt-1.5 text-sm text-white/80 leading-relaxed">30 дни безплатен консултационен телефон и имейл за въпроси.</p>
                  </div>
                </div>
              </div>

              <div className="relative mt-7 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <span className="text-sm text-white/60 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-brand-gold shrink-0" /> Извършва се лично от д-р Данка Николова
                </span>
                <Link
                  href={`/contact?service=${encodeURIComponent("Проверка преди проверката")}`}
                  className="shrink-0 px-7 py-3.5 text-sm font-bold rounded-full bg-brand-gold hover:bg-brand-gold-light text-brand-dark transition-colors text-center flex items-center justify-center gap-2 cursor-pointer"
                >
                  Заявете одит <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>

            {/* KEY SERVICE 2: Абонамент „Дигитално Спокойствие“ */}
            <article id="vip-system" className="reveal scroll-mt-24 relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FBF5E6] via-[#F4E6C2] to-[#E6CD95] text-brand-dark p-7 sm:p-9 flex flex-col border border-brand-gold">
              <div className="relative flex-1">
                <span className="inline-flex text-xs font-semibold uppercase tracking-[0.14em] text-brand-green">Месечен абонамент</span>
                <h3 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-brand-green leading-tight">Система „Дигитално Спокойствие“</h3>

                <div className="mt-5 flex items-baseline gap-2">
                  <span className="font-serif text-4xl sm:text-5xl font-bold text-brand-green whitespace-nowrap">14 дни</span>
                  <span className="text-sm text-brand-dark/70">безплатен тест</span>
                </div>

                <p className="mt-5 text-base text-brand-dark/85 leading-relaxed">
                  Пълна дигитализация на HACCP и ДПХП документацията — без разхвърляни папки, с автоматични дневници и напомняния за сроковете.
                </p>

                {/* Plans strip */}
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PLANS.map((p) => (
                    <div
                      key={p.id}
                      className={`rounded-2xl px-2 py-3 text-center border ${
                        p.featured ? "bg-brand-green text-white border-brand-green" : "bg-white/70 border-brand-green/15 text-brand-green"
                      }`}
                    >
                      <span className="block text-xs font-semibold leading-tight">{p.name}</span>
                      <span className="block font-serif text-lg font-bold leading-tight mt-1">
                        {p.priceEur} €<span className="text-xs font-sans font-medium opacity-70"> / мес.</span>
                      </span>
                    </div>
                  ))}
                </div>

                <p className="mt-6 mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-brand-green/70">Какво включва системата</p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2.5 text-[15px] text-brand-dark/90">
                  {[
                    "Автоматични БАБХ дневници (1 клик)",
                    "Генератор на етикети за проследимост",
                    "Напомняния за ЛЗК и договори (ДДД и др.)",
                    "Дигитални тестове и сертификати",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 text-brand-green shrink-0 mt-1" strokeWidth={2.5} /> {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 rounded-2xl bg-white/75 border border-brand-green/15 p-4 flex items-start gap-3.5">
                  <div className="p-2.5 bg-brand-green text-brand-gold rounded-xl shrink-0">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div className="text-sm leading-relaxed">
                    <strong className="text-brand-green block">Забравете за страха от актове и инспекции</strong>
                    <span className="text-brand-dark/75">При проверка отваряте профила си и БАБХ вижда перфектно попълнени записи.</span>
                  </div>
                </div>
              </div>

              <div className="relative mt-7 pt-6 border-t border-brand-green/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <Link
                  href="/babh-sistema#paketi"
                  className="px-6 py-3.5 text-sm font-bold rounded-full border border-brand-green/40 text-brand-green hover:bg-brand-green hover:text-white transition-colors text-center cursor-pointer"
                >
                  Пакети и цени
                </Link>
                <Link
                  href="/profile"
                  className="px-7 py-3.5 text-sm font-bold rounded-full bg-brand-green hover:bg-[#16402F] text-white transition-colors text-center flex items-center justify-center gap-2 cursor-pointer"
                >
                  Тествай безплатно <ArrowRight className="h-4 w-4 text-brand-gold" />
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ═══════════════ 3. FULL CATALOG ═══════════════ */}
      <section id="katalog" className="scroll-mt-24 py-14 sm:py-20 bg-[#EFE7D8] border-y border-brand-gold/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            eyebrow="Пълен каталог"
            title="Всички еднократни услуги"
            subtitle="За всяка услуга ще видите какво представлява, какво точно включва и каква е ползата за Вашия обект."
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {SERVICES.map((srv, index) => {
              const Icon = srv.icon;
              const wide = index === 0;
              return (
                <article
                  key={srv.id}
                  id={srv.id}
                  className={`reveal scroll-mt-24 rounded-3xl bg-[#FFFDF9] border border-brand-green/10 hover:border-brand-gold/60 hover:shadow-[0_18px_50px_rgba(10,31,24,0.08)] transition-all duration-300 p-6 sm:p-8 flex flex-col ${
                    wide ? "lg:col-span-2 lg:grid lg:grid-cols-2 lg:gap-12" : ""
                  }`}
                >
                  {/* What it is */}
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3.5">
                        <span className="p-3 rounded-2xl bg-brand-green text-brand-gold shrink-0">
                          <Icon className="h-6 w-6" />
                        </span>
                        <span className="font-serif text-3xl font-bold text-brand-gold/60">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <span className="text-xs font-semibold bg-brand-gold/15 text-brand-green px-3 py-1.5 rounded-full text-right">
                        {srv.badge}
                      </span>
                    </div>

                    <h3 className={`mt-5 font-serif font-bold text-brand-green leading-snug ${wide ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"}`}>
                      {srv.href ? (
                        <Link href={srv.href} className="hover:text-brand-gold-dark transition-colors">
                          {srv.title}
                        </Link>
                      ) : (
                        srv.title
                      )}
                    </h3>

                    <p className="mt-3 text-[15px] text-brand-dark/75 leading-relaxed">{srv.desc}</p>

                    {srv.href && (
                      <Link
                        href={srv.href}
                        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-green underline decoration-brand-gold underline-offset-4 hover:text-brand-gold-dark transition-colors"
                      >
                        Подробно за услугата <ArrowRight className="h-4 w-4" />
                      </Link>
                    )}
                  </div>

                  {/* What you get */}
                  <div className={`flex-1 flex flex-col ${wide ? "mt-6 lg:mt-0" : "mt-6"}`}>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-brand-gold-dark">Какво включва</p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2.5 text-[15px] text-brand-dark/85">
                      {srv.scope.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 leading-snug">
                          <Check className="h-4 w-4 text-brand-gold-dark shrink-0 mt-0.5" strokeWidth={2.5} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-5 rounded-2xl bg-brand-green/[0.05] border border-brand-green/10 px-4 py-3 flex items-start gap-3 text-[15px] text-brand-dark/85">
                      <TrendingUp className="h-5 w-5 text-brand-gold-dark shrink-0 mt-0.5" />
                      <span className="leading-snug"><strong className="text-brand-green">Полза:</strong> {srv.benefits}</span>
                    </div>

                    <div className="mt-auto pt-6 flex flex-col sm:flex-row gap-3">
                      <Link
                        href={`/contact?service=${encodeURIComponent(srv.title)}`}
                        className="flex-1 text-center px-6 py-3 text-sm font-bold rounded-full bg-brand-green hover:bg-[#16402F] text-white transition-colors flex items-center justify-center gap-2"
                      >
                        Поискайте оферта <ArrowRight className="h-4 w-4 text-brand-gold" />
                      </Link>
                      <Link
                        href="/consultations"
                        className="flex-1 text-center px-6 py-3 text-sm font-bold rounded-full border border-brand-green/30 text-brand-green hover:border-brand-green hover:bg-brand-green/[0.06] transition-colors"
                      >
                        Консултация
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ 4. HOW IT WORKS ═══════════════ */}
      <section className="py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle eyebrow="Как работим" title="От запитване до готова документация в три стъпки" />
          <ol className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((step) => (
              <li key={step.num} className="reveal relative rounded-3xl bg-[#FFFDF9] border border-brand-green/10 p-7">
                <span className="font-serif text-5xl font-bold text-brand-gold/60 block">{step.num}</span>
                <h3 className="mt-3 font-serif text-xl font-bold text-brand-green">{step.title}</h3>
                <p className="mt-2 text-[15px] text-brand-dark/75 leading-relaxed">{step.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ═══════════════ 5. TRAININGS & SPECIAL CASES ═══════════════ */}
      <section id="obucheniya" className="scroll-mt-24 pb-14 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="reveal relative overflow-hidden rounded-3xl bg-[#0A1F18] text-white p-7 sm:p-10 lg:p-12 border border-brand-gold/25">
            <div aria-hidden className="absolute -right-32 -bottom-40 w-[30rem] h-[30rem] rounded-full border border-brand-gold/15 pointer-events-none" />
            <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-7">
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-brand-gold">
                  <BookOpen className="h-4 w-4" /> Обучения и специални казуси
                </span>
                <h2 className="mt-3 font-serif text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
                  Подгответе екипа си за всяка проверка от БАБХ
                </h2>
                <p className="mt-4 text-base text-white/75 leading-relaxed max-w-2xl">
                  Освен системи за самоконтрол, предлагаме онлайн и присъствени обучения за персонала с получаване на легални удостоверения, както и съдействие при специфични казуси и жалби.
                </p>
                <ul className="mt-6 flex flex-wrap gap-x-7 gap-y-3 text-[15px] text-white/90">
                  {["Удостоверение за персонал", "Онлайн и присъствени формати", "Съдействие при жалби и актове"].map((item) => (
                    <li key={item} className="flex items-center gap-2.5">
                      <Check className="h-4 w-4 text-brand-gold shrink-0" strokeWidth={2.5} /> {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="lg:col-span-5 flex flex-col gap-3">
                <Link
                  href="/live"
                  className="w-full text-center px-6 py-4 text-sm font-bold rounded-full bg-brand-gold hover:bg-brand-gold-light text-brand-dark transition-colors flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <Video className="h-4 w-4" /> Разгледайте live обученията
                </Link>
                <Link
                  href={`/contact?service=${encodeURIComponent("Специфичен казус")}`}
                  className="w-full text-center px-6 py-4 text-sm font-bold rounded-full border border-white/25 hover:border-brand-gold hover:text-brand-gold text-white transition-colors cursor-pointer"
                >
                  Запитване за специфичен казус
                </Link>
                <a
                  href="tel:+359887902198"
                  className="mt-1 inline-flex items-center justify-center gap-2 text-[15px] text-white/75 hover:text-brand-gold transition-colors"
                >
                  <Phone className="h-4 w-4 text-brand-gold" /> Спешен въпрос? <span className="font-mono">0887 902 198</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
