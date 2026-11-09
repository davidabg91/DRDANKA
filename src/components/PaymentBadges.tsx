/**
 * Разпознаваемите знаци на картите и портфейлите под бутона за плащане —
 * като на големите онлайн магазини. Чисти SVG-та, без външни изображения.
 */

function Badge({ children, dark, label }: { children: React.ReactNode; dark?: boolean; label: string }) {
  return (
    <span
      role="img"
      aria-label={label}
      title={label}
      className={`inline-flex items-center justify-center h-7 w-11 rounded-md border shadow-sm ${
        dark ? "bg-black border-black" : "bg-white border-slate-200"
      }`}
    >
      {children}
    </span>
  );
}

export function VisaMark() {
  return (
    <Badge label="Visa">
      <svg viewBox="0 0 48 16" className="h-3 w-auto" aria-hidden="true">
        <text
          x="24"
          y="13.5"
          textAnchor="middle"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="16"
          fontWeight="900"
          fontStyle="italic"
          letterSpacing="-0.5"
          fill="#1A1F71"
        >
          VISA
        </text>
      </svg>
    </Badge>
  );
}

export function MastercardMark() {
  return (
    <Badge label="Mastercard">
      <svg viewBox="0 0 32 20" className="h-4 w-auto" aria-hidden="true">
        <circle cx="12" cy="10" r="8" fill="#EB001B" />
        <circle cx="20" cy="10" r="8" fill="#F79E1B" />
        <path d="M16 3.07a8 8 0 0 1 0 13.86 8 8 0 0 1 0-13.86z" fill="#FF5F00" />
      </svg>
    </Badge>
  );
}

export function ApplePayMark() {
  return (
    <Badge label="Apple Pay" dark>
      <svg viewBox="0 0 40 16" className="h-3.5 w-auto" aria-hidden="true">
        {/* ябълка */}
        <path
          d="M10.1 8.5c0-1.6 1.3-2.4 1.4-2.4-.8-1.1-1.9-1.3-2.3-1.3-1-.1-1.9.6-2.4.6-.5 0-1.3-.6-2.1-.6C3.6 4.8 2.6 5.4 2 6.4.9 8.3 1.7 11.1 2.8 12.6c.5.8 1.1 1.6 1.9 1.6.8 0 1-.5 2-.5s1.2.5 2 .5 1.3-.8 1.8-1.5c.6-.8.8-1.6.8-1.7 0 0-1.6-.6-1.2-2.5z"
          fill="#fff"
        />
        <path d="M8.6 3.6c.4-.5.7-1.2.6-1.9-.6 0-1.3.4-1.8.9-.4.4-.7 1.1-.6 1.8.7.1 1.3-.3 1.8-.8z" fill="#fff" />
        <text x="14" y="12.5" fontFamily="-apple-system, 'Segoe UI', Arial, sans-serif" fontSize="11" fontWeight="600" fill="#fff">
          Pay
        </text>
      </svg>
    </Badge>
  );
}

export function GooglePayMark() {
  return (
    <Badge label="Google Pay">
      <svg viewBox="0 0 40 16" className="h-3.5 w-auto" aria-hidden="true">
        <text x="1" y="12.5" fontFamily="Arial, Helvetica, sans-serif" fontSize="12" fontWeight="700">
          <tspan fill="#4285F4">G</tspan>
        </text>
        <text x="13" y="12.5" fontFamily="Arial, Helvetica, sans-serif" fontSize="11" fontWeight="600" fill="#5F6368">
          Pay
        </text>
      </svg>
    </Badge>
  );
}

/** Visa · Mastercard · Apple Pay · Google Pay — в един ред. */
export default function PaymentBadges({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center justify-center gap-1.5 ${className}`}>
      <VisaMark />
      <MastercardMark />
      <ApplePayMark />
      <GooglePayMark />
    </div>
  );
}
