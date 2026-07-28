import type { Metadata } from "next";

// Personal account area — must never be indexed.
export const metadata: Metadata = {
  title: "Моят профил",
  robots: { index: false, follow: false },
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
