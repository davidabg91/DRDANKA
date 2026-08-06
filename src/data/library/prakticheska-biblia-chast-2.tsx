import Link from "next/link";
import {
  ShieldAlert, CheckCircle, ShieldCheck, Sparkles, BookOpen, HelpCircle,
  Scale, Wrench, ClipboardCheck, Users, HeartHandshake, Info,
} from "lucide-react";
import type { LibraryMaterial } from "./types";

function PrakticheskaBibliaChast2Page() {
  return (
    <div className="space-y-12">
      {/* Hook / Problem */}
      <section className="relative bg-white border border-brand-green/10 rounded-3xl p-6 sm:p-8 shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 rounded-full blur-3xl" />
        <div className="space-y-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 text-red-600 border border-red-200 text-[10px] font-black uppercase tracking-wider shadow-sm">
            <ShieldAlert className="h-3.5 w-3.5" />
            Част II · Практическа библия за хранителния бизнес
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-green leading-tight">
            Добри хигиенни и производствени практики. Процедури, основани на принципите на НАССР.
          </h2>
          <p className="text-sm text-brand-dark/80 leading-relaxed">
            Продължение на „Практическа библия за хранителния бизнес“ – Част I. Практическо ръководство за
            производители, търговци и заведения за обществено хранене, което превежда нормативните изисквания на
            езика на реалната практика — от теорията към практиката.
          </p>
          <p className="text-sm text-brand-dark/80 leading-relaxed">
            Ще разберете не само какво изисква законодателството, но и как то се прилага в реалната работа на
            обекта: как се разпределят отговорностите, какво се наблюдава, къде се документира контролът, как се
            реагира при отклонение и как се доказва, че системата действително работи.
          </p>
        </div>
      </section>

      {/* What you'll learn */}
      <section className="bg-brand-green text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.02] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-2xl space-y-6">
          <h3 className="font-serif text-2xl font-bold text-brand-gold">Какво ще научите в Част II:</h3>
          <div className="space-y-4 text-sm text-white/80">
            {[
              "какво изисква законодателството и как изискването се прилага на практика",
              "как се определят отговорностите на персонала в обекта",
              "какво трябва да се наблюдава и контролира ежедневно",
              "как и къде се документира извършеният контрол",
              "как се реагира при отклонение с подходящи корективни действия",
              "как се проверява дали предприетите действия са ефективни",
              "как се доказва, че системата за самоконтрол действително работи",
            ].map((step, idx) => (
              <div key={idx} className="flex gap-4">
                <CheckCircle className="h-5 w-5 text-brand-gold shrink-0 mt-0.5" />
                <p className="leading-relaxed text-sm text-white">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value pillars */}
      <section className="space-y-6">
        <div className="border-b border-brand-green/5 pb-3">
          <h2 className="font-serif text-2xl font-bold text-brand-green flex items-center gap-2.5">
            <span className="p-2 bg-brand-gold/10 text-brand-gold rounded-xl"><Sparkles className="h-5 w-5" /></span>
            Какво Ви дава ръководството
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { Icon: Scale, title: "Съответствие със законодателството", text: "Актуалните нормативни изисквания, преведени на разбираем език." },
            { Icon: Wrench, title: "Практически решения", text: "Готови подходи, които се адаптират към Вашия обект, а не се копират сляпо." },
            { Icon: ClipboardCheck, title: "Реален контролен опит от ОДБХ", text: "Най-често установяваните несъответствия при официален контрол и как да ги избегнете." },
            { Icon: Users, title: "Защита на потребителя", text: "Ясни правила и достоверни записи, които гарантират безопасността на храните." },
            { Icon: HeartHandshake, title: "Доверие и репутация", text: "Работеща система, която защитава обекта и изгражда доверие." },
          ].map(({ Icon, title, text }) => (
            <div key={title} className="bg-white border border-brand-green/10 rounded-2xl p-5 shadow-sm space-y-2">
              <span className="inline-flex p-2.5 bg-brand-gold/10 text-brand-gold rounded-xl"><Icon className="h-5 w-5" /></span>
              <h4 className="font-serif text-base font-bold text-brand-green leading-snug">{title}</h4>
              <p className="text-xs text-brand-dark/60 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Important note */}
      <section className="bg-brand-light rounded-3xl border border-brand-gold/25 p-6 sm:p-8 flex items-start gap-4">
        <span className="p-2.5 bg-white text-brand-gold rounded-xl shrink-0 shadow-sm"><Info className="h-6 w-6" /></span>
        <div className="space-y-2">
          <h3 className="font-serif text-lg font-bold text-brand-green">Важно уточнение</h3>
          <p className="text-sm text-brand-dark/70 leading-relaxed">
            Ръководството има общ методически и практически характер. Всяка добра хигиенна и производствена практика
            трябва да бъде адаптирана към вида на обекта, храните, помещенията, оборудването, технологичните
            процеси, организацията на работа, отговорностите на персонала и приложимите законови изисквания.
          </p>
          <p className="text-sm text-brand-dark/70 leading-relaxed">
            Сляпото копиране на готова документация е една от най-често установяваните причини за несъответствия
            при официален контрол. Ръководството не замества индивидуалната оценка на обекта и професионалната
            консултация.
          </p>
        </div>
      </section>

      {/* From the author */}
      <section className="bg-white rounded-3xl border border-brand-green/10 p-6 sm:p-8 shadow-md space-y-4">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-brand-gold">
          <BookOpen className="h-3.5 w-3.5" /> От автора
        </span>
        <blockquote className="border-l-4 border-brand-gold/40 pl-4 space-y-3">
          <p className="text-sm text-brand-dark/80 leading-relaxed italic">
            „Безопасността на храните не се постига с документация, която стои затворена в папка. Тя се изгражда
            чрез ясни правила, разбираеми отговорности, обучен персонал, достоверни записи и ежедневен контрол.“
          </p>
          <p className="text-sm text-brand-dark/70 leading-relaxed">
            Работещата система отразява реалната дейност, разбира се от персонала, изпълнява се ежедневно, установява
            навреме отклоненията, осигурява предприемането на подходящи действия и защитава безопасността на храните
            и потребителите.
          </p>
        </blockquote>
        <p className="text-right font-serif text-sm font-bold text-brand-green">— д-р Данка Николова</p>
      </section>

      {/* Price / Offer */}
      <section className="bg-white rounded-3xl border border-brand-gold/25 p-6 sm:p-8 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-brand-gold">
              <Sparkles className="h-3.5 w-3.5" /> Цена
            </span>
            <div className="flex items-end gap-3">
              <span className="font-serif text-4xl sm:text-5xl font-bold text-brand-gold leading-none">
                99,90 <span className="text-2xl text-brand-dark/50 font-sans">€</span>
              </span>
            </div>
            <p className="text-xs text-brand-dark/60 pt-1">Продължение на Част I на „Практическа библия за хранителния бизнес“.</p>
          </div>
          <div className="flex items-start gap-2 text-[11px] text-brand-dark/60 leading-relaxed max-w-xs">
            <ShieldCheck className="h-5 w-5 text-brand-gold shrink-0 mt-0.5" />
            <span>Веднага след потвърждаване на плащането получавате достъп до ръководството в защитения си профил.</span>
          </div>
        </div>
      </section>

      {/* Target audience */}
      <section className="bg-brand-light rounded-3xl border border-brand-green/10 p-6 sm:p-8 space-y-6">
        <h3 className="font-serif text-xl font-bold text-brand-green text-center">За кого е Част II?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl mx-auto">
          {[
            "Производители на храни",
            "Търговци на храни",
            "Заведения за обществено хранене",
            "Собственици и управители на хранителни обекти",
            "Отговорници по безопасност на храните",
            "Персонал, който води записите в обекта",
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-lg border border-brand-green/5 shadow-sm">
              <CheckCircle className="h-4 w-4 text-brand-gold shrink-0" />
              <span className="text-xs font-medium text-brand-dark">{item}</span>
            </div>
          ))}
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
            и ще Ви отговорим.
          </p>
        </div>
      </section>
    </div>
  );
}

export const prakticheskaBibliaChast2: LibraryMaterial = {
  slug: "prakticheska-biblia-chast-2",
  title: "„Практическа библия за хранителния бизнес“ – Част II",
  tagline:
    "Добри хигиенни и производствени практики и процедури, основани на принципите на НАССР. Продължение на Част I — от теорията към практиката, за производители, търговци и заведения за обществено хранене.",
  priceEur: 99.90,
  type: "pdf",
  category: "document",
  contentUrl: "#", // delivery via protected viewer — admin uploads PDF to library/<slug>/file.pdf
  card: {
    cover: "/cover-prakticheska-biblia-2.webp",
    badge: "Ново",
    accent: "gold",
  },
  page: PrakticheskaBibliaChast2Page,
  metaDescription:
    "Част II на „Практическа библия за хранителния бизнес“: добри хигиенни и производствени практики и процедури, основани на принципите на НАССР. Практическо ръководство за производители, търговци и заведения за обществено хранене — от теорията към практиката. Цена 99,90 €.",
};
