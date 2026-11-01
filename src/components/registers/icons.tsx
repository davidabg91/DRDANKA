/* Собствени икони за дневниците (без общите „ИИ" икони като магическа пръчка). */

/** Календар с отметка — „попълни автоматично" за период. */
export function MonthFillIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect x="3" y="4.5" width="18" height="16" rx="2.5" />
      <path d="M3 9.5h18" />
      <path d="M8 2.5v4M16 2.5v4" />
      <path d="m8.5 15 2.3 2.3L15.5 12.6" />
    </svg>
  );
}
