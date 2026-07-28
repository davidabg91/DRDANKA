import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Наръчници и чек листи за проверка на документацията",
  description:
    "Професионални наръчници, ръководства, чек листи и въпросници за проверка на документацията за безопасност на храните. Готови за изтегляне веднага след покупка.",
  alternates: { canonical: "/manuals" },
};

export default function ManualsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
