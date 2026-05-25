"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, ArrowRight, Mail } from "lucide-react";

/**
 * Post-checkout landing page.
 * Calls /api/checkout/verify with the session_id to confirm payment and
 * (idempotently) grant access before showing the user the next step.
 */
export default function SuccessPage() {
  const params = useParams<{ id: string }>();
  const search = useSearchParams();
  const sessionId = search.get("session_id");
  const courseId = params?.id;

  const [state, setState] = useState<"verifying" | "ok" | "pending" | "error">("verifying");
  const [buyerEmail, setBuyerEmail] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    if (!sessionId) {
      setState("error");
      setErrorMsg("Липсва session_id в URL-а.");
      return;
    }
    (async () => {
      try {
        const res = await fetch("/api/checkout/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.detail || data?.error || `HTTP ${res.status}`);
        if (data.paid) {
          setBuyerEmail(data.buyerEmail || "");
          setState("ok");
        } else {
          setState("pending");
        }
      } catch (err: any) {
        setErrorMsg(err?.message || String(err));
        setState("error");
      }
    })();
  }, [sessionId]);

  return (
    <div className="bg-brand-light min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl border border-brand-green/5 p-8 sm:p-10 space-y-6 text-center">
        {state === "verifying" && (
          <>
            <div className="w-12 h-12 rounded-full border-4 border-brand-gold/30 border-t-brand-gold animate-spin mx-auto" />
            <h1 className="font-serif text-2xl font-bold text-brand-green">Потвърждаваме плащането…</h1>
            <p className="text-sm text-brand-dark/60">Това отнема няколко секунди.</p>
          </>
        )}

        {state === "ok" && (
          <>
            <CheckCircle className="h-14 w-14 text-green-500 mx-auto" />
            <h1 className="font-serif text-3xl font-bold text-brand-green">Благодарим за покупката!</h1>
            <p className="text-sm text-brand-dark/70 leading-relaxed">
              Плащането е успешно. Достъпът до курса е активен. Изпратихме линк за вход на:
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-gold/10 text-brand-green text-sm font-bold">
              <Mail className="h-4 w-4 text-brand-gold" />
              {buyerEmail || "вашия email"}
            </div>
            <div className="text-xs text-brand-dark/60 leading-relaxed bg-brand-light/50 rounded-xl p-4 border border-brand-green/5 space-y-1.5">
              <p><strong>Какво следва:</strong></p>
              <p>1. Отворете email-а — ще намерите линк „Задай парола"</p>
              <p>2. Задайте парола за акаунта си</p>
              <p>3. Влезте на /profile → таб „Моите курсове"</p>
            </div>
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-gold text-brand-dark font-bold text-sm uppercase tracking-wider hover:bg-brand-gold-light transition-colors cursor-pointer"
            >
              Към профила <ArrowRight className="h-4 w-4" />
            </Link>
          </>
        )}

        {state === "pending" && (
          <>
            <div className="w-12 h-12 rounded-full border-4 border-amber-200 border-t-amber-500 animate-spin mx-auto" />
            <h1 className="font-serif text-2xl font-bold text-brand-green">Плащането все още се обработва</h1>
            <p className="text-sm text-brand-dark/60">
              Когато банката потвърди плащането, ще ви изпратим линк за достъп на email-а ви. Това обикновено
              отнема под минута.
            </p>
            <Link href={`/courses/${courseId}`} className="text-xs font-bold uppercase tracking-wider text-brand-gold hover:underline cursor-pointer">
              ← Към курса
            </Link>
          </>
        )}

        {state === "error" && (
          <>
            <XCircle className="h-14 w-14 text-red-500 mx-auto" />
            <h1 className="font-serif text-2xl font-bold text-brand-green">Възникна проблем</h1>
            <p className="text-sm text-brand-dark/60">{errorMsg || "Не успяхме да потвърдим плащането."}</p>
            <p className="text-xs text-brand-dark/50">
              Ако сте платили, моля свържете се с нас — ще предоставим достъп ръчно.
            </p>
            <div className="flex gap-3 justify-center">
              <Link href="/contact" className="px-5 py-2 rounded-full bg-brand-green text-white text-xs font-bold uppercase tracking-wider hover:bg-brand-green/90 transition-colors cursor-pointer">
                Свържи се
              </Link>
              <Link href={`/courses/${courseId}`} className="px-5 py-2 rounded-full border border-brand-green/20 text-brand-green text-xs font-bold uppercase tracking-wider hover:bg-brand-green/5 transition-colors cursor-pointer">
                Към курса
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
