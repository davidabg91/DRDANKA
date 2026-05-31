"use client";

import React, { useEffect, useState } from "react";
import { Player } from "@remotion/player";
import { ConsultationStepsVideo } from "./ConsultationStepsVideo";
import { HelpCircle } from "lucide-react";

export default function ConsultationStepsWidget() {
  const [isMounted, setIsMounted] = useState(false);
  const [dimensions, setDimensions] = useState({ w: 800, h: 650 });

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    const updateDimensions = () => {
      if (window.innerWidth < 640) {
        setDimensions({ w: 400, h: 750 });
      } else {
        setDimensions({ w: 800, h: 650 });
      }
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => {
      window.removeEventListener("resize", updateDimensions);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-20 p-6 sm:p-10 bg-white border border-brand-green/10 rounded-2xl shadow-sm hover:shadow-xl hover:border-brand-gold/30 transition-all duration-500 relative overflow-hidden group">
      {/* Subtle glow on hover */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-gold/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
      
      <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-green mb-2 flex items-center relative z-10">
        <HelpCircle className="h-6 w-6 text-brand-gold mr-3 shrink-0 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-500" />
        Как протича една онлайн консултация?
      </h3>
      
      <div className="w-full relative h-[750px] sm:h-[650px] -ml-2 sm:-ml-4">
        {isMounted && (
          <Player
            acknowledgeRemotionLicense={true}
            component={ConsultationStepsVideo}
            durationInFrames={300} // 10 seconds total loop
            compositionWidth={dimensions.w}
            compositionHeight={dimensions.h}
            fps={30}
            style={{ width: "100%", height: "100%", backgroundColor: "transparent" }}
            controls={false}
            autoPlay={true}
            loop={true}
            initiallyMuted={true}
          />
        )}
      </div>
    </div>
  );
}
