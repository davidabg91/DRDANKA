"use client";

import Link from "next/link";
import Image from "next/image";
import {
  BookOpen, ShieldCheck, Video, ArrowRight,
} from "lucide-react";
import { LIBRARY_MATERIALS } from "@/data/library";
import { usePriceOverrides, resolvePrice } from "@/lib/priceOverrides";
import PageHero from "@/components/PageHero";

/**
 * /books — catalog of Dr. Nikolova's books (LIBRARY_MATERIALS with category "book").
 *
 * Content is curated in src/data/library/ (no admin upload). The cross-sell
 * banner at the bottom links to /live for buyers who want a live session
 * instead.
 */
export default function BooksPage() {
  const { overrides } = usePriceOverrides();
  const bookMaterials = LIBRARY_MATERIALS.filter(m => m.category === "book");
  return (
    <div className="min-h-screen pb-24">
      <PageHero
        badgeText="Книги"
        title="Книги на д-р Николова"
        subtitle="Практически книги за безопасност на храните, НАССР и изискванията на БАБХ — написани от д-р Данка Николова."
        icon={BookOpen}
      />

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {bookMaterials.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-10 text-center space-y-2">
            <BookOpen className="h-10 w-10 text-brand-gold/50 mx-auto" />
            <p className="text-brand-dark/60 text-sm">Очаквайте скоро — първите книги са в подготовка.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {bookMaterials.map(m => (
              <Link
                key={m.slug}
                href={`/library/${m.slug}`}
                className="group relative bg-white rounded-3xl border border-brand-green/10 hover:border-brand-gold/50 overflow-hidden shadow-md hover:shadow-2xl hover:shadow-brand-gold/20 hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer"
              >
                <div className="relative aspect-[4/3] bg-gradient-to-br from-brand-green/15 to-brand-gold/15 overflow-hidden">
                  {m.card.cover ? (
                    <Image
                      src={m.card.cover}
                      alt={m.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover object-center group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative">
                        <div className="absolute inset-0 rounded-2xl bg-brand-gold/30 blur-2xl animate-pulse" />
                        {m.type === "video"
                          ? <Video className="relative h-20 w-20 text-brand-green/40" strokeWidth={1.5} />
                          : <BookOpen className="relative h-20 w-20 text-brand-green/40" strokeWidth={1.5} />}
                      </div>
                    </div>
                  )}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/30 to-transparent" />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider bg-white/95 backdrop-blur-sm text-brand-green px-2.5 py-1 rounded-full shadow-sm">
                      {m.type === "video" ? <><Video className="h-3 w-3" /> Видео</> : <><BookOpen className="h-3 w-3" /> Книга</>}
                    </span>
                  </div>
                  {m.card.badge && (
                    <div className="absolute top-3 right-3">
                      <span className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm ${
                        m.card.badge.includes('50%') || m.card.badge.includes('Отстъпка')
                          ? 'bg-red-600 text-white animate-pulse shadow-red-600/30' 
                          : 'bg-brand-gold text-brand-dark'
                      }`}>
                        {m.card.badge}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5 sm:p-6 flex flex-col flex-1 gap-3">
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-green leading-snug group-hover:text-brand-gold transition-colors">
                    {m.title}
                  </h3>
                  <p className="text-xs text-brand-dark/60 leading-relaxed line-clamp-2 flex-1">{m.tagline}</p>

                  <div className="flex items-end justify-between pt-4 mt-auto border-t border-brand-green/5">
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-brand-dark/40 block leading-none mb-1">Цена</span>
                      <div className="flex flex-col">
                        {m.originalPriceEur && (
                          <span className="font-serif text-base sm:text-lg text-brand-dark/40 line-through decoration-red-500/60 decoration-2 leading-none mb-0.5">
                            {m.originalPriceEur.toFixed(2)}€
                          </span>
                        )}
                        <span className="font-serif text-2xl sm:text-3xl font-bold text-brand-gold leading-none">
                          {resolvePrice(m.slug, overrides, m.priceEur).toFixed(2)}<span className="text-sm text-brand-dark/50 font-sans ml-0.5">€</span>
                        </span>
                      </div>
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


        <div className="mt-10 bg-white rounded-2xl border border-brand-green/5 p-6 sm:p-8 flex items-start gap-4">
          <ShieldCheck className="h-6 w-6 text-brand-gold shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-brand-green text-sm">Сигурен достъп</p>
            <p className="text-xs text-brand-dark/60 leading-relaxed">
              Плащате с карта — без сложна регистрация. Веднага получавате достъп до материала на посочения email
              адрес.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
