"use client";

/**
 * Месечният абонамент с карта: „Плати с карта · всеки месец автоматично",
 * смяна на плана при вече включено автоматично плащане и спиране/пускане
 * на автоматичното таксуване. Сървърът е `/api/pay/subscription`.
 *
 * Не се показва, докато плащането с карта не е включено (няма Stripe ключ).
 */

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { auth } from "@/lib/firebase";
import { useCardPayments, PayButtonFace, SecurePaymentNote, PAY_BUTTON_CLASS } from "@/components/CardPayButton";
import PurchaseConsent from "@/components/PurchaseConsent";

async function callSubscription(action: string, email?: string, consent?: boolean): Promise<{ ok: boolean; data: any }> {
  const token = await auth.currentUser?.getIdToken();
  if (!token) return { ok: false, data: { error: "unauthorized" } };
  const res = await fetch("/api/pay/subscription", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ action, ...(email ? { email } : {}), ...(consent ? { consent: true } : {}) }),
  });
  return { ok: res.ok, data: await res.json().catch(() => ({})) };
}

/**
 * След нов/премахнат обект или ръчна смяна на плана от админа — новата сума
 * важи от следващото месечно таксуване (без плащане сега). Нищо не прави,
 * ако профилът няма автоматично плащане.
 */
export function syncAutoPay(email?: string): void {
  callSubscription("sync", email).catch(() => null);
}

export default function SubscriptionCardPay({
  amountLabel,
  hasAutoPay,
}: {
  /** „29 €" — месечната сума. */
  amountLabel: string;
  /** Профилът вече плаща автоматично с карта → бутонът сменя плана. */
  hasAutoPay: boolean;
}) {
  const enabled = useCardPayments();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [consent, setConsent] = useState(false);

  if (!enabled) return null;

  const pay = async () => {
    setBusy(true);
    setError("");
    try {
      const { ok, data } = await callSubscription(hasAutoPay ? "change" : "checkout", undefined, consent);
      if (ok && data.url) {
        window.location.href = data.url;
        return;
      }
      if (ok && hasAutoPay && data.synced) {
        setDone(true);
      } else {
        setError(
          data.error === "already_subscribed"
            ? "Автоматичното плащане вече е включено — презаредете страницата."
            : "Плащането не можа да започне. Опитайте отново след малко."
        );
      }
    } catch {
      setError("Няма връзка. Опитайте отново.");
    }
    setBusy(false);
  };

  if (done) {
    return (
      <div className="rounded-2xl bg-brand-green/5 border border-brand-green/15 p-4 text-sm text-brand-green font-bold text-center">
        Готово — разликата се таксува от картата Ви и новият план се активира до минута.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <PurchaseConsent kind="subscription" checked={consent} onChange={setConsent} />
      <button type="button" onClick={pay} disabled={busy || !consent} className={PAY_BUTTON_CLASS}>
        <PayButtonFace
          busy={busy}
          busyLabel="Момент…"
          label={hasAutoPay ? `Смени плана · ${amountLabel} / месец` : `Плати ${amountLabel} / месец`}
        />
      </button>
      <SecurePaymentNote
        hint={hasAutoPay ? "разликата за текущия месец се таксува веднага" : "активира се веднага · спирате го с един клик"}
      />
      {error && <p className="text-xs font-bold text-red-600 text-center">{error}</p>}
    </div>
  );
}

/** „Автоматично плащане с карта: включено · Спри" — в активния план. */
export function AutoRenewControl({ autoRenew, expiresAt }: { autoRenew: boolean; expiresAt?: string }) {
  const enabled = useCardPayments();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  if (!enabled) return null;

  const toggle = async () => {
    if (autoRenew && !confirm(`Да спрем ли автоматичното плащане? Достъпът остава до ${expiresAt || "края на платения месец"}.`)) return;
    setBusy(true);
    setError("");
    const { ok, data } = await callSubscription(autoRenew ? "cancel" : "resume").catch(() => ({ ok: false, data: {} }));
    if (!ok || !data.ok) setError("Не успяхме да променим плащането. Опитайте отново.");
    setBusy(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
      <span className="inline-flex items-center gap-1.5 font-bold text-brand-green">
        <RefreshCw className="h-3.5 w-3.5 text-brand-gold" />
        {autoRenew ? `Автоматично плащане с карта — следващо на ${expiresAt || "—"}` : "Автоматичното плащане е спряно"}
      </span>
      <button
        type="button"
        onClick={toggle}
        disabled={busy}
        className="font-bold underline underline-offset-4 text-brand-dark/60 hover:text-brand-gold bg-transparent border-0 cursor-pointer p-0 disabled:opacity-50"
      >
        {busy ? "…" : autoRenew ? "Спри" : "Пусни отново"}
      </button>
      {error && <span className="text-red-600 font-bold">{error}</span>}
    </div>
  );
}
