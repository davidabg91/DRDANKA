"use client";

/**
 * Интерактивна обиколка (onboarding tour) на дневниците по самоконтрол.
 * Показва се само при първото влизане: затъмнява екрана, осветява
 * съответния елемент и обяснява стъпка по стъпка какво се попълва и следи.
 */

import { useState, useEffect, useMemo, useCallback } from "react";
import { ChevronLeft, ChevronRight, X, Sparkles } from "lucide-react";

export interface TourStep {
  /** Стойност на data-tour атрибута на целевия елемент */
  target: string;
  emoji: string;
  title: string;
  text: string;
}

const PAD = 10; // отстояние на „прозореца" около елемента
const CARD_W = 360;

export default function RegistersTour({
  steps,
  onClose,
}: {
  steps: TourStep[];
  onClose: (completed: boolean) => void;
}) {
  // Само стъпките, чиито елементи реално съществуват на екрана
  const activeSteps = useMemo(
    () => steps.filter((s) => typeof document !== "undefined" && document.querySelector(`[data-tour="${s.target}"]`)),
    [steps]
  );
  const [idx, setIdx] = useState(0);
  const [rect, setRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

  const step = activeSteps[idx];

  const measure = useCallback(() => {
    if (!step) return;
    const el = document.querySelector(`[data-tour="${step.target}"]`);
    if (!el) {
      setRect(null);
      return;
    }
    const r = el.getBoundingClientRect();
    setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
  }, [step]);

  // При смяна на стъпката: скролираме елемента в средата и измерваме
  useEffect(() => {
    if (!step) return;
    const el = document.querySelector(`[data-tour="${step.target}"]`);
    if (!el) {
      setRect(null);
      return;
    }
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    const t1 = setTimeout(measure, 350);
    const t2 = setTimeout(measure, 700); // след приключване на smooth scroll
    let raf = 0;
    const onMove = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    window.addEventListener("resize", onMove);
    window.addEventListener("scroll", onMove, true);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onMove);
      window.removeEventListener("scroll", onMove, true);
    };
  }, [step, measure]);

  // ESC затваря обиколката
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!step) return null;

  const isLast = idx === activeSteps.length - 1;
  const vw = typeof window !== "undefined" ? window.innerWidth : 1200;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;

  // Позиция на балончето: под елемента, ако има място; иначе над него
  let cardTop = 0;
  let cardLeft = 0;
  let placement: "below" | "above" | "center" = "center";
  if (rect) {
    const spaceBelow = vh - (rect.top + rect.height);
    placement = spaceBelow > 240 ? "below" : rect.top > 240 ? "above" : "below";
    cardTop = placement === "below" ? rect.top + rect.height + PAD + 14 : rect.top - PAD - 14;
    cardLeft = Math.min(Math.max(rect.left + rect.width / 2 - CARD_W / 2, 12), vw - CARD_W - 12);
  } else {
    cardTop = vh / 2 - 120;
    cardLeft = vw / 2 - CARD_W / 2;
  }
  const arrowLeft = rect ? Math.min(Math.max(rect.left + rect.width / 2 - cardLeft, 24), CARD_W - 24) : CARD_W / 2;

  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-label="Обиколка на дневниците">
      {/* Затъмнение с „прозорец" върху целевия елемент */}
      {rect ? (
        <div
          className="absolute rounded-2xl ring-2 ring-brand-gold shadow-[0_0_0_9999px_rgba(8,20,16,0.78)] transition-all duration-300 pointer-events-none"
          style={{
            top: rect.top - PAD,
            left: rect.left - PAD,
            width: rect.width + PAD * 2,
            height: rect.height + PAD * 2,
          }}
        >
          <div className="absolute -inset-1 rounded-2xl ring-2 ring-brand-gold/40 animate-pulse pointer-events-none" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-[#081410]/80" />
      )}

      {/* Балонче */}
      <div
        className="absolute bg-white rounded-3xl shadow-2xl p-5 space-y-3 transition-all duration-300"
        style={{
          top: cardTop,
          left: cardLeft,
          width: CARD_W,
          maxWidth: "calc(100vw - 24px)",
          transform: placement === "above" ? "translateY(-100%)" : undefined,
        }}
      >
        {/* Стрелка към елемента */}
        {rect && (
          <div
            className="absolute w-4 h-4 bg-white rotate-45"
            style={
              placement === "below"
                ? { top: -7, left: arrowLeft - 8 }
                : { bottom: -7, left: arrowLeft - 8 }
            }
          />
        )}

        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl leading-none">{step.emoji}</span>
            <h4 className="font-serif text-base font-bold text-brand-green leading-snug">{step.title}</h4>
          </div>
          <button
            onClick={() => onClose(false)}
            className="text-brand-dark/30 hover:text-brand-dark cursor-pointer p-1 -m-1 shrink-0"
            title="Затвори обиколката"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="text-[13px] text-brand-dark/75 leading-relaxed">{step.text}</p>

        <div className="flex items-center justify-between pt-1">
          {/* Прогрес точки */}
          <div className="flex items-center gap-1.5">
            {activeSteps.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`rounded-full transition-all cursor-pointer ${
                  i === idx ? "w-5 h-2 bg-brand-gold" : "w-2 h-2 bg-brand-green/20 hover:bg-brand-green/40"
                }`}
                aria-label={`Стъпка ${i + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {idx > 0 && (
              <button
                onClick={() => setIdx(idx - 1)}
                className="p-2 rounded-xl border border-brand-green/15 text-brand-dark/60 hover:border-brand-gold cursor-pointer"
                title="Назад"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={() => (isLast ? onClose(true) : setIdx(idx + 1))}
              className="flex items-center gap-1.5 bg-brand-green hover:bg-brand-green/90 text-white text-[11px] font-black uppercase tracking-wider px-4 py-2.5 rounded-xl cursor-pointer border-0 shadow-md shadow-brand-green/20"
            >
              {isLast ? (
                <>
                  <Sparkles className="h-3.5 w-3.5" /> Започвам!
                </>
              ) : (
                <>
                  Напред <ChevronRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </div>
        </div>

        <p className="text-[10px] text-brand-dark/35 text-center">
          Стъпка {idx + 1} от {activeSteps.length} · ESC за изход
        </p>
      </div>
    </div>
  );
}
