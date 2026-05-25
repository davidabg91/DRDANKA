"use client";

import Link from "next/link";
import { GraduationCap, BookOpen, Award, ArrowRight, Users, CheckCircle, Building } from "lucide-react";

/**
 * /training — marketing landing for live training and the digital bookstore.
 *
 * Old hardcoded MATERIAL_PACKAGES / COURSES / order flow removed —
 * all paid materials now live in Firestore and are sold via /bookstore.
 * Live consultations still go through /contact.
 */
export default function TrainingPage() {
  return (
    <div className="bg-brand-light min-h-screen pb-24">
      {/* Hero */}
      <section className="bg-brand-green text-white py-16 border-b border-brand-gold/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-brand-gold">
            <GraduationCap className="h-3.5 w-3.5" />
            Обучения & Материали
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
            Обучения за хранителен бизнес
          </h1>
          <p className="text-sm sm:text-base text-white/70 max-w-2xl mx-auto font-light leading-relaxed">
            Подгответе персонала, документацията и обекта си за изискванията на БАБХ. Изберете между живо обучение
            на място или дигитални наръчници от книжарницата.
          </p>
        </div>
      </section>

      {/* Two-card CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/bookstore"
          className="group bg-white rounded-2xl border border-brand-green/10 p-8 space-y-4 shadow-md hover:shadow-xl hover:border-brand-gold/40 transition-all duration-300 cursor-pointer flex flex-col"
        >
          <div className="p-3 bg-brand-gold/10 text-brand-gold rounded-xl w-fit">
            <BookOpen className="h-7 w-7" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-brand-green group-hover:text-brand-gold transition-colors">
            Дигитална Книжарница
          </h2>
          <p className="text-sm text-brand-dark/70 leading-relaxed flex-1">
            Готови наръчници, шаблони и обучителни материали. Купуват се онлайн с карта, четат се веднага в защитения
            ви профил. Идеално за самоподготовка преди инспекция.
          </p>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-green group-hover:text-brand-gold transition-colors">
            Виж каталога <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </span>
        </Link>

        <Link
          href="/contact"
          className="group bg-white rounded-2xl border border-brand-green/10 p-8 space-y-4 shadow-md hover:shadow-xl hover:border-brand-gold/40 transition-all duration-300 cursor-pointer flex flex-col"
        >
          <div className="p-3 bg-brand-green/10 text-brand-green rounded-xl w-fit">
            <Users className="h-7 w-7" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-brand-green group-hover:text-brand-gold transition-colors">
            Живо обучение на място
          </h2>
          <p className="text-sm text-brand-dark/70 leading-relaxed flex-1">
            Персонално обучение на персонала ви по НАССР, хигиенни практики и подготовка за БАБХ инспекции. Издава
            се официален сертификат за всеки участник.
          </p>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-green group-hover:text-brand-gold transition-colors">
            Заяви обучение <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </span>
        </Link>
      </section>

      {/* What you get */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 space-y-8">
        <div className="text-center space-y-2">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-brand-green">Какво получавате</h3>
          <p className="text-sm text-brand-dark/60 max-w-2xl mx-auto">
            Независимо коя форма изберете, материалите ни се основават на актуалните регулации и над 20 години
            практика в консултирането на хранителни обекти.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: Award, title: "Сертификат", text: "Официален документ за проведено обучение при живите курсове." },
            { icon: CheckCircle, title: "Актуални документи", text: "Шаблони, които отговарят на последните изисквания на БАБХ." },
            { icon: Building, title: "Практически примери", text: "Реални казуси от ресторанти, цехове и магазини." },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="bg-white rounded-2xl border border-brand-green/5 p-6 space-y-3 shadow-sm">
              <div className="p-2.5 bg-brand-gold/10 text-brand-gold rounded-xl w-fit">
                <Icon className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-brand-green">{title}</h4>
              <p className="text-xs text-brand-dark/60 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
