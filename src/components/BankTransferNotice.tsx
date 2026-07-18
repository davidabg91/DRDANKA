import { Landmark } from "lucide-react";

/**
 * Reusable bank-transfer instructions block shown after a booking / purchase
 * request. Replaces the old test-card payment across the site: the client pays
 * by bank transfer, and д-р Данка Николова confirms and grants access / contacts
 * them once the funds arrive.
 */
export default function BankTransferNotice({
  amount,
  reference,
  variant = "light",
  className = "",
}: {
  /** Amount to display, e.g. "35 €" or "119 € / месец". Optional. */
  amount?: string;
  /** Suggested payment reference (основание), e.g. the client name / service. */
  reference?: string;
  /** "light" for white surfaces, "dark" for the brand-green success card. */
  variant?: "light" | "dark";
  className?: string;
}) {
  const dark = variant === "dark";
  const rows: Array<{ label: string; value: string; mono?: boolean; accent?: boolean }> = [
    { label: "Получател", value: "Данка Василева Крамолинска" },
    { label: "Банка", value: "ЦКБ АД – Клон Плевен" },
    { label: "IBAN", value: "BG98 CECB 9790 1008 5533 00", mono: true, accent: true },
    { label: "BIC", value: "CECBBGSF", mono: true },
  ];

  return (
    <div
      className={`rounded-2xl p-5 sm:p-6 text-left relative overflow-hidden ${
        dark
          ? "bg-brand-green text-white border border-brand-gold/25 shadow-xl"
          : "bg-brand-light/60 text-brand-dark border border-brand-green/15"
      } ${className}`}
    >
      {dark && <div className="absolute top-0 right-0 w-48 h-48 bg-brand-gold/10 rounded-full blur-[60px] pointer-events-none" />}

      <div className="relative">
        <h5 className={`font-serif text-base font-bold flex items-center gap-2 ${dark ? "text-white" : "text-brand-green"}`}>
          <Landmark className="h-5 w-5 text-brand-gold" />
          Данни за банков превод
        </h5>

        {amount && (
          <div className={`mt-3 flex items-center justify-between rounded-xl px-3 py-2 ${dark ? "bg-white/5 border border-white/10" : "bg-white border border-brand-green/10"}`}>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${dark ? "text-white/50" : "text-brand-dark/50"}`}>Сума за плащане</span>
            <span className="font-serif text-lg font-bold text-brand-gold">{amount}</span>
          </div>
        )}

        <p className={`text-[11px] leading-relaxed mt-3 ${dark ? "text-white/70" : "text-brand-dark/60"}`}>
          В основанието за плащане въведете{reference ? <> <strong className={dark ? "text-white" : "text-brand-green"}>{reference}</strong></> : " Вашето име и вида на услугата"}.
        </p>

        <div className="mt-4 space-y-2.5">
          {rows.map((r) => (
            <div key={r.label} className={`rounded-lg px-3 py-2 ${dark ? "bg-white/5 border border-white/10" : "bg-white border border-brand-green/10"}`}>
              <span className={`block text-[9px] font-bold uppercase tracking-wider ${dark ? "text-white/50" : "text-brand-dark/40"}`}>{r.label}</span>
              <span className={`text-sm font-semibold ${r.mono ? "font-mono select-all" : ""} ${r.accent ? "text-brand-gold" : dark ? "text-white" : "text-brand-dark"}`}>{r.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
