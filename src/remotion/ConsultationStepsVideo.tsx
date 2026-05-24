import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import React from "react";

const steps = [
  {
    title: "1. Резервация",
    desc: "Изберете пакет и свободен час от формата. Веднага ще получите потвърждение с детайли за срещата.",
  },
  {
    title: "2. Подготовка",
    desc: "Можете да изпратите Ваши документи, скици или снимки на обекта, за да се запознаем с тях предварително.",
  },
  {
    title: "3. Среща",
    desc: "Свързваме се по видеовръзка (Google Meet) или телефон. Анализираме казуса Ви и набелязваме план за действие.",
  },
  {
    title: "4. Резултати",
    desc: "До 24 часа след срещата получавате писмен опис с насоки, чек-листове или образци, нужни за бизнеса Ви.",
  }
];

export const ConsultationStepsVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill className="bg-transparent font-sans flex flex-col justify-center px-6 relative py-4">
      {/* The vertical line */}
      <div 
        className="absolute left-[34px] top-10 bottom-10 w-1 bg-gradient-to-b from-brand-gold/50 via-brand-green/20 to-transparent rounded-full"
        style={{
           transformOrigin: "top",
           transform: `scaleY(${Math.min(1, frame / 120)})`
        }}
      ></div>

      <div className="space-y-6 relative ml-12">
        {steps.map((step, i) => {
          const startFrame = i * 25; 
          const exitFrame = 270 + i * 5; 
          
          const enterProgress = spring({
            frame: frame - startFrame,
            fps,
            config: { damping: 14, mass: 0.8 }
          });

          const exitProgress = spring({
            frame: frame - exitFrame,
            fps,
            config: { damping: 14, mass: 0.8 }
          });
          
          if (frame < startFrame - 5) return null;
          
          const opacity = Math.max(0, enterProgress - exitProgress);
          const translateX = (1 - enterProgress) * -40 + exitProgress * 40;
          const pulse = Math.sin((frame - startFrame) / 8) * 0.15 + 0.85;

          return (
             <div 
               key={i}
               className="relative"
               style={{
                 opacity,
                 transform: `translateX(${translateX}px)`
               }}
             >
                {/* Timeline Dot */}
                <div 
                  className="absolute -left-[45px] top-6 w-5 h-5 rounded-full bg-brand-gold shadow-[0_0_15px_rgba(212,175,55,0.6)] border-4 border-white z-10"
                  style={{ transform: `scale(${pulse})` }}
                ></div>
                
                {/* Content Card */}
                <div className="bg-gradient-to-r from-brand-green/[0.04] to-transparent p-5 sm:p-6 rounded-2xl border border-brand-green/10 shadow-sm backdrop-blur-md relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-brand-green/20"></div>
                  <strong className="text-brand-green text-xl sm:text-2xl font-bold block mb-2">{step.title}</strong>
                  <span className="text-base sm:text-lg text-brand-dark/80 leading-relaxed font-medium">{step.desc}</span>
                </div>
             </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
