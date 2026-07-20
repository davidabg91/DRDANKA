import Link from "next/link";
import {
  Calendar, Users, Award, CheckCircle, XCircle, MessageSquare,
  BookOpen, Gift, ShieldCheck, AlertTriangle, FileCheck, Landmark, Sprout,
} from "lucide-react";
import type { LiveCourse } from "./types";

/**
 * "ПАКЕТ 4 — Как да стартирам производство по Наредба № 26"
 * (документ „пакет4 наредба 26.docx")
 *
 * Live обучение с д-р Данка Николова. Записване през общата опашка
 * (/enrollments) + плащане по банков път, като другите live обучения.
 */

const MODULES = [
  {
    n: "01",
    title: "Законодателството",
    items: [
      "Какво представлява Наредба № 26",
      "Кой може да произвежда по Наредба № 26",
      "Какви продукти могат да се произвеждат",
      "Ограничения",
      "Права и задължения",
    ],
  },
  {
    n: "02",
    title: "Сграден фонд",
    items: [
      "Изисквания към помещенията",
      "Производствени, складови и хладилни помещения",
      "Санитарно-битови помещения",
      "Производствени потоци",
      "Осветление, вентилация, водоснабдяване, канализация",
      "Настилки, стени, тавани",
    ],
  },
  {
    n: "03",
    title: "Производствено оборудване",
    items: [
      "Какво оборудване е необходимо",
      "Какво оборудване не е необходимо",
      "Най-често допусканите грешки",
      "Как да избегнете ненужни инвестиции",
    ],
  },
  {
    n: "04",
    title: "Документацията",
    items: [
      "Регистрация и необходими документи",
      "ДПХП и НАССР",
      "Проследимост и етикетиране",
      "Самоконтрол и входящ контрол",
      "Задължителни записи",
    ],
  },
  {
    n: "05",
    title: "Проверката",
    items: [
      "Как протича регистрацията",
      "Какво проверяват инспекторите",
      "Най-честите несъответствия",
      "Как да избегнете отказ и да преминете спокойно",
    ],
  },
  {
    n: "06",
    title: "След регистрацията",
    items: [
      "Какви записи се водят",
      "Какви са ежедневните задължения",
      "Как да поддържате документацията",
      "Как да се подготвяте за бъдещи проверки",
    ],
  },
];

function Naredba26Page() {
  return (
    <div className="space-y-10">
      {/* Hook — цената на грешната инвестиция */}
      <section className="bg-gradient-to-br from-brand-green/95 to-brand-green text-white rounded-3xl p-6 sm:p-10 shadow-lg">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-gold text-brand-dark flex items-center justify-center shrink-0 shadow-md">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="space-y-3">
            <h2 className="font-serif text-2xl font-bold">Една грешна инвестиция може да Ви струва хиляди евро</h2>
            <p className="text-sm text-white/80 leading-relaxed">
              Най-скъпата грешка не е отказът за регистрация. Най-скъпата грешка е да разберете, че обектът не отговаря
              на изискванията, след като вече сте инвестирали време и средства.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm text-white/85">
              {[
                "Ремонт на неподходящи помещения",
                "Закупуване на ненужно оборудване",
                "Неправилен технологичен поток",
                "Неподходяща документация",
                "Предписания още при първата проверка",
                "Влагане на средства два пъти за едно и също",
              ].map((r) => (
                <li key={r} className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-brand-gold shrink-0 mt-0.5" /> {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Формат */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { Icon: Calendar, title: "Еднодневно обучение", desc: "Практически фокус — от идеята до успешната регистрация." },
          { Icon: Users, title: "Малка група", desc: "Всеки участник обсъжда своя бъдещ обект и получава насоки." },
          { Icon: Award, title: "Авторски сертификат", desc: "След успешно положен финален тест." },
        ].map(({ Icon, title, desc }) => (
          <div key={title} className="bg-white rounded-2xl border border-brand-green/5 p-5 space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-brand-gold/10 text-brand-gold flex items-center justify-center">
              <Icon className="h-5 w-5" />
            </div>
            <p className="font-bold text-brand-green text-sm">{title}</p>
            <p className="text-xs text-brand-dark/60 leading-relaxed">{desc}</p>
          </div>
        ))}
      </section>

      {/* След обучението */}
      <section className="bg-white rounded-3xl border border-brand-green/5 p-6 sm:p-10 space-y-4">
        <h2 className="font-serif text-xl font-bold text-brand-green flex items-center gap-3">
          <span className="w-10 h-10 rounded-2xl bg-brand-gold/10 text-brand-gold flex items-center justify-center"><ShieldCheck className="h-5 w-5" /></span>
          След обучението ще знаете
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-brand-dark/80">
          {[
            "Как да изберете правилния обект",
            "Какви са изискванията към сградния фонд",
            "Какви помещения са необходими",
            "Как да организирате технологичния поток",
            "Какво оборудване е необходимо (и какво не)",
            "Какви документи трябва да подготвите",
            "Кога се разработва НАССР и кога се прилагат ДПХП",
            "Какво реално проверяват инспекторите",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-brand-gold shrink-0 mt-0.5" /> {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Програма — 6 модула */}
      <section className="space-y-5">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-green flex items-center gap-3">
          <span className="w-10 h-10 rounded-2xl bg-brand-gold/10 text-brand-gold flex items-center justify-center"><BookOpen className="h-5 w-5" /></span>
          Програма на обучението — 6 модула
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {MODULES.map((m) => (
            <div key={m.n} className="bg-white rounded-2xl border border-brand-green/5 p-6 hover:border-brand-gold/40 hover:shadow-md transition-all duration-300 space-y-3">
              <div className="flex items-start gap-3">
                <span className="font-serif text-3xl font-bold text-brand-gold/60 shrink-0 leading-none">{m.n}</span>
                <h3 className="font-serif text-base font-bold text-brand-green leading-snug pt-1">{m.title}</h3>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm text-brand-dark/75">
                {m.items.map((it) => (
                  <li key={it} className="flex items-start gap-2"><CheckCircle className="h-3.5 w-3.5 text-brand-gold shrink-0 mt-0.5" /> {it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Бонуси */}
      <section className="bg-gradient-to-br from-brand-gold/15 to-brand-gold/5 border border-brand-gold/30 rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="font-serif text-xl font-bold text-brand-green flex items-center gap-2">
          <Gift className="h-5 w-5 text-brand-gold" /> Бонуси за участниците
        </h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          {[
            "Чеклист „Готов ли е моят обект за регистрация?“",
            "Чеклист „Всички документи по Наредба № 26“",
            "Чеклист „Самопроверка преди посещение на БАБХ“",
            "Образци на заявления и декларации",
            "Практически материали",
            "Авторски сертификат след успешно положен финален тест",
          ].map((x) => (
            <li key={x} className="bg-white rounded-2xl border border-brand-gold/20 p-4 flex items-start gap-2 text-brand-dark/80">
              <Gift className="h-4 w-4 text-brand-gold shrink-0 mt-0.5" /> {x}
            </li>
          ))}
        </ul>
      </section>

      {/* Цени + записване */}
      <section className="bg-white rounded-3xl border border-brand-green/5 p-6 sm:p-10 space-y-4">
        <h2 className="font-serif text-xl font-bold text-brand-green">Цени и записване</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border-2 border-brand-gold bg-brand-gold/5 p-5 text-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-gold-dark">Ранно записване</span>
            <div className="font-serif text-4xl font-black text-brand-green mt-1">149 €</div>
          </div>
          <div className="rounded-2xl border border-brand-green/10 bg-brand-light/40 p-5 text-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-dark/50">Редовна цена</span>
            <div className="font-serif text-4xl font-black text-brand-dark/70 mt-1">199 €</div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm pt-2">
          {[
            ["1.", "Записвате се сега", "Попълвате име, email и телефон и получавате данните за банков превод."],
            ["2.", "Плащате по банков път", "Мястото се счита за резервирано след постъпване на плащането (местата са ограничени)."],
            ["3.", "Потвърждение от д-р Николова", "Веднага след като плащането постъпи, д-р Данка Николова се свързва с Вас за детайлите."],
          ].map(([n, title, desc]) => (
            <div key={n} className="space-y-1">
              <span className="font-serif text-2xl font-bold text-brand-gold">{n}</span>
              <p className="font-bold text-brand-green text-sm">{title}</p>
              <p className="text-xs text-brand-dark/60 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
        <p className="flex items-start gap-2 text-xs text-brand-dark/60 bg-brand-green/5 rounded-xl p-3 border border-brand-green/10">
          <Landmark className="h-4 w-4 text-brand-gold shrink-0 mt-0.5" />
          Основание за превод: „Обучение Наредба № 26“. Данните за банковата сметка се показват след като изпратите
          заявката за записване.
        </p>
      </section>

      {/* Сертификат */}
      <section className="bg-white rounded-3xl border border-brand-green/5 p-6 sm:p-8 flex items-start gap-4">
        <FileCheck className="h-8 w-8 text-brand-gold shrink-0" />
        <div className="space-y-1">
          <p className="font-bold text-brand-green">Авторски сертификат</p>
          <p className="text-sm text-brand-dark/70 leading-relaxed">
            След успешно положен финален тест получавате авторски сертификат за преминато обучение. Най-важното обаче
            са практическите знания, които ще Ви помогнат да направите законен и информиран старт на производството си.
          </p>
        </div>
      </section>

      {/* За кого */}
      <section className="space-y-4">
        <h2 className="font-serif text-xl font-bold text-brand-green">Подходящо за:</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            "Малки производители",
            "Земеделски стопани и фермери",
            "Производители на млечни продукти",
            "Производители на месни продукти",
            "Производители на яйца и риба",
            "Производители на пчелни продукти",
            "Производители на традиционни храни",
            "Всеки, който иска законно да произвежда по Наредба № 26",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-brand-dark/80 bg-white rounded-xl border border-brand-green/5 p-3">
              <Sprout className="h-4 w-4 text-brand-gold shrink-0 mt-0.5" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <p className="text-center text-xs text-brand-dark/50">
        Имате въпрос преди записване?{" "}
        <Link href="/contact" className="text-brand-gold hover:underline font-bold">
          Пишете на д-р Николова <MessageSquare className="h-3 w-3 inline" />
        </Link>
      </p>
    </div>
  );
}

export const naredba26: LiveCourse = {
  slug: "naredba-26",
  title: "Как да стартирам производство по Наредба № 26",
  tagline:
    "Еднодневно практическо обучение — от идеята до успешната регистрация: сграден фонд, оборудване, документация и проверката на БАБХ.",
  priceEur: 149.0,
  originalPriceEur: 199.0,
  platform: "zoom",
  hasCertificate: true,
  format: "1 ден — 6 практически модула",
  groupSize: "Малка група, ограничени места",
  nextBatch: "Дата: обявява се при сформиране на група · ранно записване 149 €",
  highlights: [
    "6 модула — от сградния фонд до проверката на БАБХ",
    "Какво оборудване е нужно и как да избегнете ненужни инвестиции",
    "Бонус: 3 чеклиста + образци на заявления и декларации",
  ],
  card: {
    badge: "Пакет 4",
    accent: "gold",
    icon: Sprout,
  },
  page: Naredba26Page,
  metaDescription:
    "Еднодневно практическо live обучение „Как да стартирам производство по Наредба № 26“ с д-р Данка Николова. Сграден фонд, оборудване, документи, регистрация, авторски сертификат.",
};
