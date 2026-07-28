import type { Metadata } from "next";

export const metadata: Metadata = {
  // default = the /library listing title; template re-declared so nested
  // /library/[slug] pages keep the brand suffix.
  title: {
    default: "Обучения и материали за хранителен бизнес",
    template: "%s | Д-р Данка Николова",
  },
  description:
    "Професионални обучения, видео курсове и готови материали от д-р Данка Николова по HACCP, ДПХП и етикетиране — достъп веднага след покупка, учите във Вашето темпо.",
  alternates: { canonical: "/library" },
};

export default function LibraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
