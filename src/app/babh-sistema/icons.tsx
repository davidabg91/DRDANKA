/**
 * Собствени икони за страницата за системата — нарисувани специално за
 * DANKA, вместо стандартните „ИИ" символи (искрици, магическа пръчка).
 * Стил като lucide: 24×24, линия 2, currentColor.
 */

import type { SVGProps } from "react";

const base: SVGProps<SVGSVGElement> = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

/** Сенник на магазин над лист от дневник — дневници, подбрани по мярка на обекта. */
export function ShopRegisterIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M5 10v9.5A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V10" />
      <path d="M4 3h16l1.5 5q-1.6 2.2-3.2 0q-1.6 2.2-3.2 0q-1.6 2.2-3.1 0q-1.6 2.2-3.2 0q-1.6 2.2-3.2 0z" />
      <path d="M9.5 3l-0.8 5M14.5 3l0.8 5" />
      <path d="M9 14.5h6M9 17.5h4" />
    </svg>
  );
}

/** Календар с отметнати дни и следващите на ред — рутината се попълва сама всеки ден. */
export function DailyTicksIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="4.5" width="18" height="16.5" rx="2" />
      <path d="M8 2.5v4M16 2.5v4M3 9.5h18" />
      <path d="M6 13.5l1 1 1.6-1.6M10.7 13.5l1 1 1.6-1.6M15.4 13.5l1 1 1.6-1.6" />
      <path d="M6 17.5l1 1 1.6-1.6M10.7 17.5l1 1 1.6-1.6" />
      <path d="M15.6 18h2.2" strokeDasharray="0.1 2.1" />
    </svg>
  );
}
