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
import { Loader2, Lock } from "lucide-react";
import PaymentBadges from "@/components/PaymentBadges";
import PurchaseConsent, { type ConsentKind } from "@/components/PurchaseConsent";

let configPromise: Promise<boolean> | null = null;
function cardPaymentsEnabled(): Promise<boolean> {
  configPromise ??= fetch("/api/pay/config")
    .then((r) => r.json())
    .then((d) => !!d.cardPayments)
    .catch(() => false);
  return configPromise;
}

/**
 * Отваря платежната страница на Stripe за заявката. Връща текст на грешка,
 * ако не е успяло (при успех браузърът вече напуска страницата).
 */
export async function startEnrollmentCheckout(enrollmentId: string, consent: boolean, returnPath?: string): Promise<string> {
  if (!consent) return "Моля, отбележете съгласието си над бутона за плащане.";
  try {
    const res = await fetch("/api/pay/enrollment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        enrollmentId,
        consent,
        returnPath: returnPath ?? (typeof window !== "undefined" ? window.location.pathname : "/profile"),
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.url) {
      window.location.href = data.url;
      return "";
    }
    return data.error === "already_paid"
      ? "Тази покупка вече е платена — вижте профила си."
      : "Плащането не можа да започне. Опитайте отново след малко.";
  } catch {
    return "Няма връзка. Опитайте отново.";
  }
}

/** Плътният бутон „Плати 12,00 €" с катинар — общ за всички плащания с карта. */
export function PayButtonFace({ busy, label, busyLabel = "Отваряне на плащането…" }: { busy: boolean; label: string; busyLabel?: string }) {
  return busy ? (
    <>
      <Loader2 className="h-5 w-5 animate-spin" /> {busyLabel}
    </>
  ) : (
    <>
      <Lock className="h-4 w-4 opacity-80" /> {label}
    </>
  );
}

export const PAY_BUTTON_CLASS =
  "w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-[#0A1F18] hover:bg-black disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-[#0A1F18] text-white font-bold text-base tracking-wide shadow-lg shadow-black/20 cursor-pointer border-0 transition-colors";

/** „Защитено плащане · Visa · Mastercard · Apple Pay · Google Pay" под бутона. */
export function SecurePaymentNote({ hint }: { hint?: string }) {
  return (
    <div className="space-y-2">
      <PaymentBadges />
      <p className="flex items-center justify-center gap-1 text-[11px] text-brand-dark/55 text-center leading-snug">
        <Lock className="h-3 w-3 shrink-0" /> Защитено плащане чрез Stripe{hint ? ` · ${hint}` : ""}
      </p>
    </div>
  );
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
  hint = "достъпът се отключва веднага",
  consentKind = "digital",
}: {
  enrollmentId: string;
  /** „11,11 €" — показва се на бутона. */
  amountLabel?: string;
  /** Къде да се върне клиентът, ако се откаже на платежната страница. */
  returnPath?: string;
  /** Какво става след плащането — под бутона. */
  hint?: string;
  /** Кой текст за съгласие (правото на отказ) да се покаже. */
  consentKind?: ConsentKind;
}) {
  const enabled = useCardPayments();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [consent, setConsent] = useState(false);

  if (!enabled || !enrollmentId) return null;

  const pay = async () => {
    setBusy(true);
    const err = await startEnrollmentCheckout(enrollmentId, consent, returnPath);
    // При успех браузърът вече отива към Stripe — бутонът остава „Отваряне…".
    if (err) {
      setError(err);
      setBusy(false);
    }
  };

  return (
    <div className="space-y-3">
      <PurchaseConsent kind={consentKind} checked={consent} onChange={setConsent} />
      <button type="button" onClick={pay} disabled={busy || !consent} className={PAY_BUTTON_CLASS}>
        <PayButtonFace busy={busy} label={`Плати${amountLabel ? ` ${amountLabel}` : ""}`} />
      </button>
      <SecurePaymentNote hint={hint} />
      {error && <p className="text-xs font-bold text-red-600 text-center">{error}</p>}
    </div>
  );
}
