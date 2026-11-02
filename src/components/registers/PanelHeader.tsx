"use client";

/**
 * Общо заглавие за панелите в дневниците: икона, заглавие, едно изречение
 * какво е това, и по желание сгъваемо „Как се ползва" с 2–4 кратки стъпки.
 * Така всеки панел обяснява сам себе си без да претрупва екрана.
 */

import { useState, type ComponentType, type ReactNode } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export function HowTo({ steps, label = "Как се ползва" }: { steps: ReactNode[]; label?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-brand-gold-dark hover:text-brand-green cursor-pointer"
      >
        <HelpCircle className="h-3.5 w-3.5" />
        {label}
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <ol className="mt-2 space-y-1.5 plan-in">
          {steps.map((s, i) => (
            <li key={i} className="flex gap-2.5 text-[11px] leading-snug text-brand-dark/70">
              <span className="w-4 h-4 rounded-full bg-brand-gold/20 text-brand-gold-dark text-[9px] font-black flex items-center justify-center shrink-0 mt-px">
                {i + 1}
              </span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export default function PanelHeader({
  icon: Icon,
  title,
  description,
  howTo,
  right,
  tone = "green",
}: {
  icon: ComponentType<{ className?: string }>;
  title: ReactNode;
  description?: ReactNode;
  howTo?: ReactNode[];
  right?: ReactNode;
  /** Цветът на иконата — златист за неща, които изискват действие. */
  tone?: "green" | "gold";
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="flex items-start gap-3 min-w-0 flex-1 basis-64">
        <span
          className={`p-2.5 rounded-2xl shrink-0 ${
            tone === "gold" ? "bg-brand-gold/15 text-brand-gold-dark" : "bg-brand-green/10 text-brand-green"
          }`}
        >
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0 space-y-1">
          <h3 className="font-serif text-base sm:text-lg font-bold text-brand-green leading-snug">{title}</h3>
          {description && <p className="text-[11px] sm:text-xs text-brand-dark/55 leading-snug">{description}</p>}
          {howTo && howTo.length > 0 && <HowTo steps={howTo} />}
        </div>
      </div>
      {right && <div className="flex flex-wrap items-center gap-2">{right}</div>}
    </div>
  );
}
