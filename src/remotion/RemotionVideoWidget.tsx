"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

// The Remotion player + composition are ~150KB of JS that is not needed for
// first paint. Load them in a client-only chunk (ssr: false) after the hero
// renders. The fixed-height container below reserves the space, so there is no
// layout shift while the chunk loads.
const RemotionPlayerInner = dynamic(() => import("./RemotionPlayerInner"), {
  ssr: false,
});

export default function RemotionVideoWidget() {
  return (
    <div className="relative group">
      {/* Ambient glow */}
      <div className="absolute -inset-1 bg-gradient-to-br from-brand-gold/30 via-amber-400/10 to-emerald-500/20 rounded-3xl blur-2xl opacity-60 group-hover:opacity-90 transition-all duration-700"></div>

      <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/8 bg-gradient-to-br from-[#0a1f17] via-[#0d2b1c] to-[#081410] flex flex-col">
        {/* Remotion Player inside the card - Transparent UI Animation */}
        <div className="w-full relative h-[300px] sm:h-[360px]">
          <RemotionPlayerInner />
        </div>

        {/* Card Content & Buttons */}
        <div className="px-6 pb-7 sm:px-8 flex flex-col justify-end space-y-4 shrink-0 bg-gradient-to-t from-[#081410] to-transparent relative z-10 -mt-10">
          <div className="text-center">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-white leading-tight">
              Абонамент
            </h3>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-brand-gold leading-tight">
              „БАБХ Спокойствие“
            </h3>
          </div>

          <div className="flex flex-col gap-2.5">
            <Link
              href="/profile?tab=register"
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 bg-gradient-to-r from-brand-gold via-amber-400 to-brand-gold bg-[length:200%_auto] hover:bg-right-center text-brand-dark font-extrabold text-xs uppercase tracking-[0.12em] transition-all duration-500 rounded-xl shadow-lg shadow-brand-gold/25 hover:shadow-brand-gold/40 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <span>Тествай безплатно 14 дни</span>
            </Link>
            <Link
              href="/services#vip-system"
              className="w-full flex items-center justify-center gap-2.5 py-3 px-6 border border-white/10 hover:bg-white/5 text-white font-bold text-xs uppercase tracking-[0.12em] transition-all duration-300 rounded-xl cursor-pointer"
            >
              <span>Виж Информация</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
