import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import React from "react";

const features = [
  { 
    title: "Дигитални дневници", 
    subtitle: "Попълвайте онлайн и печатайте при проверка", 
    icon: (
      <svg className="w-6 h-6 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ) 
  },
  { 
    title: "Автоматична НАССР", 
    subtitle: "Персонализирана система за Вашия обект", 
    icon: (
      <svg className="w-6 h-6 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ) 
  },
  { 
    title: "Лично представителство", 
    subtitle: "Защита на Вашия обект при проверки от БАБХ", 
    icon: (
      <svg className="w-6 h-6 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ) 
  },
  { 
    title: "Спешна консултации", 
    subtitle: "Бърз отговор при акт или извънреден сигнал", 
    icon: (
      <svg className="w-6 h-6 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ) 
  },
];

export const SubscriptionVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  return (
    <AbsoluteFill className="bg-transparent font-sans flex flex-col items-center justify-start pt-6 px-4 space-y-4">
      {features.map((feat, i) => {
        // Stagger the entrance of each feature card by 40 frames (~1.3s)
        const delay = i * 40 + 10; 
        
        const enterSpring = spring({
          frame: frame - delay,
          fps,
          config: { damping: 14, mass: 0.8 }
        });
        
        // Add a very subtle continuous float effect after they appear
        const float = Math.sin((frame - delay) / 20) * 3;
        
        // After 240 frames (~8 seconds), they all start to fade out to loop beautifully
        const exitOpacity = frame > 260 ? Math.max(0, 1 - (frame - 260) / 30) : 1;
        
        return (
          <div 
            key={i} 
            className="w-full max-w-lg bg-white/[0.03] border border-brand-green/20 p-5 rounded-2xl flex items-center gap-5 shadow-2xl backdrop-blur-md"
            style={{ 
              transform: `scale(${enterSpring}) translateY(${float}px)`, 
              opacity: enterSpring * exitOpacity 
            }}
          >
             <div className="w-14 h-14 bg-brand-gold/15 rounded-xl flex items-center justify-center shrink-0 border border-brand-gold/30 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
               {feat.icon}
             </div>
             <div>
               <h4 className="text-white font-bold text-xl leading-tight mb-1 tracking-wide">{feat.title}</h4>
               <p className="text-white/60 text-sm leading-snug">{feat.subtitle}</p>
             </div>
          </div>
        )
      })}
    </AbsoluteFill>
  );
};
