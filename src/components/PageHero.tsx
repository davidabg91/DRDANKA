import React, { ReactNode } from "react";
import { Sparkles } from "lucide-react";

interface PageHeroProps {
  badgeText?: string;
  title: string | ReactNode;
  subtitle?: string | ReactNode;
  icon?: React.ElementType;
}

export default function PageHero({ badgeText, title, subtitle, icon: Icon }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0A1F18] via-[#0D2B1C] to-[#081410] border-b border-brand-gold/20 py-10 sm:py-14 z-10">
      {/* Glow blobs */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-brand-gold/15 rounded-full blur-[80px] pointer-events-none translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-brand-green/30 rounded-full blur-[80px] pointer-events-none -translate-x-1/2 translate-y-1/2" />
      
      {/* Mesh/grid pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "repeating-linear-gradient(45deg, #ffffff 0, #ffffff 1px, transparent 1px, transparent 20px), repeating-linear-gradient(-45deg, #ffffff 0, #ffffff 1px, transparent 1px, transparent 20px)"
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {badgeText && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold mb-4 shadow-lg shadow-brand-gold/5 backdrop-blur-md">
            {Icon ? <Icon className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{badgeText}</span>
          </div>
        )}
        
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight drop-shadow-md mb-4 max-w-4xl">
          {title}
        </h1>
        
        {subtitle && (
          <p className="text-sm sm:text-base text-white/70 max-w-2xl font-light leading-relaxed drop-shadow-sm">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
