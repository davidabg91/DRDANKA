import Link from "next/link";
import { CheckCircle, BookOpen, AlertTriangle, ShieldCheck, FileText, Sparkles } from "lucide-react";
import type { LibraryMaterial } from "./types";

/**
 * "15 златни правила за етикетиране на храните"
 *
 * Custom detail page rendering. Edit the layout freely — this is the
 * template for "ready" materials. Each library entry can have a different
 * visual treatment to suit its content.
 */

function EtiketiraneOnHraniPage() {
  return (
    <div className="space-y-10">
      {/* Quote-style intro */}
      <section className="relative bg-white border-l-4 border-brand-gold rounded-r-3xl p-6 sm:p-10 shadow-md">
        <Sparkles className="absolute top-6 right-6 h-5 w-5 text-brand-gold/40" />
        <p className="font-serif italic text-lg sm:text-xl text-brand-green leading-relaxed">
          „Етикетът е лицето на Вашия продукт пред клиента и инспектора. Един грешен ред може да Ви струва глоба, отнемане на партида или загуба на доверие."
        </p>
        <p className="mt-4 text-sm font-bold text-brand-dark/60 uppercase tracking-wider">— д-р Данка Николова</p>
      </section>

      {/* What you'll learn */}
      <section className="space-y-5">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-green flex items-center gap-3">
          <span className="w-10 h-10 rounded-2xl bg-brand-gold/10 text-brand-gold flex items-center justify-center"><BookOpen className="h-5 w-5" /></span>
          Какво ще научите
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            ["Регламент (ЕС) № 1169/2011", "Основен нормативен документ. Кое е задължително, кое препоръчително."],
            ["Деклариране на съставки", "Поредност, обозначение на алергени, проценти на ключовите съставки."],
            ["Хранителна декларация", "Енергийна стойност и 6 задължителни показателя — как ги изчислявате."],
            ["Срок на годност", `„Най-добър до" срещу „Използвай до" — кога кой се прилага.`],
            ["Кръстосано замърсяване", "Когато контактът с алергени е възможен — как декларирате."],
            ["Размер на шрифта", "Какво казва законът за минималната височина на буквата."],
          ].map(([title, desc]) => (
            <div key={title} className="bg-white rounded-2xl border border-brand-green/5 p-5 hover:border-brand-gold/40 hover:shadow-md transition-all duration-300">
              <h3 className="font-bold text-brand-green mb-1.5 text-sm flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-brand-gold shrink-0 mt-0.5" />
                {title}
              </h3>
              <p className="text-xs text-brand-dark/70 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why it matters */}
      <section className="bg-gradient-to-br from-brand-green/95 to-brand-green text-white rounded-3xl p-6 sm:p-10 shadow-lg">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-gold text-brand-dark flex items-center justify-center shrink-0 shadow-md">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h2 className="font-serif text-2xl font-bold">Защо това е важно</h2>
            <p className="text-sm text-white/80 leading-relaxed">
              БАБХ налага глоби от <strong className="text-brand-gold">300 до 5000 лв.</strong> за неправилно
              етикетиране. В над 60% от инспекциите се открива поне един етикет, който не отговаря на изискванията.
              Едно нарушение по алергените може да доведе до изтегляне на партида и публично уведомление.
            </p>
            <p className="text-sm text-white/80 leading-relaxed">
              Този наръчник е написан в езика на човек, не на чиновник — стъпка по стъпка, с реални примери от
              практиката на д-р Николова.
            </p>
          </div>
        </div>
      </section>

      {/* For whom */}
      <section className="space-y-4">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-green flex items-center gap-3">
          <span className="w-10 h-10 rounded-2xl bg-brand-gold/10 text-brand-gold flex items-center justify-center"><FileText className="h-5 w-5" /></span>
          За кого е написан
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            "Производители на пакетирани храни",
            "Пекарни, сладкарски работилници, цехове",
            "Млечни и месни производства",
            "Малки артизанални марки и стартиращи бизнеси",
            "Дистрибутори, които препродават под собствен етикет",
            "Магазини, които правят собствени продукти на щанд",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-brand-dark/80 bg-white rounded-xl border border-brand-green/5 p-3">
              <CheckCircle className="h-4 w-4 text-brand-gold shrink-0 mt-0.5" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Trust */}
      <section className="bg-white rounded-3xl border border-brand-green/5 p-6 sm:p-8 flex items-start gap-4 shadow-md">
        <ShieldCheck className="h-6 w-6 text-brand-gold shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-brand-green text-sm">Над 20 години опит, събран в един PDF</p>
          <p className="text-xs text-brand-dark/60 leading-relaxed">
            Д-р Николова е консултирала над 800 хранителни обекта в България. Тази книжка съдържа дестилирания опит
            от реалните БАБХ проверки — кое наистина се проверява и кое е по-малко важно.
          </p>
        </div>
      </section>

      <p className="text-center text-xs text-brand-dark/50">
        Имате въпрос преди да купите?{" "}
        <Link href="/contact" className="text-brand-gold hover:underline font-bold">
          Пишете на д-р Николова →
        </Link>
      </p>
    </div>
  );
}

export const etiketiraneNaHrani: LibraryMaterial = {
  slug: "etiketirane-na-hrani",
  title: "15 златни правила за етикетиране на храните",
  tagline:
    "Практическо ръководство по изискванията на Регламент (ЕС) № 1169/2011 — съставки, алергени, хранителна декларация, шрифтове.",
  priceEur: 49.9,
  type: "pdf",
  // Replace with the real Google Drive / S3 URL once content is ready.
  contentUrl: "https://drive.google.com/file/d/REPLACE_ME/view",
  card: {
    badge: "Бестселър",
    accent: "gold",
  },
  page: EtiketiraneOnHraniPage,
  metaDescription:
    "Практически наръчник за етикетиране на храни според Регламент (ЕС) 1169/2011. Съставки, алергени, шрифтове, хранителна декларация — от д-р Данка Николова.",
};
