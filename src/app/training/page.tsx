"use client";

import Link from "next/link";
import {
  GraduationCap, BookOpen, Award, ArrowRight, CheckCircle, Building,
  Video, ShieldCheck, Play, Sparkles,
} from "lucide-react";

/**
 * /training — landing for the two distinct paid offerings.
 *
 *   - /bookstore  — digital PDFs (one-time download, read in portal)
 *   - /trainings  — specialized online lectures + video courses with certificate
 *
 * Each card is a full premium panel (gradient base, glow blobs, big icon
 * tile, bullet trust signals, shimmer CTA) — the page acts as a fork
 * between the two business lines.
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
            Подгответе персонала, документацията и обекта си за изискванията на БАБХ. Изберете формата, която
            пасва на Вашето темпо — четене или живо обучение.
          </p>
        </div>
      </section>

      {/* Three premium cards */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ───── CARD 1: Digital bookstore (Video courses) ───── */}
        <Link
          href="/library"
          className="group relative block overflow-hidden rounded-3xl bg-gradient-to-br from-[#0A1F18] via-[#0F2A20] to-[#1A3D2E] border border-brand-gold/25 shadow-2xl shadow-brand-green/20 hover:shadow-brand-gold/20 transition-all duration-500 cursor-pointer"
        >
          {/* Glow blobs */}
          <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 bg-brand-gold/20 rounded-full blur-3xl opacity-60 group-hover:opacity-90 transition-opacity duration-700" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 w-72 h-72 bg-brand-green/40 rounded-full blur-3xl opacity-40 group-hover:opacity-60 transition-opacity duration-700" />

          {/* Diagonal mesh */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, transparent, transparent 18px, rgba(255,255,255,0.4) 18px, rgba(255,255,255,0.4) 19px)",
            }}
          />

          <div className="relative p-7 sm:p-10 flex flex-col gap-5 h-full">
            <div className="flex items-start justify-between gap-4">
              <div className="relative">
                <div className="absolute inset-0 rounded-3xl bg-brand-gold/30 blur-2xl animate-pulse" />
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-brand-gold to-brand-gold/70 flex items-center justify-center shadow-xl shadow-brand-gold/40 group-hover:scale-105 transition-transform duration-500">
                  <BookOpen className="h-10 w-10 sm:h-12 sm:w-12 text-brand-dark" strokeWidth={2.5} />
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-brand-gold bg-brand-gold/10 border border-brand-gold/30 px-3 py-1.5 rounded-full">
                <Sparkles className="h-3 w-3" />
                Започни веднага
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-tight">
                Готови <span className="text-brand-gold">обучения</span>
              </h2>
              <p className="text-sm text-white/70 leading-relaxed">
                Видео и практически обучения от д-р Николова. Купувате с карта, получавате достъп веднага. Учите във Вашето темпо.
              </p>
            </div>

            <ul className="space-y-1.5 mt-auto">
              {[
                "Достъп веднага след плащане",
                "Видео и PDF формат за самоподготовка",
                "Учите във Вашето темпо",
              ].map((b) => (
                <li key={b} className="flex items-center gap-2 text-xs text-white/80">
                  <CheckCircle className="h-3.5 w-3.5 text-brand-gold shrink-0" />
                  {b}
                </li>
              ))}
            </ul>

            <span className="relative overflow-hidden inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-gold hover:bg-brand-gold-light text-brand-dark font-bold text-xs uppercase tracking-widest rounded-full shadow-lg shadow-brand-gold/30 transition-all duration-300 mt-2 w-fit">
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 pointer-events-none" />
              Виж готовите обучения
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </div>
        </Link>

        {/* ───── CARD 2: Live online courses ───── */}
        <Link
          href="/live"
          className="group relative block overflow-hidden rounded-3xl bg-gradient-to-br from-[#0A1F18] via-[#0F2A20] to-[#1A3D2E] border border-brand-gold/25 shadow-2xl shadow-brand-green/20 hover:shadow-brand-gold/20 transition-all duration-500 cursor-pointer"
        >
          {/* Glow blobs */}
          <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 bg-brand-gold/20 rounded-full blur-3xl opacity-60 group-hover:opacity-90 transition-opacity duration-700" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 w-72 h-72 bg-brand-green/40 rounded-full blur-3xl opacity-40 group-hover:opacity-60 transition-opacity duration-700" />

          {/* Diagonal mesh */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(-45deg, transparent, transparent 18px, rgba(255,255,255,0.4) 18px, rgba(255,255,255,0.4) 19px)",
            }}
          />

          <div className="relative p-7 sm:p-10 flex flex-col gap-5 h-full">
            <div className="flex items-start justify-between gap-4">
              <div className="relative">
                <div className="absolute inset-0 rounded-3xl bg-brand-gold/30 blur-2xl animate-pulse" />
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-brand-gold to-brand-gold/70 flex items-center justify-center shadow-xl shadow-brand-gold/40 group-hover:scale-105 transition-transform duration-500">
                  <Video className="h-10 w-10 sm:h-12 sm:w-12 text-brand-dark" strokeWidth={2.5} />
                  <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full bg-brand-green border-4 border-[#0A1F18] flex items-center justify-center shadow-lg">
                    <Play className="h-3 w-3 text-brand-gold fill-brand-gold ml-0.5" />
                  </div>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-brand-gold bg-brand-gold/10 border border-brand-gold/30 px-3 py-1.5 rounded-full">
                <Video className="h-3 w-3" />
                Live с д-р Данка
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-tight">
                Live <span className="text-brand-gold">курсове</span>
              </h2>
              <p className="text-sm text-white/70 leading-relaxed">
                Групови онлайн обучения по Zoom / Google Meet, водени лично от д-р Николова. Записвате се, ние
                Ви пишем с дата при сформирана група.
              </p>
            </div>

            <ul className="space-y-1.5 mt-auto">
              {[
                "Малки групи с лична обратна връзка",
                "Zoom / Google Meet сесии",
                "Сертификат след тестове",
              ].map((b) => (
                <li key={b} className="flex items-center gap-2 text-xs text-white/80">
                  <CheckCircle className="h-3.5 w-3.5 text-brand-gold shrink-0" />
                  {b}
                </li>
              ))}
            </ul>

            <span className="relative overflow-hidden inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-gold hover:bg-brand-gold-light text-brand-dark font-bold text-xs uppercase tracking-widest rounded-full shadow-lg shadow-brand-gold/30 transition-all duration-300 mt-2 w-fit">
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 pointer-events-none" />
              Виж Live курсовете
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </div>
        </Link>

        {/* ───── CARD 3: Manuals and Documents ───── */}
        <Link
          href="/manuals"
          className="group relative block overflow-hidden rounded-3xl bg-gradient-to-br from-[#0A1F18] via-[#0F2A20] to-[#1A3D2E] border border-brand-gold/25 shadow-2xl shadow-brand-green/20 hover:shadow-brand-gold/20 transition-all duration-500 cursor-pointer"
        >
          {/* Glow blobs */}
          <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 bg-brand-gold/20 rounded-full blur-3xl opacity-60 group-hover:opacity-90 transition-opacity duration-700" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 w-72 h-72 bg-brand-green/40 rounded-full blur-3xl opacity-40 group-hover:opacity-60 transition-opacity duration-700" />

          {/* Diagonal mesh */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(-45deg, transparent, transparent 18px, rgba(255,255,255,0.4) 18px, rgba(255,255,255,0.4) 19px)",
            }}
          />

          <div className="relative p-7 sm:p-10 flex flex-col gap-5 h-full">
            <div className="flex items-start justify-between gap-4">
              <div className="relative">
                <div className="absolute inset-0 rounded-3xl bg-brand-gold/30 blur-2xl animate-pulse" />
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-brand-gold to-brand-gold/70 flex items-center justify-center shadow-xl shadow-brand-gold/40 group-hover:scale-105 transition-transform duration-500">
                  <BookOpen className="h-10 w-10 sm:h-12 sm:w-12 text-brand-dark" strokeWidth={2.5} />
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-brand-gold bg-brand-gold/10 border border-brand-gold/30 px-3 py-1.5 rounded-full">
                <ShieldCheck className="h-3 w-3" />
                Готови документи
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-tight">
                Наръчници и <span className="text-brand-gold">чек листи</span>
              </h2>
              <p className="text-sm text-white/70 leading-relaxed">
                Професионални ръководства, въпросници и чек листи за проверка на документацията и етикетите. Изтегляте веднага.
              </p>
            </div>

            <ul className="space-y-1.5 mt-auto">
              {[
                "Готови за ползване",
                "PDF формат",
                "Практически насочени",
              ].map((b) => (
                <li key={b} className="flex items-center gap-2 text-xs text-white/80">
                  <CheckCircle className="h-3.5 w-3.5 text-brand-gold shrink-0" />
                  {b}
                </li>
              ))}
            </ul>

            <span className="relative overflow-hidden inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-gold hover:bg-brand-gold-light text-brand-dark font-bold text-xs uppercase tracking-widest rounded-full shadow-lg shadow-brand-gold/30 transition-all duration-300 mt-2 w-fit">
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 pointer-events-none" />
              Виж документите
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </div>
        </Link>
      </section>

      {/* What you get */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 space-y-8">
        <div className="text-center space-y-2">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-brand-green">Какво получавате</h3>
          <p className="text-sm text-brand-dark/60 max-w-2xl mx-auto">
            Независимо коя форма изберете, материалите ни се основават на актуалните регулации и над 20 години
            практика в консултирането на хранителни обекти.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: Award, title: "Сертификат за обучение", text: "Личен сертификат от д-р Николова, удостоверяващ преминатото обучение." },
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
