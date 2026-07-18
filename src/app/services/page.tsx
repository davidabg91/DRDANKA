import Link from "next/link";
import {
  FileText,
  ShieldCheck,
  BookOpen,
  ClipboardList,
  Layers,
  Award,
  ListTodo,
  CalendarDays,
  FileSpreadsheet,
  Check,
  CheckCircle,
  ChevronRight,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Video,
  AlertTriangle,
  HelpCircle,
  XCircle,
  FileCheck,
  Gift,
  Phone,
  MapPin,
  Clock,
  Search
} from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import PageHero from "@/components/PageHero";

interface ServiceItem {
  title: string;
  badge: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>> | any;
  desc: string;
  scope: string[];
  benefits: string;
  isVip?: boolean;
}

const SERVICES: ServiceItem[] = [

  {
    title: "НАССР Системи (ХАСЕП)",
    badge: "Задължително по Закон",
    icon: ShieldCheck,
    desc: "Анализ на опасностите и критични контролни точки. Разработване, внедряване и подготовка на пълна документация за БАБХ съгласно Закона за храните.",
    scope: [
      "Анализ на опасностите и определяне на критични контролни точки (ККТ)",
      "Разработване на Системи за самоконтрол (ДПХП - Добри производствени и хигиенни практики)",
      "Определяне на граници на мониторинг и коригиращи действия",
      "Изготвяне на мониторингови дневници и инструкции за хигиена",
    ],
    benefits: "100% законова защита от санкции и затваряне на обекта при инспекция.",
  },
  {
    title: "ISO 22000 & IFS",
    badge: "Международен стандарт",
    icon: Award,
    desc: "Професионално внедряване на международни стандарти за управление на безопасността на храните. Задължително за износ и работа с големи търговски вериги.",
    scope: [
      "Одит на готовността на предприятието за сертификация",
      "Разработване на документална система съгласно ISO 22000:2018 / IFS Food v8",
      "Провеждане на вътрешни одити и обучение на лидерски екипи",
      "Пълно съдействие по време на сертификационния одит",
    ],
    benefits: "Достъп до международни пазари и партньорства с големи супермаркети.",
  },
  {
    title: "GMP (Добра производствена практика)",
    badge: "Производство & Хигиена",
    icon: ClipboardList,
    desc: "Внедряване на ДПХП изисквания за инфраструктура, контрол на вредителите, лична хигиена на персонала, хигиена на помещенията и управление на отпадъците.",
    scope: [
      "Проектиране на правилно технологично разпределение на помещенията",
      "Разработване на програми за почистване, дезинфекция и ДДД",
      "Инструкции за входящ контрол на суровини и проследимост",
      "Въвеждане на изисквания за работно облекло и лична хигиена",
    ],
    benefits: "Максимална хигиена и предотвратяване на замърсявания в производството.",
  },
  {
    title: "Технологични карти и рецептури",
    badge: "За готвачи & Производители",
    icon: FileSpreadsheet,
    desc: "Изготвяне на задължителни технологични карти за ястия в заведения или хранителни продукти в цехове, съобразени с изискванията на Регламент 1169/2011.",
    scope: [
      "Описание на производствения процес и съставки стъпка по стъпка",
      "Определяне на физико-химични и микробиологични показатели",
      "Обозначаване на алергени, хранителна стойност и срок на годност",
      "Процедури по съхранение и транспорт на готовия продукт",
    ],
    benefits: "Пълно нормативно съответствие при етикетиране и продажба на ястия/храни.",
  },
  {
    title: "Пълна документация за БАБХ",
    badge: "Нови Обекти",
    icon: FileText,
    desc: "Подготовка на целия пакет документи, необходим за регистрация и отваряне на нов хранителен обект в Българската агенция по безопасност на храните.",
    scope: [
      "Подаване на Уведомление за регистрация на обект по чл. 26 от Закона за храните",
      "Сглобяване на папки със системи за самоконтрол, дневници и графици",
      "Инструкции за работа на персонала и дезинфекционни планове",
      "Съдействие при първоначалния оглед от инспекторите на БАБХ",
    ],
    benefits: "Бързо отваряне на обекта без забавяне поради документални пропуски.",
  },
  {
    title: "Одити & Актуализации",
    badge: "Контрол & Превенция",
    icon: ListTodo,
    desc: "Периодичен преглед на Вашите съществуващи HACCP или ISO системи. Отстраняване на предписания след инспекции и актуализация при промяна на меню/асортимент.",
    scope: [
      "Независим одит на обекта за откриване на пропуски преди БАБХ",
      "Актуализация на HACCP при промени в технологичния процес",
      "Коригиране на системи след получени нормативни предписания",
      "Абонаментно обслужване и поддръжка на документацията",
    ],
    benefits: "Спокойствие, че Вашата система е актуална спрямо най-новите закони.",
  },
  {
    title: "Изготвяне на Меню с Алергени",
    badge: "Задължително по Закон",
    icon: ListTodo,
    desc: "Професионален одит на Вашето меню и съставяне на легални обозначения, легенда и папка за 14-те основни групи алергени съгласно Регламент (ЕС) № 1169/2011.",
    scope: [
      "Анализ на рецептите и идентифициране на скрити алергени",
      "Съставяне на писмена Легенда за алергените в главното меню",
      "Изготвяне на детайлна информационна папка (технологични профили) за гишето/клиентите",
      "Консултация за предотвратяване на кръстосано замърсяване в кухнята/караваната",
    ],
    benefits: "Пълно съответствие с изискванията на БАБХ и безопасност за здравето на клиентите.",
  },
];

export default function Services() {
  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <PageHero
        badgeText="КАКВО ПРЕДЛАГАМЕ"
        title="Професионални Услуги по Безопасност на Храните"
        subtitle="Изберете индивидуални консултации, проектиране или актуализация на Вашите системи за самоконтрол. 27 години опит в сътрудничество с БАБХ."
      />

      {/* ═══════════════ FLAGSHIP: Проверка преди проверката ═══════════════ */}
      <section id="proverka-predi-proverkata" className="pt-14 pb-6 scroll-mt-28 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2rem] border border-brand-gold/25 bg-gradient-to-br from-[#0A1F18] via-[#0D2B1C] to-[#081410] text-white shadow-2xl">
            {/* Ambient glows */}
            <div className="absolute top-0 right-0 w-[28rem] h-[28rem] bg-brand-gold/15 rounded-full blur-[100px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 left-0 w-[28rem] h-[28rem] bg-brand-green/25 rounded-full blur-[100px] pointer-events-none -translate-x-1/3 translate-y-1/3" />
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.03]"
              style={{
                backgroundImage: "repeating-linear-gradient(45deg, #ffffff 0, #ffffff 1px, transparent 1px, transparent 22px), repeating-linear-gradient(-45deg, #ffffff 0, #ffffff 1px, transparent 1px, transparent 22px)"
              }}
            />

            <div className="relative z-10 p-6 sm:p-10 lg:p-14">
              {/* ─── Hero / Emotional hook ─── */}
              <div className="max-w-3xl">
                <span className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] bg-brand-gold text-brand-dark px-4 py-2 rounded-full shadow-lg shadow-brand-gold/20">
                  <Star className="h-3.5 w-3.5" fill="currentColor" /> Премиум пакет
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mt-6 leading-[1.1] tracking-tight">
                  Проверка преди проверката
                </h2>
                <p className="text-brand-gold/90 font-serif text-lg sm:text-xl mt-3 italic">
                  Независим професионален одит на предприятието Ви — преди инспекцията на БАБХ.
                </p>
                <p className="text-white/70 text-sm sm:text-base leading-relaxed mt-5">
                  Повечето оператори са убедени, че всичко е наред… докато не започне проверката. Вместо да чакате инспекторът да открие слабите места — <span className="text-white font-semibold">открийте ги първи</span>.
                </p>
              </div>

              {/* ─── Problem: questions + risks ─── */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
                <div className="bg-white/[0.06] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                  <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white mb-4">
                    <HelpCircle className="h-5 w-5 text-brand-gold" /> Сигурни ли сте, че сте готови?
                  </h3>
                  <ul className="space-y-2.5 text-sm text-white/75">
                    {[
                      "Наистина ли документацията Ви е актуална?",
                      "Прилагате ли НАССР така, както е разработен?",
                      "Работят ли реално добрите производствени и хигиенни практики?",
                      "Осигурена ли е проследимостта и изрядни ли са етикетите?",
                      "Подготвен ли е персоналът за проверка?",
                    ].map((q, i) => (
                      <li key={i} className="flex items-start gap-2.5 leading-relaxed">
                        <HelpCircle className="h-4 w-4 text-brand-gold/70 shrink-0 mt-0.5" />
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-red-950/30 border border-red-500/20 rounded-2xl p-6 backdrop-blur-sm">
                  <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-red-200 mb-4">
                    <AlertTriangle className="h-5 w-5 text-red-400" /> Един пропуск може да доведе до
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5 text-sm text-white/80">
                    {[
                      "Предписания",
                      "Актове и санкции",
                      "Спиране на дейността",
                      "Блокиране на продукция",
                      "Изтегляне от пазара",
                      "Загуба на клиенти",
                    ].map((r, i) => (
                      <li key={i} className="flex items-start gap-2 leading-relaxed">
                        <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* ─── What the audit covers ─── */}
              <div className="mt-12">
                <h3 className="flex items-center gap-2 font-serif text-2xl font-bold text-brand-gold mb-6">
                  <Search className="h-6 w-6" /> Какво включва проверката
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    "Анализ на внедрената НАССР система",
                    "Преглед на разработените ДПХП",
                    "Технологична документация",
                    "Производствени процеси и потоци",
                    "Сграден фонд и помещения",
                    "Производствено оборудване",
                    "Условия за съхранение",
                    "Проследимост и етикетиране",
                    "Задължителна документация и записи",
                    "Съответствие със законодателството",
                    "Анализ на риска",
                    "Установяване на несъответствия",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5 bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 hover:bg-white/[0.09] hover:border-brand-gold/30 transition-colors duration-300">
                      <Check className="h-4 w-4 text-brand-gold shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-white/85 leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ─── Deliverables + Bonus ─── */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-12">
                <div className="lg:col-span-3 bg-white text-brand-dark rounded-2xl p-6 sm:p-8 shadow-xl">
                  <h3 className="flex items-center gap-2 font-serif text-xl font-bold text-brand-green mb-5">
                    <FileCheck className="h-6 w-6 text-brand-gold" /> След проверката получавате
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "Подробен писмен доклад с всички установени несъответствия",
                      "Анализ на риска за Вашето предприятие",
                      "План с конкретни коригиращи действия",
                      "Практически препоръки за подобрение на системата",
                      "Консултация за обсъждане на резултатите",
                    ].map((d, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm leading-relaxed">
                        <CheckCircle className="h-5 w-5 text-brand-green shrink-0 mt-0.5" />
                        <span className="text-brand-dark/80">{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="lg:col-span-2 bg-gradient-to-br from-brand-gold/25 to-brand-gold/5 border border-brand-gold/40 rounded-2xl p-6 sm:p-8 flex flex-col justify-center">
                  <div className="inline-flex items-center gap-2 text-brand-gold text-[11px] font-black uppercase tracking-widest mb-3">
                    <Gift className="h-4 w-4" /> Специален бонус
                  </div>
                  <p className="font-serif text-2xl font-bold text-white leading-tight">
                    30 дни професионална подкрепа
                  </p>
                  <p className="text-white/70 text-sm leading-relaxed mt-3">
                    След проверката, в продължение на 30 дни задавате въпроси по изпълнението на препоръките.
                  </p>
                  <ul className="mt-4 space-y-2 text-sm text-white/85">
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-brand-gold shrink-0" /> Без ограничение в броя въпроси</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-brand-gold shrink-0" /> Без допълнително заплащане</li>
                    <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-brand-gold shrink-0" /> Подкрепа по телефон и имейл</li>
                  </ul>
                </div>
              </div>

              {/* ─── Price + CTA ─── */}
              <div className="mt-12 bg-white/[0.06] border border-brand-gold/25 rounded-2xl p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 backdrop-blur-sm">
                <div className="flex-1">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-brand-gold/80">Инвестиция</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-serif text-5xl sm:text-6xl font-black text-white tabular-nums">600</span>
                    <span className="font-serif text-3xl font-bold text-brand-gold">€</span>
                    <span className="text-white/50 text-sm ml-1">еднократно</span>
                  </div>
                  <ul className="mt-4 space-y-1.5 text-xs text-white/60">
                    <li className="flex items-start gap-2"><MapPin className="h-3.5 w-3.5 text-brand-gold/70 shrink-0 mt-0.5" /> Цена за обекти до 50 км. При по-голямо разстояние се начисляват транспортни разходи.</li>
                    <li className="flex items-start gap-2"><FileText className="h-3.5 w-3.5 text-brand-gold/70 shrink-0 mt-0.5" /> За големи предприятия или обекти над един работен ден се изготвя индивидуална оферта.</li>
                    <li className="flex items-start gap-2"><Clock className="h-3.5 w-3.5 text-brand-gold/70 shrink-0 mt-0.5" /> Посещението се резервира след предварително заплащане.</li>
                  </ul>
                </div>
                <div className="w-full lg:w-auto shrink-0 flex flex-col items-stretch lg:items-end gap-3">
                  <Link
                    href={`/contact?service=${encodeURIComponent("Проверка преди проверката")}`}
                    className="inline-flex items-center justify-center gap-2 px-10 py-5 text-sm font-black uppercase tracking-widest rounded-xl bg-brand-gold hover:bg-brand-gold-light text-brand-dark shadow-xl shadow-brand-gold/20 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                  >
                    Заявете проверка <ChevronRight className="h-5 w-5" />
                  </Link>
                  <p className="text-[11px] text-white/50 text-center lg:text-right leading-relaxed max-w-[16rem]">
                    Посочете име/фирма, вид на обекта и населено място — ще се свържа с Вас за организация и дата.
                  </p>
                </div>
              </div>

              {/* ─── Signature / promise ─── */}
              <div className="mt-10 border-t border-white/10 pt-8 flex items-start gap-4">
                <ShieldCheck className="h-8 w-8 text-brand-gold shrink-0" />
                <p className="text-white/75 text-sm sm:text-base leading-relaxed font-serif italic max-w-4xl">
                  „Като бивш директор на Областна дирекция по безопасност на храните и експерт с над 25 години опит в официалния контрол, ще получите независима оценка на реалното състояние на предприятието Ви. Най-добрата проверка е тази, за която вече сте подготвени.“
                  <span className="block not-italic text-brand-gold font-bold text-sm mt-2 font-sans">— д-р Данка Николова</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <SectionHeading
            badgeText="ЕДНОКРАТНИ УСЛУГИ И СТАНДАРТИ"
            title="Допълнителни Консултантски Услуги"
            subtitle="Вижте нашите решения за разработка на HACCP, ISO сертификации и подготовка на документация."
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {SERVICES.map((srv, index) => {
            const Icon = srv.icon;
            const isVip = srv.isVip;
            return (
              <div
                key={index}
                className={`border rounded-2xl p-6 sm:p-10 transition-all duration-300 flex flex-col justify-between ${
                  isVip
                    ? "bg-gradient-to-br from-[#FBF5E6] via-[#F2DFAC] to-[#DCBF7A] border-brand-gold shadow-[0_15px_35px_rgba(220,191,122,0.25)] relative overflow-hidden text-brand-dark border-2 hover:shadow-xl"
                    : "bg-gradient-to-br from-[#F8F9FA] via-[#E9ECEF] to-[#DEE2E6] border-[#CED4DA] text-brand-dark shadow-lg shadow-black/5 hover:border-brand-gold/30 hover:shadow-xl"
                }`}
              >
                {isVip && (
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -z-10 pointer-events-none translate-x-12 -translate-y-12"></div>
                )}
                <div>
                  {/* Top row */}
                  <div className="flex justify-between items-start mb-6">
                    <div className={`p-3 rounded-lg border ${
                      isVip 
                        ? "bg-brand-green/10 border-brand-green/20 text-brand-green" 
                        : "bg-brand-green/5 border-brand-green/10 text-brand-green"
                    }`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider border px-3 py-1.5 rounded-full ${
                      isVip 
                        ? "text-brand-green border-brand-green/30 bg-brand-green/10 font-extrabold flex items-center gap-1.5 animate-pulse" 
                        : "text-brand-gold border-brand-gold/20 bg-brand-gold/5"
                    }`}>
                      {isVip && <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse"></span>}
                      {srv.badge}
                    </span>
                  </div>

                  {/* Title and description */}
                  <h2 className={`font-serif text-xl sm:text-2xl font-bold mb-4 text-brand-green`}>
                    {srv.title}
                  </h2>
                  <p className={`text-xs sm:text-sm leading-relaxed mb-6 ${
                    isVip ? "text-brand-dark/90" : "text-brand-dark/70"
                  }`}>
                    {srv.desc}
                  </p>

                  {/* Scope / list */}
                  <div className="mb-6">
                    <h3 className={`text-xs font-bold uppercase tracking-widest mb-3 ${
                      isVip ? "text-brand-green" : "text-brand-dark"
                    }`}>
                      Обхват на услугата:
                    </h3>
                    <ul className="space-y-2.5">
                      {srv.scope.map((item, idx) => (
                        <li key={idx} className="flex items-start text-xs">
                          <Check className={`h-4 w-4 mr-2.5 shrink-0 mt-0.5 ${
                            isVip ? "text-brand-green" : "text-brand-gold"
                          }`} />
                          <span className={isVip ? "text-brand-dark/95" : "text-brand-dark/80"}>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom section (benefit + CTA) */}
                <div className={`border-t pt-6 mt-6 space-y-5 ${
                  isVip ? "border-brand-green/10" : "border-brand-green/5"
                }`}>
                  <div className={`p-4 rounded-xl border-l-[3px] flex items-start shadow-sm transition-all duration-300 hover:shadow-md ${
                    isVip 
                      ? "bg-gradient-to-r from-brand-green/10 to-transparent border-l-brand-green text-brand-green" 
                      : "bg-gradient-to-r from-brand-gold/15 to-transparent border-l-brand-gold text-brand-dark"
                  }`}>
                    <TrendingUp className={`h-4.5 w-4.5 mr-3 shrink-0 mt-0.5 ${isVip ? "text-brand-green" : "text-brand-gold"}`} />
                    <div className="text-xs leading-relaxed">
                      <span className="font-bold uppercase tracking-wider block mb-1">Реална полза за бизнеса</span>
                      <span className={isVip ? "text-brand-dark/95 font-medium" : "text-brand-dark/80"}>{srv.benefits}</span>
                    </div>
                  </div>
                  {isVip ? (
                    <div className="flex flex-col items-center gap-3">
                      <Link
                        href="/profile"
                        className="w-full text-center px-8 py-4 text-xs font-black uppercase tracking-widest rounded-lg transition-colors cursor-pointer bg-brand-green hover:bg-brand-green/90 text-white shadow-lg"
                      >
                        Тествай безплатно 14 дни
                      </Link>
                      <p className="text-[10px] text-brand-dark/50 text-center italic leading-relaxed">
                        * Броят на местата е ограничен, за да гарантираме индивидуално внимание и качествено обслужване на всеки клиент.
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                      <Link
                        href="/consultations"
                        className="w-full sm:w-auto text-center px-8 py-3.5 text-xs font-bold uppercase tracking-wider rounded transition-colors cursor-pointer bg-brand-green/10 text-brand-green border border-brand-green/20 hover:bg-brand-green hover:text-white shadow-sm"
                      >
                        Заяви Консултация
                      </Link>
                      <Link
                        href={`/contact?service=${encodeURIComponent(srv.title)}`}
                        className="w-full sm:w-auto text-center px-8 py-3.5 text-xs font-black uppercase tracking-wider rounded transition-colors cursor-pointer bg-brand-gold hover:bg-brand-gold-light text-brand-dark shadow-lg shadow-brand-gold/15"
                      >
                        Попитай за оферта
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* VIP System Deep Dive (New Section) */}
      <section id="vip-system" className="py-16 relative z-10 border-t border-brand-gold/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#FBF5E6] via-[#F2DFAC] to-[#DCBF7A] border border-brand-gold rounded-[1.5rem] shadow-2xl relative overflow-hidden text-brand-dark p-6 sm:p-8 lg:p-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/30 rounded-full blur-3xl -z-10 pointer-events-none translate-x-24 -translate-y-24" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-green/10 rounded-full blur-3xl -z-10 pointer-events-none -translate-x-24 translate-y-24" />

            <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
              <div className="relative inline-flex group mb-2">
                <div className="absolute transition-all duration-1000 opacity-40 -inset-px bg-gradient-to-r from-brand-gold via-white to-brand-gold rounded-full blur-md group-hover:opacity-70 group-hover:-inset-1 group-hover:duration-200 animate-pulse" />
                <span className="relative inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] bg-brand-dark text-brand-gold px-6 py-2.5 rounded-full border border-brand-gold/50 shadow-2xl overflow-hidden">
                  <span className="absolute -inset-full h-full w-1/2 z-0 block transform -skew-x-12 bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent animate-[shimmer_2.5s_infinite]" />
                  <Star className="h-4 w-4 text-brand-gold relative z-10 drop-shadow-[0_0_8px_rgba(220,191,122,0.8)]" fill="currentColor" /> 
                  <span className="relative z-10 drop-shadow-[0_0_2px_rgba(220,191,122,0.5)]">Премиум Услуга</span>
                </span>
              </div>
              <h2 className="font-serif leading-tight drop-shadow-sm flex flex-col gap-1 sm:gap-2">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-brand-green to-[#1A3D2E] text-transparent bg-clip-text uppercase">
                  ВИП Абонаментна Система
                </span>
                <span className="relative inline-block mt-2 sm:mt-3">
                  <span className="absolute inset-0 bg-white/60 blur-2xl rounded-full"></span>
                  <span className="relative text-4xl sm:text-5xl lg:text-7xl font-serif font-black tracking-tight drop-shadow-xl bg-gradient-to-r from-[#6e4e13] via-[#b38d3b] to-[#4a340b] text-transparent bg-clip-text py-2 uppercase">
                    Дигитално Спокойствие
                  </span>
                </span>
              </h2>
              <div className="mt-8 space-y-8 max-w-3xl mx-auto relative z-10">
                <p className="text-xl sm:text-2xl font-serif text-brand-dark leading-snug relative inline-block">
                  <span className="absolute -left-6 -top-4 text-6xl text-brand-gold/40 font-serif select-none pointer-events-none">"</span>
                  Пълно дигитално управление на безопасността на храните във Вашия обект
                  <span className="absolute -right-6 -bottom-8 text-6xl text-brand-gold/40 font-serif select-none pointer-events-none">"</span>
                </p>
                
                <div className="w-24 h-px bg-gradient-to-r from-transparent via-brand-gold to-transparent mx-auto"></div>

                <div className="text-sm sm:text-base text-brand-dark/80 leading-relaxed space-y-6">
                  <div className="relative p-6 sm:p-8 bg-white rounded-3xl shadow-xl shadow-brand-gold/10 border border-brand-gold/20 overflow-hidden group hover:shadow-brand-gold/20 transition-all duration-500 hover:-translate-y-1 text-left">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-brand-gold/10 to-transparent rounded-bl-full transition-transform duration-700 group-hover:scale-125 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-brand-green/5 to-transparent rounded-tr-full pointer-events-none" />
                    
                    <div className="relative z-10 flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
                      <div className="shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-brand-gold to-[#A4855C] flex items-center justify-center shadow-lg shadow-brand-gold/30 group-hover:rotate-3 transition-transform duration-500">
                        <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                      </div>
                      <div className="space-y-3 pt-1">
                        <p className="text-brand-green text-base sm:text-lg lg:text-xl font-bold leading-tight drop-shadow-sm">
                          Забравете за претрупаните папки, изгубените дневници и постоянния страх от проверки.
                        </p>
                        <div className="h-1 w-12 bg-gradient-to-r from-brand-gold to-brand-gold-light rounded-full" />
                        <p className="text-sm sm:text-base text-brand-dark/80 leading-relaxed font-medium">
                          С ВИП Абонаментна Система <span className="font-bold text-brand-green">„Дигитално Спокойствие“</span> получавате иновативно дигитално решение за управление на безопасността на храните, което автоматизира ежедневните процеси, поддържа обекта Ви в нормативно съответствие и Ви осигурява директна връзка с д-р Данка Николова.
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="bg-brand-green/5 border border-brand-green/10 text-brand-dark font-medium p-5 rounded-2xl text-center shadow-inner">
                    Системата е създадена специално за производители и търговци на храни, които искат спокойствие, сигурност и професионална защита на бизнеса си.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
              <div className="space-y-8">
                <h3 className="font-serif text-2xl font-bold text-brand-green mb-6 border-b border-brand-green/10 pb-4">Какво получавате?</h3>
                
                <div className="bg-white/60 p-5 rounded-2xl border border-white shadow-sm space-y-2 relative overflow-hidden group hover:bg-white/80 transition-colors">
                  <h4 className="font-bold flex items-center gap-2"><ClipboardList className="h-5 w-5 text-brand-green" /> Автоматизирани БАБХ дневници</h4>
                  <p className="text-sm text-brand-dark/80">Автоматично и лесно попълване на ежедневните записи за:</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium text-brand-dark/80 pl-2">
                    <li className="flex items-start gap-1.5"><Check className="h-4 w-4 text-brand-green shrink-0" /> Температурен режим</li>
                    <li className="flex items-start gap-1.5"><Check className="h-4 w-4 text-brand-green shrink-0" /> Хигиена на обекта</li>
                    <li className="flex items-start gap-1.5"><Check className="h-4 w-4 text-brand-green shrink-0" /> Входящ контрол</li>
                    <li className="flex items-start gap-1.5"><Check className="h-4 w-4 text-brand-green shrink-0" /> Проследимост</li>
                    <li className="flex items-start gap-1.5"><Check className="h-4 w-4 text-brand-green shrink-0" /> Технологични карти</li>
                    <li className="flex items-start gap-1.5"><Check className="h-4 w-4 text-brand-green shrink-0" /> Здраве на персонала</li>
                    <li className="flex items-start gap-1.5"><Check className="h-4 w-4 text-brand-green shrink-0" /> Обучение на персонала</li>
                    <li className="flex items-start gap-1.5"><Check className="h-4 w-4 text-brand-green shrink-0" /> Управление на отпадъци</li>
                    <li className="flex items-start gap-1.5"><Check className="h-4 w-4 text-brand-green shrink-0" /> Контролни записи</li>
                  </ul>
                  <p className="text-xs font-bold text-brand-green mt-2 bg-brand-green/10 p-2 rounded-lg inline-block">Всичко се попълва дигитално с минимално време и риск от грешки.</p>

                  {/* Mock UI: БАБХ Дневници */}
                  <div className="mt-6 bg-white rounded-xl shadow-lg border border-brand-green/10 overflow-hidden relative group-hover:-translate-y-1 transition-transform duration-300">
                    <div className="bg-gradient-to-r from-brand-green to-[#12382b] p-3 flex justify-between items-center text-white">
                      <span className="text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5"><ClipboardList className="h-3 w-3 text-brand-gold"/> Дневник: Хладилници</span>
                      <span className="text-[9px] bg-white/20 px-2 py-0.5 rounded-full font-medium">Днес</span>
                    </div>
                    <div className="p-4 flex items-center justify-between bg-brand-light/30">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-brand-dark/50 uppercase block">Хладилна витрина #1</span>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-black text-brand-green tracking-tighter">4.0°<span className="text-lg">C</span></span>
                          <span className="text-[9px] font-bold text-green-700 bg-green-100 px-1.5 py-0.5 rounded flex items-center gap-1"><CheckCircle className="h-2.5 w-2.5"/> В норма</span>
                        </div>
                      </div>
                      <div className="bg-brand-gold text-brand-green px-4 py-2 rounded-lg shadow-md text-[10px] font-black uppercase tracking-wider">
                        Запиши
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/60 p-5 rounded-2xl border border-white shadow-sm space-y-2 relative overflow-hidden group hover:bg-white/80 transition-colors">
                  <h4 className="font-bold flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-brand-green" /> 24/7 връзка с д-р Николова</h4>
                  <p className="text-sm text-brand-dark/80">Получавате постоянен директен чат и експертни консултации при:</p>
                  <div className="flex flex-wrap gap-2">
                    {["Изненадващи проверки", "Предписания от БАБХ", "Извънредни ситуации", "Въпроси по безопасност"].map(i => (
                      <span key={i} className="text-[10px] uppercase tracking-wider font-bold bg-white px-2 py-1 rounded-md border border-brand-green/10 text-brand-dark/80">{i}</span>
                    ))}
                  </div>

                  {/* Mock UI: Чат */}
                  <div className="mt-6 bg-white rounded-xl shadow-lg border border-brand-green/10 overflow-hidden relative group-hover:-translate-y-1 transition-transform duration-300">
                    <div className="bg-brand-green/5 border-b border-brand-green/10 p-3 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-brand-gold flex items-center justify-center relative">
                          <span className="text-[10px] font-black text-brand-dark">ДН</span>
                          <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white"></div>
                        </div>
                        <span className="text-[10px] font-bold text-brand-green uppercase">Чат с Експерт</span>
                      </div>
                    </div>
                    <div className="p-4 space-y-3 bg-brand-light/30">
                      <div className="flex flex-col gap-1 items-end">
                        <div className="bg-brand-green text-white text-[10px] px-3 py-2 rounded-2xl rounded-tr-sm shadow-sm inline-block max-w-[85%]">
                          Имаме проверка от БАБХ в момента. Какво да им покажа за дневниците?
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 items-start">
                        <div className="bg-white border border-brand-green/10 text-brand-dark text-[10px] px-3 py-2 rounded-2xl rounded-tl-sm shadow-sm inline-block max-w-[85%] font-medium">
                          Здравейте! Спокойно, отворете &quot;Система&quot; и им покажете Дигиталния Дневник. Всичко Ви е наред.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/60 p-5 rounded-2xl border border-white shadow-sm space-y-2 relative overflow-hidden group hover:bg-white/80 transition-colors">
                  <h4 className="font-bold flex items-center gap-2"><ListTodo className="h-5 w-5 text-brand-green" /> Защита при проверки и актове</h4>
                  <p className="text-sm text-brand-dark/80">Приоритетно съдействие и експертна подкрепа при:</p>
                  <div className="flex flex-wrap gap-2">
                    {["Предписания", "Актове", "Несъответствия", "Писмени становища", "Комуникация с органи"].map(i => (
                      <span key={i} className="text-[10px] uppercase tracking-wider font-bold bg-white px-2 py-1 rounded-md border border-brand-green/10 text-brand-dark/80">{i}</span>
                    ))}
                  </div>

                  {/* Mock UI: Документ/Защита */}
                  <div className="mt-6 bg-white rounded-xl shadow-lg border border-brand-green/10 overflow-hidden relative group-hover:-translate-y-1 transition-transform duration-300">
                    <div className="bg-gradient-to-r from-brand-dark to-brand-green p-3 flex justify-between items-center text-white">
                      <span className="text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5"><ShieldCheck className="h-3 w-3 text-brand-gold"/> Становище / Възражение</span>
                    </div>
                    <div className="p-4 bg-brand-light/30">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                          <FileText className="h-4 w-4 text-red-600" />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-brand-dark block leading-tight">Подготвено възражение срещу АУАН №12345</span>
                          <span className="text-[9px] text-brand-dark/50 block">Състояние: Готово за изпращане</span>
                          <div className="mt-2 inline-flex bg-brand-green/10 text-brand-green px-2 py-1 rounded text-[9px] font-black uppercase">
                            Изтегли PDF
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-white/60 p-6 rounded-2xl border border-white shadow-sm space-y-3 mt-0 lg:mt-[5.5rem] relative overflow-hidden group hover:bg-white/80 transition-colors">
                  <h4 className="font-bold flex items-center gap-2"><FileText className="h-5 w-5 text-brand-green" /> Интелигентен генератор на етикети</h4>
                  <p className="text-sm text-brand-dark/80">Системата автоматично генерира легални етикети за отворени продукти с автоматично изчисляване на срокове, следене на годност и проследимост.</p>

                  {/* Mock UI: Етикети */}
                  <div className="mt-6 bg-white rounded-xl shadow-lg border border-brand-green/10 overflow-hidden relative group-hover:-translate-y-1 transition-transform duration-300 p-4 space-y-3">
                    <div className="flex justify-between items-start border-b border-dashed border-brand-green/20 pb-3">
                      <div>
                        <span className="text-[10px] font-black uppercase text-brand-gold bg-brand-green px-2 py-0.5 rounded flex items-center gap-1 w-max mb-1.5"><FileText className="h-2.5 w-2.5"/> Етикет</span>
                        <h5 className="font-bold text-brand-dark text-sm">Прясно мляко 3%</h5>
                      </div>
                      <div className="text-right">
                        <span className="block text-[9px] font-bold text-brand-dark/40 uppercase">Партида</span>
                        <span className="text-xs font-mono font-bold text-brand-dark">#L294A</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="block text-[9px] font-bold text-brand-dark/40 uppercase">Отворено на</span>
                        <span className="text-xs font-bold text-brand-dark">10 Окт, 14:00</span>
                      </div>
                      <div className="text-right">
                        <span className="block text-[9px] font-bold text-brand-dark/40 uppercase">Годно до</span>
                        <span className="text-xs font-black text-red-600 bg-red-50 border border-red-100 px-1.5 py-0.5 rounded">12 Окт, 14:00</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/60 p-6 rounded-2xl border border-white shadow-sm space-y-3 relative overflow-hidden group hover:bg-white/80 transition-colors">
                  <h4 className="font-bold flex items-center gap-2"><BookOpen className="h-5 w-5 text-brand-green" /> Дигитално обучение на персонала</h4>
                  <p className="text-sm text-brand-dark/80">Онлайн обучение по безопасност на храните и хигиенни практики с интерактивни тестове, дигитални сертификати и автоматично проследяване.</p>

                  {/* Mock UI: Обучение */}
                  <div className="mt-6 bg-white rounded-xl shadow-lg border border-brand-green/10 overflow-hidden relative group-hover:-translate-y-1 transition-transform duration-300">
                    <div className="bg-brand-green/5 border-b border-brand-green/10 p-3 flex justify-between items-center">
                      <span className="text-[10px] font-bold text-brand-green uppercase flex items-center gap-1"><BookOpen className="h-3 w-3"/> Обучителен модул</span>
                      <span className="text-[9px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">100% Завършен</span>
                    </div>
                    <div className="p-4 space-y-3 bg-brand-light/30">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand-gold/20 flex items-center justify-center">
                          <Award className="h-5 w-5 text-brand-gold" />
                        </div>
                        <div>
                          <span className="text-[10px] font-black text-brand-dark uppercase block">Иван Иванов (Готвач)</span>
                          <span className="text-[9px] text-brand-dark/60 block">Тест: Лична хигиена</span>
                        </div>
                      </div>
                      <div className="w-full bg-black/5 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-brand-gold w-full h-full"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/60 p-6 rounded-2xl border border-white shadow-sm space-y-3 relative overflow-hidden group hover:bg-white/80 transition-colors">
                  <h4 className="font-bold flex items-center gap-2"><Layers className="h-5 w-5 text-brand-green" /> Автоматични актуализации</h4>
                  <p className="text-sm text-brand-dark/80">При промяна на меню, персонал, процеси или закони — системата автоматично актуализира необходимите НАССР и ДПХП документи.</p>

                  {/* Mock UI: Актуализация */}
                  <div className="mt-6 bg-white rounded-xl shadow-lg border border-brand-green/10 overflow-hidden relative group-hover:-translate-y-1 transition-transform duration-300 p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 w-2 h-2 rounded-full bg-brand-gold animate-pulse shrink-0"></div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase text-brand-green block">Системно известие</span>
                        <p className="text-[10px] text-brand-dark/80 leading-snug">
                          Открита е промяна в Наредба №1. Вашата HACCP документация беше автоматично актуализирана до версия 2.4.
                        </p>
                        <span className="text-[9px] text-brand-dark/40 font-mono mt-1 block">Днес, 10:30 ч.</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-10 p-6 sm:p-8 bg-gradient-to-br from-[#0A1F18] via-[#0D2B1C] to-[#081410] text-white rounded-2xl shadow-xl relative overflow-hidden z-10 border border-brand-gold/10">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/20 rounded-full blur-[40px] pointer-events-none translate-x-10 -translate-y-10" />
                  <div 
                    className="absolute inset-0 pointer-events-none opacity-[0.03]"
                    style={{
                      backgroundImage: "repeating-linear-gradient(45deg, #ffffff 0, #ffffff 1px, transparent 1px, transparent 20px), repeating-linear-gradient(-45deg, #ffffff 0, #ffffff 1px, transparent 1px, transparent 20px)"
                    }}
                  />
                  <h4 className="font-serif text-xl font-bold text-brand-gold mb-4">За кого е създадена системата?</h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs font-medium text-white/90">
                    <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-gold mt-1" />Ресторанти и заведения</li>
                    <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-gold mt-1" />Производства на храни</li>
                    <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-gold mt-1" />Сладкарски и хлебопекарни</li>
                    <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-gold mt-1" />Магазини за храни</li>
                    <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-gold mt-1" />Мандри и месопреработвателни</li>
                    <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-gold mt-1" />Складове за търговия</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-16 text-center space-y-8 bg-white/40 p-8 sm:p-12 rounded-3xl border border-white/60">
              <div className="max-w-3xl mx-auto space-y-4">
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-brand-green">Вашият бизнес заслужава спокойствие</h3>
                <p className="text-base text-brand-dark/80 leading-relaxed">
                  Вместо да губите време в хартии, проверки и притеснения, ВИП системата „Дигитално Спокойствие“ Ви помага да управлявате безопасността на храните модерно, лесно и професионално.
                </p>
                <p className="text-lg font-bold text-brand-green italic bg-brand-green/5 py-3 px-6 rounded-xl inline-block mt-4 border border-brand-green/10">
                  „Защото спокойният бизнес е успешният бизнес.“
                </p>
              </div>
              <div className="pt-6">
                <Link
                  href="/profile"
                  className="inline-flex items-center justify-center px-10 py-5 text-sm sm:text-base font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer bg-brand-green hover:bg-[#12382b] text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 border border-brand-green"
                >
                  Тествай безплатно 14 дни
                </Link>
                <p className="text-[10px] text-brand-dark/50 text-center italic leading-relaxed mt-4">
                  * Броят на местата е ограничен, за да гарантираме индивидуално внимание и качествено обслужване на всеки клиент.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Training Promo Section */}
      <section className="py-20 relative z-10 overflow-hidden border-t border-brand-gold/10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none translate-x-32 -translate-y-32" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-green/5 rounded-full blur-3xl pointer-events-none -translate-x-32 translate-y-32" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Box */}
            <div className="lg:col-span-5 relative">
              <div className="bg-gradient-to-br from-[#0A1F18] via-[#0D2B1C] to-[#081410] rounded-[2rem] p-8 sm:p-10 text-white shadow-2xl relative overflow-hidden z-10 border border-brand-gold/20">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/15 rounded-full blur-[80px] pointer-events-none translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-green/20 rounded-full blur-[80px] pointer-events-none -translate-x-1/2 translate-y-1/2" />
                <div 
                  className="absolute inset-0 pointer-events-none opacity-[0.03]"
                  style={{
                    backgroundImage: "repeating-linear-gradient(45deg, #ffffff 0, #ffffff 1px, transparent 1px, transparent 20px), repeating-linear-gradient(-45deg, #ffffff 0, #ffffff 1px, transparent 1px, transparent 20px)"
                  }}
                />
                <BookOpen className="h-12 w-12 text-brand-gold mb-6 relative z-10 drop-shadow-md" />
                <h3 className="font-serif text-3xl sm:text-4xl font-bold mb-4 relative z-10">
                  Професионални Обучения
                </h3>
                <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-8 relative z-10">
                  Инвестирайте в знанията на Вашия екип. Предлагаме специализирани курсове по безопасност на храните, съобразени с най-новите изисквания на БАБХ и ЕС.
                </p>
                <div className="flex flex-col gap-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-brand-gold shrink-0" />
                    <span className="text-sm font-medium">Удостоверение след завършване</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-brand-gold shrink-0" />
                    <span className="text-sm font-medium">Присъствени и онлайн формати</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-brand-gold shrink-0" />
                    <span className="text-sm font-medium">Индивидуален подход към обекта</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Text */}
            <div className="lg:col-span-7 space-y-8 lg:pl-8">
              <div>
                <span className="text-xs font-bold uppercase text-brand-green tracking-widest bg-brand-green/10 px-4 py-2 rounded-full inline-flex items-center gap-2 mb-4 border border-brand-green/20">
                  <Users className="w-3.5 h-3.5" /> Заявете Обучение
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-brand-dark mb-4 tracking-tight leading-tight">
                  Подгответе екипа си за всяка проверка
                </h2>
                <p className="text-brand-dark/70 text-base sm:text-lg leading-relaxed">
                  Персоналът е най-важното звено в системата за безопасност на храните. Ние предлагаме интерактивни и практически обучения, които правят сложните нормативни изисквания лесни за разбиране и прилагане в ежедневната работа на служителите Ви.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-brand-light p-6 rounded-2xl border border-brand-green/10 hover:border-brand-green/30 hover:shadow-lg transition-all duration-300 group">
                  <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Video className="h-5 w-5 text-brand-green" />
                  </div>
                  <h4 className="font-bold text-brand-dark mb-2 text-lg">Готови видео обучения</h4>
                  <p className="text-sm text-brand-dark/70 leading-relaxed">Учете в удобно за Вас време с нашите специализирани онлайн курсове и дигитални материали с достъп веднага.</p>
                </div>
                <div className="bg-brand-light p-6 rounded-2xl border border-brand-green/10 hover:border-brand-green/30 hover:shadow-lg transition-all duration-300 group">
                  <div className="w-10 h-10 rounded-xl bg-brand-gold/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-brand-gold/30">
                    <Users className="h-5 w-5 text-brand-gold-dark" />
                  </div>
                  <h4 className="font-bold text-brand-dark mb-2 text-lg">Обучения на живо</h4>
                  <p className="text-sm text-brand-dark/70 leading-relaxed">Интерактивни уебинари, семинари и корпоративни групови обучения с директна връзка с д-р Николова.</p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/training"
                  className="inline-flex items-center px-10 py-5 bg-brand-gold hover:bg-brand-gold-light text-brand-dark font-black text-sm uppercase tracking-widest transition-all rounded-xl shadow-xl hover:-translate-y-1 hover:shadow-2xl"
                >
                  Към Центъра за Обучения
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Secondary CTA section */}
      <section className="bg-brand-green py-16 border-t border-brand-gold/15 text-center text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <SectionHeading
            lightText={true}
            className="!mb-0"
            badgeText="СПЕЦИФИЧНИ КАЗУСИ"
            title="Не виждате услугата, от която се нуждаете?"
            subtitle="Извършваме специфични консултации за нетипични обекти, съдействаме при жалби и помагаме за решаване на сложни казуси с държавните органи."
          />
          <div className="pt-2">
            <Link
              href={`/contact?service=${encodeURIComponent("Безплатен първоначален одит")}`}
              className="inline-flex items-center px-8 py-3.5 bg-brand-gold hover:bg-brand-gold-light text-brand-dark font-bold text-xs uppercase tracking-widest transition-colors rounded shadow-lg"
            >
              Свържете се за безплатен одит
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
