import Link from "next/link";
import {
  Calendar, Users, Award, CheckCircle, XCircle, HelpCircle, MessageSquare,
  BookOpen, Gift, ShieldCheck, AlertTriangle, FileCheck, Landmark, ClipboardList,
} from "lucide-react";
import type { LiveCourse } from "./types";

/**
 * "ПАКЕТ 2 — Двудневно практическо обучение по разработване, внедряване и
 * поддържане на ДПХП" (документ „ПАКЕТ 2 ОБУЧЕНИЕ ДПХП.docx")
 *
 * Live обучение с д-р Данка Николова. Записване през общата опашка
 * (/enrollments) + плащане по банков път, като другите live обучения.
 */

function DphpPage() {
  return (
    <div className="space-y-10">
      {/* Hook — ДПХП само на хартия */}
      <section className="bg-gradient-to-br from-brand-green/95 to-brand-green text-white rounded-3xl p-6 sm:p-10 shadow-lg">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-gold text-brand-dark flex items-center justify-center shrink-0 shadow-md">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="space-y-3">
            <h2 className="font-serif text-2xl font-bold">Имате ДПХП — но работят ли реално?</h2>
            <p className="text-sm text-white/80 leading-relaxed">
              Проблемът обикновено не е, че няма документи. Проблемът е, че документите не са разработени според
              конкретния обект, не са внедрени правилно и не се поддържат като жива система.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm text-white/85">
              {[
                "Програмите са копирани от друг обект",
                "Описаните дейности не съответстват на реалната работа",
                "Мониторингът е формален или липсва",
                "Персоналът не познава и не прилага правилата",
                "Записите се попълват механично",
                "Документацията не е актуализирана след промени",
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
          { Icon: Calendar, title: "2 дни — теория + практика", desc: "Ден 1 — законодателство, структура и принципи. Ден 2 — реални казуси." },
          { Icon: Users, title: "Малка група", desc: "Ограничен брой участници за индивидуално внимание." },
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
          Няма просто да знаете какво представляват ДПХП — ще знаете как да ги превърнете от папка с документи в
          реална система за управление на ежедневната работа.
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-brand-dark/80">
          {[
            "Да определяте кои програми са приложими за обекта",
            "Да разработвате ясни и практически приложими процедури",
            "Да определяте измерими и проверими критерии",
            "Да създавате подходящ мониторинг и работещи чеклисти",
            "Да определяте адекватни корективни действия",
            "Да намалявате ненужната документация",
            "Да обучавате персонала как да прилага правилата",
            "Да аргументирате документацията пред контролните органи",
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
              <h3 className="font-serif text-lg font-bold">Законодателство, структура и принципи</h3>
            </div>
            <ul className="space-y-1.5 text-sm text-brand-dark/75">
              {[
                "Приложими законодателни изисквания",
                "Ролята на ДПХП в системата за безопасност на храните",
                "Как се определят приложимите за обекта програми",
                "Правилна структура: цел, обхват, отговорности, критерии",
                "Матрицата „Какво? Как? Кога? Кой?“",
                "Разработване на мониторинг и корективни действия",
                "Какви записи действително са необходими",
                "Верификация и доказване на реалното внедряване",
              ].map((x) => (
                <li key={x} className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-brand-gold shrink-0 mt-0.5" /> {x}</li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-2xl border border-brand-green/5 p-6 space-y-3">
            <div className="flex items-center gap-2 text-brand-green">
              <span className="text-[10px] font-black uppercase tracking-widest bg-brand-gold/15 text-brand-gold-dark px-2.5 py-1 rounded-full">Ден 2</span>
              <h3 className="font-serif text-lg font-bold">Практическа работа и реални казуси</h3>
            </div>
            <p className="text-xs text-brand-dark/55">Всеки работи по програма или казус, свързан с неговата дейност.</p>
            <ul className="space-y-1.5 text-sm text-brand-dark/75">
              {[
                "Анализ на примерни програми по ДПХП",
                "Откриване на общи, неприложими и копирани текстове",
                "Разработване на програма по практически казус",
                "Адаптиране на процедура към конкретен вид обект",
                "Изготвяне на чеклист или контролна карта",
                "Определяне на корективни действия при отклонения",
                "Практическа верификация на програмата",
                "Работа по конкретни въпроси на участниците",
              ].map((x) => (
                <li key={x} className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-brand-gold shrink-0 mt-0.5" /> {x}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Подходящо и ако */}
      <section className="bg-brand-light/40 rounded-3xl border border-brand-green/10 p-6 sm:p-8 space-y-3">
        <h2 className="font-serif text-xl font-bold text-brand-green flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-brand-gold" /> Обучението е подходящо и ако:
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-brand-dark/80">
          {[
            "Имате готови програми, но не сте сигурни дали са правилни",
            "Документацията ви е разработена преди години и не е актуализирана",
            "Програмите са прекалено общи или обемни",
            "Персоналът не разбира какво трябва да изпълнява",
            "Имате много формуляри, но не получавате реална информация",
            "Предстои ви регистрация или проверка",
            "Искате сами да поддържате документацията си",
            "Искате да намалите зависимостта от външни консултанти",
          ].map((x) => (
            <li key={x} className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-brand-gold shrink-0 mt-0.5" /> {x}</li>
          ))}
        </ul>
      </section>

      {/* Бонуси */}
      <section className="bg-gradient-to-br from-brand-gold/15 to-brand-gold/5 border border-brand-gold/30 rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="font-serif text-xl font-bold text-brand-green flex items-center gap-2">
          <Gift className="h-5 w-5 text-brand-gold" /> Бонуси за участниците
        </h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          {[
            "Авторски модел за структура на програма по ДПХП",
            "Практически шаблони за разработване на процедури",
            "Контролни чеклисти и примерни записи",
            "Матрица „Какво? Как? Кога? Кой?“",
            "Чеклист „Работи ли реално моята програма по ДПХП?“",
            "Практическо домашно задание с обратна връзка",
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
            <div className="font-serif text-4xl font-black text-brand-green mt-1">199 €</div>
          </div>
          <div className="rounded-2xl border border-brand-green/10 bg-brand-light/40 p-5 text-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-dark/50">Редовна цена</span>
            <div className="font-serif text-4xl font-black text-brand-dark/70 mt-1">299 €</div>
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
          Основание за превод: „Обучение ДПХП“. Данните за банковата сметка се показват след като изпратите заявката за записване.
        </p>
      </section>

      {/* Сертификат */}
      <section className="bg-white rounded-3xl border border-brand-green/5 p-6 sm:p-8 flex items-start gap-4">
        <FileCheck className="h-8 w-8 text-brand-gold shrink-0" />
        <div className="space-y-1">
          <p className="font-bold text-brand-green">Авторски сертификат</p>
          <p className="text-sm text-brand-dark/70 leading-relaxed">
            След практическо домашно задание и успешно положен финален тест получавате авторски сертификат за
            преминато обучение по разработване, внедряване и поддържане на ДПХП. Най-голямата стойност са знанията и
            практическите умения, съобразени с реалната дейност на обекта.
          </p>
        </div>
      </section>

      {/* За кого */}
      <section className="space-y-4">
        <h2 className="font-serif text-xl font-bold text-brand-green">Подходящо за:</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            "Производители на храни",
            "Магазини и търговски обекти",
            "Складове за храни",
            "Заведения за обществено хранене и кетъринг",
            "Малки и средни хранителни предприятия",
            "Стартиращи хранителни бизнеси",
            "Управители и собственици на обекти",
            "Технолози, отговорници по качеството и консултанти",
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

export const obuchenieDphp: LiveCourse = {
  slug: "obuchenie-dphp",
  title: "Двудневно практическо обучение по разработване, внедряване и поддържане на ДПХП",
  tagline:
    "От формалната документация до реално работеща система — с практически казуси и работещи шаблони.",
  priceEur: 199.0,
  originalPriceEur: 299.0,
  platform: "zoom",
  hasCertificate: true,
  format: "2 дни — теория + практика",
  groupSize: "Малка група, ограничени места",
  nextBatch: "Дати: обявяват се при сформиране на група · ранно записване 199 €",
  highlights: [
    "От формална документация до реално работеща система",
    "Ден 2 — разработване по Ваш практически казус",
    "Бонус: авторски модел + матрица „Какво? Как? Кога? Кой?“",
  ],
  card: {
    badge: "Пакет 2",
    accent: "gold",
    icon: ClipboardList,
  },
  page: DphpPage,
  metaDescription:
    "Двудневно практическо live обучение по разработване, внедряване и поддържане на ДПХП с д-р Данка Николова. Реални казуси, работещи шаблони, авторски сертификат.",
};
