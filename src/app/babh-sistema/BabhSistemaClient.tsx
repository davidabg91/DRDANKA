import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  Camera,
  CalendarClock,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Printer,
  ShieldCheck,
  Smartphone,
  Store,
  Tag,
  Thermometer,
  Users,
  XCircle,
  Zap,
} from "lucide-react";
import { PLANS, PLAN_BY_ID, TRIAL_PLAN, planDelta } from "@/lib/plans";
import { AUTHOR } from "@/lib/siteConfig";
import PlanHelpButton from "@/components/PlanHelpButton";
import { DailyTicksIcon, ShopRegisterIcon } from "./icons";
import { BABH_FAQ } from "./babhFaq";

/* ------------------------------------------------------------------ */
/*  Съдържание                                                         */
/* ------------------------------------------------------------------ */

const PAINS = [
  {
    pain: "„Не знам кои дневници ми трябват.“",
    relief: "Системата ги подбира сама според Вашия обект.",
  },
  {
    pain: "„Забравям да попълвам всеки ден.“",
    relief: "Всяка сутрин виждате кратък списък какво остава.",
  },
  {
    pain: "„Страх ме е от проверка на БАБХ.“",
    relief: "Всичко е подредено и се печата с един бутон.",
  },
];

const STEPS = [
  {
    icon: Store,
    title: "Казвате ни какъв е обектът",
    text: "Магазин, заведение, месарница… и какви уреди имате — хладилници, фурна, фритюрник. Отнема 2 минути.",
  },
  {
    icon: Bell,
    title: "Всеки ден системата Ви казва какво да попълните",
    text: "Кратък списък „Днес попълнете“. Натискате, потвърждавате — и точката става зелена.",
  },
  {
    icon: ShieldCheck,
    title: "При проверка сте спокойни",
    text: "Показвате дневниците от телефона или ги печатате на А4 — подредени и подписани.",
  },
];

const AUTOMATIONS = [
  {
    icon: ShopRegisterIcon,
    title: "Подбира Вашите дневници",
    text: "Показва само това, което се отнася за Вашия обект. Не се лутате между ненужни бланки.",
  },
  {
    icon: ClipboardList,
    title: "Казва какво да направите днес",
    text: "Ясен списък всяка сутрин. Ако нещо липсва — системата Ви го показва и Ви отвежда там с едно натискане.",
  },
  {
    icon: DailyTicksIcon,
    title: "Попълва рутинното автоматично",
    text: "Температури, хигиена, чек-листи — сложете отметка и се попълват сами всеки работен ден.",
  },
  {
    icon: Camera,
    title: "Снимате фактурата — готово",
    text: "Изкуственият интелект чете документа от доставчика и попълва входящия контрол вместо Вас.",
  },
  {
    icon: CalendarClock,
    title: "Следи сроковете",
    text: "Здравни книжки, договор за ДДД и други договори — напомня 30 дни преди да изтекат.",
  },
  {
    icon: Thermometer,
    title: "Предупреждава при проблем",
    text: "Температура извън нормата светва в червено веднага — знаете какво да коригирате.",
  },
  {
    icon: Tag,
    title: "Етикети за срок на годност",
    text: "Принтирате етикет с дата на приготвяне и до кога е годна храната — без смятане.",
  },
  {
    icon: Printer,
    title: "Готово за БАБХ с един бутон",
    text: "Всички дневници на А4, в официален вид и с Вашия електронен подпис.",
  },
];

const REGISTER_GROUPS = [
  {
    title: "За всеки обект",
    items: [
      "Входящ контрол",
      "Списък на доставчиците",
      "Температури на хладилници и фризери",
      "Хигиена преди работа",
      "Почистване и дезинфекция",
      "Лична хигиена на персонала",
      "Здравни книжки",
      "Обучение на персонала",
      "Култура по безопасност на храните",
      "Брак",
      "ДДД обработки",
      "Договори и срокове",
    ],
  },
  {
    title: "Ако имате топла точка",
    items: ["Скара и печене", "Готвени ястия", "Пържилна мазнина", "Топла и студена витрина", "Меню с алергени", "Партидни карти"],
  },
  {
    title: "Ако работите с месо",
    items: ["Месни заготовки", "Дефростация", "Разфасовка", "Стерилизатор за ножове"],
  },
];

/** Примерен месец (септември 2026, започва във вторник): неделите са почивни, 12-ти има пропуск. */
const CAL_LEAD = 1;
const CAL = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1;
  const weekday = (CAL_LEAD + i) % 7; // 0 = понеделник … 6 = неделя
  return { day, s: weekday === 6 ? "p" : day === 12 ? "r" : "g" };
});
const CAL_WORK = CAL.filter((c) => c.s !== "p").length;

/* ------------------------------------------------------------------ */

export default function BabhSistemaClient() {
  return (
    <div className="bg-white text-brand-dark font-sans overflow-x-hidden">
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative bg-gradient-to-br from-[#0A2318] via-brand-green to-[#0D2B1C] text-white overflow-hidden">
        <div className="absolute -top-32 -right-24 w-[32rem] h-[32rem] bg-brand-gold/15 rounded-full blur-[110px] pointer-events-none" />
        <div className="absolute -bottom-40 -left-24 w-[28rem] h-[28rem] bg-emerald-400/10 rounded-full blur-[110px] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] bg-white/10 border border-white/15 text-brand-gold px-3.5 py-1.5 rounded-full">
              <Zap className="h-3.5 w-3.5" fill="currentColor" /> Електронни дневници по самоконтрол
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight">
              Дневниците за БАБХ —{" "}
              <span className="bg-gradient-to-r from-brand-gold via-yellow-200 to-brand-gold bg-clip-text text-transparent">
                без главоболие.
              </span>
            </h1>
            <p className="text-base sm:text-lg text-white/80 leading-relaxed max-w-xl">
              Не е нужно да сте специалист. Системата знае кои дневници са нужни за Вашия обект, всеки ден Ви казва какво да попълните и пази всичко подредено за проверка.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <Link
                href="/profile"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-brand-gold hover:bg-brand-gold-light text-brand-dark font-black text-sm uppercase tracking-wider shadow-[0_10px_30px_rgba(212,175,55,0.35)] hover:-translate-y-0.5 transition-all"
              >
                Опитайте 14 дни безплатно <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#paketi"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-sm uppercase tracking-wider transition-all"
              >
                Вижте пакетите
              </a>
            </div>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/70">
              {["14 дни безплатно", "Без банкова карта", "Работи на телефон"].map((t) => (
                <li key={t} className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-brand-gold" /> {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Телефон: „Днес попълнете“ */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-[340px] rounded-[2.2rem] bg-[#0B1F17] border border-white/15 p-3 shadow-2xl shadow-black/40">
              <div className="rounded-[1.7rem] bg-white text-brand-dark p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] text-brand-dark/50">Добро утро!</p>
                    <p className="font-serif text-lg font-bold text-brand-green leading-tight">Днес попълнете:</p>
                  </div>
                  <span className="grid place-items-center h-10 w-10 rounded-full bg-brand-gold/15 text-brand-gold-dark">
                    <Bell className="h-5 w-5" />
                  </span>
                </div>
                {[
                  { t: "Температури", s: "2 хладилника, 1 фризер", done: true, icon: Thermometer },
                  { t: "Хигиена преди работа", s: "Зала, склад, санитарен възел", done: true, icon: ClipboardList },
                  { t: "Лична хигиена", s: "3 служители", done: false, icon: Users },
                ].map((x) => (
                  <div
                    key={x.t}
                    className={`flex items-center gap-3 rounded-2xl border p-3 ${x.done ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200"}`}
                  >
                    <x.icon className={`h-5 w-5 shrink-0 ${x.done ? "text-emerald-600" : "text-amber-600"}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold leading-tight">{x.t}</p>
                      <p className="text-[11px] text-brand-dark/55 truncate">{x.s}</p>
                    </div>
                    {x.done ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                    ) : (
                      <span className="text-[10px] font-black uppercase bg-amber-500 text-white px-2 py-1 rounded-lg">Попълни</span>
                    )}
                  </div>
                ))}
                <div>
                  <div className="flex justify-between text-[11px] font-bold text-brand-dark/60 mb-1.5">
                    <span>Готово за днес</span>
                    <span>2 от 3</span>
                  </div>
                  <div className="h-2 rounded-full bg-brand-green/10 overflow-hidden">
                    <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-emerald-500 to-brand-green" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ ЗВУЧИ ЛИ ПОЗНАТО ═══════════════ */}
      <section className="py-16 sm:py-20 bg-brand-light/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <SectionTitle eyebrow="Звучи ли Ви познато?" title="Дневниците не трябва да са Вашата грижа" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PAINS.map((p) => (
              <div key={p.pain} className="bg-white rounded-3xl p-6 shadow-sm ring-1 ring-brand-green/10">
                <p className="flex items-start gap-2 text-brand-dark/60 text-sm italic">
                  <XCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" /> {p.pain}
                </p>
                <div className="h-px bg-brand-green/10 my-4" />
                <p className="flex items-start gap-2 font-bold text-brand-green leading-snug">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" /> {p.relief}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ КАК РАБОТИ ═══════════════ */}
      <section className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <SectionTitle eyebrow="Как работи" title="Три стъпки. Без обучение." />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((s, i) => (
              <div key={s.title} className="relative rounded-3xl bg-gradient-to-b from-brand-green/[0.05] to-transparent ring-1 ring-brand-green/10 p-7">
                <span className="absolute -top-5 left-7 grid place-items-center h-10 w-10 rounded-2xl bg-brand-gold text-brand-dark font-serif text-xl font-black shadow-lg">
                  {i + 1}
                </span>
                <s.icon className="h-8 w-8 text-brand-green mt-3" />
                <h3 className="font-serif text-xl font-bold text-brand-green mt-4 leading-snug">{s.title}</h3>
                <p className="text-sm text-brand-dark/70 leading-relaxed mt-2">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ СИСТЕМАТА МИСЛИ ВМЕСТО ВАС ═══════════════ */}
      <section className="py-16 sm:py-20 bg-[#0A2318] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <SectionTitle
            dark
            eyebrow="Системата мисли вместо Вас"
            title="Сложната част я прави системата"
            text="Вие се грижите за бизнеса си. Кои дневници, кога, как и какво липсва — това е работа на системата."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {AUTOMATIONS.map((a) => (
              <div key={a.title} className="rounded-3xl bg-white/[0.05] border border-white/10 p-6 hover:bg-white/[0.08] hover:border-brand-gold/40 transition-colors">
                <span className="grid place-items-center h-12 w-12 rounded-2xl bg-brand-gold/15 text-brand-gold">
                  <a.icon className="h-6 w-6" />
                </span>
                <h3 className="font-bold text-base mt-4 leading-snug">{a.title}</h3>
                <p className="text-sm text-white/65 leading-relaxed mt-1.5">{a.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ КАЛЕНДАРЪТ ═══════════════ */}
      <section className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <SectionTitle align="left" eyebrow="С един поглед" title="Зелено — всичко е наред. Червено — нещо липсва." />
            <p className="text-base text-brand-dark/70 leading-relaxed">
              Календарът показва целия месец. Натиснете червения ден и системата Ви казва точно какво не е попълнено — и Ви отвежда там.
            </p>
            <ul className="space-y-3">
              {[
                { c: "bg-emerald-500", t: "Всичко за деня е попълнено" },
                { c: "bg-red-500", t: "Има пропуснат запис — вижте кой" },
                { c: "bg-slate-300", t: "Почивен ден — нищо не се попълва" },
              ].map((l) => (
                <li key={l.t} className="flex items-center gap-3 text-sm font-medium">
                  <span className={`h-4 w-4 rounded-md ${l.c}`} /> {l.t}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl ring-1 ring-brand-green/10 shadow-xl p-5 sm:p-6 bg-white max-w-md w-full mx-auto">
            <div className="flex items-center justify-between mb-4">
              <p className="font-serif text-lg font-bold text-brand-green">Септември</p>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-1">
                {CAL_WORK - 1} от {CAL_WORK} дни ✓
              </span>
            </div>
            <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] font-bold text-brand-dark/40 mb-1.5">
              {["П", "В", "С", "Ч", "П", "С", "Н"].map((d, i) => (
                <span key={i}>{d}</span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {Array.from({ length: CAL_LEAD }, (_, i) => (
                <span key={`lead-${i}`} />
              ))}
              {CAL.map(({ day, s }) => (
                <span
                  key={day}
                  className={`aspect-square rounded-lg grid place-items-center text-xs font-bold ${
                    s === "g" ? "bg-emerald-500 text-white" : s === "r" ? "bg-red-500 text-white ring-4 ring-red-200" : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {day}
                </span>
              ))}
            </div>
            <div className="mt-4 flex items-start gap-2.5 rounded-2xl bg-red-50 border border-red-200 p-3">
              <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
              <p className="text-xs text-red-900 leading-snug">
                <strong>12 септември:</strong> липсва чек-листът за почистване и дезинфекция.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ ПРЕДИ / СЕГА ═══════════════ */}
      <section className="py-16 sm:py-20 bg-brand-light/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <SectionTitle eyebrow="Разликата" title="Тетрадки и папки или телефон?" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="rounded-3xl bg-white p-7 ring-1 ring-red-200">
              <p className="font-serif text-lg font-bold text-red-700 mb-4">Без системата</p>
              <ul className="space-y-3 text-sm text-brand-dark/75">
                {[
                  "Купища бланки и папки, които се губят",
                  "Не сте сигурни кои дневници Ви трябват",
                  "Забравени дни и изтекли здравни книжки",
                  "Паника, когато дойде инспектор",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2.5">
                    <XCircle className="h-5 w-5 text-red-400 shrink-0" /> {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl bg-brand-green text-white p-7 shadow-xl">
              <p className="font-serif text-lg font-bold text-brand-gold mb-4">Със системата</p>
              <ul className="space-y-3 text-sm text-white/90">
                {[
                  "Всичко е на едно място — в телефона",
                  "Системата подбира дневниците вместо Вас",
                  "Напомняне за всеки ден и за всеки срок",
                  "Печат на А4 с един бутон при проверка",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-5 w-5 text-brand-gold shrink-0" /> {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ КОИ ДНЕВНИЦИ ═══════════════ */}
      <section id="babh-registers-section" className="py-16 sm:py-20 scroll-mt-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <SectionTitle
            eyebrow="Какво е включено"
            title="Всички дневници по самоконтрол — на едно място"
            text="Не е нужно да ги знаете наизуст. Системата показва само тези, които се отнасят за Вашия обект."
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {REGISTER_GROUPS.map((g) => (
              <div key={g.title} className="rounded-3xl ring-1 ring-brand-green/10 p-6 bg-white">
                <p className="font-serif text-lg font-bold text-brand-green mb-4">{g.title}</p>
                <div className="flex flex-wrap gap-2">
                  {g.items.map((it) => (
                    <span key={it} className="inline-flex items-center gap-1.5 text-xs font-medium bg-brand-light/70 border border-brand-green/10 rounded-full px-3 py-1.5">
                      <Check className="h-3 w-3 text-emerald-600" strokeWidth={3} /> {it}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ ЕКСПЕРТЪТ ═══════════════ */}
      <section className="py-14 bg-brand-light/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-white ring-1 ring-brand-gold/30 p-7 sm:p-9 flex flex-col sm:flex-row gap-6 items-start shadow-sm">
            <span className="grid place-items-center h-16 w-16 rounded-2xl bg-brand-gold/15 text-brand-gold-dark shrink-0">
              <ShieldCheck className="h-8 w-8" />
            </span>
            <div className="space-y-2">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-brand-gold-dark">Създадена от експерт</p>
              <p className="font-serif text-xl sm:text-2xl font-bold text-brand-green leading-snug">
                Системата е изградена от {AUTHOR.name} — с над {AUTHOR.experienceYears} години опит в безопасността на храните.
              </p>
              <p className="text-sm text-brand-dark/70 leading-relaxed">
                Бивш директор на Областна дирекция по безопасност на храните. Знае какво проверява инспекторът — и точно това е заложено в системата. В пакетите „{PLAN_BY_ID.pro.name}“ и „{PLAN_BY_ID.vip.name}“ имате и директна връзка с нея.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ ПАКЕТИ ═══════════════ */}
      <section id="paketi" className="py-16 sm:py-20 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <SectionTitle
            eyebrow="Пакети и цени"
            title="Изберете пакет за Вашия обект"
            text={`Месечен абонамент, плащане по банков път. Започнете с 14 дни безплатно — с възможностите на пакет „${PLAN_BY_ID[TRIAL_PLAN].name}“.`}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 items-stretch">
            {PLANS.map((p) => {
              const delta = planDelta(p.id);
              return (
              <div
                key={p.id}
                className={`flex flex-col rounded-3xl p-6 ${
                  p.featured
                    ? "bg-gradient-to-br from-[#0D2B1C] via-brand-green to-[#0A2318] text-white shadow-2xl shadow-brand-green/25 ring-2 ring-brand-gold xl:-my-3 xl:py-9"
                    : "bg-white ring-1 ring-brand-green/10 shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between gap-2 min-h-[24px]">
                  <span className={`text-[10px] font-black uppercase tracking-[0.15em] ${p.featured ? "text-white/50" : "text-brand-dark/40"}`}>{p.tierLabel}</span>
                  {p.featured && (
                    <span className="text-[9px] font-black uppercase tracking-wider bg-brand-gold text-brand-dark px-2.5 py-1 rounded-full">Препоръчан</span>
                  )}
                </div>
                <h3 className={`font-serif text-2xl font-bold mt-1.5 ${p.featured ? "text-white" : "text-brand-green"}`}>{p.name}</h3>
                <p className={`text-xs leading-relaxed mt-1 ${p.featured ? "text-white/65" : "text-brand-dark/60"}`}>{p.tagline}</p>
                <div className="mt-5 flex items-end gap-1.5">
                  <span className={`font-serif text-5xl font-black tabular-nums leading-none ${p.featured ? "text-white" : "text-brand-dark"}`}>{p.priceEur}</span>
                  <span className="font-serif text-2xl font-bold text-brand-gold leading-none mb-0.5">€</span>
                  <span className={`text-xs mb-1.5 ${p.featured ? "text-white/50" : "text-brand-dark/45"}`}>/ месец</span>
                </div>
                <div className={`h-px my-5 ${p.featured ? "bg-white/10" : "bg-brand-green/10"}`} />
                {delta.base && (
                  <p className={`text-sm font-bold mb-2 ${p.featured ? "text-brand-gold" : "text-brand-green"}`}>
                    Всичко от „{delta.base.name}“, плюс:
                  </p>
                )}
                <ul className={`space-y-2 text-[13px] ${p.featured ? "text-white/85" : "text-brand-dark/80"}`}>
                  {delta.records.map((r) => (
                    <li key={r} className="flex items-start gap-2 leading-snug">
                      <Check className={`h-4 w-4 shrink-0 mt-0.5 ${p.featured ? "text-brand-gold" : "text-emerald-600"}`} strokeWidth={3} />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
                {delta.services.length > 0 && (
                  <p className={`text-[10px] font-black uppercase tracking-wider mt-5 mb-2 ${p.featured ? "text-brand-gold" : "text-brand-gold-dark"}`}>
                    {delta.base ? "Допълнителни услуги" : "Включени услуги"}
                  </p>
                )}
                <ul className={`space-y-2 text-[13px] flex-grow ${p.featured ? "text-white/85" : "text-brand-dark/80"}`}>
                  {delta.services.map((r) => (
                    <li key={r} className="flex items-start gap-2 leading-snug">
                      <CheckCircle2 className="h-4 w-4 text-brand-gold shrink-0 mt-0.5" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/profile"
                  className={`mt-6 w-full py-3.5 text-center font-black text-xs uppercase tracking-widest rounded-2xl transition-all ${
                    p.featured
                      ? "bg-brand-gold hover:bg-brand-gold-light text-brand-dark shadow-lg"
                      : "bg-brand-green/[0.06] hover:bg-brand-green text-brand-green hover:text-white ring-1 ring-brand-green/15"
                  }`}
                >
                  Започнете безплатно
                </Link>
              </div>
              );
            })}
          </div>
          <PlanHelpButton />
        </div>
      </section>

      {/* ═══════════════ ВЪПРОСИ ═══════════════ */}
      <section className="py-16 sm:py-20 bg-brand-light/40">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <SectionTitle eyebrow="Въпроси" title="Често задавани въпроси" />
          <div className="space-y-3">
            {BABH_FAQ.map((f) => (
              <details key={f.question} className="group rounded-2xl bg-white ring-1 ring-brand-green/10 p-5 open:shadow-md">
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none font-bold text-brand-green">
                  {f.question}
                  <ChevronDown className="h-5 w-5 shrink-0 text-brand-gold-dark transition-transform group-open:rotate-180" />
                </summary>
                <p className="text-sm text-brand-dark/70 leading-relaxed mt-3">{f.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ ФИНАЛЕН ПРИЗИВ ═══════════════ */}
      <section className="py-16 sm:py-20 px-4">
        <div className="max-w-4xl mx-auto rounded-[2rem] bg-gradient-to-br from-[#0A2318] via-brand-green to-[#0D2B1C] text-white text-center p-8 sm:p-14 relative overflow-hidden shadow-2xl">
          <div className="absolute -top-24 -right-16 w-72 h-72 bg-brand-gold/20 rounded-full blur-[90px] pointer-events-none" />
          <div className="relative space-y-5">
            <Smartphone className="h-10 w-10 text-brand-gold mx-auto" />
            <h2 className="font-serif text-3xl sm:text-4xl font-black leading-tight">Опитайте 14 дни безплатно</h2>
            <p className="text-white/75 max-w-xl mx-auto">
              Регистрирате обекта, а системата подрежда дневниците вместо Вас. Без банкова карта и без задължения.
            </p>
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-brand-gold hover:bg-brand-gold-light text-brand-dark font-black text-sm uppercase tracking-wider shadow-xl hover:-translate-y-0.5 transition-all"
            >
              Започнете сега <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionTitle({
  eyebrow,
  title,
  text,
  dark = false,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  text?: string;
  dark?: boolean;
  align?: "center" | "left";
}) {
  return (
    <div className={`space-y-3 ${align === "center" ? "text-center max-w-2xl mx-auto" : ""}`}>
      <p className={`text-[11px] font-black uppercase tracking-[0.2em] ${dark ? "text-brand-gold" : "text-brand-gold-dark"}`}>{eyebrow}</p>
      <h2 className={`font-serif text-3xl sm:text-4xl font-bold leading-tight ${dark ? "text-white" : "text-brand-green"}`}>{title}</h2>
      {text && <p className={`text-base leading-relaxed ${dark ? "text-white/70" : "text-brand-dark/65"}`}>{text}</p>}
    </div>
  );
}
