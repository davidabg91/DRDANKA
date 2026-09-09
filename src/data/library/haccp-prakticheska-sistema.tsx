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
  Gift,
  Video,
  Sparkles,
} from "lucide-react";
import type { LibraryMaterial } from "./types";

function HaccpPrakticheskaSistemaPage() {
  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      {/* 1. Hero / Main Value Prop */}
      <section className="relative bg-gradient-to-br from-brand-green via-brand-green/95 to-brand-dark text-white rounded-3xl p-7 sm:p-10 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-5 max-w-3xl relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-gold/20 border border-brand-gold/30 text-brand-gold text-[10px] font-black uppercase tracking-wider">
              <Video className="h-3.5 w-3.5" />
              Запис от практическо обучение в Zoom
            </div>
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 text-[10px] font-black uppercase tracking-wider">
              -50% Промоция в момента
            </div>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
            Една грешка в документацията може да Ви струва хиляди левове, загубено време и излишни нерви
          </h2>

          <p className="text-sm sm:text-base text-white/90 leading-relaxed">
            В този запис на практическото обучение ще научите как правилно да разработите и прилагате ДХПП и процедури, основани на принципите на НАССР. Ще разберете какво най-често проверяват инспекторите от ОДБХ и кои пропуски могат да доведат до предписания и санкции.
          </p>

          {/* Special Bonus Badge inside hero */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-brand-gold/30 space-y-1.5 shadow-lg">
            <div className="flex items-center gap-2 text-brand-gold font-bold text-xs uppercase tracking-wider">
              <Gift className="h-4 w-4 text-brand-gold" />
              Специален бонус за участниците
            </div>
            <p className="text-xs sm:text-sm text-white font-medium leading-relaxed">
              Получавате основните правила за разработване на технологична документация (ТД) и НАССР план — практически насоки и реални примери, които можете да приложите веднага във Вашия хранителен обект!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            {[
              "Реални примери от контрола",
              "Защита от санкции и глоби",
              "Бонус: правила за ТД и НАССР",
              "Гледате веднага след покупка",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-xs text-white/90 font-medium bg-white/5 px-3 py-2 rounded-xl border border-white/10">
                <CheckCircle className="h-4 w-4 text-brand-gold shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Key Pillars of the Training */}
      <section className="bg-white rounded-3xl border border-brand-green/10 p-6 sm:p-10 shadow-md space-y-6">
        <div className="border-b border-brand-green/5 pb-4 space-y-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-brand-gold bg-brand-gold/10 px-3 py-1 rounded-full inline-block">
            Какво съдържа обучението
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-brand-green">
            Ключови теми, разгледани в практическия запис:
          </h3>
          <p className="text-sm text-brand-dark/70 leading-relaxed">
            Без суха теория — конкретни инструкции как системата да работи за Вас, а не против Вас при проверка:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: "Правилно разработване и прилагане на ДХПП",
              desc: "Как да организирате добрите хигиенни и производствени практики, така че да отразяват действителните технологични процеси в обекта.",
            },
            {
              title: "Процедури, основани на принципите на НАССР",
              desc: "Анализ на опасностите, критични контролни точки (ККТ), граници, мониторинг и корективни действия без излишен бумащина.",
            },
            {
              title: "Какво най-често проверяват инспекторите от ОДБХ",
              desc: "Вътрешен поглед от официалния контрол: кои са първите документи и записи, които инспекторът изисква при влизане в обекта.",
            },
            {
              title: "Пропуските, които водят до предписания и санкции",
              desc: "Най-често допусканите грешки в записите, температурните дневници, дезинфекцията и проследимостта и как да ги елиминирате.",
            },
            {
              title: "СПЕЦИАЛЕН БОНУС: Правила за технологична документация (ТД)",
              desc: "Конкретни насоки как се изготвя ТД на произвежданите храни, за да отговаря напълно на Закона за храните.",
            },
            {
              title: "СПЕЦИАЛЕН БОНУС: Структура на НАССР план",
              desc: "Примерен модел и правила за изграждане на работещ НАССР план, готов за проверка и инспекция.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-brand-light/50 border border-brand-green/10 hover:border-brand-gold/40 transition-all space-y-2 group"
            >
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-brand-gold/15 text-brand-green font-bold text-xs flex items-center justify-center">
                  {idx + 1}
                </span>
                <h4 className="font-serif font-bold text-brand-green text-sm sm:text-base group-hover:text-brand-gold transition-colors">
                  {item.title}
                </h4>
              </div>
              <p className="text-xs text-brand-dark/70 leading-relaxed pl-9">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Main Stats / Highlights */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { icon: Video, label: "Видео запис от Zoom", desc: "Гледате със собствено темпо" },
          { icon: ClipboardCheck, label: "Реални примери", desc: "От опита на бивш директор на ОДБХ" },
          { icon: ShieldCheck, label: "Без хаос", desc: "Работеща документация, без фиктивни записи" }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-brand-green/5 p-6 shadow-md flex items-start gap-4">
            <div className="p-3 bg-brand-gold/10 text-brand-gold rounded-xl shrink-0">
              <stat.icon className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-brand-green text-sm">{stat.label}</h4>
              <p className="text-[11px] text-brand-dark/60 leading-normal">{stat.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* 4. Benefits / What you'll achieve */}
      <section className="bg-brand-green text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.02] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-2xl space-y-6">
          <h3 className="font-serif text-2xl font-bold text-brand-gold">Представете си как още от утре:</h3>
          <div className="space-y-4 text-sm text-white/80">
            {[
              "знаете точно какви записи трябва да се водят и по какъв начин",
              "документацията Ви е подредена, проверена и адекватна на дейността",
              "персоналът знае какво прави и не допуска опасни грешки",
              "имате реални доказателства за контрол при внезапна инспекция",
              "намалявате риска от глоби, предписания и напрежение при проверки от ОДБХ",
            ].map((step, idx) => (
              <div key={idx} className="flex gap-4">
                <CheckCircle className="h-5 w-5 text-brand-gold shrink-0 mt-0.5" />
                <p className="leading-relaxed text-sm text-white">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Bonuses */}
      <section className="space-y-6">
        <div className="border-b border-brand-green/5 pb-3">
          <h2 className="font-serif text-2xl font-bold text-brand-green flex items-center gap-2.5">
            <span className="p-2 bg-brand-gold/10 text-brand-gold rounded-xl"><Award className="h-5 w-5" /></span>
            Бонуси, включени в обучението
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              icon: FileText,
              title: "БОНУС #1: Основни правила за разработка на ТД и НАССР план",
              desc: "Конкретни указания как се структурира технологичната документация и НАССР плана в хранителния обект."
            },
            {
              icon: CheckSquare,
              title: "БОНУС #2: Примерни записи и контролни форми",
              desc: "Ще Ви помогнат по-лесно да организирате документацията и самоконтрола във Вашия обект."
            },
            {
              icon: BookOpen,
              title: "БОНУС #3: Чек-лист за самоконтрол преди проверка",
              desc: "За проверка дали документацията и записите в обекта са адекватни, актуални и подготвени за инспекция."
            },
            {
              icon: Users,
              title: "БОНУС #4: Най-честите грешки при воденето на записи",
              desc: "Подробен преглед на несъответствията, които инспекторите установяват най-често, и как да ги избегнете."
            }
          ].map((bonus, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-brand-gold/20 p-5 shadow-sm space-y-3">
              <h3 className="font-serif text-sm font-bold text-brand-green flex items-center gap-2">
                <bonus.icon className="h-5 w-5 text-brand-gold shrink-0" />
                {bonus.title}
              </h3>
              <p className="text-xs text-brand-dark/70 leading-relaxed">
                {bonus.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Target Audience */}
      <section className="bg-white rounded-3xl border border-brand-green/10 p-6 sm:p-8 space-y-6 shadow-sm">
        <h3 className="font-serif text-xl font-bold text-brand-green text-center">За кого е подходящо това практическо обучение?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl mx-auto">
          {[
            "Производители и търговци на храни",
            "Собственици и управители на хранителни обекти",
            "Стартиращи хранителни бизнеси",
            "Лица, подготвящи регистрация по Закона за храните",
            "Персонал в производството и търговията с храни",
            "Отговорници по качеството и безопасността на храните",
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 bg-brand-light/60 px-4 py-2.5 rounded-xl border border-brand-green/5">
              <CheckCircle className="h-4 w-4 text-brand-gold shrink-0" />
              <span className="text-xs font-medium text-brand-dark">{item}</span>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-brand-dark/60 max-w-2xl mx-auto">
          Не е необходимо да имате предварителен юридически опит. Обучението превежда нормативната материя на ясен, достъпен и веднага приложим език.
        </p>
      </section>

      {/* 7. Lecturer */}
      <section className="bg-white rounded-3xl border border-brand-green/10 p-6 sm:p-10 shadow-lg grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-4 relative aspect-square rounded-2xl overflow-hidden shadow-md">
          <Image
            src="/cover-haccp-praktichesko-obuchenie.jpg"
            alt="Д-р Данка Николова"
            fill
            className="object-cover object-top"
          />
        </div>
        <div className="md:col-span-8 space-y-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-brand-gold bg-brand-gold/10 px-3 py-1 rounded-full inline-block">
            Лектор на обучението
          </span>
          <h3 className="font-serif text-2xl font-bold text-brand-green">
            Д-р Данка Николова
          </h3>
          <p className="text-xs sm:text-sm font-semibold text-brand-gold-dark">
            Ветеринарен лекар с над 27 години практически опит в контрола и безопасността на храните
          </p>
          <p className="text-xs sm:text-sm text-brand-dark/75 leading-relaxed">
            Дългогодишен инспектор и експерт в официалния контрол, както и <strong>бивш директор на Областна дирекция по безопасност на храните (ОДБХ)</strong>.
          </p>
          <p className="text-xs sm:text-sm text-brand-dark/75 leading-relaxed">
            Познава практиката от двете страни — какво изискват нормите и как реално инспекторите проверяват обектите на терен.
          </p>
        </div>
      </section>

      {/* 8. Questions Section */}
      <section className="bg-white rounded-3xl border border-brand-green/5 p-6 sm:p-8 flex items-start gap-4 shadow-md">
        <HelpCircle className="h-6 w-6 text-brand-gold shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-brand-green text-sm">Имате въпроси за курса?</p>
          <p className="text-xs text-brand-dark/60 leading-relaxed">
            Ако имате допълнителни въпроси преди покупка, можете да се свържете с д-р Николова от страницата за{" "}
            <Link href="/contact" className="text-brand-gold hover:underline font-bold">контакти</Link>.
          </p>
        </div>
      </section>
    </div>
  );
}

export const haccpPrakticheskaSistema: LibraryMaterial = {
  slug: "haccp-prakticheska-sistema",
  title: "Практическо обучение по ДХПП и процедури, основани на принципите на НАССР – запис от Zoom",
  seoTitle: "Обучение по ДХПП и НАССР процедури — запис от Zoom",
  tagline:
    "Една грешка в документацията може да Ви струва хиляди левове. Научете как правилно да разработите и прилагате ДХПП и НАССР, какво проверява ОДБХ + Бонус: правила за ТД и НАССР план.",
  priceEur: 29,
  originalPriceEur: 58,
  type: "video",
  category: "training",
  contentUrl: "#", // Add the course stream link here when available
  card: {
    cover: "/cover-haccp-praktichesko-obuchenie.jpg",
    badge: "Запис от Zoom · Промо",
    accent: "gold",
  },
  page: HaccpPrakticheskaSistemaPage,
  metaDescription:
    "Запис от практическо онлайн обучение по ДХПП и НАССР в Zoom с д-р Данка Николова. Избегнете глоби и грешки в документацията. Включва специален бонус правила за ТД и НАССР план.",
};
