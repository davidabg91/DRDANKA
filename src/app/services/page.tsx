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
  ChevronRight,
  Sparkles,
  TrendingUp
} from "lucide-react";
import SectionHeading from "@/components/SectionHeading";

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
    <div className="bg-brand-light">
      {/* Page Header */}
      <section className="bg-brand-green py-20 text-center relative overflow-hidden border-b border-brand-gold/15">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-gold/5 via-transparent to-transparent opacity-75 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
          <span className="text-xs font-bold uppercase text-brand-gold tracking-widest block">
            КАКВО ПРЕДЛАГАМЕ
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Професионални Услуги по Безопасност на Храните
          </h1>
          <p className="text-sm sm:text-base text-white/80 max-w-2xl mx-auto leading-relaxed">
            Изберете индивидуални консултации, проектиране или актуализация на Вашите системи за самоконтрол. 27 години опит в сътрудничество с БАБХ.
          </p>
        </div>
      </section>

      {/* VIP SYSTEM SECTION */}
      <section className="py-16 bg-white border-b border-brand-green/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#FBF5E6] via-[#F2DFAC] to-[#DCBF7A] border border-brand-gold rounded-[2.5rem] shadow-2xl relative overflow-hidden text-brand-dark p-8 sm:p-12 lg:p-16">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/30 rounded-full blur-3xl -z-10 pointer-events-none translate-x-24 -translate-y-24" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-green/10 rounded-full blur-3xl -z-10 pointer-events-none -translate-x-24 translate-y-24" />

            <div className="text-center max-w-4xl mx-auto space-y-6 mb-16">
              <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest bg-brand-green text-white px-4 py-2 rounded-full shadow-md animate-pulse">
                <Sparkles className="h-4 w-4 text-brand-gold" /> Премиум Услуга
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-green leading-tight">
                ВИП Абонаментна Система <br className="hidden sm:block" />
                <span className="text-brand-dark">„Дигитално Спокойствие“</span>
              </h2>
              <p className="text-lg sm:text-xl font-medium text-brand-dark/90 italic">
                Пълно дигитално управление на безопасността на храните във Вашия обект
              </p>
              <div className="text-sm sm:text-base text-brand-dark/80 leading-relaxed space-y-4 max-w-3xl mx-auto">
                <p>
                  <strong>Забравете за претрупаните папки, изгубените дневници и постоянния страх от проверки.</strong><br />
                  С ВИП Абонаментна Система „Дигитално Спокойствие“ получавате иновативно дигитално решение за управление на безопасността на храните, което автоматизира ежедневните процеси, поддържа обекта Ви в нормативно съответствие и Ви осигурява директна връзка с д-р Данка Николова.
                </p>
                <p>
                  Системата е създадена специално за производители и търговци на храни, които искат спокойствие, сигурност и професионална защита на бизнеса си.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
              <div className="space-y-8">
                <h3 className="font-serif text-2xl font-bold text-brand-green mb-6 border-b border-brand-green/10 pb-4">Какво получавате?</h3>
                
                <div className="bg-white/60 p-6 rounded-2xl border border-white shadow-sm space-y-3">
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
                </div>

                <div className="bg-white/60 p-6 rounded-2xl border border-white shadow-sm space-y-3">
                  <h4 className="font-bold flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-brand-green" /> 24/7 връзка с д-р Николова</h4>
                  <p className="text-sm text-brand-dark/80">Получавате постоянен директен чат и експертни консултации при:</p>
                  <div className="flex flex-wrap gap-2">
                    {["Изненадващи проверки", "Предписания от БАБХ", "Извънредни ситуации", "Въпроси по безопасност"].map(i => (
                      <span key={i} className="text-[10px] uppercase tracking-wider font-bold bg-white px-2 py-1 rounded-md border border-brand-green/10 text-brand-dark/80">{i}</span>
                    ))}
                  </div>
                </div>

                <div className="bg-white/60 p-6 rounded-2xl border border-white shadow-sm space-y-3">
                  <h4 className="font-bold flex items-center gap-2"><ListTodo className="h-5 w-5 text-brand-green" /> Защита при проверки и актове</h4>
                  <p className="text-sm text-brand-dark/80">Приоритетно съдействие и експертна подкрепа при:</p>
                  <div className="flex flex-wrap gap-2">
                    {["Предписания", "Актове", "Несъответствия", "Писмени становища", "Комуникация с органи"].map(i => (
                      <span key={i} className="text-[10px] uppercase tracking-wider font-bold bg-white px-2 py-1 rounded-md border border-brand-green/10 text-brand-dark/80">{i}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-white/60 p-6 rounded-2xl border border-white shadow-sm space-y-3 mt-0 lg:mt-[5.5rem]">
                  <h4 className="font-bold flex items-center gap-2"><FileText className="h-5 w-5 text-brand-green" /> Интелигентен генератор на етикети</h4>
                  <p className="text-sm text-brand-dark/80">Системата автоматично генерира легални етикети за отворени продукти с автоматично изчисляване на срокове, следене на годност и проследимост.</p>
                </div>

                <div className="bg-white/60 p-6 rounded-2xl border border-white shadow-sm space-y-3">
                  <h4 className="font-bold flex items-center gap-2"><BookOpen className="h-5 w-5 text-brand-green" /> Дигитално обучение на персонала</h4>
                  <p className="text-sm text-brand-dark/80">Онлайн обучение по безопасност на храните и хигиенни практики с интерактивни тестове, дигитални сертификати и автоматично проследяване.</p>
                </div>

                <div className="bg-white/60 p-6 rounded-2xl border border-white shadow-sm space-y-3">
                  <h4 className="font-bold flex items-center gap-2"><Layers className="h-5 w-5 text-brand-green" /> Автоматични актуализации</h4>
                  <p className="text-sm text-brand-dark/80">При промяна на меню, персонал, процеси или закони — системата автоматично актуализира необходимите НАССР и ДПХП документи.</p>
                </div>

                <div className="mt-10 p-6 sm:p-8 bg-brand-green text-white rounded-2xl shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/20 rounded-full blur-2xl pointer-events-none translate-x-10 -translate-y-10" />
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
                  Кандидатствай за Абонамент
                </Link>
                <p className="text-[10px] text-brand-dark/50 text-center italic leading-relaxed mt-4">
                  * Броят на местата е ограничен, за да гарантираме индивидуално внимание и качествено обслужване на всеки клиент.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-brand-light">
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
                        Кандидатствай за Абонамент
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
