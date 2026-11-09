"use client";

/**
 * Връщане от платежната страница на Stripe. Проверява плащането (и отключва
 * веднага, ако webhook-ът още не е пристигнал) и води клиента към купеното.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle, Loader2, AlertTriangle } from "lucide-react";
import { trackPurchase } from "@/lib/fpixel";

type State =
  | { kind: "checking" }
  | { kind: "paid"; title: string | null; href: string; subscription?: boolean; deferred?: boolean }
  | { kind: "pending" }
  | { kind: "error" };

export default function PaySuccessPage() {
  const [state, setState] = useState<State>({ kind: "checking" });

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get("session_id") || "";
    let tries = 0;
    let timer: ReturnType<typeof setTimeout>;
    let alive = true;
    const check = async () => {
      tries++;
      try {
        const res = await fetch(`/api/pay/status?session_id=${encodeURIComponent(sessionId)}`);
        const data = await res.json();
        if (!alive) return;
        if (res.ok && data.paid) {
          // Отчита покупката веднъж на плащане (при презареждане — не).
          try {
            const key = `fb_purchase_${sessionId}`;
            if (data.amountEur > 0 && !sessionStorage.getItem(key)) {
              sessionStorage.setItem(key, "1");
              trackPurchase({ content_name: data.title || undefined, value: data.amountEur, currency: "EUR" });
            }
          } catch {
            // sessionStorage е недостъпен — пропускаме отчитането
          }
          setState({
            kind: "paid",
            title: data.title,
            href: data.href || "/profile",
            subscription: !!data.subscription,
            deferred: !!data.deferred,
          });
          return;
        }
        if (!res.ok && res.status !== 500) {
          setState({ kind: "error" });
          return;
        }
      } catch {
        // мрежова грешка — опитваме пак
      }
      if (tries >= 15) {
        setState({ kind: "pending" });
        return;
      }
      timer = setTimeout(check, 2000);
    };
    check();
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-brand-green/10 overflow-hidden text-center">
        <div className="bg-[#0A1F18] text-white px-6 py-8 space-y-3">
          {state.kind === "checking" && <Loader2 className="h-14 w-14 mx-auto text-brand-gold animate-spin" />}
          {state.kind === "paid" && <CheckCircle className="h-14 w-14 mx-auto text-brand-gold plan-pop" />}
          {(state.kind === "pending" || state.kind === "error") && <AlertTriangle className="h-14 w-14 mx-auto text-brand-gold" />}
          <h1 className="font-serif text-2xl font-bold">
            {state.kind === "checking" && "Проверяваме плащането…"}
            {state.kind === "paid" && "Плащането е успешно"}
            {state.kind === "pending" && "Плащането се обработва"}
            {state.kind === "error" && "Не намерихме това плащане"}
          </h1>
        </div>
        <div className="p-6 space-y-4">
          {state.kind === "checking" && (
            <p className="text-sm text-brand-dark/70">Това отнема няколко секунди. Моля, не затваряйте страницата.</p>
          )}
          {state.kind === "paid" && (
            <>
              {state.subscription ? (
                <p className="text-sm text-brand-dark/75 leading-relaxed">
                  {state.deferred ? (
                    <>
                      Автоматичното месечно плащане е включено. Първото таксуване е в деня, в който изтича вече
                      платеният Ви месец — дотогава всичко остава както е.
                    </>
                  ) : (
                    <>
                      {state.title ? <strong>{state.title}</strong> : "Абонаментът"} е активен. Картата ще се таксува
                      автоматично всеки месец — можете да го спрете по всяко време от „Абонаментни пакети“ в профила.
                    </>
                  )}{" "}
                  Stripe ще Ви изпрати разписка на имейла.
                </p>
              ) : (
              <p className="text-sm text-brand-dark/75 leading-relaxed">
                {state.title ? (
                  <>
                    <strong>{state.title}</strong> е отключен в профила Ви.
                  </>
                ) : (
                  "Покупката е отключена в профила Ви."
                )}{" "}
                Stripe ще Ви изпрати и разписка на имейла.
              </p>
              )}
              <Link
                href={state.href}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-brand-green hover:bg-brand-green/90 text-white font-black text-xs uppercase tracking-wider"
              >
                Към профила <ArrowRight className="h-4 w-4" />
              </Link>
            </>
          )}
          {state.kind === "pending" && (
            <p className="text-sm text-brand-dark/75 leading-relaxed">
              Банката още потвърждава плащането. Ще бъде отключено автоматично до няколко минути — проверете{" "}
              <Link href="/profile" className="text-brand-green font-bold underline">профила си</Link>.
            </p>
          )}
          {state.kind === "error" && (
            <p className="text-sm text-brand-dark/75 leading-relaxed">
              Ако сте платили, достъпът ще се появи в{" "}
              <Link href="/profile" className="text-brand-green font-bold underline">профила Ви</Link>. При въпроси
              се свържете с нас от страницата{" "}
              <Link href="/contact" className="text-brand-green font-bold underline">Контакти</Link>.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
