import Link from "next/link";
import {
  ShieldAlert, CheckCircle, FileText, CheckSquare, ShieldCheck,
  Sparkles, Award, BookOpen, HelpCircle, ArrowRight,
  PackageCheck, Scale, Wrench, ClipboardCheck, Download, Check, AlertTriangle,
} from "lucide-react";
import type { LibraryMaterial } from "./types";

function PrakticheskaBibliaPaketPage() {
  return (
    <div className="space-y-12">
      {/* Hook / Problem & Intro */}
      <section className="relative bg-white border border-brand-green/10 rounded-3xl p-6 sm:p-10 shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/10 rounded-full blur-3xl" />
        <div className="space-y-5 max-w-4xl relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 text-red-600 border border-red-200 text-[10px] font-black uppercase tracking-wider shadow-sm">
              <ShieldAlert className="h-3.5 w-3.5" />
              СПЕЦИАЛНА ПРОМОЦИЯ · ПЪЛЕН КОМПЛЕКТ
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-gold text-brand-dark text-[10px] font-black uppercase tracking-wider shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Всички части + образци и чек листи
            </span>
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-green leading-tight">
            Практическа библия за хранителния бизнес
          </h1>

          <p className="text-base sm:text-lg font-semibold text-brand-gold leading-snug">
            Практически комплект за всеки, който иска да управлява хранителен обект уверено, подредено и в съответствие с изискванията за безопасност на храните.
          </p>

          <p className="text-sm sm:text-base text-brand-dark/80 leading-relaxed">
            Създаден на основата на реалния опит от официалния контрол, комплектът превежда сложните изисквания на законодателството на разбираем език и показва какво трябва да има в обекта, какво трябва да се контролира, как да се документира и какво се проверява на практика.
          </p>
        </div>
      </section>

      {/* Pricing Offer Box */}
      <section className="relative bg-gradient-to-br from-brand-green via-brand-green/95 to-brand-dark text-white rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden border border-brand-gold/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-white/15">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-gold block">
                ПРОМОЦИОНАЛНА ПАКЕТНА ЦЕНА
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                Всички части в един пълен комплект
              </h2>
            </div>
            <div className="flex flex-col sm:items-end">
              <div className="flex items-center gap-3">
                <span className="text-xs uppercase tracking-wider text-white/50 font-bold">Редовна цена:</span>
                <span className="font-serif text-xl sm:text-2xl text-white/50 line-through decoration-red-500 decoration-2">
                  150 €
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xs uppercase tracking-wider text-brand-gold font-black sm:mr-1">ПРОМО ЦЕНА СЕГА:</span>
                <span className="font-serif text-5xl sm:text-6xl font-bold text-brand-gold leading-none">
                  70 <span className="text-2xl sm:text-3xl text-brand-gold/80 font-sans">€</span>
                </span>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-300 mt-2 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
                <Check className="h-3.5 w-3.5" /> Спестявате 80 € (над 53% отстъпка)
              </span>
            </div>
          </div>

          {/* Core statement highlight */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/10 border border-brand-gold/30 backdrop-blur-sm text-center sm:text-left flex flex-col sm:flex-row items-center gap-4">
            <span className="p-3 bg-brand-gold text-brand-dark rounded-xl shrink-0 font-black shadow-md">
              <Sparkles className="h-6 w-6" />
            </span>
            <div className="space-y-0.5">
              <p className="font-serif text-lg sm:text-xl font-bold text-brand-gold">
                Не просто теория.
              </p>
              <p className="text-sm text-white/90 font-medium leading-relaxed">
                Система, която Ви показва как изискванията работят в реалния хранителен бизнес.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What you'll find in the Bible */}
      <section className="space-y-6">
        <div className="border-b border-brand-green/10 pb-3">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-green flex items-center gap-2.5">
            <span className="p-2 bg-brand-gold/10 text-brand-gold rounded-xl">
              <BookOpen className="h-5 w-5" />
            </span>
            В „Практическата библия“ ще откриете:
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: "Програми и процедури за ДПХП",
              desc: "Практически разработени програми и процедури за добри хигиенни и производствени практики.",
              icon: ClipboardCheck,
            },
            {
              title: "Принципите на НАССР",
              desc: "Насоки за прилагане на принципите на НАССР.",
              icon: Scale,
            },
            {
              title: "Приемане, съхранение и движение",
              desc: "Контрол на приемането, съхранението и движението на храните.",
              icon: PackageCheck,
            },
            {
              title: "Хигиена, вредители, отпадъци и замърсяване",
              desc: "Хигиена, лична хигиена, вредители, вода, отпадъци и предотвратяване на кръстосано замърсяване.",
              icon: ShieldCheck,
            },
            {
              title: "Проследимост, обучения и верификация",
              desc: "Проследимост, обучение на персонала, мониторинг и верификация.",
              icon: Wrench,
            },
            {
              title: "Готови образци на бланки и дневници",
              desc: "Готови образци на заповеди, инструкции, дневници, чек-листове и контролни записи.",
              icon: FileText,
            },
            {
              title: "Най-честите пропуски при проверка",
              desc: "Практически примери за най-честите пропуски и какво търсят контролните органи при проверка.",
              icon: AlertTriangle,
              colSpan: true,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`bg-white rounded-2xl border border-brand-green/10 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4 ${
                  item.colSpan ? "md:col-span-2 bg-gradient-to-r from-brand-gold/5 via-white to-brand-gold/5 border-brand-gold/30" : ""
                }`}
              >
                <span className="p-2.5 bg-brand-gold/10 text-brand-gold rounded-xl shrink-0 mt-0.5">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="space-y-1 flex-1">
                  <h3 className="font-serif text-base font-bold text-brand-green leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-brand-dark/75 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Target Audience */}
      <section className="bg-brand-light rounded-3xl border border-brand-green/10 p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-1">
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-brand-green">
            За кого е подходяща?
          </h3>
          <p className="text-xs sm:text-sm text-brand-dark/70 max-w-2xl mx-auto">
            Подходяща за собственици и управители на хранителни обекти, отговорници по безопасност на храните, консултанти, студенти и специалисти в областта на контрола на храните.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl mx-auto pt-2">
          {[
            "Собственици и управители на хранителни обекти",
            "Отговорници по безопасност на храните",
            "Консултанти по безопасност и НАССР",
            "Студенти в хранителни и ветеринарни специалности",
            "Специалисти в областта на контрола на храните",
            "Персонал, водещ ежедневните записи и дневници в обекта",
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2.5 bg-white px-4 py-3 rounded-xl border border-brand-green/5 shadow-sm"
            >
              <CheckSquare className="h-4 w-4 text-brand-gold shrink-0" />
              <span className="text-xs font-medium text-brand-dark leading-snug">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Final punchline box */}
      <section className="relative bg-gradient-to-r from-amber-500 via-brand-gold to-amber-600 rounded-3xl p-6 sm:p-8 text-brand-dark shadow-xl text-center overflow-hidden">
        <div className="space-y-3 max-w-3xl mx-auto relative z-10">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] bg-black/10 px-3 py-1 rounded-full">
            <AlertTriangle className="h-3.5 w-3.5" />
            ВАЖНО ЗА ВАШИЯ ОБЕКТ
          </span>
          <p className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold leading-snug text-brand-dark">
            „Защото най-добрият момент да откриете пропуските във Вашия обект е ПРЕДИ да ги открие контролният орган.“
          </p>
          <div className="pt-2">
            <p className="text-xs sm:text-sm text-brand-dark/80 font-bold uppercase tracking-wider">
              Редовна цена: 150 € · ПРОМО ЦЕНА СЕГА: 70 €
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
            или се свържете с д-р Даниела Николова.
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
    "Практически комплект за всеки, който иска да управлява хранителен обект уверено, подредено и в съответствие с изискванията за безопасност на храните.",
  priceEur: 70,
  originalPriceEur: 150,
  type: "pdf",
  category: "document",
  contentUrl: "#",
  card: {
    cover: "/cover-prakticheska-biblia-paket.webp",
    badge: "ПРОМО -53%",
    accent: "gold",
  },
  page: PrakticheskaBibliaPaketPage,
  metaDescription:
    "Практическа библия за хранителния бизнес — практически комплект от трите части: ДПХП, НАССР, образци на заповеди, дневници и чек-листове. Редовна цена: 150 €, промо цена сега: 70 €.",
};

