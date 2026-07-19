"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Video, Calendar, Users, Award, ArrowRight, Sparkles, ShieldCheck, BookOpen,
} from "lucide-react";
import { LIVE_COURSES } from "@/data/live-courses";
import { usePriceOverrides, resolvePrice } from "@/lib/priceOverrides";
import PageHero from "@/components/PageHero";

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
    <div className="min-h-screen pb-24">
      <PageHero
        badgeText="Live онлайн обучения"
        title="Курсове с д-р Данка в Zoom"
        subtitle="Групови live сесии с лична обратна връзка по Вашите казуси. Записвате се, ние Ви пишем с дата, когато се сформира група."
        icon={Video}
      />

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
                <div className="relative aspect-[4/3] overflow-hidden">
                  {c.card.cover ? (
                    <>
                      <Image
                        src={c.card.cover}
                        alt={c.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className={`object-cover group-hover:scale-110 transition-transform duration-700 ${c.slug === 'haccp-dhpp-praktika' ? 'object-top' : 'object-center'}`}
                      />
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/30 to-transparent" />
                    </>
                  ) : (
                    /* Editorial header for courses without a cover photo — same visual
                       weight as a photo card, built from typography instead of an image. */
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0A1F18] via-[#0D2B1C] to-[#081410] overflow-hidden">
                      <div
                        className="absolute inset-0 pointer-events-none opacity-[0.06]"
                        style={{
                          backgroundImage:
                            "repeating-linear-gradient(45deg, #ffffff 0, #ffffff 1px, transparent 1px, transparent 18px), repeating-linear-gradient(-45deg, #ffffff 0, #ffffff 1px, transparent 1px, transparent 18px)",
                        }}
                      />
                      <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-gold/25 rounded-full blur-3xl pointer-events-none group-hover:bg-brand-gold/35 transition-colors duration-700" />
                      <div className="relative h-full flex flex-col items-start justify-end p-5 sm:p-6">
                        <span className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.2em] bg-brand-gold text-brand-dark px-3 py-1.5 rounded-full shadow-md mb-3">
                          <Sparkles className="h-3 w-3" /> {c.card.badge || "Специализиран модул"}
                        </span>
                        <span className="font-serif text-4xl sm:text-5xl font-black text-white/15 leading-none select-none group-hover:text-white/25 transition-colors duration-500">
                          {c.title.slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm ${c.card.cover ? "bg-white/95 text-brand-green" : "bg-white/10 text-white border border-white/20"}`}>
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
                      <span className="text-[9px] font-bold uppercase tracking-wider text-brand-dark/40 block leading-none mb-1">Цена</span>
                      <div className="flex items-end gap-2">
                        <span className="font-serif text-2xl sm:text-3xl font-bold text-brand-gold leading-tight">
                          {resolvePrice(c.slug, overrides, c.priceEur).toFixed(2)}<span className="text-sm text-brand-dark/50 font-sans ml-0.5">€</span>
                        </span>
                        {c.originalPriceEur && (
                          <span className="text-sm sm:text-base font-sans font-medium text-brand-dark/40 line-through mb-1.5">
                            {c.originalPriceEur.toFixed(2)}€
                          </span>
                        )}
                      </div>
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
