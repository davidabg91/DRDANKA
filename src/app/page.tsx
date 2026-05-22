import Link from "next/link";
import {
  ShieldAlert,
  Award,
  Users,
  CheckCircle,
  TrendingUp,
  FileCheck,
  Coffee,
  ShoppingBag,
  ForkKnife,
  Truck,
  Warehouse,
  Flame,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Zap
} from "lucide-react";
import FAQAccordion from "@/components/FAQAccordion";
import ContactForm from "@/components/ContactForm";
import { Suspense } from "react";

export default function Home() {
  const stats = [
    { value: "27+", label: "Години трудов стаж в хранителния контрол" },
    { value: "500+", label: "Успешно консултирани обекта в България" },
    { value: "100%", label: "Одобрение от БАБХ при проверки" },
    { value: "0 €", label: "Наложени глоби след наш предварителен одит" },
  ];

  const industries = [
    {
      title: "Ресторанти и заведения",
      desc: "Ресторанти, кафе-сладкарници, пицарии, заведения за бързо хранене, кетъринг компании.",
      icon: ForkKnife,
    },
    {
      title: "Магазини за храни",
      desc: "Супермаркети, специализирани магазини (месарници, пекарни), павилиони.",
      icon: ShoppingBag,
    },
    {
      title: "Производство на храни",
      desc: "Хлебозаводи, цехове за сладкарски или месни изделия, пакетиращи предприятия.",
      icon: Coffee,
    },
    {
      title: "Логистика и транспорт",
      desc: "Специализиран транспорт на храни, хладилни камиони, дистрибуция.",
      icon: Truck,
    },
    {
      title: "Складове на едро",
      desc: "Складови бази за съхранение на храни и суровини, логистични центрове.",
      icon: Warehouse,
    },
    {
      title: "Хранителни добавки",
      desc: "Регистрация на обекти за търговия с хранителни добавки, фитнес храни.",
      icon: Flame,
    },
  ];

  const steps = [
    {
      num: "01",
      title: "Одит на място / Чертеж",
      desc: "Анализираме Вашето помещение, потоците на суровини и технологичното оборудване.",
    },
    {
      num: "02",
      title: "Разработка на системи",
      desc: "Съставяме Вашите НАССР планове, Системи за самоконтрол (СУБХ) и технологични карти.",
    },
    {
      num: "03",
      title: "Обучение на персонала",
      desc: "Провеждаме практическо обучение за правилно попълване на дневниците за самоконтрол.",
    },
    {
      num: "04",
      title: "Пълна готовност за проверка",
      desc: "Вашият обект работи законно, а Вие сте спокойни при всяко посещение от инспекторите на БАБХ.",
    },
  ];

  const trustPoints = [
    {
      title: "Качество без шаблони",
      desc: "Безкомпромисно качество на документацията – разработваме всяка система индивидуално спрямо обекта.",
      icon: FileCheck,
    },
    {
      title: "Светкавична реакция",
      desc: "Бърза реакция при спешни случаи, предписания или актове от контролните органи.",
      icon: Zap,
    },
    {
      title: "Експертно познаване",
      desc: "Дълбоко познаване на всички наредби на БАБХ, МЗ и европейското законодателство.",
      icon: Award,
    },
    {
      title: "Постоянна актуализация",
      desc: "Поддръжка, одити и навременна актуализация на системите спрямо промени в закона.",
      icon: ShieldCheck,
    },
  ];

  return (
    <div>
      {/* 1. Hero Section */}
      <section className="bg-brand-green relative overflow-hidden pt-10 pb-20 sm:pt-16 sm:pb-24 md:pt-28 md:pb-36 border-b border-brand-gold/15">
        {/* Decorative Grid Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-gold/10 via-transparent to-transparent opacity-70 pointer-events-none"></div>
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-brand-gold/5 blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Content */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
              <span className="inline-flex items-center px-3 py-1 rounded bg-brand-gold/10 border border-brand-gold/30 text-xs font-semibold text-brand-gold uppercase tracking-wider">
                <Award className="h-3.5 w-3.5 mr-1.5" /> 27 години практика в контрола и безопасността на храните
              </span>
              
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1] max-w-2xl mx-auto lg:mx-0">
                Системи за безопасност на храните, които{" "}
                <span className="text-brand-gold font-style-italic font-medium">работят</span> при проверка
              </h1>
              
              <p className="text-base sm:text-lg text-white/80 leading-relaxed max-w-xl mx-auto lg:mx-0">
                HACCP | ISO 22000 | IFS | ISO 9001 | GMP. Професионални консултации, проектиране и подготовка на пълна документация за БАБХ от д-р Данка Николова.
              </p>

              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/consultations#booking"
                  className="px-8 py-4 bg-brand-gold hover:bg-brand-gold-light text-brand-dark font-bold text-xs uppercase tracking-widest transition-all duration-300 rounded shadow-lg shadow-brand-gold/20 flex items-center justify-center cursor-pointer"
                >
                  Безплатен 10-мин. разговор
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
                <Link
                  href="/services"
                  className="px-8 py-4 border border-white/20 hover:border-brand-gold text-white hover:text-brand-gold font-bold text-xs uppercase tracking-widest transition-all duration-300 rounded flex items-center justify-center cursor-pointer"
                >
                  Разгледай услугите
                </Link>
              </div>

              {/* Quick Trust Pillars */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 max-w-md mx-auto lg:mx-0">
                <div className="text-center lg:text-left">
                  <span className="text-white font-bold block text-lg font-serif">100%</span>
                  <span className="text-[10px] uppercase text-white/50 tracking-wider font-semibold block mt-0.5">Одобрение</span>
                </div>
                <div className="text-center lg:text-left border-x border-white/10 px-4">
                  <span className="text-white font-bold block text-lg font-serif">Без глоби</span>
                  <span className="text-[10px] uppercase text-white/50 tracking-wider font-semibold block mt-0.5">Сигурност</span>
                </div>
                <div className="text-center lg:text-left">
                  <span className="text-white font-bold block text-lg font-serif">24h</span>
                  <span className="text-[10px] uppercase text-white/50 tracking-wider font-semibold block mt-0.5">Бърза реакция</span>
                </div>
              </div>
            </div>

            {/* Hero Highlight Card - АБОНАМЕНТ БАБХ СПОКОЙСТВИЕ */}
            <div className="lg:col-span-5 relative group">
              {/* Ambient glow */}
              <div className="absolute -inset-1 bg-gradient-to-br from-brand-gold/30 via-amber-400/10 to-emerald-500/20 rounded-3xl blur-2xl opacity-60 group-hover:opacity-90 transition-all duration-700"></div>

              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/8">

                {/* Top gradient header band */}
                <div className="bg-gradient-to-br from-[#0a1f17] via-[#0d2b1c] to-[#081410] px-5 sm:px-7 pt-6 sm:pt-7 pb-5 sm:pb-6 relative">
                  {/* Decorative glow orbs */}
                  <div className="absolute top-0 right-0 w-48 h-48 bg-brand-gold/8 rounded-full blur-3xl pointer-events-none"></div>
                  <div className="absolute -bottom-6 left-8 w-32 h-32 bg-emerald-500/8 rounded-full blur-2xl pointer-events-none"></div>

                  {/* Badge row */}
                  <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
                    <div className="flex items-center gap-1.5 bg-brand-gold/15 border border-brand-gold/30 rounded-full px-3 py-1.5">
                      <span className="relative flex h-1.5 w-1.5 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-gold opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-gold"></span>
                      </span>
                      <span className="text-[9px] font-black text-brand-gold tracking-[0.15em] uppercase whitespace-nowrap">Месечен Абонамент</span>
                    </div>
                    <div className="bg-emerald-500/15 border border-emerald-500/25 rounded-full px-3 py-1.5">
                      <span className="text-[9px] font-bold text-emerald-400 tracking-wider uppercase whitespace-nowrap">Ограничени места</span>
                    </div>
                  </div>

                  {/* Main title */}
                  <div className="text-center">
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-tight mb-1">
                      Абонамент
                    </h3>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-brand-gold leading-tight mb-4">
                      „БАБХ Спокойствие“
                    </h3>
                    <p className="text-sm text-white/65 leading-relaxed">
                      Забравете за страха от проверки. Ние управляваме цялата Ви БАБХ документация, дневници и юридическа защита — вие се фокусирате върху бизнеса.
                    </p>
                  </div>


                </div>

                {/* Features list */}
                <div className="bg-[#050f0a] px-5 sm:px-7 py-5 space-y-3.5">

                  {/* Feature 1 */}
                  <div className="flex items-start gap-3.5 group/item cursor-default">
                    <div className="w-8 h-8 rounded-xl bg-brand-gold/15 border border-brand-gold/20 flex items-center justify-center shrink-0 mt-0.5 group-hover/item:bg-brand-gold/25 transition-colors duration-200">
                      <CheckCircle className="h-4 w-4 text-brand-gold" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-white block leading-snug group-hover/item:text-brand-gold transition-colors duration-200">Дигитални дневници по самоконтрол</span>
                      <span className="text-[11px] text-white/50 leading-normal">Попълвайте онлайн и печатайте при проверка — без хаос с папки</span>
                    </div>
                  </div>

                  {/* Feature 2 */}
                  <div className="flex items-start gap-3.5 group/item cursor-default">
                    <div className="w-8 h-8 rounded-xl bg-brand-gold/15 border border-brand-gold/20 flex items-center justify-center shrink-0 mt-0.5 group-hover/item:bg-brand-gold/25 transition-colors duration-200">
                      <CheckCircle className="h-4 w-4 text-brand-gold" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-white block leading-snug group-hover/item:text-brand-gold transition-colors duration-200">Автоматична НАССР / ДХП система</span>
                      <span className="text-[11px] text-white/50 leading-normal">Персонализирана за Вашия обект — готова за инспекторите от БАБХ</span>
                    </div>
                  </div>

                  {/* Feature 3 */}
                  <div className="flex items-start gap-3.5 group/item cursor-default">
                    <div className="w-8 h-8 rounded-xl bg-brand-gold/15 border border-brand-gold/20 flex items-center justify-center shrink-0 mt-0.5 group-hover/item:bg-brand-gold/25 transition-colors duration-200">
                      <CheckCircle className="h-4 w-4 text-brand-gold" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-white block leading-snug group-hover/item:text-brand-gold transition-colors duration-200">Лично представителство пред БАБХ</span>
                      <span className="text-[11px] text-white/50 leading-normal">Д-р Николова защитава Вашия обект при проверки и предписания</span>
                    </div>
                  </div>

                  {/* Feature 4 */}
                  <div className="flex items-start gap-3.5 group/item cursor-default">
                    <div className="w-8 h-8 rounded-xl bg-brand-gold/15 border border-brand-gold/20 flex items-center justify-center shrink-0 mt-0.5 group-hover/item:bg-brand-gold/25 transition-colors duration-200">
                      <CheckCircle className="h-4 w-4 text-brand-gold" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-white block leading-snug group-hover/item:text-brand-gold transition-colors duration-200">Спешна консултация без доплащане</span>
                      <span className="text-[11px] text-white/50 leading-normal">Бърз отговор при акт, сигнал или извънредна проверка</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="pt-3">
                    <Link
                      href="/profile"
                      className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 bg-gradient-to-r from-brand-gold via-amber-400 to-brand-gold bg-[length:200%_auto] hover:bg-right-center text-brand-dark font-extrabold text-[11px] uppercase tracking-[0.12em] transition-all duration-500 rounded-xl shadow-lg shadow-brand-gold/25 hover:shadow-brand-gold/40 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    >
                      <span>РЕГИСТРАЦИЯ/ВХОД</span>
                      <span className="text-base leading-none">→</span>
                    </Link>
                    <p className="text-center text-[9px] text-white/30 mt-2.5 tracking-wide">Достъп до НАССР папки и дневници · Сигурна връзка</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Stats Section — Medium Elegant Cards */}
      <section className="bg-gradient-to-r from-[#FAF6EE] via-[#F3EAD9] to-[#E9D9BF] py-10 border-y border-brand-gold/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">

            {/* Stat 1 — Left accent */}
            <div className="bg-gradient-to-r from-white via-white to-[#FFFDF9] border-y border-r border-brand-green/5 border-l-4 border-brand-gold hover:border-brand-gold/60 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-xl bg-brand-green/5 flex items-center justify-center mb-3">
                <Award className="h-5 w-5 text-brand-green" />
              </div>
              <span className="font-serif text-3xl sm:text-4xl font-extrabold text-brand-green leading-none block mb-2">
                27<span className="text-brand-gold text-2xl">+</span>
              </span>
              <p className="text-xs sm:text-sm text-brand-dark/70 font-semibold leading-snug max-w-[180px]">
                Години стаж в хранителния контрол
              </p>
            </div>

            {/* Stat 2 — Top accent */}
            <div className="bg-gradient-to-b from-white via-white to-[#FFFDF9] border-x border-b border-brand-green/5 border-t-4 border-brand-gold hover:border-brand-gold/60 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-xl bg-amber-500/5 flex items-center justify-center mb-3">
                <Users className="h-5 w-5 text-brand-gold-dark" />
              </div>
              <span className="font-serif text-3xl sm:text-4xl font-extrabold text-brand-green leading-none block mb-2">
                500<span className="text-brand-gold text-2xl">+</span>
              </span>
              <p className="text-xs sm:text-sm text-brand-dark/70 font-semibold leading-snug max-w-[180px]">
                Консултирани обекта в България
              </p>
            </div>

            {/* Stat 3 — Right accent */}
            <div className="bg-gradient-to-l from-white via-white to-[#FFFDF9] border-y border-l border-brand-green/5 border-r-4 border-brand-gold hover:border-brand-gold/60 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/5 flex items-center justify-center mb-3">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
              </div>
              <span className="font-serif text-3xl sm:text-4xl font-extrabold text-emerald-600 leading-none block mb-2">
                100<span className="text-2xl">%</span>
              </span>
              <p className="text-xs sm:text-sm text-brand-dark/70 font-semibold leading-snug max-w-[180px]">
                Одобрение от БАБХ при проверки
              </p>
            </div>

            {/* Stat 4 — Bottom accent */}
            <div className="bg-gradient-to-t from-white via-white to-[#FFFDF9] border-x border-t border-brand-green/5 border-b-4 border-brand-gold hover:border-brand-gold/60 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-xl bg-brand-green/5 flex items-center justify-center mb-3">
                <TrendingUp className="h-5 w-5 text-brand-green" />
              </div>
              <span className="font-serif text-3xl sm:text-4xl font-extrabold text-brand-green leading-none block mb-2">
                0<span className="text-brand-gold text-2xl">€</span>
              </span>
              <p className="text-xs sm:text-sm text-brand-dark/70 font-semibold leading-snug max-w-[180px]">
                Глоби след предварителен одит
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* 3. Emotional Value Proposition (Authority) */}
      <section className="py-20 md:py-28 bg-gradient-to-r from-[#FAF6EE] via-[#F3EAD9] to-[#E9D9BF] border-b border-brand-gold/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left side: Message */}
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-green/5 border border-brand-green/20 rounded-full text-[10px] font-black uppercase text-brand-green tracking-[0.15em] mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse"></span>
                СИГУРНОСТ & СЪОТВЕТСТВИЕ
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-brand-green leading-tight">
                Защо бизнесът избира <span className="text-brand-gold">д-р Данка Николова</span> за свой партньор?
              </h2>
              <p className="text-sm sm:text-base text-brand-dark/80 leading-relaxed">
                Безопасността на храните не е просто папка с документи, която стои на рафта. Тя е гаранция за здравето на Вашите клиенти и за сигурността на Вашата инвестиция. Ние не предлагаме генерични шаблони. Всяка система се разработва индивидуално спрямо архитектурата, потока на суровините и спецификата на Вашето меню.
              </p>
              
              {/* Trust point cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                {trustPoints.map((point, index) => {
                  const Icon = point.icon;
                  return (
                    <div
                      key={index}
                      className="bg-white border border-brand-green/5 hover:border-brand-gold/30 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col justify-between"
                    >
                      <div>
                        <div className="bg-brand-green/5 group-hover:bg-brand-gold/15 p-2 rounded-lg border border-brand-green/5 group-hover:border-brand-gold/20 inline-block mb-3 transition-colors duration-300">
                          <Icon className="h-5 w-5 text-brand-green group-hover:text-brand-gold-dark transition-colors duration-300" />
                        </div>
                        <h3 className="font-serif text-sm sm:text-base font-bold text-brand-green mb-1.5">
                          {point.title}
                        </h3>
                        <p className="text-xs text-brand-dark/70 leading-relaxed">
                          {point.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-6">
                <Link
                  href="/about"
                  className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-brand-green hover:text-brand-gold transition-colors"
                >
                  Прочетете повече за опита на д-р Николова
                  <ChevronRight className="h-4 w-4 ml-1.5" />
                </Link>
              </div>
            </div>

            {/* Right side: Portrait & Quote */}
            <div className="lg:col-span-5">
              <div className="relative bg-white border border-brand-green/10 rounded-2xl p-8 shadow-xl">
                <div className="absolute -top-6 -left-6 bg-brand-gold p-4 rounded-xl border border-brand-gold-dark/20 text-brand-dark">
                  <ShieldAlert className="h-8 w-8" />
                </div>
                <blockquote className="font-serif text-brand-green text-lg italic leading-relaxed pt-4 mb-6">
                  "Моята мисия е да дам спокойствие и сигурност на българските ресторантьори и производители. Хранителният бизнес трябва да се концентрира върху качеството и клиентите си, а ние се грижим нормативните изисквания да бъдат спазени безпроблемно."
                </blockquote>
                <div className="border-t border-brand-green/5 pt-4">
                  <h4 className="font-serif text-base font-bold text-brand-green">Д-р Данка Николова</h4>
                  <p className="text-[10px] text-brand-gold uppercase tracking-wider font-semibold">
                    Основател & Главен консултант
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Industries We Serve */}
      <section className="py-20 md:py-28 bg-gradient-to-r from-[#FAF6EE] via-[#F3EAD9] to-[#E9D9BF] border-b border-brand-gold/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-green/5 border border-brand-green/20 rounded-full text-[10px] font-black uppercase text-brand-green tracking-[0.15em] mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse"></span>
              КОМПЕТЕНТНОСТ
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-brand-green">
              Сектори, в които предлагаме <span className="text-brand-gold">експертни решения</span>
            </h2>
            <p className="text-sm text-brand-dark/70">
              Работим с широк спектър от обекти от хранително-вкусовата промишленост в цялата страна.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industries.map((ind, i) => {
              const Icon = ind.icon;
              return (
                <div
                  key={i}
                  className="group bg-brand-light hover:bg-white border border-brand-green/5 hover:border-brand-gold/30 rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-brand-green/5"
                >
                  <div className="bg-brand-green/5 group-hover:bg-brand-gold/10 p-3 rounded-lg border border-brand-green/5 group-hover:border-brand-gold/20 inline-block mb-5 transition-colors duration-300">
                    <Icon className="h-6 w-6 text-brand-green group-hover:text-brand-gold-dark transition-colors duration-300" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-brand-green mb-2">
                    {ind.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-brand-dark/70 leading-relaxed">
                    {ind.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Professional Process Section */}
      <section className="py-20 md:py-28 bg-gradient-to-r from-[#FAF6EE] via-[#F3EAD9] to-[#E9D9BF] border-b border-brand-gold/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-green/5 border border-brand-green/20 rounded-full text-[10px] font-black uppercase text-brand-green tracking-[0.15em] mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse"></span>
              ПРОЦЕС НА РАБОТА
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-brand-green">
              Как постигаме <span className="text-brand-gold">пълна съвместимост</span>?
            </h2>
            <p className="text-sm text-brand-dark/70">
              Нашият четиристъпков подход гарантира, че нито един детайл по безопасността няма да бъде пропуснат.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {steps.map((step, i) => (
              <div key={i} className="bg-white border border-brand-green/5 rounded-xl p-6 shadow-sm relative overflow-hidden group hover:border-brand-gold/30 transition-all duration-300">
                {/* Accent line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-brand-green group-hover:bg-brand-gold transition-colors"></div>
                
                <span className="font-serif text-5xl font-black text-brand-gold/40 group-hover:text-brand-gold block mb-4 transition-colors duration-300">
                  {step.num}
                </span>
                <h3 className="font-serif text-base sm:text-lg font-bold text-brand-green mb-3">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-brand-dark/70 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FAQ Section */}
      <section className="py-20 md:py-28 bg-gradient-to-r from-[#FAF6EE] via-[#F3EAD9] to-[#E9D9BF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-green/5 border border-brand-green/20 rounded-full text-[10px] font-black uppercase text-brand-green tracking-[0.15em] mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse"></span>
              ВЪПРОСИ & ОТГОВОРИ
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-brand-green">
              Често задавани <span className="text-brand-gold">въпроси от бизнеса</span>
            </h2>
            <p className="text-sm text-brand-dark/70">
              Научете бързи отговори за Вашите законови задължения и нормативни изисквания.
            </p>
          </div>

          <FAQAccordion />
        </div>
      </section>

      {/* 7. Contact / Lead Form Section */}
      <section className="py-20 md:py-28 bg-brand-green relative overflow-hidden">
        {/* Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-brand-gold/10 via-transparent to-transparent opacity-60 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* CTA copy */}
            <div className="lg:col-span-5 text-center lg:text-left space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-gold/10 border border-brand-gold/30 rounded-full text-[10px] font-black uppercase text-brand-gold tracking-[0.15em] mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse"></span>
                СВЪРЖЕТЕ СЕ С НАС
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white leading-tight">
                Готови ли сте за <span className="text-brand-gold">следващата инспекция</span>?
              </h2>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed">
                Попълнете формата със своите данни и изисквания. Ще се свържем с Вас, за да обсъдим казуса Ви и да предложим оптимално и законно решение за Вашия хранителен обект.
              </p>
              <div className="space-y-4 pt-4 hidden lg:block text-sm text-white/70">
                <div className="flex items-center">
                  <CheckCircle className="h-4.5 w-4.5 text-brand-gold mr-3 shrink-0" />
                  <span>Индивидуален анализ на нуждите на обекта</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4.5 w-4.5 text-brand-gold mr-3 shrink-0" />
                  <span>Индивидуална оферта до 24 часа</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4.5 w-4.5 text-brand-gold mr-3 shrink-0" />
                  <span>Пълно съдействие при изготвяне и подаване</span>
                </div>
              </div>
            </div>

            {/* Contact Form Wrapper */}
            <div className="lg:col-span-7">
              <Suspense fallback={<div className="text-center py-12 text-white/50">Зареждане на формата...</div>}>
                <ContactForm />
              </Suspense>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
