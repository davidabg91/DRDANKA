import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import React from "react";

const features = [
  { 
    title: "Дигитални дневници", 
    subtitle: "Попълвайте онлайн и печатайте при проверка. Всички температури и хигиена са записани сигурно.", 
    icon: (
      <svg className="w-12 h-12 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    mockup: (
      <div className="bg-black/60 border border-brand-green/30 rounded-3xl p-8 w-full mt-6 flex flex-col gap-5 shadow-inner">
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
          <span className="text-white font-bold text-xl uppercase tracking-wider">Дневник Температури</span>
          <span className="text-sm bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full uppercase tracking-widest font-bold">Днес попълнен</span>
        </div>
        <div className="flex justify-between items-center bg-white/5 p-5 rounded-2xl border border-white/5">
          <span className="text-white/70 text-lg font-medium">Хладилна витрина 1</span>
          <span className="text-white font-mono font-bold text-2xl">4.2°C <span className="text-emerald-400 text-xl ml-2">✅</span></span>
        </div>
        <div className="flex justify-between items-center bg-white/5 p-5 rounded-2xl border border-white/5">
          <span className="text-white/70 text-lg font-medium">Фризер месо</span>
          <span className="text-white font-mono font-bold text-2xl">-18.5°C <span className="text-emerald-400 text-xl ml-2">✅</span></span>
        </div>
      </div>
    )
  },
  { 
    title: "Входящ контрол на суровини", 
    subtitle: "Проследявайте всяка доставка електронно. Гаранция за качество и безопасност на всяка приета партида.", 
    icon: (
      <svg className="w-12 h-12 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
      </svg>
    ),
    mockup: (
      <div className="bg-black/60 border border-brand-green/30 rounded-3xl p-6 w-full mt-6 flex flex-col shadow-inner">
        <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-4">
          <span className="text-white font-bold text-xl uppercase tracking-wider">Дневник Входящ Контрол</span>
          <span className="text-sm bg-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full uppercase tracking-widest font-bold">Одобрен прием</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-white/80">
            <thead>
              <tr className="border-b border-white/5 text-sm text-brand-gold uppercase">
                <th className="pb-3 font-bold pr-2">Продукт/Суровина</th>
                <th className="pb-3 font-bold pr-2">Доставчик</th>
                <th className="pb-3 font-bold pr-2">Партида / №</th>
                <th className="pb-3 font-bold pr-2">t° трансп.</th>
                <th className="pb-3 font-bold pr-2">Срок годност</th>
                <th className="pb-3 font-bold text-center">Изрядност</th>
              </tr>
            </thead>
            <tbody className="text-base">
              <tr className="border-b border-white/5 bg-white/5">
                <td className="py-4 px-2 font-bold text-white whitespace-nowrap">Прясно мляко 3%</td>
                <td className="py-4 px-2 whitespace-nowrap">Бор-Чвор ООД</td>
                <td className="py-4 px-2 font-mono text-sm">L-40912</td>
                <td className="py-4 px-2 text-emerald-400 font-bold font-mono">3.5°C</td>
                <td className="py-4 px-2 text-sm">12.06.2026</td>
                <td className="py-4 px-2 text-center text-2xl">✅</td>
              </tr>
              <tr>
                <td className="py-4 px-2 font-bold text-white whitespace-nowrap">Свински врат</td>
                <td className="py-4 px-2 whitespace-nowrap">Месокомбинат</td>
                <td className="py-4 px-2 font-mono text-sm">L-883A</td>
                <td className="py-4 px-2 text-emerald-400 font-bold font-mono">-2.0°C</td>
                <td className="py-4 px-2 text-sm">05.06.2026</td>
                <td className="py-4 px-2 text-center text-2xl">✅</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  },
  { 
    title: "Индивидуална НАССР Система", 
    subtitle: "Изцяло дигитализирани процедури, строго разработени за спецификите на Вашия обект и винаги готови за БАБХ.", 
    icon: (
      <svg className="w-12 h-12 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    mockup: (
       <div className="bg-black/60 border border-brand-gold/30 rounded-3xl p-8 w-full mt-6 flex flex-col gap-6 shadow-inner">
         <div className="flex justify-between items-center border-b border-white/10 pb-4">
          <span className="text-brand-gold font-bold text-xl uppercase tracking-wider">Блок Схема на процесите</span>
          <span className="text-sm bg-brand-gold/20 text-brand-gold px-4 py-2 rounded-full uppercase tracking-widest font-bold">Активна</span>
        </div>
        <div className="flex items-center gap-4 py-4">
           <div className="w-14 h-14 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center font-bold text-white/50 text-xl">1</div>
           <div className="h-2 flex-grow bg-white/5 rounded-full relative overflow-hidden">
             <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-brand-gold/50 to-brand-gold"></div>
           </div>
           <div className="w-14 h-14 rounded-xl bg-brand-gold/20 flex items-center justify-center font-bold text-brand-gold border border-brand-gold/50 shadow-[0_0_20px_rgba(212,175,55,0.3)] text-xl">2</div>
        </div>
        <p className="text-base text-white/40 text-center font-medium">Утвърдена съгласно Регламент (ЕО) 852/2004</p>
       </div>
    )
  },
  { 
    title: "Лично представителство", 
    subtitle: "Д-р Николова застава лично до вас при проверки от БАБХ и защитава интересите на вашия обект.", 
    icon: (
      <svg className="w-12 h-12 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    mockup: (
       <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-3xl p-10 w-full mt-6 flex items-center justify-center shadow-inner relative overflow-hidden h-64">
         <div className="absolute -right-4 -bottom-10 text-emerald-500/10 text-[12rem] pointer-events-none leading-none">🛡️</div>
         <div className="text-center relative z-10 space-y-4">
           <h3 className="text-5xl font-black text-emerald-400 uppercase tracking-widest drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]">ЗАЩИТЕН ОБЕКТ</h3>
           <p className="text-xl text-emerald-100/70 font-medium">Пълна юридическа и експертна подкрепа</p>
         </div>
       </div>
    )
  },
  { 
    title: "Спешна консултация 24/7", 
    subtitle: "Бърз отговор при акт, предписание или извънреден сигнал. Ние сме на една ръка разстояние.", 
    icon: (
      <svg className="w-12 h-12 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    mockup: (
       <div className="bg-black/60 border border-white/10 rounded-3xl p-8 w-full mt-6 flex flex-col shadow-inner">
         <div className="bg-gradient-to-r from-brand-gold/10 to-transparent p-6 rounded-2xl flex items-start gap-6 border border-brand-gold/20 shadow-lg">
           <div className="w-16 h-16 bg-brand-gold rounded-full flex items-center justify-center text-brand-dark font-black text-xl shrink-0 shadow-[0_0_15px_rgba(212,175,55,0.4)]">ДН</div>
           <div className="space-y-3 pt-1">
             <p className="text-sm text-brand-gold font-bold uppercase tracking-widest">Д-р Данка Николова</p>
             <p className="text-xl text-white/90 leading-relaxed italic">"Не подписвайте акта. Идвам на място до 30 минути, за да прегледам предписанието заедно с инспекторите."</p>
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
    <AbsoluteFill className="bg-transparent font-sans flex items-center justify-center p-8 relative">
      {features.map((feat, i) => {
        // We have 5 features, 75 frames each. Total duration is 375.
        // To make it loop seamlessly, we use circular math.
        const centerFrame = i * 75;
        let localFrame = frame - centerFrame;
        
        // Wrap around logic for seamless looping
        if (localFrame < -187.5) localFrame += 375;
        if (localFrame > 187.5) localFrame -= 375;
        
        // Hide features when they are entirely outside their time window
        if (localFrame < -25 || localFrame > 95) return null;
        
        // Enter animation happens from localFrame = -15 to 0
        const enterProgress = spring({
          frame: localFrame + 15,
          fps,
          config: { damping: 14, mass: 0.8 }
        });
        
        // Exit animation happens from localFrame = 60 to 75
        const exitProgress = spring({
          frame: localFrame - 60, 
          fps,
          config: { damping: 14, mass: 0.8 }
        });
        
        const opacity = enterProgress - exitProgress;
        const translateY = (1 - enterProgress) * 70 - exitProgress * 70;
        const scale = 0.95 + enterProgress * 0.05 - exitProgress * 0.05;
        
        return (
          <div 
            key={i} 
            className="absolute w-[95%] max-w-4xl bg-[#081410]/90 border border-brand-green/30 p-10 sm:p-12 rounded-[3rem] flex flex-col shadow-[0_40px_80px_rgba(0,0,0,0.7)] backdrop-blur-3xl"
            style={{ 
              transform: `translateY(${translateY}px) scale(${scale})`, 
              opacity: Math.max(0, opacity),
              zIndex: 10 // ensure active card is on top
            }}
          >
             <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8 mb-8 border-b border-white/5 pb-8">
               <div className="w-24 h-24 bg-gradient-to-br from-brand-gold/20 to-brand-gold/5 rounded-3xl flex items-center justify-center shrink-0 border border-brand-gold/40 shadow-[0_0_30px_rgba(212,175,55,0.25)]">
                 {feat.icon}
               </div>
               <div>
                 <h4 className="text-white font-black text-3xl sm:text-4xl leading-tight mb-3 tracking-wide drop-shadow-lg">{feat.title}</h4>
                 <p className="text-white/70 text-lg sm:text-xl leading-relaxed max-w-2xl">{feat.subtitle}</p>
               </div>
             </div>
             {feat.mockup}
          </div>
        )
      })}
    </AbsoluteFill>
  );
};
