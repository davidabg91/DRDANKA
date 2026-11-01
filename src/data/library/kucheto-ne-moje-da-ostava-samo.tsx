import {
  CheckCircle, Gift, FileText, Smartphone, Heart, ClipboardList, Footprints,
} from "lucide-react";
import type { LibraryMaterial } from "./types";

function KuchetoNeMojeDaOstavaSamoPage() {
  return (
    <div className="space-y-12">
      {/* Hook */}
      <section className="relative bg-white border border-brand-green/10 rounded-3xl p-6 sm:p-8 shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 rounded-full blur-3xl" />
        <div className="space-y-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-gold/10 text-brand-green border border-brand-gold/30 text-[10px] font-black uppercase tracking-wider shadow-sm">
            <Heart className="h-3.5 w-3.5 text-brand-gold" />
            Книга · Данка Николова
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-green leading-tight">
            Повече спокойствие за кучето. По-малко тревога, когато излизаш.
          </h2>
          <p className="text-sm text-brand-dark/80 leading-relaxed">
            „Когато кучето не може да остава само“ е практическо ръководство с ясни упражнения, планове за действие
            и дневник за проследяване — за да вървите заедно, стъпка по стъпка, към по-спокойно ежедневие.
          </p>
        </div>
      </section>

      {/* What's inside */}
      <section className="bg-brand-green text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.02] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-2xl space-y-6">
          <h3 className="font-serif text-2xl font-bold text-brand-gold">Какво ще намериш в книгата:</h3>
          <div className="space-y-4">
            {[
              { Icon: Footprints, text: "ясни упражнения, които започват от най-малката стъпка" },
              { Icon: ClipboardList, text: "планове за действие, които да следваш ден след ден" },
              { Icon: FileText, text: "дневник за проследяване на напредъка на кучето" },
            ].map(({ Icon, text }) => (
              <div key={text} className="flex gap-4">
                <Icon className="h-5 w-5 text-brand-gold shrink-0 mt-0.5" />
                <p className="leading-relaxed text-sm text-white">{text}</p>
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
            В цената получаваш и два бонуса
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            { title: "„Трябва да изляза“", text: "Как да организираш грижата за кучето, докато отсъстваш." },
            { title: "„10 спокойни занимания у дома“", text: "Илюстрирани идеи с подробни указания." },
          ].map((b) => (
            <div key={b.title} className="bg-white rounded-2xl border border-brand-gold/30 p-6 shadow-md space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-brand-gold">Бонус</span>
              <h3 className="font-serif text-lg font-bold text-brand-green">{b.title}</h3>
              <p className="text-sm text-brand-dark/70 leading-relaxed">{b.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Format + CTA */}
      <section className="rounded-3xl bg-brand-dark p-6 sm:p-8 text-white space-y-4">
        <p className="flex items-center gap-2 text-sm text-white/85">
          <Smartphone className="h-5 w-5 text-brand-gold shrink-0" />
          Три PDF файла за четене на телефон, таблет или компютър.
        </p>
        <p className="font-serif text-xl sm:text-2xl font-bold">
          Книгата + двата бонуса — само за <span className="text-brand-gold">11,11 €</span>
        </p>
        <p className="flex items-start gap-2 text-sm text-white/75">
          <CheckCircle className="h-5 w-5 text-brand-gold shrink-0" />
          Купи сега и започни с първата малка стъпка към по-спокойно ежедневие заедно.
        </p>
      </section>
    </div>
  );
}

export const kuchetoNeMojeDaOstavaSamo: LibraryMaterial = {
  slug: "kucheto-ne-moje-da-ostava-samo",
  title: "Когато кучето не може да остава само",
  tagline:
    "Повече спокойствие за кучето. По-малко тревога, когато излизаш. Книга с упражнения, планове и дневник + 2 бонуса.",
  priceEur: 11.11,
  type: "pdf",
  category: "book",
  contentUrl: "#",
  files: [
    { title: "Бонус „Трябва да изляза“", path: "bonus-1.pdf" },
    { title: "Бонус „10 спокойни занимания у дома“", path: "bonus-2.pdf" },
  ],
  card: {
    cover: "/cover-kniga-kucheto-samo.webp",
    badge: "Ново",
    accent: "gold",
  },
  page: KuchetoNeMojeDaOstavaSamoPage,
  seoTitle: "Когато кучето не може да остава само — книга от Данка Николова",
  metaDescription:
    "Практическо ръководство с упражнения, планове за действие и дневник за кучета, които трудно остават сами. Плюс 2 бонуса: „Трябва да изляза“ и „10 спокойни занимания у дома“. 11,11 €.",
};
