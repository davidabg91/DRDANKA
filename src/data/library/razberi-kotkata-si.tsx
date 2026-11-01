import {
  CheckCircle, Gift, Smartphone, Heart, HelpCircle, Calendar, Scissors, Eye, Camera,
} from "lucide-react";
import type { LibraryMaterial } from "./types";

function RazberiKotkataSiPage() {
  return (
    <div className="space-y-12">
      {/* Hook */}
      <section className="relative bg-white border border-brand-green/10 rounded-3xl p-6 sm:p-8 shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 rounded-full blur-3xl" />
        <div className="space-y-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-gold/10 text-brand-green border border-brand-gold/30 text-[10px] font-black uppercase tracking-wider shadow-sm">
            <Heart className="h-3.5 w-3.5 text-brand-gold" />
            Електронна книга · д-р Данка Николова
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-green leading-tight">
            Обичаш котката си. А разбираш ли какво ти казва?
          </h2>
          <div className="space-y-2">
            {[
              "Защо се крие?",
              "Защо хапе по време на галене?",
              "Как да направиш дома ѝ по-уютен и ежедневието ѝ по-спокойно?",
            ].map((q) => (
              <p key={q} className="flex items-start gap-2 text-sm text-brand-dark/80">
                <HelpCircle className="h-4 w-4 text-brand-gold shrink-0 mt-0.5" />
                {q}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* What's inside */}
      <section className="bg-brand-green text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.02] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-2xl space-y-6">
          <h3 className="font-serif text-2xl font-bold text-brand-gold">Какво ще откриеш в книгата:</h3>
          <p className="text-sm text-white/85 leading-relaxed">
            В „Разбери котката си“ ще намериш практични насоки за:
          </p>
          <div className="space-y-4">
            {["поведението", "храненето", "хигиената", "играта", "ежедневните грижи"].map((t) => (
              <div key={t} className="flex gap-4">
                <CheckCircle className="h-5 w-5 text-brand-gold shrink-0 mt-0.5" />
                <p className="leading-relaxed text-sm text-white">{t}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bonuses */}
      <section className="space-y-6">
        <div className="border-b border-brand-green/5 pb-3">
          <h2 className="font-serif text-2xl font-bold text-brand-green flex items-center gap-2.5">
            <span className="p-2 bg-brand-gold/10 text-brand-gold rounded-xl"><Gift className="h-5 w-5" /></span>
            Получаваш и четири бонуса
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[
            { Icon: Calendar, title: "„7 дни повече близост с котката“" },
            { Icon: Scissors, title: "„Направи сама играчки за котката“" },
            { Icon: Eye, title: "„Котешки език в картинки“" },
            { Icon: Camera, title: "„Моята котка — нашият албум“" },
          ].map(({ Icon, title }) => (
            <div key={title} className="bg-white rounded-2xl border border-brand-gold/30 p-6 shadow-md flex items-start gap-4">
              <span className="p-2.5 bg-brand-gold/10 rounded-xl shrink-0"><Icon className="h-5 w-5 text-brand-gold" /></span>
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-gold">Бонус</span>
                <h3 className="font-serif text-lg font-bold text-brand-green leading-snug">{title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Format + CTA */}
      <section className="rounded-3xl bg-brand-dark p-6 sm:p-8 text-white space-y-4">
        <p className="flex items-center gap-2 text-sm text-white/85">
          <Smartphone className="h-5 w-5 text-brand-gold shrink-0" />
          Чети онлайн в профила си — на телефон, таблет или компютър.
        </p>
        <p className="font-serif text-xl sm:text-2xl font-bold">
          Книгата + четирите бонуса — <span className="text-brand-gold">19,19 €</span>
        </p>
        <p className="flex items-start gap-2 text-sm text-white/75">
          <CheckCircle className="h-5 w-5 text-brand-gold shrink-0" />
          Поръчай и направи първата стъпка към повече разбиране и близост с твоята котка!
        </p>
      </section>
    </div>
  );
}

export const razberiKotkataSi: LibraryMaterial = {
  slug: "razberi-kotkata-si",
  title: "Разбери котката си",
  tagline:
    "Обичаш котката си. А разбираш ли какво ти казва? Насоки за поведението, храненето, хигиената и играта + 4 бонуса.",
  priceEur: 19.19,
  type: "pdf",
  category: "book",
  contentUrl: "#",
  files: [
    { title: "4-те бонуса", path: "bonusi.pdf" },
  ],
  card: {
    cover: "/cover-kniga-razberi-kotkata.webp",
    badge: "Ново",
    accent: "gold",
  },
  page: RazberiKotkataSiPage,
  seoTitle: "Разбери котката си — книга от д-р Данка Николова",
  metaDescription:
    "Електронна книга с практични насоки за поведението, храненето, хигиената, играта и ежедневните грижи за котката. Плюс 4 бонуса. 19,19 €.",
};
