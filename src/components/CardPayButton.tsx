"use client";

/**
 * „Плати с карта · Apple Pay · Google Pay" за заявка от `enrollments`.
 * Пренасочва към платежната страница на Stripe; след плащане заявката се
 * отключва автоматично (webhook + /pay/success).
 *
 * Не се показва, докато плащането с карта не е включено (няма Stripe ключ),
 * така че може да стои до банковия превод още преди активирането.
 */

import { useEffect, useState } from "react";
import { CreditCard, Loader2, Lock } from "lucide-react";

let configPromise: Promise<boolean> | null = null;
function cardPaymentsEnabled(): Promise<boolean> {
  configPromise ??= fetch("/api/pay/config")
    .then((r) => r.json())
    .then((d) => !!d.cardPayments)
    .catch(() => false);
  return configPromise;
}

export function useCardPayments(): boolean | null {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  useEffect(() => {
    let alive = true;
    cardPaymentsEnabled().then((v) => alive && setEnabled(v));
    return () => {
      alive = false;
    };
  }, []);
  return enabled;
}

export default function CardPayButton({
  enrollmentId,
  amountLabel,
  returnPath,
}: {
  enrollmentId: string;
  /** „11,11 €" — показва се на бутона. */
  amountLabel?: string;
  /** Къде да се върне клиентът, ако се откаже на платежната страница. */
  returnPath?: string;
}) {
  const enabled = useCardPayments();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (!enabled || !enrollmentId) return null;

  const pay = async () => {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/pay/enrollment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enrollmentId,
          returnPath: returnPath ?? (typeof window !== "undefined" ? window.location.pathname : "/profile"),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.url) {
        window.location.href = data.url;
        return;
      }
      setError(
        data.error === "already_paid"
          ? "Тази заявка вече е платена — вижте профила си."
          : "Плащането с карта не можа да започне. Опитайте отново или платете по банков път."
      );
    } catch {
      setError("Няма връзка. Опитайте отново.");
    }
    setBusy(false);
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={pay}
        disabled={busy}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-brand-green hover:bg-brand-green/90 disabled:opacity-70 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-brand-green/25 cursor-pointer border-0 transition-colors"
      >
        {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <CreditCard className="h-5 w-5 text-brand-gold" />}
        {busy ? "Отваряне на плащането…" : `Плати с карта${amountLabel ? ` · ${amountLabel}` : ""}`}
      </button>
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        {["Visa", "Mastercard", "Apple Pay", "Google Pay"].map((m) => (
          <span key={m} className="text-[10px] font-bold px-2 py-0.5 rounded-md border border-brand-green/10 bg-white text-brand-dark/60">
            {m}
          </span>
        ))}
      </div>
      <p className="flex items-center justify-center gap-1 text-[10px] text-brand-dark/50">
        <Lock className="h-3 w-3" /> Защитено плащане през Stripe · достъпът се отключва веднага
      </p>
      {error && <p className="text-xs font-bold text-red-600 text-center">{error}</p>}
    </div>
  );
}
