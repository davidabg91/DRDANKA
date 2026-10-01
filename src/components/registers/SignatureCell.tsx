"use client";

/**
 * Клетка „Подпис" в дневниците. Когато обектът е избрал електронен подпис
 * (режим "draw"), нарисуваният подпис се показва автоматично във всеки попълнен
 * ред; иначе клетката е обикновено текстово поле за ръчен подпис.
 */

import { createContext, useContext } from "react";
import type { RegisterColumn } from "@/data/storeRegisters";

/** Електронният подпис (PNG data URL) — само ако е избран режим "draw". */
export const SignatureContext = createContext<string | undefined>(undefined);

/** Колона за подпис на отговорното лице (не на служител — напр. при получаване на облекло). */
export function isOwnerSignatureCol(col: Pick<RegisterColumn, "key" | "label">): boolean {
  return (col.key === "sign" || col.key === "signature") && !/служител/i.test(col.label);
}

/** Има ли в реда въведени данни извън колоните за подпис. */
export function rowHasData(row: Record<string, unknown> | undefined, ignore: string[] = ["sign", "signature"]): boolean {
  if (!row) return false;
  return Object.entries(row).some(
    ([k, v]) => !k.startsWith("__") && !ignore.includes(k) && String(v ?? "").trim() !== ""
  );
}

export default function SignatureCell({
  value,
  onChange,
  readOnly,
  filled,
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  readOnly: boolean;
  /** Редът е попълнен — тогава електронният подпис се поставя автоматично. */
  filled: boolean;
  className?: string;
}) {
  const signature = useContext(SignatureContext);
  if (signature) {
    return filled ? (
      <img
        src={signature}
        alt="Електронен подпис"
        title="Електронен подпис — поставя се автоматично"
        className="h-8 max-w-[96px] mx-auto object-contain"
      />
    ) : (
      <span className="block text-center text-[9px] text-brand-dark/25" title="Подписът се поставя автоматично при попълване на реда">
        ✍️
      </span>
    );
  }
  return (
    <input
      type="text"
      className={`w-full text-xs border border-brand-green/15 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold text-brand-dark disabled:bg-brand-light/60 disabled:text-brand-dark/60 ${className}`}
      value={value}
      disabled={readOnly}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
