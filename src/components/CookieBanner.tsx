"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { OPEN_SETTINGS_EVENT, readConsent, saveConsent, type ConsentChoice } from "@/lib/consent";

/**
 * Asks for consent before Meta Pixel runs. Both buttons carry equal weight —
 * refusing must be as easy as accepting.
 */
export default function CookieBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (readConsent() === null) setOpen(true);
    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_SETTINGS_EVENT, reopen);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, reopen);
  }, []);

  if (!open) return null;

  const choose = (choice: ConsentChoice) => {
    saveConsent(choice);
    setOpen(false);
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Настройки за бисквитки"
      className="fixed inset-x-0 bottom-0 z-[100] p-3 sm:p-4 print:hidden"
    >
      <div className="max-w-4xl mx-auto bg-white border border-brand-green/15 rounded-2xl shadow-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center gap-4">
        <p className="text-xs sm:text-sm text-brand-dark/80 leading-relaxed flex-1">
          Използваме необходими технологии, за да работи сайтът (вход в профила, плащане). С Ваше съгласие
          използваме и Meta Pixel, за да измерваме ефективността на рекламите си във Facebook и Instagram.
          Можете да промените избора си по всяко време.{" "}
          <Link href="/privacy#biskvitki" className="text-brand-gold font-semibold hover:underline">
            Научете повече
          </Link>
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            type="button"
            onClick={() => choose("denied")}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl border border-brand-green/25 text-brand-green text-xs font-bold uppercase tracking-wider hover:bg-brand-green/5 transition-colors"
          >
            Отказвам
          </button>
          <button
            type="button"
            onClick={() => choose("granted")}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-brand-green text-white text-xs font-bold uppercase tracking-wider hover:bg-brand-green/90 transition-colors"
          >
            Приемам
          </button>
        </div>
      </div>
    </div>
  );
}
