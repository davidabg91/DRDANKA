"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Video, Calendar, Users, Award, ArrowRight, Sparkles, ShieldCheck, BookOpen,
} from "lucide-react";
import { LIVE_COURSES } from "@/data/live-courses";
import { usePriceOverrides, resolvePrice } from "@/lib/priceOverrides";

/**
 * /live — catalog of group online courses (Zoom / Google Meet) run by Dr. Danka.
 *
 * Each card opens a detail page with a sign-up form. Buyers enter the
 * /enrollments queue; admin contacts them with the scheduled date once a
 * group is formed.
 */
export default function LiveCoursesPage() {
  const { overrides } = usePriceOverrides();
  return (
    <div className="bg-brand-light min-h-screen pb-24">
      <section className="bg-brand-green text-white py-16 border-b border-brand-gold/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-brand-gold">
            <Video className="h-3.5 w-3.5" />
            Live онлайн обучения
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold">
            Курсове с д-р Данка в Zoom
          </h1>
          <p className="text-sm sm:text-base text-white/70 max-w-2xl mx-auto font-light">
            Групови live сесии с лична обратна връзка по Вашите казуси. Записвате се, ние Ви пишем с дата, когато
            се сформира група.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {LIVE_COURSES.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-10 text-center space-y-2">
            <Video className="h-10 w-10 text-brand-gold/50 mx-auto" />
            <p className="text-brand-dark/60 text-sm">Скоро добавяме нови курсове.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {LIVE_COURSES.map(c => (
              <Link
                key={c.slug}
                href={`/live/${c.slug}`}
                className="group relative bg-white rounded-3xl border border-brand-green/10 hover:border-brand-gold/50 overflow-hidden shadow-md hover:shadow-2xl hover:shadow-brand-gold/20 hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer"
              >
                <div className="relative aspect-[4/3] bg-gradient-to-br from-brand-green/15 to-brand-gold/15 overflow-hidden">
                  {c.card.cover ? (
                    <Image
                      src={c.card.cover}
                      alt={c.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className={`object-cover group-hover:scale-110 transition-transform duration-700 ${c.slug === 'haccp-dhpp-praktika' ? 'object-top' : 'object-center'}`}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative">
                        <div className="absolute inset-0 rounded-2xl bg-brand-gold/30 blur-2xl animate-pulse" />
                        <Video className="relative h-20 w-20 text-brand-green/40" strokeWidth={1.5} />
                      </div>
                    </div>
                  )}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/30 to-transparent" />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider bg-white/95 backdrop-blur-sm text-brand-green px-2.5 py-1 rounded-full shadow-sm">
                      <Video className="h-3 w-3" /> {c.platform === "zoom" ? "Zoom" : "Google Meet"}
                    </span>
                    {c.hasCertificate && (
                      <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider bg-brand-gold text-brand-dark px-2.5 py-1 rounded-full shadow-sm">
                        <Award className="h-3 w-3" /> Сертификат
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5 sm:p-6 flex flex-col flex-1 gap-3">
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-green leading-snug group-hover:text-brand-gold transition-colors">
                    {c.title}
                  </h3>
                  <p className="text-xs text-brand-dark/60 leading-relaxed line-clamp-2 flex-1">{c.tagline}</p>

                  {/* Quick facts row */}
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-brand-dark/50">
                    {c.format && (
                      <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3 text-brand-gold" /> {c.format}</span>
                    )}
                    {c.groupSize && (
                      <span className="inline-flex items-center gap-1"><Users className="h-3 w-3 text-brand-gold" /> {c.groupSize}</span>
                    )}
                  </div>

                  <div className="flex items-end justify-between pt-4 mt-auto border-t border-brand-green/5">
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-brand-dark/40 block leading-none">Цена</span>
                      <span className="font-serif text-2xl sm:text-3xl font-bold text-brand-gold leading-tight">
                        {resolvePrice(c.slug, overrides, c.priceEur).toFixed(2)}<span className="text-sm text-brand-dark/50 font-sans ml-0.5">€</span>
                      </span>
                    </div>
                    <span className="relative overflow-hidden inline-flex items-center gap-1.5 px-4 py-2.5 bg-brand-green group-hover:bg-brand-gold text-white group-hover:text-brand-dark font-bold text-[10px] uppercase tracking-widest rounded-full shadow-md group-hover:shadow-lg group-hover:shadow-brand-gold/40 transition-all duration-300">
                      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 pointer-events-none" />
                      Виж
                      <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Cross-sell to ready library */}
        <Link
          href="/library"
          className="group relative block overflow-hidden rounded-3xl bg-gradient-to-br from-[#0A1F18] via-[#0F2A20] to-[#1A3D2E] border border-brand-gold/25 shadow-2xl shadow-brand-green/20 hover:shadow-brand-gold/20 transition-all duration-500 cursor-pointer mt-12"
        >
          <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 bg-brand-gold/20 rounded-full blur-3xl opacity-60 group-hover:opacity-80 transition-opacity duration-700" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 w-72 h-72 bg-brand-green/40 rounded-full blur-3xl opacity-40 group-hover:opacity-60 transition-opacity duration-700" />
          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 p-6 sm:p-10 items-center">
            <div className="lg:col-span-3 flex justify-center lg:justify-start">
              <div className="relative">
                <div className="absolute inset-0 rounded-3xl bg-brand-gold/30 blur-2xl animate-pulse" />
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-brand-gold to-brand-gold/70 flex items-center justify-center shadow-xl shadow-brand-gold/40 group-hover:scale-105 transition-transform duration-500">
                  <BookOpen className="h-12 w-12 sm:h-14 sm:w-14 text-brand-dark" strokeWidth={2.5} />
                </div>
              </div>
            </div>
            <div className="lg:col-span-6 space-y-3 text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-brand-gold">
                <Sparkles className="h-3 w-3" />
                Бързо решение?
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                Готови <span className="text-brand-gold">обучения</span>
              </h2>
              <p className="text-sm text-white/70 leading-relaxed max-w-xl">
                Не искате да чакате група? Дигиталната ни книжарница има PDF наръчници и видео обучения, които
                можете да започнете веднага.
              </p>
            </div>
            <div className="lg:col-span-3 flex justify-center lg:justify-end">
              <span className="relative overflow-hidden inline-flex items-center gap-2 px-6 py-4 bg-brand-gold hover:bg-brand-gold-light text-brand-dark font-bold text-xs uppercase tracking-widest rounded-full shadow-lg shadow-brand-gold/30 transition-all duration-300 whitespace-nowrap">
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 pointer-events-none" />
                Виж готовите
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </div>
          </div>
        </Link>
      </section>
    </div>
  );
}
