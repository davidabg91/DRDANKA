import type { Metadata } from "next";
import Link from "next/link";
import {
  FileText,
  ShieldCheck,
  BookOpen,
  ClipboardList,
  Award,
  ListTodo,
  FileSpreadsheet,
  Check,
  CheckCircle,
  ChevronRight,
  Star,
  TrendingUp,
  Users,
  Video,
  AlertTriangle,
  XCircle,
  FileCheck,
  Gift,
  Phone,
  MapPin,
  Clock,
  Search,
  Zap,
  Sparkles,
  Tag
} from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Услуги по безопасност на храните — HACCP, ISO, ДПХП",
  description:
    "Индивидуални консултации, проектиране и актуализация на системи за самоконтрол: HACCP, ISO 22000, IFS Food, GMP, ДПХП и подготовка на документация за БАБХ. 27 години опит.",
  alternates: { canonical: "/services" },
};

interface ServiceItem {
  title: string;
  badge: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>> | any;
  desc: string;
  scope: string[];
  benefits: string;
}

const SERVICES: ServiceItem[] = [
  {
    title: "НАССР Системи (ХАСЕП)",
    badge: "Задължително по Закон",
    icon: ShieldCheck,
    desc: "Анализ на опасностите и критични контролни точки. Разработване, внедряване и подготовка на пълна документация за БАБХ съгласно Закона за храните.",
    scope: [
      "Анализ на опасностите и ККТ контрол",
      "Разработване на ДПХП процедури",
      "Мониторингови дневници и инструкции",
      "Индивидуален план за обекта",
    ],
    benefits: "100% законова защита от санкции и спиране на дейност.",
  },
  {
    title: "ISO 22000 & IFS Food",
    badge: "Международен Стандарт",
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
    title: "GMP & ДПХП Процедури",
    badge: "Производство & Хигиена",
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
    title: "Технологични Карти & Рецептури",
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
    title: "Документация за БАБХ (Нов Обект)",
    badge: "Нови Обекти",
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
    title: "Одити & Актуализация на HACCP",
    badge: "Контрол & Превенция",
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
    title: "Изготвяне на Меню с Алергени",
    badge: "Задължително по Закон",
    icon: Tag,
    desc: "Анализ на рецептите и съставяне на легални обозначения, легенда и информационна папка за 14-те основни алергена.",
    scope: [
      "Анализ на съставките и алергените",
      "Писмена Легенда за главното меню",
      "Информационна папка за клиентите",
      "Обучение за кръстосано замърсяване",
    ],
    benefits: "Пълно съответствие и защита на здравето на клиентите.",
  },
];

export default function Services() {
  return (
    <div className="min-h-screen pb-16">
      {/* Page Header */}
      <PageHero
        badgeText="КАКВО ПРЕДЛАГАМЕ"
        title="Професионални Услуги по Безопасност на Храните"
        subtitle="Индивидуални консултации, проектиране, одити и дигитална поддръжка на Вашите системи за самоконтрол. 27 години опит."
      />

      {/* Main Container - Aligned from left boundary to match navbar */}
      <div className="w-full max-w-[1536px] px-4 sm:px-6 lg:px-8 space-y-10 mt-6">

        {/* ═══════════════ TOP SECTION: THE 2 KEY FEATURED SERVICES (DESKTOP 2-COLUMN GRID) ═══════════════ */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-brand-green/10 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-brand-gold" />
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-brand-green">Основни Премиум Услуги</h2>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-dark/50 hidden sm:inline-block">
              2-та най-важни пакета за пълна защита
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            
            {/* KEY SERVICE 1: Проверка преди проверката */}
            <div id="proverka-predi-proverkata" className="relative overflow-hidden rounded-2xl border border-brand-gold/30 bg-gradient-to-br from-[#0A1F18] via-[#0D2B1C] to-[#081410] text-white p-6 sm:p-7 shadow-xl flex flex-col justify-between scroll-mt-24 group hover:border-brand-gold/60 transition-all duration-300">
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/15 rounded-full blur-[70px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
              <div className="relative z-10 space-y-4">
                
                {/* Header Badge & Title */}
                <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-4">
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-brand-gold text-brand-dark px-2.5 py-1 rounded-md shadow">
                      <Star className="h-3 w-3" fill="currentColor" /> Одит на място
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-white leading-tight">
                      Проверка преди проверката
                    </h3>
                  </div>
                  <div className="text-right shrink-0 bg-white/10 border border-brand-gold/40 rounded-xl px-3.5 py-2 backdrop-blur-sm">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-brand-gold block">Еднократно</span>
                    <span className="font-serif text-2xl font-black text-white">600 <span className="text-sm font-sans text-brand-gold">€</span></span>
                  </div>
                </div>

                <p className="text-xs text-white/80 leading-relaxed">
                  Независим професионален одит на Вашия обект <strong className="text-brand-gold font-bold">преди инспекцията на БАБХ</strong> — открийте пропуските първи с гаранция за съответствие.
                </p>

                {/* Scope Grid - Compact 2 columns */}
                <div className="space-y-2 pt-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-brand-gold block">Какво включва одитът:</span>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-white/85">
                    <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-brand-gold shrink-0" /> Внедрена HACCP и ДПХП система</li>
                    <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-brand-gold shrink-0" /> Сграден фонд & Потоци на работа</li>
                    <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-brand-gold shrink-0" /> Задължителни дневници и записи</li>
                    <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-brand-gold shrink-0" /> Етикетиране & Проследимост</li>
                  </ul>
                </div>

                {/* Deliverables & Bonus */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-[11px] space-y-1">
                    <span className="font-bold text-white flex items-center gap-1"><FileCheck className="h-3.5 w-3.5 text-brand-gold" /> Получавате:</span>
                    <p className="text-white/70 leading-snug">Подробен писмен доклад с несъответствията и план с коригиращи действия.</p>
                  </div>
                  <div className="bg-brand-gold/10 border border-brand-gold/30 rounded-xl p-3 text-[11px] space-y-1">
                    <span className="font-bold text-brand-gold flex items-center gap-1"><Gift className="h-3.5 w-3.5" /> БОНУС:</span>
                    <p className="text-white/80 leading-snug">30 дни безплатен консултационен телефон & имейл за въпроси.</p>
                  </div>
                </div>

              </div>

              {/* Bottom CTA */}
              <div className="relative z-10 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
                <span className="text-[10px] text-white/50 flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-brand-gold" /> Извършва се лично от д-р Данка Николова
                </span>
                <Link
                  href={`/contact?service=${encodeURIComponent("Проверка преди проверката")}`}
                  className="w-full sm:w-auto px-6 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl bg-brand-gold hover:bg-brand-gold-light text-brand-dark shadow-md hover:-translate-y-0.5 transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Заявете одит <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* KEY SERVICE 2: ВИП Абонамент „Дигитално Спокойствие“ */}
            <div id="vip-system" className="relative overflow-hidden rounded-2xl border-2 border-brand-gold bg-gradient-to-br from-[#FBF5E6] via-[#F2DFAC] to-[#DCBF7A] text-brand-dark p-6 sm:p-7 shadow-xl flex flex-col justify-between scroll-mt-24 group hover:shadow-2xl transition-all duration-300">
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/40 rounded-full blur-[60px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
              
              <div className="relative z-10 space-y-4">
                
                {/* Header Badge & Title */}
                <div className="flex items-start justify-between gap-3 border-b border-brand-green/15 pb-4">
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-brand-green text-brand-gold px-2.5 py-1 rounded-md shadow">
                      <Zap className="h-3 w-3" fill="currentColor" /> ВИП Абонамент
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-brand-green leading-tight">
                      Система „Дигитално Спокойствие“
                    </h3>
                  </div>
                  <div className="text-right shrink-0 bg-white/70 border border-brand-gold/50 rounded-xl px-3.5 py-2">
                    <span className="text-[9px] font-black uppercase tracking-wider text-brand-green block">Безплатен тест</span>
                    <span className="font-serif text-lg font-black text-brand-green">14 Дни <span className="text-xs font-sans text-brand-dark/70">проба</span></span>
                  </div>
                </div>

                <p className="text-xs text-brand-dark/90 leading-relaxed font-medium">
                  Пълна дигитализация на HACCP & ДПХП документацията — без разхвърляни папки, с автоматични дневници и 24/7 поддръжка.
                </p>

                {/* Core Advantages List */}
                <div className="space-y-2 pt-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-brand-green block">Какво включва системата:</span>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-brand-dark/90 font-medium">
                    <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-brand-green shrink-0" /> Автоматични БАБХ дневници (1 клик)</li>
                    <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-brand-green shrink-0" /> Генератор на етикети за проследимост</li>
                    <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-brand-green shrink-0" /> 24/7 Чат с д-р Николова при проверки</li>
                    <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-brand-green shrink-0" /> Дигитални тестове и сертификати</li>
                  </ul>
                </div>

                {/* Highlight banner */}
                <div className="bg-white/80 border border-brand-green/20 rounded-xl p-3 text-[11px] flex items-center gap-3">
                  <div className="p-2 bg-brand-green text-brand-gold rounded-lg shrink-0">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <strong className="text-brand-green block">Забравете за страха от актове и инспекции!</strong>
                    <span className="text-brand-dark/70">При проверка отваряте профила си и БАБХ вижда перфектно попълнени записи.</span>
                  </div>
                </div>

              </div>

              {/* Bottom CTA */}
              <div className="relative z-10 pt-5 border-t border-brand-green/15 flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Link
                    href="/vip-system"
                    className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl bg-white/80 border border-brand-green/30 text-brand-green hover:bg-brand-green hover:text-white transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Search className="h-3.5 w-3.5" /> Виж повече
                  </Link>
                </div>
                <Link
                  href="/profile"
                  className="w-full sm:w-auto px-6 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl bg-brand-green hover:bg-brand-green/90 text-white shadow-md hover:-translate-y-0.5 transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Тествай безплатно <ChevronRight className="h-4 w-4 text-brand-gold" />
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* ═══════════════ SECTION 2: ALL STANDARD CONSULTING SERVICES (COMPACT 3-COLUMN DESKTOP GRID) ═══════════════ */}
        <section className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-brand-green/10 pb-3">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-brand-gold block">Пълен каталог</span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-brand-green">Еднократни & Стандартни Услуги</h2>
            </div>
            <p className="text-xs text-brand-dark/50">
              Компактен преглед на всички налични решения по безопасност на храните
            </p>
          </div>

          {/* Compact 3-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((srv, index) => {
              const Icon = srv.icon;
              return (
                <div
                  key={index}
                  className="bg-white border border-brand-green/10 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-brand-gold/40 transition-all duration-200 flex flex-col justify-between text-brand-dark space-y-4"
                >
                  <div className="space-y-3">
                    {/* Top Row: Icon + Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="p-2 bg-brand-green/5 border border-brand-green/10 text-brand-green rounded-lg shrink-0">
                        <Icon className="h-5 w-5 text-brand-green" />
                      </div>
                      <span className="text-[9px] font-bold uppercase tracking-wider bg-brand-gold/10 text-brand-dark border border-brand-gold/30 px-2.5 py-0.5 rounded-full truncate">
                        {srv.badge}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-serif text-base font-bold text-brand-green leading-snug">
                      {srv.title}
                    </h3>

                    {/* Desc */}
                    <p className="text-[11px] text-brand-dark/70 leading-relaxed line-clamp-3">
                      {srv.desc}
                    </p>

                    {/* Scope list */}
                    <div className="space-y-1.5 pt-1 border-t border-brand-green/5">
                      <span className="text-[9px] font-black uppercase tracking-wider text-brand-dark/50 block">Обхват:</span>
                      <ul className="space-y-1 text-[11px] text-brand-dark/80">
                        {srv.scope.slice(0, 3).map((item, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 leading-tight">
                            <Check className="h-3 w-3 text-brand-gold shrink-0 mt-0.5" strokeWidth={2.5} />
                            <span className="truncate">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Bottom Benefit + Actions */}
                  <div className="space-y-3 pt-3 border-t border-brand-green/5">
                    <div className="bg-brand-light p-2.5 rounded-lg text-[10px] text-brand-dark/80 flex items-start gap-1.5 border border-brand-green/5">
                      <TrendingUp className="h-3.5 w-3.5 text-brand-gold shrink-0 mt-0.5" />
                      <span className="leading-tight"><strong className="text-brand-green">Полза:</strong> {srv.benefits}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href="/consultations"
                        className="text-center py-2 text-[10px] font-bold uppercase tracking-wider rounded bg-brand-green/5 text-brand-green border border-brand-green/15 hover:bg-brand-green hover:text-white transition-colors"
                      >
                        Консултация
                      </Link>
                      <Link
                        href={`/contact?service=${encodeURIComponent(srv.title)}`}
                        className="text-center py-2 text-[10px] font-black uppercase tracking-wider rounded bg-brand-gold hover:bg-brand-gold-light text-brand-dark transition-colors shadow-sm"
                      >
                        Оферта
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ═══════════════ SECTION 3: TRAININGS & SPECIALIZED CONSULTATIONS ═══════════════ */}
        <section className="bg-gradient-to-br from-[#0A1F18] via-[#0D2B1C] to-[#081410] text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-brand-gold/20 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-4">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-brand-gold/20 text-brand-gold px-3 py-1 rounded-full border border-brand-gold/30">
                <BookOpen className="h-3.5 w-3.5" /> Обучения & Специални Казуси
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-tight">
                Подгответе екипа си за всяка проверка от БАБХ
              </h2>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed max-w-2xl">
                Освен системи за самоконтрол, предлагаме онлайн и присъствени обучения за персонала с получаване на легални удостоверeния, както и съдействие при специфични казуси и жалби.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-2 text-xs font-medium text-white/90">
                  <CheckCircle className="h-4 w-4 text-brand-gold" /> Удостоверение за персонал
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-white/90">
                  <CheckCircle className="h-4 w-4 text-brand-gold" /> Онлайн & Присъствени формати
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-white/90">
                  <CheckCircle className="h-4 w-4 text-brand-gold" /> Съдействие при жалби и актове
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
              <Link
                href="/live"
                className="w-full text-center px-6 py-3.5 text-xs font-black uppercase tracking-widest rounded-xl bg-brand-gold hover:bg-brand-gold-light text-brand-dark shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Video className="h-4 w-4" /> Разгледай Live Обученията <ChevronRight className="h-4 w-4" />
              </Link>
              <Link
                href={`/contact?service=${encodeURIComponent("Специфичен казус")}`}
                className="w-full text-center px-6 py-3.5 text-xs font-bold uppercase tracking-widest rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Phone className="h-4 w-4 text-brand-gold" /> Запитване за Специфичен Казус
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
