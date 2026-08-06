import Link from "next/link";
import {
  ShieldAlert, CheckCircle, ShieldCheck, Sparkles, BookOpen, HelpCircle,
  FileText, ClipboardList, CalendarClock, FileSignature, Info, Copyright,
} from "lucide-react";
import type { LibraryMaterial } from "./types";

function PrakticheskaBibliaChast3Page() {
  return (
    <div className="space-y-12">
      {/* Hook / Problem */}
      <section className="relative bg-white border border-brand-green/10 rounded-3xl p-6 sm:p-8 shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 rounded-full blur-3xl" />
        <div className="space-y-4 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 text-red-600 border border-red-200 text-[10px] font-black uppercase tracking-wider shadow-sm">
              <ShieldAlert className="h-3.5 w-3.5" />
              Част III · Практическа библия за хранителния бизнес
            </div>
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-brand-gold text-brand-dark text-[10px] font-black uppercase tracking-wider shadow-sm">
              Промоция
            </div>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-green leading-tight">
            Приложения към ДПХП и процедури, основани на принципите на НАССР.
          </h2>
          <p className="text-sm text-brand-dark/80 leading-relaxed">
            Практическите приложения към „Практическа библия за хранителния бизнес“ — готови работни документи,
            разработени към отделните добри производствени и хигиенни практики. Предназначени да Ви помогнат при
            организирането, изпълнението, документирането и доказването на извършвания контрол.
          </p>
          <p className="text-sm text-brand-dark/80 leading-relaxed">
            За по-лесно използване приложенията са подредени по номерата на съответните ДПХП — подбирате само
            документите, които са приложими за Вашия обект.
          </p>
        </div>
      </section>

      {/* What's inside */}
      <section className="bg-brand-green text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.02] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-2xl space-y-6">
          <h3 className="font-serif text-2xl font-bold text-brand-gold">Какво съдържа Част III:</h3>
          <div className="space-y-4 text-sm text-white/80">
            {[
              "примерни заповеди и списъци",
              "графици и планове за контрол",
              "дневници и регистри по самоконтрол",
              "протоколи и контролни листове",
              "декларации, въпросници и други работни документи",
              "образци, подредени по номерата на съответните ДПХП",
            ].map((step, idx) => (
              <div key={idx} className="flex gap-4">
                <CheckCircle className="h-5 w-5 text-brand-gold shrink-0 mt-0.5" />
                <p className="leading-relaxed text-sm text-white">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to use */}
      <section className="space-y-6">
        <div className="border-b border-brand-green/5 pb-3">
          <h2 className="font-serif text-2xl font-bold text-brand-green flex items-center gap-2.5">
            <span className="p-2 bg-brand-gold/10 text-brand-gold rounded-xl"><ClipboardList className="h-5 w-5" /></span>
            Как да използвате приложенията
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { Icon: FileText, title: "Подбирате приложимото", text: "Не е необходимо да използвате всички приложения — само тези, приложими за конкретния обект." },
            { Icon: FileSignature, title: "Адаптирате към обекта", text: "Наименование, адрес, регистрационен номер, отговорни лица, честоти и показатели по Ваша организация." },
            { Icon: CalendarClock, title: "Попълвате и удостоверявате", text: "Своевременно, четливо и достоверно, подписано от определеното отговорно лице." },
          ].map(({ Icon, title, text }) => (
            <div key={title} className="bg-white border border-brand-green/10 rounded-2xl p-5 shadow-sm space-y-2">
              <span className="inline-flex p-2.5 bg-brand-gold/10 text-brand-gold rounded-xl"><Icon className="h-5 w-5" /></span>
              <h4 className="font-serif text-base font-bold text-brand-green leading-snug">{title}</h4>
              <p className="text-xs text-brand-dark/60 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Образец → запис */}
      <section className="bg-brand-light rounded-3xl border border-brand-gold/25 p-6 sm:p-8 flex items-start gap-4">
        <span className="p-2.5 bg-white text-brand-gold rounded-xl shrink-0 shadow-sm"><Info className="h-6 w-6" /></span>
        <div className="space-y-2">
          <h3 className="font-serif text-lg font-bold text-brand-green">От образец към запис</h3>
          <p className="text-sm text-brand-dark/70 leading-relaxed">
            Непопълненото приложение представлява образец. След попълване то се превръща в запис, който трябва да
            бъде своевременно попълнен, удостоверен от отговорното лице, защитен от промяна, съхраняван за определен
            срок и достъпен при вътрешна проверка или официален контрол.
          </p>
          <p className="text-sm text-brand-dark/70 leading-relaxed">
            Приложенията не заменят реалното изпълнение на мерките. Те имат стойност само когато доказват
            действително извършена дейност, получен резултат, установено отклонение или предприето корективно
            действие. Не се допуска механично използване на образците без предварителна оценка на приложимостта им.
          </p>
        </div>
      </section>

      {/* Price / Offer */}
      <section className="bg-white rounded-3xl border border-brand-gold/25 p-6 sm:p-8 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-brand-gold">
              <Sparkles className="h-3.5 w-3.5" /> Промоционална цена
            </span>
            <div className="flex items-end gap-3">
              <span className="font-serif text-2xl text-brand-dark/40 line-through decoration-red-500/60 decoration-2 leading-none">
                78,90 €
              </span>
              <span className="font-serif text-4xl sm:text-5xl font-bold text-brand-gold leading-none">
                49 <span className="text-2xl text-brand-dark/50 font-sans">€</span>
              </span>
            </div>
            <p className="text-xs text-brand-dark/60 pt-1">Промоционална цена 49 евро вместо редовните 78,90 евро.</p>
          </div>
          <div className="flex items-start gap-2 text-[11px] text-brand-dark/60 leading-relaxed max-w-xs">
            <ShieldCheck className="h-5 w-5 text-brand-gold shrink-0 mt-0.5" />
            <span>Веднага след потвърждаване на плащането получавате достъп до приложенията в защитения си профил.</span>
          </div>
        </div>
      </section>

      {/* Target audience */}
      <section className="bg-brand-light rounded-3xl border border-brand-green/10 p-6 sm:p-8 space-y-6">
        <h3 className="font-serif text-xl font-bold text-brand-green text-center">За кого е Част III?</h3>
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

      {/* Copyright / license */}
      <section className="bg-white rounded-3xl border border-brand-green/10 p-6 sm:p-8 shadow-md flex items-start gap-4">
        <span className="p-2.5 bg-brand-green/5 text-brand-green rounded-xl shrink-0"><Copyright className="h-6 w-6" /></span>
        <div className="space-y-2">
          <h3 className="font-serif text-base font-bold text-brand-green">Авторски права и лиценз за ползване</h3>
          <p className="text-xs text-brand-dark/60 leading-relaxed">
            © 2026 г. д-р Данка Николова. Всички права запазени. Закупуването на изданието Ви дава право да
            използвате и адаптирате приложимите образци единствено за нуждите на собствения си хранителен обект или
            организация — включително попълване, адаптиране и отпечатване на работни копия. Възпроизвеждане,
            разпространение, публикуване или предоставяне на трети лица не е разрешено без писмено съгласие на автора.
          </p>
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

export const prakticheskaBibliaChast3: LibraryMaterial = {
  slug: "prakticheska-biblia-chast-3",
  title: "„Практическа библия за хранителния бизнес“ – Част III",
  tagline:
    "Приложения към ДПХП и процедури, основани на принципите на НАССР: заповеди, дневници, регистри, протоколи, контролни листове и образци, подредени по номерата на съответните ДПХП. Промоционална цена.",
  priceEur: 49,
  originalPriceEur: 78.90,
  type: "pdf",
  category: "document",
  contentUrl: "#", // delivery via protected viewer — admin uploads PDF to library/<slug>/file.pdf
  card: {
    cover: "/cover-prakticheska-biblia-3.webp",
    badge: "Промоция",
    accent: "gold",
  },
  page: PrakticheskaBibliaChast3Page,
  metaDescription:
    "Част III на „Практическа библия за хранителния бизнес“: приложения към ДПХП — примерни заповеди, дневници, регистри, протоколи, контролни листове, декларации и въпросници, подредени по номерата на съответните ДПХП. Промоционална цена 49 € вместо 78,90 €.",
};
