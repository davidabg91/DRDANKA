import type { Metadata } from "next";

export const metadata: Metadata = {
  // default = the /live listing title; template re-declared so nested
  // /live/[slug] pages keep the brand suffix (a plain string here would
  // otherwise consume the root template for child segments).
  title: {
    default: "Live онлайн обучения по безопасност на храните в Zoom",
    template: "%s | Д-р Данка Николова",
  },
  description:
    "Групови live сесии с д-р Данка Николова в Zoom по HACCP, ДПХП, етикетиране и наредбите на БАБХ. Лична обратна връзка по Вашите казуси и официален сертификат.",
  alternates: { canonical: "/live" },
};

export default function LiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
