import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Книги на д-р Данка Николова",
  description:
    "Книги и практически ръководства от Данка Николова — с ясни стъпки, упражнения и идеи за прилагане веднага. Четат се онлайн на телефон, таблет или компютър.",
  alternates: { canonical: "/books" },
};

export default function BooksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
