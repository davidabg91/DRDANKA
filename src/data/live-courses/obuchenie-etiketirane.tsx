import Link from "next/link";
import {
  Calendar, Users, Award, CheckCircle, XCircle, MessageSquare, Video, BookOpen,
  Gift, ShieldCheck, AlertTriangle, FileCheck, Landmark,
} from "lucide-react";
import type { LiveCourse } from "./types";

/**
 * "ПАКЕТ 1 — Двудневно практическо обучение по етикетиране на храните"
 * (документ „пакет 1 обучение етикетиране.docx")
 *
 * Live обучение с д-р Данка Николова. Записване през общата опашка
 * (/enrollments) + плащане по банков път, като другите live обучения.
 */

function EtiketiranePage() {
  return (
    <div className="space-y-10">
      {/* Hook — цената на грешния етикет */}
      <section className="bg-gradient-to-br from-brand-green/95 to-brand-green text-white rounded-3xl p-6 sm:p-10 shadow-lg">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-gold text-brand-dark flex items-center justify-center shrink-0 shadow-md">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="space-y-3">
            <h2 className="font-serif text-2xl font-bold">Един грешен етикет струва много повече от печата</h2>
            <p className="text-sm text-white/80 leading-relaxed">
              Най-скъпата грешка не е санкцията. Най-скъпата грешка е да отпечатате хиляди опаковки и едва тогава да
              разберете, че етикетът не отговаря на изискванията.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm text-white/85">
              {[
                "Предписание или акт",
                "Спиране на продукта от продажба",
                "Изтегляне на партиди от пазара",
                "Преетикетиране на готови опаковки",
                "Повторен разход за дизайн и печат",
                "Рекламации и загуба на доверие",
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
          { Icon: Calendar, title: "2 дни — 14–15 август", desc: "Ден 1 — законодателство и теория. Ден 2 — изцяло практическа работа." },
          { Icon: Users, title: "Малка група", desc: "Ограничен брой места за практическа насоченост и лично внимание." },
          { Icon: Award, title: "Авторски сертификат", desc: "След практическо домашно и успешно положен финален тест." },
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

      {/* Резултатът за вас */}
      <section className="bg-white rounded-3xl border border-brand-green/5 p-6 sm:p-10 space-y-4">
        <h2 className="font-serif text-xl font-bold text-brand-green flex items-center gap-3">
          <span className="w-10 h-10 rounded-2xl bg-brand-gold/10 text-brand-gold flex items-center justify-center"><ShieldCheck className="h-5 w-5" /></span>
          Резултатът за вас
        </h2>
        <p className="text-sm text-brand-dark/70 leading-relaxed">
          Няма просто да знаете какво пише в законодателството — ще знаете как да го прилагате върху реален етикет.
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-brand-dark/80">
          {[
            "Самостоятелно да проверявате етикети",
            "Да откривате несъответствия преди отпечатването",
            "Да знаете какво да изисквате от дизайнер, технолог или доставчик",
            "Да обозначавате правилно алергените и количествата на съставките",
            "Да проверявате претенциите и четливостта",
            "Да намалите риска от скъпоструващи корекции",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-brand-gold shrink-0 mt-0.5" /> {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Програма */}
      <section className="space-y-5">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-green flex items-center gap-3">
          <span className="w-10 h-10 rounded-2xl bg-brand-gold/10 text-brand-gold flex items-center justify-center"><BookOpen className="h-5 w-5" /></span>
          Програма на обучението
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-brand-green/5 p-6 space-y-3">
            <div className="flex items-center gap-2 text-brand-green">
              <span className="text-[10px] font-black uppercase tracking-widest bg-brand-green/10 px-2.5 py-1 rounded-full">Ден 1</span>
              <h3 className="font-serif text-lg font-bold">Законодателство и теория</h3>
            </div>
            <ul className="space-y-1.5 text-sm text-brand-dark/75">
              {[
                "Регламент (ЕС) № 1169/2011 — информация за храните",
                "Регламент (ЕО) № 1924/2006 — хранителни и здравни претенции",
                "Националното законодателство",
                "Задължителните елементи на етикета",
                "Добри практики при разработване на етикети",
                "Най-честите нарушения, установявани при проверки",
              ].map((x) => (
                <li key={x} className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-brand-gold shrink-0 mt-0.5" /> {x}</li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-2xl border border-brand-green/5 p-6 space-y-3">
            <div className="flex items-center gap-2 text-brand-green">
              <span className="text-[10px] font-black uppercase tracking-widest bg-brand-gold/15 text-brand-gold-dark px-2.5 py-1 rounded-full">Ден 2</span>
              <h3 className="font-serif text-lg font-bold">Практическа работа</h3>
            </div>
            <p className="text-xs text-brand-dark/55">Работим с реални продукти и реални етикети.</p>
            <ul className="space-y-1.5 text-sm text-brand-dark/75">
              {[
                "Анализ на реални етикети",
                "Проверка за съответствие със законодателството",
                "Практическо разработване на етикети",
                "Работа по реални казуси",
                "Анализ на най-често срещаните грешки",
                "Отговори на всички въпроси на участниците",
              ].map((x) => (
                <li key={x} className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-brand-gold shrink-0 mt-0.5" /> {x}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Бонуси */}
      <section className="bg-gradient-to-br from-brand-gold/15 to-brand-gold/5 border border-brand-gold/30 rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="font-serif text-xl font-bold text-brand-green flex items-center gap-2">
          <Gift className="h-5 w-5 text-brand-gold" /> Бонуси за участниците
        </h2>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          {[
            "Изготвяне на един етикет за една група продукти",
            "Авторски чек-лист „Проверка на етикета преди пускане на пазара“",
            "Електронно ръководство „15 златни правила при етикетирането на храните“",
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
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-gold-dark">Ранно записване — до 10 август</span>
            <div className="font-serif text-4xl font-black text-brand-green mt-1">199 €</div>
          </div>
          <div className="rounded-2xl border border-brand-green/10 bg-brand-light/40 p-5 text-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-dark/50">След 10 август</span>
            <div className="font-serif text-4xl font-black text-brand-dark/70 mt-1">235 €</div>
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
          Основание за превод: „Обучение по етикетиране“. Данните за банковата сметка се показват след като изпратите заявката за записване.
        </p>
      </section>

      {/* Сертификат */}
      <section className="bg-white rounded-3xl border border-brand-green/5 p-6 sm:p-8 flex items-start gap-4">
        <FileCheck className="h-8 w-8 text-brand-gold shrink-0" />
        <div className="space-y-1">
          <p className="font-bold text-brand-green">Авторски сертификат</p>
          <p className="text-sm text-brand-dark/70 leading-relaxed">
            След практическо домашно задание и успешно положен финален тест получавате авторски сертификат за
            преминато обучение по етикетиране на храните. Най-важното обаче са знанията и практическите умения, които
            ще прилагате веднага в работата си.
          </p>
        </div>
      </section>

      {/* За кого */}
      <section className="space-y-4">
        <h2 className="font-serif text-xl font-bold text-brand-green">Подходящо за:</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            "Производители на храни",
            "Вносители",
            "Търговци на едро и дребно",
            "Онлайн магазини за храни",
            "Стартиращи хранителни предприятия",
            "Технолози и отговорници по качеството",
            "Консултанти",
            "Всеки, който разработва, проверява или одобрява етикети",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-brand-dark/80 bg-white rounded-xl border border-brand-green/5 p-3">
              <CheckCircle className="h-4 w-4 text-brand-gold shrink-0 mt-0.5" />
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

export const obuchenieEtiketirane: LiveCourse = {
  slug: "obuchenie-etiketirane",
  title: "Двудневно практическо обучение по етикетиране на храните",
  tagline:
    "От законовите изисквания до правилно разработения етикет — с реални продукти, реални етикети и реални казуси.",
  priceEur: 199.0,
  originalPriceEur: 235.0,
  platform: "zoom",
  hasCertificate: true,
  format: "2 дни — теория + практика (14–15 август)",
  groupSize: "Малка група, ограничени места",
  nextBatch: "Дати: 14–15 август · ранно записване 199 € до 10 август",
  card: {
    badge: "Пакет 1",
    accent: "gold",
  },
  page: EtiketiranePage,
  metaDescription:
    "Двудневно практическо live обучение по етикетиране на храните с д-р Данка Николова. Регламент 1169/2011, реални етикети, авторски сертификат.",
  secondary: true,
};
