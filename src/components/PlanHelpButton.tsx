import { Phone } from "lucide-react";
import { AUTHOR } from "@/lib/siteConfig";

/**
 * „Не знам кой пакет е за моя обект" — обаждане към д-р Николова.
 * На телефон `tel:` отваря набирането; номерът е изписан и в бутона,
 * за да се вижда и от компютър.
 */
export default function PlanHelpButton({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 rounded-2xl px-5 py-4 text-center sm:text-left ${
        dark ? "bg-white/[0.04] border border-white/15" : "bg-brand-light/50 border border-brand-green/10"
      }`}
    >
      <div>
        <p className={`text-sm font-bold ${dark ? "text-white" : "text-brand-green"}`}>Не знаете кой пакет е подходящ?</p>
        <p className={`text-xs ${dark ? "text-white/60" : "text-brand-dark/60"}`}>
          Д-р Николова ще Ви препоръча пакет според дейността на обекта.
        </p>
      </div>
      <a
        href={AUTHOR.phoneTel}
        className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-brand-gold hover:bg-brand-gold-light text-brand-dark font-black text-xs uppercase tracking-wider shadow-md transition-all hover:-translate-y-0.5 whitespace-nowrap"
      >
        <Phone className="h-4 w-4" />
        <span className="flex flex-col items-start leading-tight">
          <span>Не знам кой пакет е за моя обект</span>
          <span className="text-[11px] font-bold normal-case tracking-normal opacity-80">Обадете се: {AUTHOR.phone}</span>
        </span>
      </a>
    </div>
  );
}
