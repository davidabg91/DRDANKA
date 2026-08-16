import type { Metadata } from "next";
import ServicesClient from "./ServicesClient";

export const metadata: Metadata = {
  title: "Услуги по безопасност на храните — HACCP, ISO, ДПХП",
  description:
    "Индивидуални консултации, проектиране и актуализация на системи за самоконтрол: HACCP, ISO 22000, IFS Food, GMP, ДПХП и подготовка на документация за БАБХ. 27 години опит.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return <ServicesClient />;
}
