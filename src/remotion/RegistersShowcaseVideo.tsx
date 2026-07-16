import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import React from "react";

/**
 * „Един работен ден с електронните дневници" — hero анимация за началния екран.
 *
 * 6 сцени × 80 кадъра (30 fps, общо 480 кадъра ≈ 16 s, loop):
 *   1. Умни напомняния — червените задачи за деня стават зелени ✓
 *   2. Температурен чек-лист — автоматична проверка на нормата (0…+4°C / ≤ −18°C)
 *   3. Хигиена с едно докосване — „Отбележи ✓ за днес" + автоматичен запис
 *   4. Здравни книжки и обучения — системата напомня преди да е късно
 *   5. Печат — цялата документация, готова на А4 за проверка
 *   6. Финал — „Обектът е изряден" + 100% пръстен
 */

const SCENE_LEN = 80;

/* ---------- помощни ---------- */

function useScene(sceneIndex: number) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = sceneIndex * SCENE_LEN;
  const local = frame - start;

  const enter = spring({ frame: local, fps, config: { damping: 16, mass: 0.7 } });
  const exit = spring({ frame: local - (SCENE_LEN - 14), fps, config: { damping: 16, mass: 0.7 } });

  return {
    local,
    visible: local >= -4 && local <= SCENE_LEN + 4,
    opacity: Math.max(0, enter - exit),
    translateY: (1 - enter) * 60 - exit * 60,
    scale: 0.96 + enter * 0.04 - exit * 0.04,
  };
}

/** Обвивка на сцена — стъклена карта с общ стил */
const SceneCard: React.FC<{
  scene: ReturnType<typeof useScene>;
  step: string;
  title: string;
  children: React.ReactNode;
}> = ({ scene, step, title, children }) => (
  <div
    className="absolute w-[92%] max-w-3xl bg-[#081410]/95 border border-brand-green/25 rounded-[2.5rem] p-10 shadow-[0_40px_80px_rgba(0,0,0,0.7)] backdrop-blur-3xl"
    style={{
      transform: `translateY(${scene.translateY}px) scale(${scene.scale})`,
      opacity: scene.opacity,
    }}
  >
    <div className="flex items-center gap-4 mb-7">
      <span className="text-[11px] font-black tracking-[0.3em] uppercase text-brand-gold/80 bg-brand-gold/10 border border-brand-gold/30 rounded-full px-4 py-1.5">
        {step}
      </span>
      <h3 className="text-white font-black text-3xl tracking-wide drop-shadow-lg">{title}</h3>
    </div>
    {children}
  </div>
);

/** Плъзгащ се ред с отложена поява */
const Slide: React.FC<{ local: number; delay: number; children: React.ReactNode; fps: number }> = ({
  local,
  delay,
  children,
  fps,
}) => {
  const p = spring({ frame: local - delay, fps, config: { damping: 15, mass: 0.6 } });
  return (
    <div style={{ opacity: p, transform: `translateX(${(1 - p) * 40}px)` }}>{children}</div>
  );
};

/** „Печатане" на число: показва по една цифра */
const typed = (text: string, local: number, startAt: number, speed = 4) => {
  const chars = Math.max(0, Math.floor((local - startAt) / speed));
  return text.slice(0, chars);
};

/* ---------- Сцена 1: Напомняния ---------- */

const ReminderRow: React.FC<{ local: number; fps: number; delay: number; doneAt: number; text: string }> = ({
  local,
  fps,
  delay,
  doneAt,
  text,
}) => {
  const appear = spring({ frame: local - delay, fps, config: { damping: 15 } });
  const done = spring({ frame: local - doneAt, fps, config: { damping: 11, mass: 0.5 } });
  const isDone = local >= doneAt;
  return (
    <div
      className={`flex items-center gap-4 rounded-2xl px-5 py-4 border transition-colors ${
        isDone ? "bg-emerald-500/10 border-emerald-400/40" : "bg-red-500/10 border-red-400/30"
      }`}
      style={{ opacity: appear, transform: `translateX(${(1 - appear) * 50}px)` }}
    >
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-lg shrink-0 ${
          isDone ? "bg-emerald-400 text-emerald-950" : "bg-red-400/90 text-red-950"
        }`}
        style={{ transform: `scale(${isDone ? 0.8 + done * 0.2 : 1})` }}
      >
        {isDone ? "✓" : "!"}
      </div>
      <span className={`text-lg font-semibold ${isDone ? "text-emerald-200/90 line-through decoration-emerald-400/60" : "text-white/85"}`}>
        {text}
      </span>
    </div>
  );
};

const SceneReminders: React.FC = () => {
  const scene = useScene(0);
  const { fps } = useVideoConfig();
  if (!scene.visible) return null;
  return (
    <SceneCard scene={scene} step="1 · Сутрин" title="Системата знае какво предстои">
      <div className="flex items-center gap-3 mb-5">
        <span className="text-4xl" style={{ transform: `rotate(${Math.sin(scene.local / 4) * (scene.local < 20 ? 14 : 0)}deg)`, display: "inline-block" }}>
          🔔
        </span>
        <span className="text-white/60 text-lg font-medium">Напомняния за днес — нищо не се пропуска</span>
      </div>
      <div className="space-y-3">
        <ReminderRow local={scene.local} fps={fps} delay={6} doneAt={38} text="Температури: хладилна витрина + фризер" />
        <ReminderRow local={scene.local} fps={fps} delay={12} doneAt={50} text="Хигиена на обекта — след почистване" />
        <ReminderRow local={scene.local} fps={fps} delay={18} doneAt={62} text="Лична хигиена на персонала — преди работа" />
      </div>
    </SceneCard>
  );
};

/* ---------- Сцена 2: Температури ---------- */

const TempRow: React.FC<{
  local: number;
  fps: number;
  delay: number;
  name: string;
  time: string;
  temp: string;
  norm: string;
}> = ({ local, fps, delay, name, time, temp, norm }) => {
  const appear = spring({ frame: local - delay, fps, config: { damping: 15 } });
  const value = typed(temp, local, delay + 8, 5);
  const complete = value === temp;
  const badge = spring({ frame: local - (delay + 8 + temp.length * 5 + 3), fps, config: { damping: 10, mass: 0.5 } });
  return (
    <div
      className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl px-6 py-5"
      style={{ opacity: appear, transform: `translateY(${(1 - appear) * 30}px)` }}
    >
      <div>
        <p className="text-white font-bold text-xl">{name}</p>
        <p className="text-white/40 text-sm font-medium">норма {norm} · измерено в {time}</p>
      </div>
      <div className="flex items-center gap-4">
        <span className="font-mono font-black text-3xl text-white min-w-[130px] text-right">
          {value}
          {!complete && <span className="text-brand-gold animate-pulse">|</span>}
          {complete && <span className="text-white/50 text-2xl">°C</span>}
        </span>
        <span
          className="bg-emerald-400 text-emerald-950 text-xs font-black uppercase tracking-widest px-3.5 py-2 rounded-xl"
          style={{ transform: `scale(${badge})`, opacity: badge }}
        >
          Норма ✓
        </span>
      </div>
    </div>
  );
};

const SceneTemps: React.FC = () => {
  const scene = useScene(1);
  const { fps } = useVideoConfig();
  if (!scene.visible) return null;
  const counter = spring({ frame: scene.local - 58, fps, config: { damping: 12 } });
  return (
    <SceneCard scene={scene} step="2 · Температури" title="Автоматичен контрол на нормите">
      <div className="space-y-4">
        <TempRow local={scene.local} fps={fps} delay={6} name="Хладилна витрина №1" time="08:12" temp="3.8" norm="0…+4°C" />
        <TempRow local={scene.local} fps={fps} delay={26} name="Фризер №1" time="08:14" temp="-18.5" norm="≤ −18°C" />
      </div>
      <div
        className="mt-6 flex items-center justify-center gap-3 text-emerald-300 font-bold text-lg"
        style={{ opacity: counter, transform: `scale(${0.9 + counter * 0.1})` }}
      >
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
        2 от 2 съоръжения отчетени — извън нормата ще светне червено
      </div>
    </SceneCard>
  );
};

/* ---------- Сцена 3: Хигиена с едно докосване ---------- */

const SceneHygiene: React.FC = () => {
  const scene = useScene(2);
  const { fps } = useVideoConfig();
  if (!scene.visible) return null;

  const zones = ["Подове", "Плотове", "Санитарен възел", "Кошове", "Отпадъци", "Мивки"];
  const btnPress = spring({ frame: scene.local - 22, fps, config: { damping: 9, mass: 0.4 } });
  const pressed = scene.local >= 22;
  const saved = spring({ frame: scene.local - 58, fps, config: { damping: 12 } });

  return (
    <SceneCard scene={scene} step="3 · Хигиена" title="Цял дневник — с едно докосване">
      <div
        className="inline-flex items-center gap-2.5 bg-brand-gold text-brand-dark font-black uppercase tracking-wider text-base px-7 py-4 rounded-2xl shadow-[0_0_30px_rgba(212,175,55,0.35)] mb-7"
        style={{ transform: `scale(${pressed ? 1 - Math.max(0, 0.12 - (scene.local - 22) * 0.02) : 1})` }}
      >
        <span className="text-xl">✓</span> Отбележи ✓ за днес
      </div>
      <div className="grid grid-cols-3 gap-3">
        {zones.map((z, i) => {
          const flip = spring({ frame: scene.local - (26 + i * 4), fps, config: { damping: 11, mass: 0.5 } });
          const on = scene.local >= 26 + i * 4;
          return (
            <div
              key={z}
              className={`rounded-2xl border px-4 py-4 flex items-center justify-between ${
                on ? "bg-emerald-500/10 border-emerald-400/40" : "bg-white/5 border-white/10"
              }`}
            >
              <span className={`text-base font-bold ${on ? "text-emerald-200" : "text-white/50"}`}>{z}</span>
              <span
                className="w-8 h-8 rounded-lg bg-emerald-400 text-emerald-950 font-black flex items-center justify-center text-lg"
                style={{ transform: `scale(${on ? flip : 0})` }}
              >
                ✓
              </span>
            </div>
          );
        })}
      </div>
      <div
        className="mt-6 flex items-center justify-center gap-2 text-white/70 font-semibold text-base"
        style={{ opacity: saved }}
      >
        <span className="w-5 h-5 rounded-full bg-emerald-400 text-emerald-950 text-xs font-black flex items-center justify-center">✓</span>
        Запазено автоматично — нищо не се губи
      </div>
    </SceneCard>
  );
};

/* ---------- Сцена 4: Здравни книжки и обучения ---------- */

const SceneStaff: React.FC = () => {
  const scene = useScene(3);
  const { fps } = useVideoConfig();
  if (!scene.visible) return null;
  const pulse = 1 + Math.sin(scene.local / 5) * 0.04;
  return (
    <SceneCard scene={scene} step="4 · Персонал" title="Напомня, преди да е късно">
      <div className="space-y-4">
        <Slide local={scene.local} delay={8} fps={fps}>
          <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl px-6 py-5">
            <div>
              <p className="text-white font-bold text-xl">Мария Петрова — ЛЗК</p>
              <p className="text-white/40 text-sm font-medium">валидна до 12.03.2027 г.</p>
            </div>
            <span className="bg-emerald-400/20 text-emerald-300 border border-emerald-400/40 text-xs font-black uppercase tracking-widest px-3.5 py-2 rounded-xl">
              Валидна ✓
            </span>
          </div>
        </Slide>
        <Slide local={scene.local} delay={20} fps={fps}>
          <div
            className="flex items-center justify-between bg-amber-500/10 border border-amber-400/50 rounded-2xl px-6 py-5"
            style={{ transform: `scale(${pulse})` }}
          >
            <div>
              <p className="text-white font-bold text-xl">Иван Георгиев — ЛЗК</p>
              <p className="text-amber-200/70 text-sm font-medium">системата напомни 30 дни по-рано</p>
            </div>
            <span className="bg-amber-400 text-amber-950 text-xs font-black uppercase tracking-widest px-3.5 py-2 rounded-xl">
              ⏰ Изтича след 12 дни
            </span>
          </div>
        </Slide>
        <Slide local={scene.local} delay={38} fps={fps}>
          <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl px-6 py-5">
            <div>
              <p className="text-white font-bold text-xl">Обучение: хигиена при търговия с храни</p>
              <p className="text-white/40 text-sm font-medium">протокол + декларация — генерират се сами</p>
            </div>
            <span className="bg-brand-gold/20 text-brand-gold border border-brand-gold/40 text-xs font-black uppercase tracking-widest px-3.5 py-2 rounded-xl">
              Проведено ✓
            </span>
          </div>
        </Slide>
      </div>
    </SceneCard>
  );
};

/* ---------- Сцена 5: Печат ---------- */

const ScenePrint: React.FC = () => {
  const scene = useScene(4);
  const { fps } = useVideoConfig();
  if (!scene.visible) return null;
  const sheet = spring({ frame: scene.local - 10, fps, config: { damping: 14, mass: 0.8 } });
  const stamp = spring({ frame: scene.local - 46, fps, config: { damping: 9, mass: 0.5 } });
  return (
    <SceneCard scene={scene} step="5 · Проверка" title="Печат с един бутон — на А4">
      <div className="flex items-center gap-8">
        {/* А4 лист */}
        <div
          className="bg-white rounded-xl w-64 shrink-0 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
          style={{ transform: `translateY(${(1 - sheet) * 120}px) rotate(${(1 - sheet) * -6}deg)`, opacity: sheet, height: 300 }}
        >
          <p className="text-[9px] font-black text-gray-800 text-center uppercase mb-2">Дневник за хигиена на обекта</p>
          <div className="border border-gray-400">
            {Array.from({ length: 9 }).map((_, r) => (
              <div key={r} className="flex border-b border-gray-300 last:border-b-0">
                <div className="w-6 border-r border-gray-300 text-[7px] text-gray-500 text-center py-1">{r === 0 ? "Дата" : r}</div>
                {Array.from({ length: 5 }).map((_, c) => (
                  <div key={c} className="flex-1 border-r border-gray-200 last:border-r-0 text-[8px] text-emerald-600 font-bold text-center py-1">
                    {r > 0 && scene.local > 18 + r * 3 + c ? "✓" : ""}
                  </div>
                ))}
              </div>
            ))}
          </div>
          {/* Печат-щемпел */}
          <div
            className="absolute bottom-6 right-4 border-4 border-emerald-600/80 text-emerald-700 rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-widest rotate-[-12deg] bg-white/70"
            style={{ transform: `rotate(-12deg) scale(${stamp})`, opacity: stamp }}
          >
            Готово за<br />БАБХ проверка
          </div>
        </div>
        <div className="space-y-5">
          <Slide local={scene.local} delay={16} fps={fps}>
            <p className="text-white/85 text-xl font-semibold leading-relaxed">
              Един дневник или <span className="text-brand-gold font-black">всичко попълнено наведнъж</span> — в официален вид, с фирмените Ви данни.
            </p>
          </Slide>
          <Slide local={scene.local} delay={30} fps={fps}>
            <div className="inline-flex items-center gap-3 bg-brand-gold text-brand-dark font-black uppercase tracking-wider text-sm px-6 py-3.5 rounded-2xl shadow-[0_0_25px_rgba(212,175,55,0.3)]">
              🖨️ Печат на всичко попълнено
            </div>
          </Slide>
        </div>
      </div>
    </SceneCard>
  );
};

/* ---------- Сцена 6: Финал ---------- */

const SceneFinale: React.FC = () => {
  const scene = useScene(5);
  const { fps } = useVideoConfig();
  if (!scene.visible) return null;
  const ring = interpolate(scene.local, [8, 50], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const shield = spring({ frame: scene.local - 6, fps, config: { damping: 10, mass: 0.6 } });
  const R = 54;
  const CIRC = 2 * Math.PI * R;
  return (
    <SceneCard scene={scene} step="БАБХ Спокойствие" title="Обектът е изряден — всеки ден">
      <div className="flex items-center justify-center gap-12 py-4">
        <div className="relative w-44 h-44 shrink-0" style={{ transform: `scale(${shield})` }}>
          <svg viewBox="0 0 128 128" className="w-full h-full -rotate-90">
            <circle cx="64" cy="64" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
            <circle
              cx="64"
              cy="64"
              r={R}
              fill="none"
              stroke="#34d399"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={CIRC * (1 - ring / 100)}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-emerald-300 font-black text-4xl font-mono">{Math.round(ring)}%</span>
            <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">попълнено днес</span>
          </div>
        </div>
        <div className="space-y-3.5">
          {[
            "15 електронни дневника по самоконтрол",
            "Автоматичен запис и напомняния",
            "Печат на цялата папка при проверка",
          ].map((t, i) => (
            <Slide key={t} local={scene.local} delay={16 + i * 10} fps={fps}>
              <div className="flex items-center gap-3.5">
                <span className="w-8 h-8 rounded-xl bg-emerald-400/20 border border-emerald-400/50 text-emerald-300 font-black flex items-center justify-center shrink-0">
                  ✓
                </span>
                <span className="text-white/85 text-xl font-semibold">{t}</span>
              </div>
            </Slide>
          ))}
        </div>
      </div>
    </SceneCard>
  );
};

/* ---------- Композиция ---------- */

export const REGISTERS_SHOWCASE_DURATION = SCENE_LEN * 6; // 480 кадъра ≈ 16 s @ 30 fps

export const RegistersShowcaseVideo: React.FC = () => {
  return (
    <AbsoluteFill className="bg-transparent font-sans flex items-center justify-center p-8 relative">
      <SceneReminders />
      <SceneTemps />
      <SceneHygiene />
      <SceneStaff />
      <ScenePrint />
      <SceneFinale />
    </AbsoluteFill>
  );
};
