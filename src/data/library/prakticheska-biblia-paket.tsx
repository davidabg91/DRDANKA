import Link from "next/link";
import {
  ShieldAlert, CheckCircle, FileText, CheckSquare, ShieldCheck,
  Sparkles, Award, BookOpen, HelpCircle, Layers, ArrowRight,
  PackageCheck, Scale, Wrench, ClipboardList, Download, Check,
} from "lucide-react";
import type { LibraryMaterial } from "./types";

function PrakticheskaBibliaPaketPage() {
  return (
    <div className="space-y-12">
      {/* Hook / Problem */}
      <section className="relative bg-white border border-brand-green/10 rounded-3xl p-6 sm:p-8 shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-brand-gold/10 rounded-full blur-3xl" />
        <div className="space-y-4 max-w-4xl relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 text-red-600 border border-red-200 text-[10px] font-black uppercase tracking-wider shadow-sm">
              <ShieldAlert className="h-3.5 w-3.5" />
              ПАКЕТ -62% · ПЪЛЕН КОМПЛЕКТ
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-gold text-brand-dark text-[10px] font-black uppercase tracking-wider shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Всички 3 части + БОНУС
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-green leading-tight">
            Цялостната система за спокойна дейност и безупречен контрол при проверка от БАБХ
          </h2>
          <p className="text-sm sm:text-base text-brand-dark/80 leading-relaxed">
            Вземете пълен достъп до трите части на <strong>„Практическа библия за хранителния бизнес“</strong> на
            специална промоционална пакетна цена от <strong>70 €</strong> (вместо общо 185.90 € при покупка поотделно).
          </p>
          <p className="text-sm text-brand-dark/70 leading-relaxed">
            Този пакет събира в едно изграждането на работеща система за самоконтрол, детайлното практическо
            прилагане на добрите практики и НАССР процедурите, както и всички готови примерни заповеди, дневници,
            регистри и чек листи за Вашия обект.
          </p>
        </div>
      </section>

      {/* Pricing Comparison Box */}
      <section className="relative bg-gradient-to-br from-brand-green via-brand-green/95 to-brand-dark text-white rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden border border-brand-gold/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-white/15">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-gold block mb-1">
                СПЕЦИАЛНА ОФЕРТА ЗА ПАКЕТ
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                Трите части в един общ пакет
              </h3>
            </div>
            <div className="flex flex-col sm:items-end">
              <div className="flex items-center gap-3">
                <span className="text-xs uppercase tracking-wider text-white/50 font-bold">Стойност поотделно:</span>
                <span className="font-serif text-xl sm:text-2xl text-white/50 line-through decoration-red-500 decoration-2">
                  185.90 €
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-serif text-5xl sm:text-6xl font-bold text-brand-gold leading-none">
                  70 <span className="text-2xl sm:text-3xl text-brand-gold/80 font-sans">€</span>
                </span>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-300 mt-2 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
                <Check className="h-3.5 w-3.5" /> Спестявате 115.90 € (62% отстъпка)
              </span>
            </div>
          </div>

          {/* Highlights grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1.5">
              <div className="flex items-center gap-2 text-brand-gold font-bold text-xs uppercase tracking-wider">
                <PackageCheck className="h-4 w-4" /> 3 части в 1
              </div>
              <p className="text-xs text-white/80 leading-relaxed">
                Отключвате едновременно Част I, Част II и Част III в профила си веднага след плащането.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1.5">
              <div className="flex items-center gap-2 text-brand-gold font-bold text-xs uppercase tracking-wider">
                <Award className="h-4 w-4" /> Включен БОНУС
              </div>
              <p className="text-xs text-white/80 leading-relaxed">
                45 стр. ръководство за най-честите грешки при воденето на записи (стойност 27 €) — напълно безплатно.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1.5">
              <div className="flex items-center gap-2 text-brand-gold font-bold text-xs uppercase tracking-wider">
                <ShieldCheck className="h-4 w-4" /> Достъп завинаги
              </div>
              <p className="text-xs text-white/80 leading-relaxed">
                Материалите остават във Вашия защитен профил с неограничен достъп за онлайн четене и изтегляне.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What is included in the package */}
      <section className="space-y-6">
        <div className="border-b border-brand-green/10 pb-3">
          <h2 className="font-serif text-2xl font-bold text-brand-green flex items-center gap-2.5">
            <span className="p-2 bg-brand-gold/10 text-brand-gold rounded-xl">
              <Layers className="h-5 w-5" />
            </span>
            Какво получавате в промоционалния пакет:
          </h2>
        </div>

        <div className="space-y-6">
          {/* Item 1 */}
          <div className="bg-white rounded-3xl border border-brand-green/10 p-6 sm:p-8 shadow-md hover:shadow-lg transition-shadow space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-brand-gold block">
                  КОМПОНЕНТ 1 · Включен в пакета
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-brand-green">
                  „Практическа библия за хранителния бизнес“ – Част I
                </h3>
              </div>
              <div className="text-left sm:text-right shrink-0">
                <span className="text-[10px] uppercase tracking-wider text-brand-dark/40 font-bold block">
                  Редовна стойност
                </span>
                <span className="font-serif text-lg text-brand-dark/50 line-through decoration-red-500/60 font-bold">
                  37 €
                </span>
              </div>
            </div>

            <p className="text-sm text-brand-dark/75 leading-relaxed">
              Откъде да започнете, кои добри производствени и хигиенни практики (ДПХП) или процедури са приложими и
              как да ги адаптирате към реалната дейност на обекта, а не формално „на хартия“.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              {[
                "Организация на мониторинга, записите и отговорностите на персонала",
                "Точни корективни действия при установяване на отклонения",
                "Премахване на повтарящи се несъответствия и несигурност при проверка",
                "Ясни критерии за приложимост на всяка процедура към конкретния обект",
              ].map((point, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-brand-dark/80">
                  <CheckCircle className="h-4 w-4 text-brand-gold shrink-0 mt-0.5" />
                  <span>{point}</span>
                </div>
              ))}
            </div>

            {/* Included Bonus in Part 1 */}
            <div className="mt-4 bg-brand-gold/10 border border-brand-gold/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start gap-4">
              <span className="p-2 bg-white text-brand-gold rounded-xl shrink-0 shadow-sm">
                <Award className="h-5 w-5" />
              </span>
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-brand-gold">
                    СПЕЦИАЛЕН БОНУС КЪМ ЧАСТ I
                  </span>
                  <span className="text-[10px] bg-brand-gold text-brand-dark font-black px-2 py-0.5 rounded-full">
                    Стойност 27 € — БЕЗПЛАТНО
                  </span>
                </div>
                <h4 className="font-serif text-base font-bold text-brand-green">
                  „Най-честите грешки при воденето на записи по ДПХП и НАССР и как да ги избегнете“ (45 стр.)
                </h4>
                <p className="text-xs text-brand-dark/70 leading-relaxed">
                  Практическо ръководство, което показва как да водите достоверни и проследими записи и да избегнете
                  празни, предварително попълнени или формално водени дневници, които инспекторите санкционират.
                </p>
              </div>
            </div>
          </div>

          {/* Item 2 */}
          <div className="bg-white rounded-3xl border border-brand-green/10 p-6 sm:p-8 shadow-md hover:shadow-lg transition-shadow space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-brand-gold block">
                  КОМПОНЕНТ 2 · Включен в пакета
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-brand-green">
                  „Практическа библия за хранителния бизнес“ – Част II
                </h3>
              </div>
              <div className="text-left sm:text-right shrink-0">
                <span className="text-[10px] uppercase tracking-wider text-brand-dark/40 font-bold block">
                  Редовна стойност
                </span>
                <span className="font-serif text-lg text-brand-dark/50 line-through decoration-red-500/60 font-bold">
                  99.90 €
                </span>
              </div>
            </div>

            <p className="text-sm text-brand-dark/75 leading-relaxed">
              Добри хигиенни и производствени практики и процедури, основани на принципите на НАССР. Продължение на
              Част I — от теорията към реалната практика в кухните, цеховете и складовете.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              {[
                "Как нормативните изисквания на Закона за храните се прилагат на практика",
                "Разпределение на отговорностите между управител, отговорник и персонал",
                "Какво точно се наблюдава ежедневно в обекта и къде се документира",
                "Как се доказва пред инспектор, че системата за самоконтрол реално функционира",
              ].map((point, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-brand-dark/80">
                  <CheckCircle className="h-4 w-4 text-brand-gold shrink-0 mt-0.5" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Item 3 */}
          <div className="bg-white rounded-3xl border border-brand-green/10 p-6 sm:p-8 shadow-md hover:shadow-lg transition-shadow space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-brand-gold block">
                  КОМПОНЕНТ 3 · Включен в пакета
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-brand-green">
                  „Практическа библия за хранителния бизнес“ – Част III
                </h3>
              </div>
              <div className="text-left sm:text-right shrink-0">
                <span className="text-[10px] uppercase tracking-wider text-brand-dark/40 font-bold block">
                  Редовна стойност
                </span>
                <span className="font-serif text-lg text-brand-dark/50 line-through decoration-red-500/60 font-bold">
                  49 €
                </span>
              </div>
            </div>

            <p className="text-sm text-brand-dark/75 leading-relaxed">
              Приложения към ДПХП и НАССР — готови работни документи, подредени по номерата на съответните добри
              практики. Не губите време в създаване на бланки — избирате приложимите и започвате работа.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              {[
                "Примерни заповеди за отговорници, хигиена, обучения и дезинфекция",
                "Дневници и регистри по самоконтрол (температури, входящ контрол, хигиена)",
                "Протоколи, контролни листове и въпросници за самопроверка",
                "Графици, планове за почистване, дезинфекция и ДДД обработка",
              ].map((point, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-brand-dark/80">
                  <CheckCircle className="h-4 w-4 text-brand-gold shrink-0 mt-0.5" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Target audience */}
      <section className="bg-brand-light rounded-3xl border border-brand-green/10 p-6 sm:p-8 space-y-6">
        <h3 className="font-serif text-xl font-bold text-brand-green text-center">
          За кого е предназначен този пакет?
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl mx-auto">
          {[
            "Заведения за обществено хранене (ресторанти, кухни, бързо хранене, кафенета)",
            "Търговски обекти, супермаркети и магазини за хранителни стоки",
            "Производители, цехове и преработватели на храни",
            "Стартиращи обекти, подготвящи регистрация в БАБХ",
            "Собственици, управители и отговорници по безопасност на храните",
            "Персонал, водещ ежедневните записи и дневници в обекта",
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 bg-white px-4 py-3 rounded-xl border border-brand-green/5 shadow-sm"
            >
              <CheckSquare className="h-4 w-4 text-brand-gold shrink-0" />
              <span className="text-xs font-medium text-brand-dark leading-snug">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* How access works */}
      <section className="bg-white rounded-3xl border border-brand-green/10 p-6 sm:p-8 shadow-md space-y-4">
        <h3 className="font-serif text-xl font-bold text-brand-green flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-brand-gold" />
          Как получавате достъп до трите части?
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-brand-light/70 border border-brand-green/5 space-y-1.5">
            <span className="font-serif text-xl font-bold text-brand-gold">1. Заявка</span>
            <p className="text-xs text-brand-dark/70 leading-relaxed">
              Натиснете бутона „Купи“ и въведете Вашите данни. Заявката за пакета се записва автоматично.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-brand-light/70 border border-brand-green/5 space-y-1.5">
            <span className="font-serif text-xl font-bold text-brand-gold">2. Плащане</span>
            <p className="text-xs text-brand-dark/70 leading-relaxed">
              Заплащате промоционалната пакетна цена от 70 € по банков път по посочената банкова сметка.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-brand-light/70 border border-brand-green/5 space-y-1.5">
            <span className="font-serif text-xl font-bold text-brand-gold">3. Достъп до всички 3 части</span>
            <p className="text-xs text-brand-dark/70 leading-relaxed">
              След потвърждение, <strong>и трите части</strong> (Част I с бонуса, Част II и Част III) се отключват
              едновременно във Вашия профил!
            </p>
          </div>
        </div>
      </section>

      {/* Questions */}
      <section className="bg-white rounded-3xl border border-brand-green/5 p-6 sm:p-8 flex items-start gap-4 shadow-md">
        <HelpCircle className="h-6 w-6 text-brand-gold shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-brand-green text-sm flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-brand-gold" /> Имате въпроси преди покупка?
          </p>
          <p className="text-xs text-brand-dark/60 leading-relaxed">
            Пишете ни от страницата за{" "}
            <Link href="/contact" className="text-brand-gold hover:underline font-bold">контакти</Link>{" "}
            или се обадете за консултация с д-р Даниела Николова.
          </p>
        </div>
      </section>
    </div>
  );
}

export const prakticheskaBibliaPaket: LibraryMaterial = {
  slug: "prakticheska-biblia-paket-vsichki-chasti",
  title: "„Практическа библия за хранителния бизнес“ – Пакет (Част I, II и III)",
  tagline:
    "Пълен комплект от трите части на практическата библия: от изграждане на системата за самоконтрол и практическо прилагане на ДПХП/НАССР до всички примерни заповеди, дневници и чек листи. Промоционална пакетна цена.",
  priceEur: 70,
  originalPriceEur: 185.90,
  type: "pdf",
  category: "document",
  contentUrl: "#",
  card: {
    cover: "/cover-prakticheska-biblia.webp",
    badge: "Пакет -62%",
    accent: "gold",
  },
  page: PrakticheskaBibliaPaketPage,
  metaDescription:
    "Пълен промоционален пакет от трите части на „Практическа библия за хранителния бизнес“: Част I, Част II и Част III с всички готови приложения, заповеди и дневници + бонус ръководство за записите. Специална цена 70 € вместо 185.90 €.",
};

