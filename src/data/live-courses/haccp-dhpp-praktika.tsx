import Link from "next/link";
import { Calendar, Users, Award, CheckCircle, MessageSquare, Video, BookOpen, ShieldCheck, Shield, TrendingDown, Eye, Sparkles } from "lucide-react";
import type { LiveCourse } from "./types";

function HaccpDhppPraktikaPage() {
  return (
    <div className="space-y-10">
      {/* Introduction */}
      <section className="bg-gradient-to-br from-brand-green/95 to-brand-green text-white rounded-3xl p-6 sm:p-10 shadow-lg">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-gold text-brand-dark flex items-center justify-center shrink-0 shadow-md">
            <Video className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h2 className="font-serif text-2xl font-bold">Описание на курса</h2>
            <p className="text-sm text-white/80 leading-relaxed">
              Това практическо обучение е създадено за собственици и управители на хранителни обекти, производители, заведения и всички, които отговарят за безопасността на храните и подготовката при проверки от ОДБХ.
            </p>
            <p className="text-sm text-white/80 leading-relaxed">
              Курсът е насочен към реалното прилагане на HACCP системата, а не само към наличието на документи „за папката“. Ще получите практически знания как да изградите работеща система за контрол, която реално защитава бизнеса ви при проверки и намалява риска от санкции и несъответствия.
            </p>
          </div>
        </div>
      </section>

      {/* Course combines */}
      <section className="relative overflow-hidden bg-brand-green text-white rounded-3xl p-6 sm:p-10 space-y-8 shadow-xl">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col gap-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-gold flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
              <Sparkles className="h-5 w-5 text-brand-gold" />
            </span>
            Обучението комбинира
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { text: "Практически примери", icon: BookOpen },
              { text: "Реални ситуации от проверки", icon: ShieldCheck },
              { text: "Насоки за правилно водене на записи", icon: CheckCircle },
              { text: "Внедряване на добри хигиенни и производствени практики", icon: Award },
              { text: "Изграждане на ефективна документация и контрол", icon: Shield },
            ].map((item) => (
              <div key={item.text} className="group flex items-start gap-4 bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-brand-gold/50 rounded-2xl p-4 transition-all duration-300">
                <div className="w-10 h-10 rounded-full bg-brand-gold/20 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-brand-gold transition-all duration-300">
                  <item.icon className="h-5 w-5 text-brand-gold group-hover:text-brand-dark transition-colors" />
                </div>
                <span className="text-sm font-medium text-white/90 group-hover:text-white mt-2 leading-tight">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What you will learn */}
      <section className="space-y-5">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-green flex items-center gap-3">
          <span className="w-10 h-10 rounded-2xl bg-brand-gold/10 text-brand-gold flex items-center justify-center"><CheckCircle className="h-5 w-5" /></span>
          Какво ще научите
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            "Кои ДХП и ДПП са задължителни",
            "Как правилно да водите записи",
            "Какво реално проверяват инспекторите",
            "Най-честите грешки в обектите",
            "Как да изградите работеща система, а не само „документи за папката“",
            "Как да намалите риска от санкции и несъответствия",
            "Как да подготвите обекта си за проверки",
            "Как да внедрите HACCP принципите на практика",
            "Как да поддържате проследимост и контрол в ежедневната работа",
          ].map((item) => (
            <div key={item} className="bg-white rounded-xl border border-brand-green/5 p-4 flex items-start gap-3 shadow-sm">
              <CheckCircle className="h-5 w-5 text-brand-gold shrink-0 mt-0.5" />
              <span className="text-sm font-bold text-brand-green">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* HACCP Plan */}
      <section className="bg-gradient-to-br from-brand-light to-white rounded-3xl border border-brand-green/10 p-6 sm:p-10 space-y-6">
        <h2 className="font-serif text-2xl font-bold text-brand-green border-b border-brand-green/10 pb-4">HACCP план и основни елементи</h2>
        <p className="text-sm text-brand-dark/70">По време на обучението ще бъдат разгледани основните елементи на HACCP системата:</p>
        <div className="space-y-3">
          {[
            "Hazard Analysis (Анализ на опасностите)",
            "Critical Control Points (Критични контролни точки)",
            "Monitoring (Мониторинг)",
            "Corrective Actions (Коригиращи действия)",
            "Verification (Верификация)",
            "Documentation (Документация)",
          ].map((item, i) => (
            <div key={item} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-brand-green/5">
              <span className="w-6 h-6 rounded-full bg-brand-gold/20 text-brand-gold flex items-center justify-center text-xs font-bold">{i + 1}</span>
              <span className="text-sm font-medium text-brand-dark">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* For whom */}
      <section className="space-y-4">
        <h2 className="font-serif text-xl font-bold text-brand-green">Подходящо за:</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            "Производители на храни",
            "Магазини за храни",
            "Заведения и ХоРеКа сектор",
            "Сладкарски и хлебопекарни цехове",
            "Мандри и месопреработвателни предприятия",
            "Стартиращи хранителни бизнеси",
            "Отговорници по безопасност на храните",
            "Управители и собственици на хранителни обекти",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-brand-dark/80 bg-white rounded-xl border border-brand-green/5 p-3 shadow-sm">
              <CheckCircle className="h-4 w-4 text-brand-gold shrink-0 mt-0.5" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Why is this different */}
      <section className="bg-brand-green text-white rounded-3xl p-6 sm:p-10 space-y-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/10 rounded-full blur-3xl" />
        <div className="relative z-10 space-y-4">
          <h2 className="font-serif text-xl font-bold text-brand-gold flex items-center gap-2">
            <ShieldCheck className="h-6 w-6" /> Защо това обучение е различно
          </h2>
          <p className="text-sm text-white/80 italic border-l-2 border-brand-gold pl-4">
            "Ако записите ви не отразяват реалната дейност в обекта, това се вижда още при първата сериозна проверка."
          </p>
          <p className="text-sm font-bold">Този курс е създаден с фокус върху:</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              "реален контрол",
              "практическо приложение",
              "сигурност при проверки",
              "защита на бизнеса",
              "изграждане на устойчива система за безопасност на храните"
            ].map(item => (
              <li key={item} className="flex items-center gap-2 text-sm text-white/90">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Benefits */}
      <section className="space-y-4">
        <h2 className="font-serif text-xl font-bold text-brand-green">Ползи от обучението:</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { text: "По-добра безопасност на храните", icon: Shield },
            { text: "Повече сигурност при проверки", icon: ShieldCheck },
            { text: "Повишено доверие и качество", icon: Award },
            { text: "По-малък риск от санкции", icon: TrendingDown },
            { text: "Реална подготовка за инспекции", icon: Eye },
            { text: "Практически подход вместо суха теория", icon: BookOpen },
          ].map((item) => (
            <div key={item.text} className="group relative bg-white rounded-2xl border border-brand-green/10 p-6 shadow-sm hover:shadow-xl hover:shadow-brand-gold/15 hover:-translate-y-1 overflow-hidden transition-all duration-300 flex flex-col items-center text-center gap-4">
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-brand-gold/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
              <div className="w-14 h-14 rounded-full bg-brand-light flex items-center justify-center group-hover:scale-110 group-hover:bg-brand-gold/10 transition-all duration-300 relative z-10">
                <item.icon className="h-6 w-6 text-brand-gold" />
              </div>
              <span className="text-sm font-bold text-brand-green relative z-10">{item.text}</span>
            </div>
          ))}
        </div>
      </section>

      <p className="text-center text-xs text-brand-dark/50 pt-8">
        Имате въпрос преди записване?{" "}
        <Link href="/contact" className="text-brand-gold hover:underline font-bold">
          Пишете на д-р Николова <MessageSquare className="h-3 w-3 inline" />
        </Link>
      </p>
    </div>
  );
}

export const haccpDhppPraktika: LiveCourse = {
  slug: "haccp-dhpp-praktika",
  title: "Практическо обучение за ДХПП и HACCP",
  tagline:
    "За разработване, внедряване и поддържане на добри хигиенни и производствени практики и процедури, основани на принципите на HACCP",
  priceEur: 79.0,
  originalPriceEur: 111.0,
  platform: "zoom",
  hasCertificate: true,
  format: "Над 27 години опит",
  groupSize: "Малки групи",
  nextBatch: "Следваща група: при достигане на нужния брой записани",
  card: {
    cover: "/viber_image_2026-05-27_16-44-06-389.jpg",
    badge: "Live с д-р Данка",
    accent: "green",
  },
  page: HaccpDhppPraktikaPage,
  metaDescription:
    "Практическо HACCP обучение с д-р Данка Николова за разработване, внедряване и поддържане на добри хигиенни и производствени практики. Научете как реално да подготвите обекта си за проверки.",
};
