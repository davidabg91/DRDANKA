import Link from "next/link";
import Image from "next/image";
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
  Zap,
  Phone
} from "lucide-react";
import FAQAccordion from "@/components/FAQAccordion";
import ContactForm from "@/components/ContactForm";
import { Suspense } from "react";
import RemotionVideoWidget from "@/remotion/RemotionVideoWidget";
import HeroTrainingCarousel from "@/components/HeroTrainingCarousel";
import SectionHeading from "@/components/SectionHeading";
export default function Home() {
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
              
              <p className="text-lg sm:text-xl lg:text-2xl text-white/90 font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Имате предписание, проблем с етикет, предстои Ви регистрация на хранителен обект или проверка от ОДБХ?
              </p>

              {/* Direct Quick Contact Options: Phone & Viber */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-1">
                <a
                  href="tel:+359887902198"
                  className="inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-brand-gold/30 hover:border-brand-gold text-white font-medium text-sm sm:text-base transition-all duration-200 shadow-sm group backdrop-blur-sm"
                >
                  <span className="text-lg">📞</span>
                  <span>Обадете се: <strong className="text-brand-gold group-hover:underline font-mono ml-1">0887 902 198</strong></span>
                </a>

                <a
                  href="viber://chat?number=%2B359887902198"
                  className="inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-[#7360F2]/15 hover:bg-[#7360F2]/25 border border-[#7360F2]/40 hover:border-[#7360F2]/80 text-white font-medium text-sm sm:text-base transition-all duration-200 shadow-sm group backdrop-blur-sm"
                >
                  <span className="text-lg">💬</span>
                  <span>Пишете ми във <strong className="text-[#A294FF] group-hover:underline">Viber</strong></span>
                </a>
              </div>

              <div className="inline-flex items-center gap-4 border-l-2 border-brand-gold/50 pl-5 text-left max-w-2xl mx-auto lg:mx-0">
                <p className="italic text-sm sm:text-base text-white/65 font-logo leading-relaxed">
                  &ldquo;Практически решения, изградени върху 27-годишен реален опит в официалния контрол на храните.&rdquo;
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/consultations#booking"
                  className="relative overflow-hidden px-8 py-4 bg-brand-gold hover:bg-brand-gold-light text-brand-dark font-bold text-xs uppercase tracking-widest transition-all duration-300 rounded-full shadow-lg shadow-brand-gold/20 hover:shadow-xl hover:shadow-brand-gold/35 flex items-center justify-center cursor-pointer group"
                >
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 pointer-events-none" />
                  Безплатен 10-минутен разговор
                  <ArrowRight className="h-4 w-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/services"
                  className="px-8 py-4 rounded-full border border-white/20 hover:border-brand-gold/80 text-white/80 hover:text-brand-gold bg-white/5 hover:bg-brand-gold/10 backdrop-blur-sm font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center cursor-pointer"
                >
                  Разгледайте услугите
                </Link>
              </div>

            </div>

            {/* Hero right column: compact subscription card + rotating training deck */}
            <div className="lg:col-span-5 lg:mt-12 xl:mt-14 z-20 space-y-5">
              <RemotionVideoWidget />
              <HeroTrainingCarousel />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Headline Ribbon under the hero — static full width */}
      <section className="bg-gradient-to-r from-[#A4855C] via-[#C5A880] to-[#A4855C] border-y border-[#A4855C]/50 relative overflow-hidden shadow-inner z-10 py-4 sm:py-5">
        {/* Subtle mesh pattern for texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.08]"
          style={{
            backgroundImage: "repeating-linear-gradient(45deg, #ffffff 0, #ffffff 1px, transparent 1px, transparent 20px), repeating-linear-gradient(-45deg, #ffffff 0, #ffffff 1px, transparent 1px, transparent 20px)"
          }}
        />

        <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <p className="font-serif text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-brand-green tracking-wide leading-tight drop-shadow-sm">
            Откриваме пропуските и ви подготвяме професионално за проверка
          </p>
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

            {/* Right side: Dr. Danka leaning on the mission panel */}
            <div className="lg:col-span-5 relative">
              {/* Ambient gold glow behind the whole composition */}
              <div
                className="absolute -inset-6 bg-brand-gold/10 blur-3xl rounded-[3rem] -z-10"
                aria-hidden
              />

              {/* Portrait — her hands rest exactly on the panel's top rim, as if
                  she is leaning on it and reading the words below. */}
              <div className="relative flex justify-center">
                <Image
                  src="/danka-hero.png"
                  alt="Д-р Данка Николова — консултант по безопасност на храните"
                  width={794}
                  height={1043}
                  loading="lazy"
                  sizes="(max-width: 1024px) 320px, 380px"
                  className="pointer-events-none select-none w-[82%] max-w-[380px] h-auto object-contain relative z-20 -mb-6 drop-shadow-[0_28px_40px_rgba(10,31,24,0.35)]"
                />
              </div>

              {/* Mission panel */}
              <div className="relative z-10 bg-white/70 backdrop-blur-xl border border-white/80 rounded-3xl px-8 pt-11 pb-8 sm:px-10 shadow-[0_20px_50px_rgba(10,31,24,0.10)] transition-all duration-500 hover:shadow-[0_24px_55px_rgba(197,168,128,0.18)]">
                <blockquote className="font-serif text-brand-green text-lg italic leading-relaxed mb-6">
                  "Моята мисия е да дам спокойствие и сигурност на българските ресторантьори и производители. Хранителният бизнес трябва да се концентрира върху качеството и клиентите си, а ние се грижим нормативните изисквания да бъдат спазени безпроблемно."
                </blockquote>
                <div className="flex items-center justify-between gap-4 border-t border-brand-green/10 pt-4">
                  <div>
                    <h4 className="font-serif text-base font-bold text-brand-green">Д-р Данка Николова</h4>
                    <p className="text-[10px] text-brand-gold uppercase tracking-wider font-semibold">
                      Основател & Главен консултант
                    </p>
                  </div>
                  <div className="shrink-0 bg-brand-gold/15 p-2.5 rounded-xl border border-brand-gold/25 text-brand-gold-dark">
                    <ShieldAlert className="h-6 w-6" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Industries We Serve — dark green (alternating) */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-[#0A1F18] via-[#0D2B1C] to-[#081410] border-b border-brand-gold/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-brand-gold/10 rounded-full blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionHeading
            lightText
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
                  className="group bg-white/[0.06] backdrop-blur-md hover:bg-white/[0.1] border border-white/10 hover:border-brand-gold/40 rounded-2xl p-7 transition-all duration-500"
                >
                  <div className="bg-brand-gold/15 group-hover:bg-brand-gold/25 p-3.5 rounded-xl border border-brand-gold/20 inline-block mb-5 transition-all duration-500">
                    <Icon className="h-6 w-6 text-brand-gold transition-colors duration-300" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-white mb-2">
                    {ind.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/65 leading-relaxed">
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

      {/* 6. FAQ Section — dark green (alternating) */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-[#0A1F18] via-[#0D2B1C] to-[#081410] border-b border-brand-gold/20 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-brand-green/25 rounded-full blur-[120px] pointer-events-none -translate-x-1/3 translate-y-1/3" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionHeading
            lightText
            badgeText="ВЪПРОСИ & ОТГОВОРИ"
            title={<>Често задавани <span className="text-brand-gold">въпроси от бизнеса</span></>}
            subtitle="Научете бързи отговори за Вашите законови задължения и нормативни изисквания."
          />

          <FAQAccordion />
        </div>
      </section>

      {/* 7. Contact / Lead Form Section — cream (alternating) */}
      <section className="py-20 md:py-28 bg-gradient-to-r from-[#FAF6EE] via-[#F3EAD9] to-[#E9D9BF] relative overflow-hidden">
        {/* Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-brand-gold/10 via-transparent to-transparent opacity-60 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* CTA copy */}
            <div className="lg:col-span-5 text-center lg:text-left space-y-6">
              <SectionHeading
                align="left"
                className="!mb-0"
                badgeText="СВЪРЖЕТЕ СЕ С НАС"
                title={<>Готови ли сте за <span className="text-brand-gold">следващата инспекция</span>?</>}
                subtitle="Попълнете формата със своите данни и изисквания. Ще се свържем с Вас, за да обсъдим казуса Ви и да предложим оптимално и законно решение за Вашия хранителен обект."
              />
              <div className="space-y-4 pt-4 hidden lg:block text-sm text-brand-dark/70">
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
                <div className="pt-2">
                  <a
                    href="tel:0887902198"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-gold/15 border border-brand-gold/30 text-brand-dark font-bold text-xs hover:bg-brand-gold hover:text-brand-dark transition-all duration-300 shadow-sm cursor-pointer"
                  >
                    <Phone className="h-4 w-4 text-brand-green shrink-0" />
                    <span>Спешен въпрос? Обадете се: <strong className="font-mono underline">0887 902 198</strong></span>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form Wrapper */}
            <div className="lg:col-span-7">
              <Suspense fallback={<div className="text-center py-12 text-brand-dark/50">Зареждане на формата...</div>}>
                <ContactForm />
              </Suspense>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
