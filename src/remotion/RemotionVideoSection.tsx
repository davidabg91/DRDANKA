"use client";

import React, { useEffect, useRef } from "react";
import { Player, PlayerRef } from "@remotion/player";
import { SubscriptionVideo } from "./SubscriptionVideo";
import Link from "next/link";

export default function RemotionVideoSection() {
  const [isMounted, setIsMounted] = React.useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-20 relative overflow-hidden bg-brand-dark/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white mb-4">
            Абонамент <span className="text-brand-gold">„БАБХ Спокойствие“</span>
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Всичко необходимо за вашия бизнес в една цялостна система. Изгледайте видеото по-долу.
          </p>
        </div>

        {/* Remotion Player Container */}
        <div className="max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(212,175,55,0.15)] border border-white/10 aspect-video bg-black">
          {isMounted && (
            <Player
              acknowledgeRemotionLicense={true}
              component={SubscriptionVideo}
              durationInFrames={300}
              compositionWidth={1280}
              compositionHeight={720}
              fps={30}
              style={{
                width: "100%",
                height: "100%",
              }}
              controls={true}
              autoPlay={true}
              loop={true}
              initiallyMuted={true}
            />
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12">
          <Link href="/profile?tab=register" className="px-8 py-4 bg-brand-gold text-brand-dark font-bold rounded-xl hover:bg-yellow-400 transition-all transform hover:-translate-y-1 shadow-[0_0_20px_rgba(212,175,55,0.4)] text-lg">
            Кандидатствай за Абонамент
          </Link>
          <Link href="/profile?tab=login" className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-all text-lg">
            Влез в профила си
          </Link>
        </div>
      </div>
    </section>
  );
}
