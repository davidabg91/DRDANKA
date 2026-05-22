import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import React from "react";

const features = [
  { 
    title: "Дигитални дневници", 
    subtitle: "Попълвайте онлайн и печатайте при проверка. Всички температури и хигиена са записани сигурно.", 
    icon: (
      <svg className="w-8 h-8 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    mockup: (
      <div className="bg-black/60 border border-brand-green/30 rounded-2xl p-5 w-full mt-4 flex flex-col gap-3 shadow-inner">
        <div className="flex justify-between items-center border-b border-white/10 pb-3">
          <span className="text-white font-bold text-sm uppercase tracking-wider">Дневник Температури</span>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full uppercase tracking-widest font-bold">Днес попълнен</span>
        </div>
        <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
          <span className="text-white/70 text-sm font-medium">Хладилна витрина 1</span>
          <span className="text-white font-mono font-bold text-lg">4.2°C <span className="text-emerald-400 text-sm ml-1">✅</span></span>
        </div>
        <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
          <span className="text-white/70 text-sm font-medium">Фризер месо</span>
          <span className="text-white font-mono font-bold text-lg">-18.5°C <span className="text-emerald-400 text-sm ml-1">✅</span></span>
        </div>
      </div>
    )
  },
  { 
    title: "Индивидуална НАССР Система", 
    subtitle: "Изцяло дигитализирани процедури, строго разработени за спецификите на Вашия обект и винаги готови за БАБХ.", 
    icon: (
      <svg className="w-8 h-8 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    mockup: (
       <div className="bg-black/60 border border-brand-gold/30 rounded-2xl p-6 w-full mt-4 flex flex-col gap-4 shadow-inner">
         <div className="flex justify-between items-center border-b border-white/10 pb-3">
          <span className="text-brand-gold font-bold text-sm uppercase tracking-wider">Блок Схема на процесите</span>
          <span className="text-[10px] bg-brand-gold/20 text-brand-gold px-3 py-1 rounded-full uppercase tracking-widest font-bold">Активна</span>
        </div>
        <div className="flex items-center gap-3 py-2">
           <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center font-bold text-white/50">1</div>
           <div className="h-1.5 flex-grow bg-white/5 rounded-full relative overflow-hidden">
             <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-brand-gold/50 to-brand-gold"></div>
           </div>
           <div className="w-10 h-10 rounded-lg bg-brand-gold/20 flex items-center justify-center font-bold text-brand-gold border border-brand-gold/50 shadow-[0_0_15px_rgba(212,175,55,0.3)]">2</div>
        </div>
        <p className="text-xs text-white/40 text-center font-medium">Утвърдена съгласно Регламент (ЕО) 852/2004</p>
       </div>
    )
  },
  { 
    title: "Лично представителство", 
    subtitle: "Д-р Николова застава лично до вас при проверки от БАБХ и защитава интересите на вашия обект.", 
    icon: (
      <svg className="w-8 h-8 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    mockup: (
       <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-8 w-full mt-4 flex items-center justify-center shadow-inner relative overflow-hidden h-40">
         <div className="absolute -right-4 -bottom-4 text-emerald-500/10 text-9xl pointer-events-none">🛡️</div>
         <div className="text-center relative z-10 space-y-2">
           <h3 className="text-3xl font-black text-emerald-400 uppercase tracking-widest drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]">ЗАЩИТЕН ОБЕКТ</h3>
           <p className="text-sm text-emerald-100/70 font-medium">Пълна юридическа и експертна подкрепа</p>
         </div>
       </div>
    )
  },
  { 
    title: "Спешна консултация 24/7", 
    subtitle: "Бърз отговор при акт, предписание или извънреден сигнал. Ние сме на една ръка разстояние.", 
    icon: (
      <svg className="w-8 h-8 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    mockup: (
       <div className="bg-black/60 border border-white/10 rounded-2xl p-5 w-full mt-4 flex flex-col shadow-inner">
         <div className="bg-gradient-to-r from-brand-gold/10 to-transparent p-4 rounded-xl flex items-start gap-4 border border-brand-gold/20 shadow-md">
           <div className="w-10 h-10 bg-brand-gold rounded-full flex items-center justify-center text-brand-dark font-black text-sm shrink-0 shadow-[0_0_10px_rgba(212,175,55,0.4)]">ДН</div>
           <div className="space-y-1">
             <p className="text-xs text-brand-gold font-bold uppercase tracking-wider">Д-р Данка Николова</p>
             <p className="text-sm text-white/90 leading-relaxed italic">"Не подписвайте акта. Идвам на място до 30 минути, за да прегледам предписанието заедно с инспекторите."</p>
           </div>
         </div>
       </div>
    )
  },
];

export const SubscriptionVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  return (
    <AbsoluteFill className="bg-transparent font-sans flex items-center justify-center p-6 relative">
      {features.map((feat, i) => {
        // Since durationInFrames=300 and we have 4 features, each feature gets exactly 75 frames (2.5 seconds)
        const startFrame = i * 75;
        const endFrame = startFrame + 75;
        
        // Hide features when they are entirely outside their time window, 
        // but add a tiny buffer for smooth crossfading overlapping.
        if (frame < startFrame - 5 || frame > endFrame + 5) return null;
        
        // Enter animation: slide up and fade in
        const enterProgress = spring({
          frame: frame - startFrame,
          fps,
          config: { damping: 14, mass: 0.8 }
        });
        
        // Exit animation: slide up further and fade out, starting 15 frames before the feature's end time
        const exitProgress = spring({
          frame: frame - (endFrame - 15), 
          fps,
          config: { damping: 14, mass: 0.8 }
        });
        
        const opacity = enterProgress - exitProgress;
        const translateY = (1 - enterProgress) * 50 - exitProgress * 50;
        const scale = 0.95 + enterProgress * 0.05 - exitProgress * 0.05;
        
        return (
          <div 
            key={i} 
            className="absolute w-full max-w-2xl bg-[#081410]/80 border border-brand-green/30 p-8 sm:p-10 rounded-[2rem] flex flex-col shadow-[0_30px_60px_rgba(0,0,0,0.6)] backdrop-blur-2xl"
            style={{ 
              transform: `translateY(${translateY}px) scale(${scale})`, 
              opacity: Math.max(0, opacity),
              zIndex: 10 // ensure active card is on top
            }}
          >
             <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6 mb-6 border-b border-white/5 pb-6">
               <div className="w-16 h-16 bg-gradient-to-br from-brand-gold/20 to-brand-gold/5 rounded-2xl flex items-center justify-center shrink-0 border border-brand-gold/40 shadow-[0_0_20px_rgba(212,175,55,0.25)]">
                 {feat.icon}
               </div>
               <div>
                 <h4 className="text-white font-black text-2xl sm:text-3xl leading-tight mb-2 tracking-wide drop-shadow-md">{feat.title}</h4>
                 <p className="text-white/70 text-sm sm:text-base leading-relaxed">{feat.subtitle}</p>
               </div>
             </div>
             {feat.mockup}
          </div>
        )
      })}
    </AbsoluteFill>
  );
};
