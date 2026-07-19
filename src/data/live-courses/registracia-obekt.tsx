import Link from "next/link";
import {
  Calendar, Users, Award, CheckCircle, XCircle, HelpCircle, MessageSquare,
  BookOpen, Gift, ShieldCheck, AlertTriangle, FileCheck, Landmark, Building2,
} from "lucide-react";
import type { LiveCourse } from "./types";

/**
 * "ПАКЕТ 3 — От идея до регистрация" (документ
 * „пакет 3 регистрация на обект.docx")
 *
 * Live обучение с д-р Данка Николова. Записване през общата опашка
 * (/enrollments) + плащане по банков път, като другите live обучения.
 */

const MODULES = [
  {
    n: "01",
    title: "Какъв вид хранителен обект трябва да регистрирате?",
    items: ["Производство", "Магазин", "Склад", "Заведение", "Онлайн търговия", "Кетъринг", "Вендинг", "Домашно производство"],
  },
  {
    n: "02",
    title: "Избор на подходящ обект",
    items: [
      "Изисквания към сградния фонд", "Производствени помещения", "Настилки, стени, тавани",
      "Осветление и вентилация", "Водоснабдяване и канализация", "Санитарно-битови помещения",
      "Потоци на суровини, персонал и отпадъци", "Как да избегнете скъпоструващи ремонти",
    ],
  },
  {
    n: "03",
    title: "Документи за регистрацията",
    items: ["Заявления", "Декларации", "Приложения", "Договори", "Други задължителни документи", "Как правилно да комплектовате документацията"],
  },
  {
    n: "04",
    title: "Документация по безопасност на храните",
    items: ["Кога се изисква НАССР", "Кога се прилагат ДПХП", "Проследимост", "Етикетиране", "Обучение на персонала"],
  },
  {
    n: "05",
    title: "Проверката от ОДБХ",
    items: ["Как протича регистрацията", "Какво проверява инспекторът", "Най-честите причини за отказ", "Как да ги избегнете"],
  },
  {
    n: "06",
    title: "След регистрацията",
    items: ["Какви записи трябва да водите", "Какви са задълженията ви", "Как да поддържате документацията", "Как да избегнете бъдещи санкции"],
  },
];

function RegistraciaObektPage() {
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
              Най-скъпата грешка не е отказът за регистрация. Най-скъпата грешка е да вложите средства в неподходящ
              обект и едва след това да разберете, че трябва да започнете всичко отначало.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm text-white/85">
              {[
                "Наемане на неподходящ обект",
                "Скъпи ремонти, които после се оказват ненужни",
                "Закупуване на неподходящо оборудване",
                "Документация, несъответстваща на дейността",
                "Непълен комплект документи",
                "Забавяне на регистрацията с месеци",
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
          { Icon: Calendar, title: "Еднодневно обучение", desc: "Практически фокус — от избора на обект до първата проверка." },
          { Icon: Users, title: "Малка група", desc: "Всеки участник задава въпроси за своя бъдещ обект." },
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
          След обучението ще можете
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-brand-dark/80">
          {[
            "Да определите кой ред за регистрация е приложим за обекта Ви",
            "Да изберете подходящо помещение още преди да инвестирате",
            "Да знаете изискванията към сградния фонд",
            "Да подготвите необходимите документи",
            "Да организирате правилно регистрацията",
            "Да избегнете най-честите грешки",
            "Да преминете уверено през проверката от ОДБХ",
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
            "Чеклист „Всички документи, необходими за регистрация на хранителен обект“",
            "Авторски шаблони — заявления, декларации, примерни документи",
            "Авторски сертификат след успешно преминат финален тест",
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
            <div className="font-serif text-4xl font-black text-brand-green mt-1">99 €</div>
          </div>
          <div className="rounded-2xl border border-brand-green/10 bg-brand-light/40 p-5 text-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-dark/50">Редовна цена</span>
            <div className="font-serif text-4xl font-black text-brand-dark/70 mt-1">129 €</div>
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
          Основание за превод: „Обучение – Регистрация на хранителен обект“. Данните за банковата сметка се показват
          след като изпратите заявката за записване.
        </p>
      </section>

      {/* Сертификат */}
      <section className="bg-white rounded-3xl border border-brand-green/5 p-6 sm:p-8 flex items-start gap-4">
        <FileCheck className="h-8 w-8 text-brand-gold shrink-0" />
        <div className="space-y-1">
          <p className="font-bold text-brand-green">Авторски сертификат</p>
          <p className="text-sm text-brand-dark/70 leading-relaxed">
            След успешно положен финален тест получавате авторски сертификат за преминато обучение. Най-важното обаче
            са практическите знания, които ще Ви помогнат да направите информиран старт на хранителния си бизнес.
          </p>
        </div>
      </section>

      {/* За кого */}
      <section className="space-y-4">
        <h2 className="font-serif text-xl font-bold text-brand-green">Подходящо за:</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            "Производители на храни",
            "Магазини",
            "Заведения",
            "Складове",
            "Онлайн търговци",
            "Домашни производства",
            "Стартиращи хранителни предприятия",
            "Всеки, който предстои да регистрира хранителен обект",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-brand-dark/80 bg-white rounded-xl border border-brand-green/5 p-3">
              <Building2 className="h-4 w-4 text-brand-gold shrink-0 mt-0.5" />
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

export const registraciaObekt: LiveCourse = {
  slug: "registracia-obekt",
  title: "От идея до регистрация — всичко преди да инвестирате в хранителен бизнес",
  tagline:
    "Еднодневно практическо обучение: избор на обект, изисквания към сградния фонд, документи и проверката от ОДБХ.",
  priceEur: 99.0,
  originalPriceEur: 129.0,
  platform: "zoom",
  hasCertificate: true,
  format: "1 ден — практически модули",
  groupSize: "Малка група, ограничени места",
  nextBatch: "Дата: обявява се при сформиране на група · ранно записване 99 €",
  highlights: [
    "6 модула — от избора на обект до проверката от ОДБХ",
    "Как да избегнете скъпоструващи ремонти и грешен избор на обект",
    "Бонус: 2 чеклиста + авторски шаблони за регистрация",
  ],
  card: {
    badge: "Пакет 3",
    accent: "gold",
    icon: Building2,
  },
  page: RegistraciaObektPage,
  metaDescription:
    "Еднодневно практическо live обучение „От идея до регистрация“ с д-р Данка Николова. Избор на обект, документи, проверка от ОДБХ, авторски сертификат.",
};
