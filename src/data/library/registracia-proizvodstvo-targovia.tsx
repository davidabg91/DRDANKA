import Link from "next/link";
import Image from "next/image";
import {
  PlayCircle,
  CheckCircle,
  Award,
  BookOpen,
  Clock,
  CheckCircle2,
  ClipboardCheck,
  ShieldCheck,
  HelpCircle,
  FileText,
  CheckSquare,
  Users,
  AlertTriangle,
  XCircle,
  Building2,
  Store,
  ArrowRight,
  Sparkles,
  TrendingDown,
  Video,
  Flame,
  BadgeCheck,
} from "lucide-react";
import type { LibraryMaterial } from "./types";

function RegistraciaProizvodstvoTargoviaPage() {
  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      {/* 1. Dramatic Hook / Attention Grabber */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-amber-600 to-brand-green p-7 sm:p-10 text-white shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/20 backdrop-blur-md border border-white/20 text-white text-[11px] font-black uppercase tracking-wider">
            <Video className="h-4 w-4 text-brand-gold" />
            Запис от практическо обучение на живо в Zoom
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight text-white">
            1 грешка може да Ви струва хиляди левове, изгубено време и нерви
          </h2>

          <p className="text-sm sm:text-base text-white/90 leading-relaxed font-medium">
            Преди да наемете помещение, да започнете ремонт или да купите оборудване — разберете какво точно трябва да проверите, за да не плащате после скъпо за грешките си.
          </p>

          <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-white/95">
            <span className="flex items-center gap-1.5 bg-white/15 px-3 py-1.5 rounded-xl backdrop-blur-sm">
              <Clock className="h-4 w-4 text-brand-gold" />
              Гледате веднага в удобно за Вас време
            </span>
            <span className="flex items-center gap-1.5 bg-white/15 px-3 py-1.5 rounded-xl backdrop-blur-sm">
              <ShieldCheck className="h-4 w-4 text-brand-gold" />
              Опит от реален официален контрол
            </span>
          </div>
        </div>
      </section>

      {/* 2. The Real Scenario / Pain Points */}
      <section className="bg-white rounded-3xl border border-brand-green/10 p-6 sm:p-10 shadow-lg space-y-6">
        <div className="space-y-2 border-b border-brand-green/5 pb-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-red-600 bg-red-50 px-2.5 py-1 rounded-md inline-block">
            Реалността при стартиране
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-brand-green">
            Познат ли Ви е този скъп сценарий?
          </h3>
          <p className="text-sm text-brand-dark/70 leading-relaxed">
            Повечето предприемачи бързат: наемат помещение, инвестират в ремонт и поръчват оборудване. И чак когато дойде инспекторът от ОДБХ за регистрация, се оказва, че:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "Разпределението на помещенията не отговаря на нормативните изисквания;",
            "Чистите и мръсните технологични потоци се пресичат в обекта;",
            "Липсват задължителни помещения, обособени зони или достатъчен брой мивки;",
            "Настилките, стените, таваните или работните повърхности не отговарят на стандартите;",
            "Закупеното скъпо оборудване не е достатъчно или е напълно неподходящо за дейността;",
            "Обектът получава предписания, отказ или забавяне с месеци преди да отвори врати.",
          ].map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 p-4 rounded-2xl bg-red-50/70 border border-red-200/50 text-brand-dark">
              <XCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm font-medium leading-relaxed">{item}</p>
            </div>
          ))}
        </div>

        {/* Cost consequence box */}
        <div className="rounded-2xl bg-brand-dark p-6 sm:p-7 text-white space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-gold">Резултатът от липсата на предварителна подготовка:</p>
          <p className="font-serif text-lg sm:text-xl font-bold text-white">
            Нов ремонт. Нови непредвидени разходи. Загубено време. Забавяне на откриването. И безкрайно напрежение.
          </p>
          <p className="text-xs sm:text-sm text-white/75 leading-relaxed pt-1">
            А всичко това може да бъде избегнато само с няколко часа правилна подготовка преди да инвестирате първия лев.
          </p>
        </div>
      </section>

      {/* 3. The Core Philosophy: Първо планирайте, после инвестирайте */}
      <section className="bg-gradient-to-r from-brand-green to-brand-green/95 text-white rounded-3xl p-7 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4 max-w-3xl">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] bg-brand-gold/20 text-brand-gold px-3 py-1 rounded-full border border-brand-gold/30">
            Златното правило
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold leading-snug text-white">
            Първо планирайте. После инвестирайте.
          </h3>
          <p className="text-sm sm:text-base text-white/85 leading-relaxed">
            Точно затова създадох практическото обучение <strong>„Регистрация на обект за производство и търговия с храни“</strong>.
          </p>
          <p className="text-sm text-white/80 leading-relaxed">
            Целта му е да Ви помогне да подготвите правилно обекта си още от самото начало и да предотвратите грешки, които струват в пъти повече от цената на едно обучение.
          </p>
        </div>
      </section>

      {/* 4. What you will learn (12 Modules / Topics) */}
      <section className="bg-white rounded-3xl border border-brand-green/10 p-6 sm:p-10 shadow-md space-y-6">
        <div className="border-b border-brand-green/5 pb-4 space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/10 text-brand-gold text-[10px] font-black uppercase tracking-wider">
            <ClipboardCheck className="h-3.5 w-3.5" />
            Пълна практическа програма
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-brand-green">
            Какво ще научите в обучението?
          </h3>
          <p className="text-sm text-brand-dark/70 leading-relaxed">
            След прегледа на записа ще имате кристална яснота по всеки един етап от подготовката и регистрацията:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              num: "01",
              title: "Определяне на дейността",
              desc: "Как точно да класифицирате дейностите, които ще извършвате, за да не заявите грешна или непълна група храни.",
            },
            {
              num: "02",
              title: "Преценка на помещението",
              desc: "Как да разберете дали избраният обект е технически и нормативно подходящ преди да подпишете договор за наем.",
            },
            {
              num: "03",
              title: "Регистрация срещу одобрение",
              desc: "Кога обектът подлежи на обикновена регистрация и кога на предварително одобрение с комисия (разлики, срокове, процедури).",
            },
            {
              num: "04",
              title: "Помещения и функционални зони",
              desc: "Какви точно помещения, складове, подготвителни площи и санитарни възли са задължителни за Вашия тип обект.",
            },
            {
              num: "05",
              title: "Технологични потоци",
              desc: "Как правилно да разпределите движението на суровини, готов продукт, персонал и отпадъци.",
            },
            {
              num: "06",
              title: "Пресичане на чисти и мръсни потоци",
              desc: "Как да избегнете най-честата причина за отказ на ОДБХ — кръстосаното замърсяване.",
            },
            {
              num: "07",
              title: "Изисквания към сградния фонд",
              desc: "Конкретни норми за подови настилки, миещи се стени, тавани, осветление, вентилация и работни плотове.",
            },
            {
              num: "08",
              title: "Мивки, вода и оборудване",
              desc: "Колко и какви мивки са нужни (за суровини, посуда, хигиена на ръцете), както и какво технологично оборудване се изисква.",
            },
            {
              num: "09",
              title: "Необходима документация",
              desc: "Какви документи, разрешителни, технологични схеми и НАССР/ДПХП системи трябва да подготвите преди проверката.",
            },
            {
              num: "10",
              title: "Какво реално проверяват инспекторите",
              desc: "Точният фокус на проверката от инспекторите на ОДБХ на място — какво гледат първо и на какво държат най-много.",
            },
            {
              num: "11",
              title: "Най-често допусканите грешки",
              desc: "Реални примери от практиката за грешки, стрували на собствениците хиляди левове и месеци забавяне.",
            },
            {
              num: "12",
              title: "Подготовка преди заявлението",
              desc: "Стъпка по стъпка как да направите пълен предварителен одит на обекта си, преди да подадете документите в БАБХ.",
            },
          ].map((card) => (
            <div
              key={card.num}
              className="p-5 rounded-2xl bg-white border border-brand-green/10 hover:border-brand-gold/40 shadow-sm hover:shadow-md transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-brand-gold bg-brand-gold/10 px-2.5 py-1 rounded-lg">
                  Модул {card.num}
                </span>
                <CheckCircle2 className="h-4 w-4 text-brand-gold/60 group-hover:text-brand-gold transition-colors" />
              </div>
              <h4 className="font-serif text-base font-bold text-brand-green group-hover:text-brand-gold transition-colors">
                {card.title}
              </h4>
              <p className="text-xs text-brand-dark/70 leading-relaxed">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. What this training saves you */}
      <section className="bg-gradient-to-br from-amber-500/10 via-amber-100/40 to-white rounded-3xl border border-brand-gold/30 p-6 sm:p-10 shadow-lg space-y-6">
        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-brand-gold-dark bg-brand-gold/15 px-3 py-1 rounded-full inline-block">
            Реалната стойност
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-brand-green">
            Какво може да Ви спести това обучение?
          </h3>
          <p className="text-sm text-brand-dark/75 leading-relaxed font-semibold">
            Инвестицията от 27 € Ви спестява капани, които на практика костват между 2 000 и 15 000+ лева:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            "Наемане на неподходящо помещение",
            "Ненужни или повторни ремонти",
            "Закупуване на грешно оборудване",
            "Непредвидени допълнителни инвестиции",
            "Предписания и последващи корекции",
            "Забавяне на регистрацията в БАБХ",
            "Загуба на месеци без приходи",
            "Излишно напрежение и стрес",
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 p-3.5 rounded-xl bg-white border border-brand-gold/20 shadow-sm text-xs font-medium text-brand-dark">
              <ShieldCheck className="h-4 w-4 text-brand-gold shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-2xl bg-brand-gold/15 border border-brand-gold/30 text-center">
          <p className="font-serif text-base sm:text-lg font-bold text-brand-green">
            „Защото най-скъпата грешка е тази, която откривате, след като вече сте платили за нея.“
          </p>
        </div>
      </section>

      {/* 6. Target Audience */}
      <section className="bg-white rounded-3xl border border-brand-green/10 p-6 sm:p-10 shadow-md space-y-6">
        <div className="border-b border-brand-green/5 pb-4 space-y-1">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-brand-green">
            За кого е подходящо обучението?
          </h3>
          <p className="text-sm text-brand-dark/70 leading-relaxed">
            Създадено е да даде директни, практически ориентирани насоки за:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {[
            "Предприемачи, които планират да започнат хранителен бизнес;",
            "Всеки, който в момента търси подходящо помещение за своя обект;",
            "Собственици, които вече са наели или закупили помещение;",
            "Лица, на които предстои ремонт или закупуване на професионално оборудване;",
            "Обекти за производство или търговия с храни в процес на подготовка;",
            "Всеки, който иска предварително да знае нормативните изисквания на БАБХ;",
            "Управители и отговорни лица по безопасност на храните в обекти;",
            "Студенти, технолози и специалисти, търсещи реален практически опит.",
          ].map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-brand-light/60 border border-brand-green/5 text-xs sm:text-sm text-brand-dark/85">
              <CheckCircle className="h-4 w-4 text-brand-gold shrink-0 mt-0.5" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Not just theory - Real practice */}
      <section className="bg-brand-green text-white rounded-3xl p-6 sm:p-10 shadow-xl space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.03] rounded-full blur-2xl" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider bg-brand-gold/20 text-brand-gold px-3 py-1 rounded-full">
            Опит от практиката
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Не само „какво пише в закона“, а какво се случва на практика
          </h3>
          <p className="text-sm sm:text-base text-white/85 leading-relaxed">
            В обучението разглеждам основната нормативна рамка, но целта не е просто да изброяваме закони и наредби.
          </p>
          <p className="text-sm text-white/75 leading-relaxed">
            Ще Ви покажа как изискванията се прилагат на практика в реалните обекти, какво действително се оценява при официалната проверка от инспекторите и къде най-често възникват несъответствията.
          </p>
        </div>
      </section>

      {/* 8. Lecturer Profile */}
      <section className="bg-white rounded-3xl border border-brand-green/10 p-6 sm:p-10 shadow-lg grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-4 relative aspect-square rounded-2xl overflow-hidden shadow-md">
          <Image
            src="/cover-registracia-proizvodstvo-targovia.jpg"
            alt="Д-р Данка Николова"
            fill
            className="object-cover object-top"
          />
        </div>
        <div className="md:col-span-8 space-y-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-brand-gold bg-brand-gold/10 px-3 py-1 rounded-full inline-block">
            Вашият лектор
          </span>
          <h3 className="font-serif text-2xl font-bold text-brand-green">
            Д-р Данка Николова
          </h3>
          <p className="text-xs sm:text-sm font-semibold text-brand-gold-dark">
            Ветеринарен лекар с над 27 години практически опит в контрола и безопасността на храните
          </p>
          <p className="text-xs sm:text-sm text-brand-dark/75 leading-relaxed">
            Професионалният ми опит включва дългогодишна работа като инспектор и експерт в системата на официалния контрол на храните, както и като <strong>директор на Областна дирекция по безопасност на храните (ОДБХ)</strong>.
          </p>
          <p className="text-xs sm:text-sm text-brand-dark/75 leading-relaxed">
            Познавам не само нормативните изисквания. Познавам практиката. Знам кои несъответствия се установяват най-често, какво реално се оценява при проверките и кои грешки могат да бъдат предотвратени още преди да сте инвестирали средствата си.
          </p>
        </div>
      </section>

      {/* 9. What you receive & How it works */}
      <section className="bg-white rounded-3xl border border-brand-green/10 p-6 sm:p-10 shadow-md space-y-6">
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-brand-green flex items-center gap-3">
          <PlayCircle className="h-7 w-7 text-brand-gold shrink-0" />
          Какво получавате при закупуване?
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-brand-light/60 border border-brand-green/5 space-y-2">
            <Video className="h-6 w-6 text-brand-gold" />
            <h4 className="font-serif font-bold text-brand-green text-sm">Пълен видео запис</h4>
            <p className="text-xs text-brand-dark/70 leading-relaxed">
              Запис от практическото обучение, проведено на живо в Zoom — с всички обяснения, чертежи и примери.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-brand-light/60 border border-brand-green/5 space-y-2">
            <Clock className="h-6 w-6 text-brand-gold" />
            <h4 className="font-serif font-bold text-brand-green text-sm">Гледате когато поискате</h4>
            <p className="text-xs text-brand-dark/70 leading-relaxed">
              Не е нужно да присъствате в определен час. Учите със собствено темпо от телефон, таблет или компютър.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-brand-light/60 border border-brand-green/5 space-y-2">
            <ShieldCheck className="h-6 w-6 text-brand-gold" />
            <h4 className="font-serif font-bold text-brand-green text-sm">Неограничен достъп</h4>
            <p className="text-xs text-brand-dark/70 leading-relaxed">
              Връщайте се към важните моменти по време на избора на помещение, ремонта или подготовката за проверка.
            </p>
          </div>
        </div>
      </section>

      {/* 10. Final Call to Action */}
      <section className="rounded-3xl bg-gradient-to-r from-brand-gold via-amber-500 to-brand-gold p-7 sm:p-10 text-brand-dark text-center shadow-xl space-y-4">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-black/10 px-3.5 py-1.5 rounded-full inline-block">
          Не започвайте с ремонта. Започнете с плана.
        </span>
        <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-dark max-w-2xl mx-auto leading-tight">
          1 грешка може да струва хиляди. Правилното решение в началото може да Ви ги спести.
        </h3>
        <p className="text-sm text-brand-dark/80 max-w-xl mx-auto leading-relaxed">
          Преди да вложите хиляди левове в помещение, ремонт и оборудване, отделете време да разберете какво действително е необходимо за Вашата дейност.
        </p>
        <div className="pt-2">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-dark/70">
            Специална цена за пълен запис: само 27 €
          </p>
        </div>
      </section>

      {/* Questions */}
      <section className="bg-white rounded-3xl border border-brand-green/5 p-6 sm:p-8 flex items-start gap-4 shadow-md">
        <HelpCircle className="h-6 w-6 text-brand-gold shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-brand-green text-sm">Имате въпроси за обучението?</p>
          <p className="text-xs text-brand-dark/60 leading-relaxed">
            Ако имате въпрос преди покупка, можете да се свържете с д-р Николова от страницата за{" "}
            <Link href="/contact" className="text-brand-gold hover:underline font-bold">контакти</Link>.
          </p>
        </div>
      </section>
    </div>
  );
}

export const registraciaProizvodstvoTargovia: LibraryMaterial = {
  slug: "registracia-proizvodstvo-targovia",
  title: "Регистрация на обект за производство и търговия с храни",
  tagline:
    "1 грешка може да ви струва хиляди левове, изгубено време и нерви. Какво трябва да проверите преди да наемете помещение, да започнете ремонт или да купите оборудване.",
  priceEur: 27,
  originalPriceEur: 54,
  type: "video",
  category: "training",
  contentUrl: "https://iframe.mediadelivery.net/embed/748739/7999eaf8-e233-4d23-8fbf-8c32f9202923",
  card: {
    cover: "/cover-registracia-proizvodstvo-targovia.jpg",
    badge: "Запис · Промо 27 €",
    accent: "gold",
  },
  page: RegistraciaProizvodstvoTargoviaPage,
  metaDescription:
    "Запис от практическо онлайн обучение „Регистрация на обект за производство и търговия с храни“ с д-р Данка Николова. Избегнете скъпоструващи грешки при наем, ремонт и оборудване.",
  seoTitle: "Регистрация на обект за производство и търговия с храни — видео обучение",
};
