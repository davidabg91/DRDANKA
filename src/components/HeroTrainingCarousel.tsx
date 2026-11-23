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
      <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-white/[0.04] p-4">
        {/* Header + progress dots */}
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.14em] text-brand-gold">
            <GraduationCap className="h-4 w-4" />
            Най-ново от Обученията
          </span>
          <div className="flex gap-1.5">
            {ITEMS.map((item, idx) => (
              <button
                key={item.slug}
                onClick={() => setIndex(idx)}
                aria-label={`Покажи обучение ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === index ? "w-6 bg-brand-gold" : "w-2 bg-white/25 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Rotating product card (re-mounts on change to replay the fade) */}
        <Link
          key={m.slug}
          href={`/library/${m.slug}`}
          className="animate-hero-card flex items-center gap-4 rounded-xl hover:bg-white/[0.06] p-2 -mx-2 transition-colors duration-300 cursor-pointer"
        >
          <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-gradient-to-br from-brand-green/40 to-brand-gold/20 flex items-center justify-center">
            {m.card.cover ? (
              <Image
                src={m.card.cover}
                alt={m.title}
                fill
                sizes="64px"
                loading="eager"
                className="object-cover"
              />
            ) : m.type === "video" ? (
              <Video className="h-7 w-7 text-brand-gold/60" />
            ) : (
              <BookOpen className="h-7 w-7 text-brand-gold/60" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-serif text-sm sm:text-base font-bold text-white leading-snug line-clamp-2">
              {m.title}
            </h4>
            <div className="flex items-center gap-2 mt-1.5">
              {m.originalPriceEur && (
                <span className="text-xs text-white/40 line-through">
                  {m.originalPriceEur.toFixed(0)}€
                </span>
              )}
              <span className="text-brand-gold font-bold text-base leading-none">
                {price.toFixed(0)}€
              </span>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-brand-gold/70 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5" />
        </Link>

        {/* View-all button */}
        <Link
          href="/training"
          className="mt-3 pt-3 border-t border-white/10 w-full flex lg:[@media(max-height:820px)]:hidden items-center justify-center gap-2 text-white/70 hover:text-brand-gold font-semibold text-sm transition-colors duration-300 cursor-pointer"
        >
          Виж всички обучения
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
