import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Sequence } from "remotion";
import React from "react";

// Scene 1: Intro
const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const opacity = interpolate(frame, [0, 15, 60, 75], [0, 1, 1, 0], { extrapolateRight: "clamp" });
  const scale = spring({ fps, frame, config: { damping: 12 } });

  return (
    <AbsoluteFill className="flex items-center justify-center bg-brand-dark" style={{ opacity }}>
      <div className="text-center space-y-6 transform" style={{ transform: `scale(${scale})` }}>
        <div className="w-24 h-24 mx-auto bg-brand-gold/20 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(212,175,55,0.3)]">
          <svg className="w-12 h-12 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h1 className="text-5xl font-serif font-bold text-white tracking-tight">БАБХ Спокойствие</h1>
        <p className="text-xl text-brand-gold/80 font-medium tracking-widest uppercase">Сигурност за вашия бизнес</p>
      </div>
    </AbsoluteFill>
  );
};

// Scene 2: Digital Logs
const LogsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const opacity = interpolate(frame, [0, 15, 60, 75], [0, 1, 1, 0], { extrapolateRight: "clamp" });
  const listItems = [0, 1, 2];

  return (
    <AbsoluteFill className="flex items-center justify-center bg-brand-dark" style={{ opacity }}>
      <div className="max-w-md w-full bg-white/[0.03] backdrop-blur-md p-8 rounded-3xl border border-brand-green/20">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          Дигитални Дневници
        </h2>
        <div className="space-y-4">
          {listItems.map((i) => {
            const checkScale = spring({ fps, frame: frame - 10 - (i * 10), config: { damping: 10 } });
            return (
              <div key={i} className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                <div className="w-6 h-6 rounded-full border-2 border-emerald-400 flex items-center justify-center bg-emerald-400/20" style={{ transform: `scale(${checkScale})` }}>
                  <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="h-2 w-32 bg-white/20 rounded-full"></div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 3: Audit Guarantee
const AuditScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const opacity = interpolate(frame, [0, 15, 60, 75], [0, 1, 1, 0], { extrapolateRight: "clamp" });
  const stampScale = spring({ fps, frame: frame - 15, config: { damping: 10, mass: 2 } });
  const rotate = interpolate(stampScale, [0, 1], [-20, -5]);

  return (
    <AbsoluteFill className="flex items-center justify-center bg-brand-dark" style={{ opacity }}>
      <div className="text-center relative">
        <h2 className="text-4xl font-serif font-bold text-white mb-8">Готовност за проверка на 1 клик</h2>
        <div className="relative inline-block">
          <div className="w-48 h-64 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl mx-auto shadow-2xl relative overflow-hidden flex flex-col p-4">
             <div className="h-4 w-full bg-white/20 rounded mb-4"></div>
             <div className="h-2 w-3/4 bg-white/10 rounded mb-2"></div>
             <div className="h-2 w-5/6 bg-white/10 rounded mb-2"></div>
             <div className="h-2 w-1/2 bg-white/10 rounded mb-2"></div>
          </div>
          
          <div 
            className="absolute -bottom-8 -right-12 border-4 border-emerald-500 text-emerald-500 text-3xl font-black uppercase tracking-widest px-6 py-2 rounded-lg backdrop-blur-md"
            style={{ transform: `scale(${stampScale}) rotate(${rotate}deg)`, opacity: stampScale }}
          >
            Одобрен
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 4: Conclusion & Subscription
const ConclusionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const yOffset = interpolate(frame, [0, 15], [50, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill className="flex flex-col items-center justify-center bg-brand-dark" style={{ opacity }}>
      <div className="text-center space-y-6" style={{ transform: `translateY(${yOffset}px)` }}>
        <h2 className="text-5xl font-serif font-bold text-brand-gold">Всичко в един абонамент</h2>
        <p className="text-xl text-white/70 max-w-lg mx-auto">
          Получавате достъп до всички инструменти, шаблони и функции.
        </p>
        <div className="flex justify-center gap-8 mt-8">
           <div className="bg-brand-green/20 border border-brand-green p-6 rounded-2xl flex flex-col items-center shadow-[0_0_30px_rgba(4,107,70,0.3)]">
              <span className="text-3xl mb-2">✅</span>
              <span className="text-white font-bold">100% Автоматизирано</span>
           </div>
           <div className="bg-brand-gold/10 border border-brand-gold p-6 rounded-2xl flex flex-col items-center shadow-[0_0_30px_rgba(212,175,55,0.1)]">
              <span className="text-3xl mb-2">🛡️</span>
              <span className="text-white font-bold">Сигурна защита</span>
           </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const SubscriptionVideo: React.FC = () => {
  return (
    <AbsoluteFill className="bg-brand-dark font-sans">
      <Sequence from={0} durationInFrames={75}>
        <IntroScene />
      </Sequence>
      <Sequence from={75} durationInFrames={75}>
        <LogsScene />
      </Sequence>
      <Sequence from={150} durationInFrames={75}>
        <AuditScene />
      </Sequence>
      <Sequence from={225} durationInFrames={75}>
        <ConclusionScene />
      </Sequence>
    </AbsoluteFill>
  );
};
