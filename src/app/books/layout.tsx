import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Книги на д-р Данка Николова",
  description:
    "Книги на д-р Николова за безопасност на храните, НАССР и изискванията на БАБХ — практически ръководства за хранителния бизнес.",
  alternates: { canonical: "/books" },
};

export default function BooksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
