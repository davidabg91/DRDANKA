import Link from "next/link";
import { CheckCircle, BookOpen, AlertTriangle, ShieldCheck, FileText, Sparkles, AlertCircle } from "lucide-react";
import type { LibraryMaterial } from "./types";

function MeatGuidePage() {
  return (
    <div className="space-y-10">
      {/* Quote-style intro */}
      <section className="relative bg-white border-l-4 border-brand-gold rounded-r-3xl p-6 sm:p-10 shadow-md">
        <Sparkles className="absolute top-6 right-6 h-5 w-5 text-brand-gold/40" />
        <p className="font-serif italic text-lg sm:text-xl text-brand-green leading-relaxed">
          „Ако подготвяш обект за месо, има нещо важно, което трябва да знаеш: Повечето обекти не се бавят, защото не са готови... а защото има разминаване между проекта, реалното изпълнение и изискванията.“
        </p>
        <p className="mt-4 text-sm font-bold text-brand-dark/60 uppercase tracking-wider">— д-р Данка Николова</p>
      </section>

      {/* Scope and target audience */}
      <section className="space-y-5">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-green flex items-center gap-3">
          <span className="w-10 h-10 rounded-2xl bg-brand-gold/10 text-brand-gold flex items-center justify-center"><BookOpen className="h-5 w-5" /></span>
          За кои обекти е приложимо?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: "Производство на месо",
              desc: "Обекти за производство на месо и месни продукти, полуфабрикати и разфасовки."
            },
            {
              title: "Производство и продажба",
              desc: "Обекти за производство с продажба на място, транжорни, месарски магазини с топла витрина."
            },
            {
              title: "Храни от жив. произход",
              desc: "Обекти с дейности, свързани с обработка и дистрибуция на храни от животински произход."
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-brand-green/5 p-5 hover:border-brand-gold/40 hover:shadow-md transition-all duration-300">
              <h3 className="font-bold text-brand-green mb-1.5 text-sm flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-brand-gold shrink-0" />
                {item.title}
              </h3>
              <p className="text-xs text-brand-dark/70 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Warning/Strict Control Section */}
      <section className="bg-gradient-to-br from-brand-green/95 to-brand-green text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-gold text-brand-dark flex items-center justify-center shrink-0 shadow-md">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="space-y-3">
            <h2 className="font-serif text-2xl font-bold">Строги изисквания и засилен контрол</h2>
            <p className="text-sm text-white/80 leading-relaxed">
              Обектите с месо и месни продукти са класифицирани като обекти с висок риск и са подложени на изключително строг ветеринарно-санитарен контрол. БАБХ ги проверява в изключителен детайл – от зонирането на пътищата (кръстосване на чисти и мръсни потоци) до температурния режим и документацията.
            </p>
            <div className="bg-white/10 rounded-2xl p-4 border border-white/15">
              <p className="text-xs text-white/90 leading-relaxed font-semibold flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-brand-gold shrink-0" />
                Всеки отказ за регистрация спира дейността Ви, изисква нова държавна такса и повтаряне на целия процес.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Applicable regulations & How it helps */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-brand-green/5 p-6 sm:p-8 space-y-4 shadow-sm">
          <h3 className="font-serif text-lg font-bold text-brand-green flex items-center gap-2">
            <span className="p-2 bg-brand-gold/10 text-brand-gold rounded-xl"><FileText className="h-4 w-4" /></span>
            Нормативна база
          </h3>
          <p className="text-xs text-brand-dark/70 leading-relaxed">
            Ръководството е изцяло съобразено със спецификите на българското и европейското законодателство:
          </p>
          <ul className="space-y-2">
            {[
              "Закон за храните",
              "Регламент (ЕО) № 852/2004 относно хигиената на храните",
              "Регламент (ЕО) № 853/2004 с хигиенни правила за храни от животински произход"
            ].map((reg, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-brand-dark/80 font-medium">
                <span className="w-5 h-5 rounded-full bg-brand-green/5 text-brand-green text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{idx + 1}</span>
                <span>{reg}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-3xl border border-brand-green/5 p-6 sm:p-8 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="font-serif text-lg font-bold text-brand-green flex items-center gap-2">
              <span className="p-2 bg-brand-gold/10 text-brand-gold rounded-xl"><ShieldCheck className="h-4 w-4" /></span>
              Какво ще си спестите?
            </h3>
            <p className="text-xs text-brand-dark/70 leading-relaxed">
              Това практическо мини ръководство Ви дава ясна перспектива върху критичните изисквания, преди да започнете строителство или ремонт. То ще Ви помогне да:
            </p>
            <ul className="space-y-1">
              {[
                "Избегнете скъпоструващи преправяния на обекта",
                "Предотвратите забавяне в одобрението от БАБХ",
                "Разберете логиката на инспекторите при проверка"
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs text-brand-dark/80 font-medium">
                  <CheckCircle className="h-3.5 w-3.5 text-brand-gold shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="bg-white rounded-3xl border border-brand-green/5 p-6 sm:p-8 flex items-start gap-4 shadow-md">
        <ShieldCheck className="h-6 w-6 text-brand-gold shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-brand-green text-sm">Проверете готовността си с д-р Николова</p>
          <p className="text-xs text-brand-dark/60 leading-relaxed">
            Създадено на базата на стотици одитирани и успешно регистрирани месарници, цехове и заведения. Спестете време, пари и нерви с ясни правила и предварителен самоконтрол.
          </p>
        </div>
      </section>

      <p className="text-center text-xs text-brand-dark/50">
        Имате въпроси за регистрацията на Вашия обект?{" "}
        <Link href="/contact" className="text-brand-gold hover:underline font-bold">
          Пишете на д-р Николова →
        </Link>
      </p>
    </div>
  );
}

export const mesoIMesniProdukti: LibraryMaterial = {
  slug: "meso-i-mesni-produkti",
  title: "Практическо ръководство: Готов ли е обектът ти за регистрация?",
  tagline: "Практическо мини ръководство за обекти с месо и месни продукти. Как да избегнеш отказ, забавяне и излишни разходи.",
  priceEur: 9.99,
  type: "pdf",
  contentUrl: "https://firebasestorage.googleapis.com/v0/b/danka-3e858.firebasestorage.app/o/library%2Fmeso-i-mesni-produkti%2Ffile.pdf?alt=media",
  card: {
    cover: "/cover-meso-produkti.webp",
    badge: "Ново",
    accent: "gold",
  },
  page: MeatGuidePage,
  metaDescription: "Практическо мини ръководство за обекти с месо и месни продукти от д-р Данка Николова. Разберете изискванията за регистрация в БАБХ и избегнете забавяния.",
};
