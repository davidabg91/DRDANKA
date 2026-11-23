import React, { ReactNode } from "react";

interface PageHeroProps {
  badgeText?: string;
  title: string | ReactNode;
  subtitle?: string | ReactNode;
  icon?: React.ElementType;
}

/**
 * Shared page header. Same visual language as the home and services heroes:
 * flat deep green, thin gold rings, a gold eyebrow line and a large left-aligned
 * title. On wide screens the page icon sits in a ringed medallion on the right.
 */
export default function PageHero({ badgeText, title, subtitle, icon: Icon }: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-[#0A1F18] z-10">
      {/* Soft light from the top-right corner */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(60rem 28rem at 100% 0%, rgba(197,168,128,0.16), transparent 60%), radial-gradient(40rem 22rem at 0% 100%, rgba(15,56,43,0.9), transparent 70%)",
        }}
      />
      {/* Gold rings */}
      <div aria-hidden className="absolute -z-10 -right-64 -top-72 w-[52rem] h-[52rem] rounded-full border border-brand-gold/15 pointer-events-none" />
      <div aria-hidden className="absolute -z-10 -right-40 -top-48 w-[38rem] h-[38rem] rounded-full border border-brand-gold/10 pointer-events-none" />
      <div aria-hidden className="absolute -z-10 -left-32 -bottom-40 w-[22rem] h-[22rem] rounded-full border border-white/[0.06] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 flex items-center justify-between gap-12">
        <div className="min-w-0 max-w-3xl">
          {badgeText && (
            <div className="flex items-center gap-3 mb-5">
              <span aria-hidden className="h-px w-8 shrink-0 bg-brand-gold" />
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-gold">
                {badgeText}
              </span>
            </div>
          )}

          <h1 className="font-logo text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.08] text-balance">
            {title}
          </h1>

          {subtitle && (
            <p className="mt-5 text-base sm:text-lg text-white/75 leading-relaxed max-w-2xl">
              {subtitle}
            </p>
          )}
        </div>

        {Icon && (
          <div aria-hidden className="hidden lg:grid shrink-0 place-items-center h-52 w-52 rounded-full border border-brand-gold/20">
            <div className="grid place-items-center h-36 w-36 rounded-full border border-brand-gold/30 bg-brand-gold/[0.07] backdrop-blur-sm">
              <Icon className="h-14 w-14 text-brand-gold" strokeWidth={1.25} />
            </div>
          </div>
        )}
      </div>

      {/* Gold hairline that fades out at both ends */}
      <div aria-hidden className="h-px bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent" />
    </section>
  );
}
