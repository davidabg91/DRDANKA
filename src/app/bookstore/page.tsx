"use client";

import Link from "next/link";
import Image from "next/image";
import { useCourses } from "@/lib/firebaseHooks";
import { BookOpen, ShieldCheck, Video, Award, Sparkles, ArrowRight, Play } from "lucide-react";

/**
 * Public digital bookstore catalog.
 * Anyone can browse — no auth required (Firestore rules permit public read on /courses).
 */
export default function BookstorePage() {
  const { courses, loading } = useCourses(true);

  return (
    <div className="bg-brand-light min-h-screen pb-24">
      <section className="bg-brand-green text-white py-16 border-b border-brand-gold/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-brand-gold">
            <BookOpen className="h-3.5 w-3.5" />
            Дигитална Книжарница
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold">
            Книжарница за хранителен бизнес
          </h1>
          <p className="text-sm sm:text-base text-white/70 max-w-2xl mx-auto font-light">
            Практически наръчници, обучения и материали от д-р Данка Николова — изтеглят се веднага след покупка и
            се четат онлайн в защитен формат.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {loading ? (
          <div className="bg-white rounded-2xl shadow-md p-10 text-center text-brand-dark/50 text-sm">
            Зареждане на каталога…
          </div>
        ) : courses.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-10 text-center space-y-2">
            <BookOpen className="h-10 w-10 text-brand-gold/50 mx-auto" />
            <p className="text-brand-dark/60 text-sm">В момента няма публикувани материали. Скоро ще има!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {courses.map(c => (
              <Link
                key={c.id}
                href={`/courses/${c.slug || c.id}`}
                className="group relative bg-white rounded-3xl border border-brand-green/10 hover:border-brand-gold/50 overflow-hidden shadow-md hover:shadow-2xl hover:shadow-brand-gold/20 hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer"
              >
                {/* Cover */}
                <div className="relative aspect-[4/3] bg-gradient-to-br from-brand-green/15 to-brand-gold/15 overflow-hidden">
                  {c.coverImageUrl ? (
                    <Image
                      src={c.coverImageUrl}
                      alt={c.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative">
                        <div className="absolute inset-0 rounded-2xl bg-brand-gold/30 blur-2xl animate-pulse" />
                        <BookOpen className="relative h-20 w-20 text-brand-green/40" strokeWidth={1.5} />
                      </div>
                    </div>
                  )}
                  {/* Subtle bottom gradient for badge readability */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/30 to-transparent" />
                  {/* Floating chip */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider bg-white/95 backdrop-blur-sm text-brand-green px-2.5 py-1 rounded-full shadow-sm">
                      <BookOpen className="h-3 w-3" /> PDF Наръчник
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6 flex flex-col flex-1 gap-3">
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-green leading-snug group-hover:text-brand-gold transition-colors">
                    {c.title}
                  </h3>
                  <p className="text-xs text-brand-dark/60 leading-relaxed line-clamp-2 flex-1">
                    {c.description}
                  </p>

                  {/* Footer strip */}
                  <div className="flex items-end justify-between pt-4 mt-auto border-t border-brand-green/5">
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-brand-dark/40 block leading-none">Цена</span>
                      <span className="font-serif text-2xl sm:text-3xl font-bold text-brand-gold leading-tight">
                        {c.priceEur.toFixed(2)}<span className="text-sm text-brand-dark/50 font-sans ml-0.5">€</span>
                      </span>
                    </div>
                    <span className="relative overflow-hidden inline-flex items-center gap-1.5 px-4 py-2.5 bg-brand-green group-hover:bg-brand-gold text-white group-hover:text-brand-dark font-bold text-[10px] uppercase tracking-widest rounded-full shadow-md group-hover:shadow-lg group-hover:shadow-brand-gold/40 transition-all duration-300">
                      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 pointer-events-none" />
                      Купи
                      <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* ─────────── PREMIUM CROSS-SELL: SPECIALIZED ONLINE COURSES ─────────── */}
        <Link
          href="/trainings"
          className="group relative block overflow-hidden rounded-3xl bg-gradient-to-br from-[#0A1F18] via-[#0F2A20] to-[#1A3D2E] border border-brand-gold/25 shadow-2xl shadow-brand-green/20 hover:shadow-brand-gold/20 transition-all duration-500 cursor-pointer mt-12"
        >
          {/* Decorative glow blobs */}
          <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 bg-brand-gold/20 rounded-full blur-3xl opacity-60 group-hover:opacity-80 transition-opacity duration-700" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 w-72 h-72 bg-brand-green/40 rounded-full blur-3xl opacity-40 group-hover:opacity-60 transition-opacity duration-700" />

          {/* Faint diagonal mesh pattern */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, transparent, transparent 18px, rgba(255,255,255,0.4) 18px, rgba(255,255,255,0.4) 19px)",
            }}
          />

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 p-6 sm:p-10 items-center">
            {/* Left — visual element */}
            <div className="lg:col-span-3 flex justify-center lg:justify-start">
              <div className="relative">
                <div className="absolute inset-0 rounded-3xl bg-brand-gold/30 blur-2xl animate-pulse" />
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-brand-gold to-brand-gold/70 flex items-center justify-center shadow-xl shadow-brand-gold/40 group-hover:scale-105 transition-transform duration-500">
                  <Video className="h-12 w-12 sm:h-14 sm:w-14 text-brand-dark" strokeWidth={2.5} />
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-brand-green border-4 border-[#0A1F18] flex items-center justify-center shadow-lg">
                    <Play className="h-3.5 w-3.5 text-brand-gold fill-brand-gold ml-0.5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Middle — copy */}
            <div className="lg:col-span-6 space-y-3 text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-brand-gold">
                <Sparkles className="h-3 w-3" />
                Още от д-р Николова
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                Специализирани курсове <span className="text-brand-gold">по безопасност</span>
              </h2>
              <p className="text-sm text-white/70 leading-relaxed max-w-xl">
                Освен дигитални наръчници, предлагаме и онлайн обучения със сертификат, провеждани лично от
                д-р Николова. Видеа, Zoom лекции и сертификат след тестове в портала.
              </p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-x-4 gap-y-2 pt-2">
                {[
                  { Icon: Award, text: "Със сертификат" },
                  { Icon: Video, text: "Видео + Zoom" },
                  { Icon: ShieldCheck, text: "БАБХ признат" },
                ].map(({ Icon, text }) => (
                  <span key={text} className="inline-flex items-center gap-1.5 text-[11px] font-bold text-white/80">
                    <Icon className="h-3.5 w-3.5 text-brand-gold" />
                    {text}
                  </span>
                ))}
              </div>
            </div>

            {/* Right — CTA */}
            <div className="lg:col-span-3 flex justify-center lg:justify-end">
              <span className="relative overflow-hidden inline-flex items-center gap-2 px-6 py-4 bg-brand-gold hover:bg-brand-gold-light text-brand-dark font-bold text-xs uppercase tracking-widest rounded-full shadow-lg shadow-brand-gold/30 transition-all duration-300 whitespace-nowrap">
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 pointer-events-none" />
                Виж курсовете
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </div>
          </div>
        </Link>

        <div className="mt-10 bg-white rounded-2xl border border-brand-green/5 p-6 sm:p-8 flex items-start gap-4">
          <ShieldCheck className="h-6 w-6 text-brand-gold shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-brand-green text-sm">Сигурно плащане и достъп</p>
            <p className="text-xs text-brand-dark/60 leading-relaxed">
              Плащате с карта през Stripe — без сложна регистрация. След успешно плащане получавате на email-а си
              линк за достъп. Материалите се четат онлайн във вашия защитен профил.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
