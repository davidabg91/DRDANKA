"use client";

import { openCookieSettings } from "@/lib/consent";

export default function CookieSettingsLink({ className }: { className?: string }) {
  return (
    <button type="button" onClick={openCookieSettings} className={className}>
      Настройки за бисквитки
    </button>
  );
}
