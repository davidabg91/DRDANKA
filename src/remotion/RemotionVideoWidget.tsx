"use client";

import React, { useEffect, useRef } from "react";
import { Player, PlayerRef } from "@remotion/player";
import { SubscriptionVideo } from "./SubscriptionVideo";
import Link from "next/link";

export default function RemotionVideoWidget() {
  const playerRef = useRef<PlayerRef>(null);

  useEffect(() => {
    const playVideo = () => {
      if (playerRef.current) {
        try {
          playerRef.current.play();
        } catch (e) {
          console.warn("Autoplay blocked by browser", e);
        }
      }
    };
    
    // Slight delay to ensure DOM is fully ready
    const timer = setTimeout(playVideo, 150);
    return () => clearTimeout(timer);
  }, []);

  const handlePlayClick = () => {
    playerRef.current?.play();
  };

  return (
    <div className="relative group lg:col-span-5 h-[650px]" onClick={handlePlayClick}>
      {/* Ambient glow */}
      <div className="absolute -inset-1 bg-gradient-to-br from-brand-gold/30 via-amber-400/10 to-emerald-500/20 rounded-3xl blur-2xl opacity-60 group-hover:opacity-90 transition-all duration-700"></div>

      <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/8 bg-gradient-to-br from-[#0a1f17] via-[#0d2b1c] to-[#081410] flex flex-col h-full">
        {/* Remotion Player inside the card - Transparent UI Animation */}
        <div className="w-full relative flex-grow min-h-[300px]">
          <Player
            ref={playerRef}
            component={SubscriptionVideo}
            durationInFrames={375}
            compositionWidth={1000}
            compositionHeight={800}
            fps={30}
            style={{ width: "100%", height: "100%", backgroundColor: "transparent" }}
            controls={false}
            autoPlay={true}
            loop={true}
          />
        </div>
        
        {/* Card Content & Buttons */}
        <div className="p-6 sm:p-8 flex flex-col justify-end space-y-4 shrink-0 bg-gradient-to-t from-[#081410] to-transparent relative z-10 -mt-10">
          <div className="text-center mb-2">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-white leading-tight mb-1">
              Абонамент
            </h3>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-brand-gold leading-tight">
              „БАБХ Спокойствие“
            </h3>
          </div>
          
          <div className="pt-2">
            <Link
              href="/profile?tab=register"
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 bg-gradient-to-r from-brand-gold via-amber-400 to-brand-gold bg-[length:200%_auto] hover:bg-right-center text-brand-dark font-extrabold text-[11px] uppercase tracking-[0.12em] transition-all duration-500 rounded-xl shadow-lg shadow-brand-gold/25 hover:shadow-brand-gold/40 hover:scale-[1.02] active:scale-[0.98] cursor-pointer mb-3"
            >
              <span>Кандидатствай за Абонамент</span>
            </Link>
            <Link
              href="/profile?tab=login"
              className="w-full flex items-center justify-center gap-2.5 py-3 px-6 border border-white/10 hover:bg-white/5 text-white font-bold text-[11px] uppercase tracking-[0.12em] transition-all duration-300 rounded-xl cursor-pointer"
            >
              <span>Вход в портала</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
