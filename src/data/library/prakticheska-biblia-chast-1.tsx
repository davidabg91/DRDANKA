import Link from "next/link";
import {
  ShieldAlert, CheckCircle, FileText, CheckSquare, ShieldCheck,
  Sparkles, Award, BookOpen, HelpCircle,
} from "lucide-react";
import type { LibraryMaterial } from "./types";

function PrakticheskaBibliaChast1Page() {
  return (
    <div className="space-y-12">
      {/* Hook / Problem */}
      <section className="relative bg-white border border-brand-green/10 rounded-3xl p-6 sm:p-8 shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 rounded-full blur-3xl" />
        <div className="space-y-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 text-red-600 border border-red-200 text-[10px] font-black uppercase tracking-wider shadow-sm">
            <ShieldAlert className="h-3.5 w-3.5" />
            Част I · Практическа библия за хранителния бизнес
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-green leading-tight">
            Имате документи, но не знаете дали системата Ви действително работи?
          </h2>
          <p className="text-sm text-brand-dark/80 leading-relaxed">
            Част I на „Практическа библия за хранителния бизнес“ ще Ви покаже откъде да започнете, кои ДПХП или
            процедури са приложими и как да ги адаптирате към реалната дейност на Вашия обект.
          </p>
          <p className="text-sm text-brand-dark/80 leading-relaxed">
            Ще разберете как да организирате мониторинга, записите, отговорностите и корективните действия, за да
            избегнете формалната документация, повтарящите се несъответствия и несигурността при проверка.
          </p>
        </div>
      </section>

      {/* What you'll learn */}
      <section className="bg-brand-green text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.02] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-2xl space-y-6">
          <h3 className="font-serif text-2xl font-bold text-brand-gold">Какво ще научите в Част I:</h3>
          <div className="space-y-4 text-sm text-white/80">
            {[
              "откъде да започнете изграждането на системата за самоконтрол",
              "кои ДПХП или процедури са приложими за Вашия обект",
              "как да ги адаптирате към реалната дейност, а не формално „на хартия“",
              "как да организирате мониторинга, записите и отговорностите",
              "как да реагирате с корективни действия при несъответствие",
              "как да избегнете повтарящите се несъответствия и несигурността при проверка",
            ].map((step, idx) => (
              <div key={idx} className="flex gap-4">
                <CheckCircle className="h-5 w-5 text-brand-gold shrink-0 mt-0.5" />
                <p className="leading-relaxed text-sm text-white">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bonus */}
      <section className="space-y-6">
        <div className="border-b border-brand-green/5 pb-3">
          <h2 className="font-serif text-2xl font-bold text-brand-green flex items-center gap-2.5">
            <span className="p-2 bg-brand-gold/10 text-brand-gold rounded-xl"><Award className="h-5 w-5" /></span>
            Получавате и БОНУС
          </h2>
        </div>
        <div className="bg-brand-gold/10 border border-brand-gold/30 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex items-start gap-4">
            <span className="p-2.5 bg-white text-brand-gold rounded-xl shrink-0 shadow-sm"><FileText className="h-6 w-6" /></span>
            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-brand-gold">
                <Sparkles className="h-3.5 w-3.5" />
                Специален бонус · Практическо ръководство от 45 страници
              </span>
              <h4 className="font-serif text-lg font-bold text-brand-green leading-snug">
                „Най-честите грешки при воденето на записи по ДПХП и НАССР и как да ги избегнете“
              </h4>
            </div>
          </div>

          <p className="text-sm font-semibold text-brand-dark/80 leading-relaxed">
            Имате попълнени дневници и регистри, но сигурни ли сте, че те доказват реално извършения контрол?
          </p>
          <p className="text-sm text-brand-dark/70 leading-relaxed">
            В това практическо ръководство от 45 страници ще откриете най-често допусканите грешки при воденето на
            записи, как се разпознават при официален контрол и как да ги предотвратите.
          </p>
          <p className="text-sm text-brand-dark/70 leading-relaxed">
            Ще научите как да водите ясни, достоверни и проследими записи, как правилно да документирате
            отклоненията и предприетите корективни действия и как да избегнете празни, предварително попълнени или
            формално водени дневници.
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-brand-gold/25">
            <p className="text-xs text-brand-dark/70 leading-relaxed max-w-sm">
              Получавате ръководството като <strong className="text-brand-green">БОНУС</strong> към Част I на
              „Практическа библия за хранителния бизнес“.
            </p>
            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-brand-dark/40">Стойност</span>
                <span className="font-serif text-lg text-brand-dark/40 line-through decoration-red-500/60 decoration-2 leading-none">
                  27 €
                </span>
              </div>
              <div className="text-right">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-brand-dark/40">За Вас</span>
                <span className="font-serif text-2xl font-bold text-brand-gold leading-none">БЕЗПЛАТНО</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Price / Offer */}
      <section className="bg-white rounded-3xl border border-brand-gold/25 p-6 sm:p-8 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-brand-gold">
              <Sparkles className="h-3.5 w-3.5" /> Стартова цена
            </span>
            <div className="flex items-end gap-3">
              <span className="font-serif text-2xl text-brand-dark/40 line-through decoration-red-500/60 decoration-2 leading-none">
                64 €
              </span>
              <span className="font-serif text-4xl sm:text-5xl font-bold text-brand-gold leading-none">
                37 <span className="text-2xl text-brand-dark/50 font-sans">€</span>
              </span>
            </div>
            <p className="text-xs text-brand-dark/60 pt-1">Стартова цена 37 евро вместо редовните 64 евро.</p>
          </div>
          <div className="flex items-start gap-2 text-[11px] text-brand-dark/60 leading-relaxed max-w-xs">
            <ShieldCheck className="h-5 w-5 text-brand-gold shrink-0 mt-0.5" />
            <span>Веднага след потвърждаване на плащането получавате библията и бонуса в защитения си профил.</span>
          </div>
        </div>
      </section>

      {/* Target audience */}
      <section className="bg-brand-light rounded-3xl border border-brand-green/10 p-6 sm:p-8 space-y-6">
        <h3 className="font-serif text-xl font-bold text-brand-green text-center">За кого е Част I?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl mx-auto">
          {[
            "Производители и търговци на храни",
            "Собственици и управители на хранителни обекти",
            "Стартиращи хранителни бизнеси",
            "Лица, подготвящи регистрация по Закона за храните",
            "Отговорници по безопасност на храните",
            "Персонал, който води записите в обекта",
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-lg border border-brand-green/5 shadow-sm">
              <CheckSquare className="h-4 w-4 text-brand-gold shrink-0" />
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

export const prakticheskaBibliaChast1: LibraryMaterial = {
  slug: "prakticheska-biblia-chast-1",
  title: "„Практическа библия за хранителния бизнес“ – Част I",
  tagline:
    "Откъде да започнете, кои ДПХП и процедури са приложими и как да ги адаптирате към реалната дейност на обекта. Включва БОНУС ръководство за най-честите грешки при записите.",
  priceEur: 37,
  originalPriceEur: 64,
  type: "pdf",
  category: "document",
  contentUrl: "#", // not used — delivery is via downloadUrl/bonus below
  downloadUrl:
    "https://drive.google.com/file/d/1XWxTYDAYfG90kEh9ck1dttKV_ZErTcyP/view?usp=drive_link",
  bonus: {
    title: "БОНУС: Най-честите грешки при воденето на записи по ДПХП и НАССР",
    url: "https://drive.google.com/file/d/13xOUsJPL--w7gyRbsK8Bjyi_Qfl1e0-R/view?usp=drive_link",
  },
  card: {
    cover: "/cover-prakticheska-biblia.webp",
    badge: "Стартова цена",
    accent: "gold",
  },
  page: PrakticheskaBibliaChast1Page,
  metaDescription:
    "Част I на „Практическа библия за хранителния бизнес“: откъде да започнете, кои ДПХП и процедури са приложими и как да организирате записите, мониторинга и корективните действия. Стартова цена 37 € вместо 64 €, с бонус ръководство.",
};
