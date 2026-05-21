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
  Sparkles
} from "lucide-react";


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
    title: "ВИП Абонаментна Система „Дигитално Спокойствие“",
    badge: "Премиум ВИП Услуга",
    icon: Sparkles,
    desc: "Пълно дигитално управление на безопасността на храните във Вашия обект. Заменяме всички хартиени папки и досадни дневници с иновативна, автоматизирана платформа. Вие получавате пълно нормативно съответствие и директна денонощна връзка с д-р Данка Николова.",
    scope: [
      "Автоматизирано попълване на ежедневните БАБХ дневници (температурен режим, хигиенно състояние, ДДД и входящ контрол) с едно кликване",
      "Постоянен 24/7 директен чат и консултации с д-р Данка Николова при извънредни казуси или изненадващи проверки",
      "Вграден генератор на легални БАБХ етикети за отворени продукти с автоматично изчисляване и следене на сроковете за годност",
      "Приоритетно изготвяне на писмени становища и пълна защита на бизнеса Ви при съставени предписания или актове от БАБХ",
      "Дигитално обучение за персонала по хигиенни норми с интерактивни тестове и автоматично издаване на валидни сертификати",
      "Автоматична софтуерна актуализация на НАССР плановете при промяна на меню, персонал, асортимент или държавни закони",
    ],
    benefits: "Спестява над 45 часа документална работа месечно, премахва риска от човешка грешка и гарантира 100% защита от глоби.",
    isVip: true,
  },
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

      {/* Services Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                    : "bg-white border-brand-green/5 text-brand-dark shadow-lg shadow-brand-green/5 hover:border-brand-gold/30 hover:shadow-xl"
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
                  <div className={`p-3.5 rounded border text-xs flex items-start ${
                    isVip 
                      ? "bg-white/50 border-brand-green/10 text-brand-green" 
                      : "bg-brand-light border-brand-green/5 text-brand-green"
                  }`}>
                    <span className="font-bold mr-1.5 shrink-0">Полза за бизнеса:</span>
                    <span className={isVip ? "text-brand-dark/90" : "text-brand-dark/80"}>{srv.benefits}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <Link
                      href={isVip ? "/profile" : "/consultations"}
                      className="w-full sm:w-auto text-center px-8 py-3.5 text-xs font-bold uppercase tracking-wider rounded transition-colors cursor-pointer bg-brand-green text-white hover:bg-brand-green/90 shadow-md"
                    >
                      {isVip ? "Влез в Абонамента" : "Заяви Консултация"}
                    </Link>
                    <Link
                      href={`/contact?service=${encodeURIComponent(srv.title)}`}
                      className={`text-xs font-bold tracking-wide uppercase transition-colors flex items-center ${
                        isVip ? "text-brand-green hover:text-brand-green/80" : "text-brand-gold hover:text-brand-gold-dark"
                      }`}
                    >
                      Попитай за оферта
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Secondary CTA section */}
      <section className="bg-brand-green py-16 border-t border-brand-gold/15 text-center text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="font-serif text-2xl sm:text-4xl font-bold">Не виждате услугата, от която се нуждаете?</h2>
          <p className="text-sm text-white/80 max-w-xl mx-auto leading-relaxed">
            Извършваме специфични консултации за нетипични обекти, съдействаме при жалби и помагаме за решаване на сложни казуси с държавните органи.
          </p>
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
