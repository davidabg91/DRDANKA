import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Плащането е успешно",
  robots: { index: false, follow: false },
};

export default function PaySuccessLayout({ children }: { children: React.ReactNode }) {
  return children;
}
