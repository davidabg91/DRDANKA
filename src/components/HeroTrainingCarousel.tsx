"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Video, ArrowRight, GraduationCap } from "lucide-react";
import { LIBRARY_MATERIALS } from "@/data/library";
import { usePriceOverrides, resolvePrice } from "@/lib/priceOverrides";

/**
 * Compact auto-rotating showcase of the 3 newest products from the Обучения
 * catalog, shown in the hero beneath the subscription card. One product is
 * visible at a time; the deck cycles so each becomes visible in turn, and a
 * button links to the full catalog.
 */
const ITEMS = LIBRARY_MATERIALS.slice(0, 3);
const ROTATE_MS = 3800;

export default function HeroTrainingCarousel() {
  const { overrides } = usePriceOverrides();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || ITEMS.length < 2) return;
    const timer = setInterval(
      () => setIndex((p) => (p + 1) % ITEMS.length),
      ROTATE_MS,
    );
    return () => clearInterval(timer);
  }, [paused]);

  if (ITEMS.length === 0) return null;

  const m = ITEMS[index];
  const price = resolvePrice(m.slug, overrides, m.priceEur);

  return (
    <div
      className="relative group"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="absolute -inset-1 bg-gradient-to-br from-emerald-500/10 via-brand-gold/10 to-amber-400/10 rounded-3xl blur-2xl opacity-50 group-hover:opacity-80 transition-all duration-700" />

      <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-5">
        {/* Header + progress dots */}
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-brand-gold">
            <GraduationCap className="h-3.5 w-3.5" />
            Най-ново от Обученията
          </span>
          <div className="flex gap-1.5">
            {ITEMS.map((item, idx) => (
              <button
                key={item.slug}
                onClick={() => setIndex(idx)}
                aria-label={`Покажи обучение ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === index ? "w-5 bg-brand-gold" : "w-1.5 bg-white/25 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Rotating product card (re-mounts on change to replay the fade) */}
        <Link
          key={m.slug}
          href={`/library/${m.slug}`}
          className="animate-hero-card flex items-center gap-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-brand-gold/40 hover:bg-white/[0.06] p-3 transition-colors duration-300 cursor-pointer"
        >
          <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-gradient-to-br from-brand-green/40 to-brand-gold/20 flex items-center justify-center">
            {m.card.cover ? (
              <Image
                src={m.card.cover}
                alt={m.title}
                fill
                sizes="80px"
                loading="eager"
                className="object-cover"
              />
            ) : m.type === "video" ? (
              <Video className="h-8 w-8 text-brand-gold/60" />
            ) : (
              <BookOpen className="h-8 w-8 text-brand-gold/60" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-serif text-sm font-bold text-white leading-snug line-clamp-2">
              {m.title}
            </h4>
            <div className="flex items-center gap-2 mt-1.5">
              {m.originalPriceEur && (
                <span className="text-[11px] text-white/40 line-through">
                  {m.originalPriceEur.toFixed(0)}€
                </span>
              )}
              <span className="text-brand-gold font-bold text-base leading-none">
                {price.toFixed(0)}€
              </span>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-brand-gold/70 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5" />
        </Link>

        {/* View-all button */}
        <Link
          href="/training"
          className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-white/80 hover:text-brand-gold font-bold text-[11px] uppercase tracking-[0.12em] transition-all duration-300 cursor-pointer"
        >
          Виж всички обучения
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
