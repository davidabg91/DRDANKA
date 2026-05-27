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
import RemotionVideoWidget from "@/remotion/RemotionVideoWidget";
import SectionHeading from "@/components/SectionHeading";
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
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0A1F18] via-[#0D2B1C] to-[#081410] pt-10 pb-20 sm:pt-12 sm:pb-20 md:pt-16 md:pb-28 border-b border-brand-gold/20 z-10">
        {/* Glow blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-gold/15 rounded-full blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-green/30 rounded-full blur-[120px] pointer-events-none -translate-x-1/3 translate-y-1/3" />
        
        {/* Subtle mesh pattern for texture */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: "repeating-linear-gradient(45deg, #ffffff 0, #ffffff 1px, transparent 1px, transparent 20px), repeating-linear-gradient(-45deg, #ffffff 0, #ffffff 1px, transparent 1px, transparent 20px)"
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:items-start items-center pt-4 lg:pt-8">
            {/* Hero Content */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
              <span className="inline-flex items-center px-3 py-1 rounded bg-brand-gold/10 border border-brand-gold/30 text-xs font-semibold text-brand-gold uppercase tracking-wider">
                <Award className="h-3.5 w-3.5 mr-1.5" /> 27 години практика в контрола и безопасността на храните
              </span>
              
              <h1 className="font-logo text-4xl sm:text-5xl lg:text-6xl xl:text-[4rem] font-bold text-white tracking-tight leading-[1.05] max-w-3xl mx-auto lg:mx-0">
                Системи за безопасност на храните, които{" "}
                <span className="text-brand-gold italic font-medium">работят</span> при реални проверки
              </h1>
              
              <div className="flex flex-wrap justify-center lg:justify-start gap-2 pt-2">
                {["GMP", "HACCP", "ISO 22000", "FSSC 22000", "IFS", "ISO 9001"].map((cert) => (
                  <span key={cert} className="px-3 sm:px-4 py-1.5 bg-white/[0.03] border border-white/10 rounded-full text-[9px] sm:text-[10px] font-bold text-white/90 uppercase tracking-widest backdrop-blur-sm shadow-inner transition-colors hover:bg-brand-gold/10 hover:border-brand-gold/30 cursor-default">
                    {cert}
                  </span>
                ))}
              </div>

              <div className="text-base sm:text-lg text-white/80 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
                Професионални консултации, проектиране и подготовка на пълна документация за БАБХ. Разработване и внедряване на системи за управление безопасността на храните за производители и търговци.
              </div>

              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 sm:p-6 backdrop-blur-sm max-w-2xl mx-auto lg:mx-0 text-left shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 rounded-full blur-[40px] pointer-events-none group-hover:bg-brand-gold/20 transition-all duration-700"></div>
                <div className="flex items-center gap-3 mb-5 relative z-10">
                  <div className="w-8 h-8 rounded-full bg-brand-gold/20 flex items-center justify-center border border-brand-gold/30 shadow-[0_0_10px_rgba(212,175,55,0.2)]">
                    <Award className="h-4 w-4 text-brand-gold" />
                  </div>
                  <h3 className="text-white font-bold text-xs uppercase tracking-widest">Професионални Обучения</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4 relative z-10">
                  {[
                    "HACCP / НАССР",
                    "ДПХП / ДХП",
                    "Етикетиране на храните",
                    "ISO 22000",
                    "Добри производствени практики",
                    "Подготовка за проверки",
                  ].map((item, idx) => (
                     <div key={idx} className="flex items-start gap-2.5 group/item">
                       <ShieldCheck className="h-4 w-4 text-brand-gold shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform" />
                       <span className="text-xs sm:text-sm text-white/80 font-medium group-hover/item:text-white transition-colors">{item}</span>
                     </div>
                  ))}
                </div>
              </div>

              <div className="inline-flex items-center gap-4 border-l-2 border-brand-gold/50 pl-5 text-left max-w-2xl mx-auto lg:mx-0">
                <p className="italic text-sm sm:text-base text-white/60 font-logo leading-relaxed">
                  "Практически решения, изградени върху 27-годишен реален опит в официалния контрол на храните."
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/consultations#booking"
                  className="relative overflow-hidden px-8 py-4 bg-brand-gold hover:bg-brand-gold-light text-brand-dark font-bold text-xs uppercase tracking-widest transition-all duration-300 rounded-full shadow-lg shadow-brand-gold/20 hover:shadow-xl hover:shadow-brand-gold/35 flex items-center justify-center cursor-pointer group"
                >
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 pointer-events-none" />
                  Безплатен 10-мин. разговор
                  <ArrowRight className="h-4 w-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/services"
                  className="px-8 py-4 rounded-full border border-white/20 hover:border-brand-gold/80 text-white/80 hover:text-brand-gold bg-white/5 hover:bg-brand-gold/10 backdrop-blur-sm font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center cursor-pointer"
                >
                  Разгледай услугите
                </Link>
              </div>

            </div>

            {/* Hero Highlight Card - Remotion Video */}
            <RemotionVideoWidget />
          </div>
        </div>
      </section>

      {/* 2. Stats Section — Medium Elegant Cards */}
      <section className="bg-gradient-to-r from-[#FAF6EE] via-[#F3EAD9] to-[#E9D9BF] py-10 border-y border-brand-gold/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">

            {/* Stat 1 */}
            <div className="bg-white/60 backdrop-blur-xl border border-brand-green/40 hover:border-brand-green rounded-2xl p-6 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(15,56,43,0.15)] transition-all duration-500 flex flex-col items-center justify-center group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-brand-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              <div className="w-10 h-10 rounded-xl bg-brand-green/10 group-hover:bg-brand-green/20 flex items-center justify-center mb-3 transition-colors duration-500 border border-brand-green/20">
                <Award className="h-5 w-5 text-brand-green" />
              </div>
              <span className="font-logo text-4xl sm:text-5xl font-extrabold text-brand-green leading-none block mb-2 relative z-10">
                27<span className="text-brand-gold text-2xl sm:text-3xl font-sans">+</span>
              </span>
              <p className="text-xs sm:text-sm text-brand-dark/80 font-bold leading-snug max-w-[180px] relative z-10">
                Години стаж в хранителния контрол
              </p>
            </div>

            {/* Stat 2 */}
            <div className="bg-white/60 backdrop-blur-xl border border-brand-green/40 hover:border-brand-green rounded-2xl p-6 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(15,56,43,0.15)] transition-all duration-500 flex flex-col items-center justify-center group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-brand-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              <div className="w-10 h-10 rounded-xl bg-brand-green/10 group-hover:bg-brand-green/20 flex items-center justify-center mb-3 transition-colors duration-500 border border-brand-green/20">
                <Users className="h-5 w-5 text-brand-green" />
              </div>
              <span className="font-logo text-4xl sm:text-5xl font-extrabold text-brand-green leading-none block mb-2 relative z-10">
                500<span className="text-brand-gold text-2xl sm:text-3xl font-sans">+</span>
              </span>
              <p className="text-xs sm:text-sm text-brand-dark/80 font-bold leading-snug max-w-[180px] relative z-10">
                Консултирани обекта в България
              </p>
            </div>

            {/* Stat 3 */}
            <div className="bg-white/60 backdrop-blur-xl border border-brand-green/40 hover:border-brand-green rounded-2xl p-6 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(15,56,43,0.15)] transition-all duration-500 flex flex-col items-center justify-center group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-brand-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              <div className="w-10 h-10 rounded-xl bg-brand-green/10 group-hover:bg-brand-green/20 flex items-center justify-center mb-3 transition-colors duration-500 border border-brand-green/20">
                <ShieldCheck className="h-5 w-5 text-brand-green" />
              </div>
              <span className="font-logo text-4xl sm:text-5xl font-extrabold text-brand-green leading-none block mb-2 relative z-10">
                100<span className="text-brand-gold text-2xl sm:text-3xl font-sans">%</span>
              </span>
              <p className="text-xs sm:text-sm text-brand-dark/80 font-bold leading-snug max-w-[180px] relative z-10">
                Одобрение от БАБХ при проверки
              </p>
            </div>

            {/* Stat 4 */}
            <div className="bg-white/60 backdrop-blur-xl border border-brand-green/40 hover:border-brand-green rounded-2xl p-6 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(15,56,43,0.15)] transition-all duration-500 flex flex-col items-center justify-center group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-brand-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              <div className="w-10 h-10 rounded-xl bg-brand-green/10 group-hover:bg-brand-green/20 flex items-center justify-center mb-3 transition-colors duration-500 border border-brand-green/20">
                <TrendingUp className="h-5 w-5 text-brand-green" />
              </div>
              <span className="font-logo text-4xl sm:text-5xl font-extrabold text-brand-green leading-none block mb-2 relative z-10">
                0<span className="text-brand-gold text-2xl sm:text-3xl font-sans">€</span>
              </span>
              <p className="text-xs sm:text-sm text-brand-dark/80 font-bold leading-snug max-w-[180px] relative z-10">
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
              <SectionHeading
                align="left"
                className="!mb-0"
                badgeText="СИГУРНОСТ & СЪОТВЕТСТВИЕ"
                title={<>Защо бизнесът избира <span className="text-brand-gold">д-р Данка Николова</span> за свой партньор?</>}
                subtitle="Безопасността на храните не е просто папка с документи, която стои на рафта. Тя е гаранция за здравето на Вашите клиенти и за сигурността на Вашата инвестиция. Ние не предлагаме генерични шаблони. Всяка система се разработва индивидуално спрямо архитектурата, потока на суровините и спецификата на Вашето меню."
              />
              
              {/* Trust point cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                {trustPoints.map((point, index) => {
                  const Icon = point.icon;
                  return (
                    <div
                      key={index}
                      className="bg-white/60 backdrop-blur-md border border-white/60 hover:bg-white hover:border-brand-gold/40 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(197,168,128,0.15)] transition-all duration-500 group flex flex-col justify-between"
                    >
                      <div>
                        <div className="bg-white group-hover:bg-brand-gold/15 p-2.5 rounded-xl border border-white group-hover:border-brand-gold/20 inline-block mb-4 shadow-sm transition-all duration-500">
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
            <div className="lg:col-span-5 relative">
              <div className="absolute -inset-4 bg-brand-gold/5 blur-2xl rounded-[3rem] -z-10"></div>
              <div className="relative bg-white/70 backdrop-blur-xl border border-white/80 rounded-3xl p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgba(197,168,128,0.1)] transition-all duration-500">
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
          <SectionHeading
            badgeText="КОМПЕТЕНТНОСТ"
            title={<>Сектори, в които предлагаме <span className="text-brand-gold">експертни решения</span></>}
            subtitle="Работим с широк спектър от обекти от хранително-вкусовата промишленост в цялата страна."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industries.map((ind, i) => {
              const Icon = ind.icon;
              return (
                <div
                  key={i}
                  className="group bg-white/50 backdrop-blur-md hover:bg-white border border-white/60 hover:border-brand-gold/40 rounded-2xl p-7 transition-all duration-500 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(197,168,128,0.15)]"
                >
                  <div className="bg-white group-hover:bg-brand-gold/10 p-3.5 rounded-xl border border-white/80 group-hover:border-brand-gold/20 inline-block mb-5 shadow-sm transition-all duration-500">
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
          <SectionHeading
            badgeText="ПРОЦЕС НА РАБОТА"
            title={<>Как постигаме <span className="text-brand-gold">пълна съвместимост</span>?</>}
            subtitle="Нашият четиристъпков подход гарантира, че нито един детайл по безопасността няма да бъде пропуснат."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {steps.map((step, i) => (
              <div key={i} className="bg-white/60 backdrop-blur-md border border-white/80 rounded-2xl p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group hover:border-brand-gold/40 hover:bg-white transition-all duration-500">
                {/* Accent line */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-green/10 to-brand-green/30 group-hover:from-brand-gold group-hover:to-yellow-300 transition-all duration-500"></div>
                
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
          <SectionHeading
            badgeText="ВЪПРОСИ & ОТГОВОРИ"
            title={<>Често задавани <span className="text-brand-gold">въпроси от бизнеса</span></>}
            subtitle="Научете бързи отговори за Вашите законови задължения и нормативни изисквания."
          />

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
              <SectionHeading
                align="left"
                className="!mb-0"
                lightText={true}
                badgeText="СВЪРЖЕТЕ СЕ С НАС"
                title={<>Готови ли сте за <span className="text-brand-gold">следващата инспекция</span>?</>}
                subtitle="Попълнете формата със своите данни и изисквания. Ще се свържем с Вас, за да обсъдим казуса Ви и да предложим оптимално и законно решение за Вашия хранителен обект."
              />
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
