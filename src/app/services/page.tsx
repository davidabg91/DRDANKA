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
  ChevronRight
} from "lucide-react";


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
            return (
              <div
                key={index}
                className="bg-white border border-brand-green/5 rounded-2xl p-6 sm:p-10 shadow-lg shadow-brand-green/5 hover:border-brand-gold/30 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top row */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="bg-brand-green/5 p-3 rounded-lg border border-brand-green/10 text-brand-green">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold border border-brand-gold/20 px-2.5 py-1 rounded bg-brand-gold/5">
                      {srv.badge}
                    </span>
                  </div>

                  {/* Title and description */}
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-brand-green mb-4">
                    {srv.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-brand-dark/70 leading-relaxed mb-6">
                    {srv.desc}
                  </p>

                  {/* Scope / list */}
                  <div className="mb-6">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-brand-dark mb-3">
                      Обхват на услугата:
                    </h3>
                    <ul className="space-y-2.5">
                      {srv.scope.map((item, idx) => (
                        <li key={idx} className="flex items-start text-xs text-brand-dark/80">
                          <Check className="h-4 w-4 text-brand-gold mr-2.5 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom section (benefit + CTA) */}
                <div className="border-t border-brand-green/5 pt-6 mt-6 space-y-5">
                  <div className="bg-brand-light p-3 rounded border border-brand-green/5 text-xs text-brand-green flex items-start">
                    <span className="font-bold mr-1">Полза за бизнеса:</span>
                    <span className="text-brand-dark/80">{srv.benefits}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <Link
                      href="/consultations"
                      className="w-full sm:w-auto text-center px-6 py-3 bg-brand-green text-white text-xs font-bold uppercase tracking-wider rounded hover:bg-brand-green/90 transition-colors cursor-pointer"
                    >
                      Заяви Консултация
                    </Link>
                    <Link
                      href="/contact"
                      className="text-xs font-bold text-brand-gold hover:text-brand-gold-dark tracking-wide uppercase transition-colors flex items-center"
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
              href="/contact"
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
