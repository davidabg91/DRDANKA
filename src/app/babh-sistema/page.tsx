import type { Metadata } from "next";
import BabhSistemaClient from "./BabhSistemaClient";

export const metadata: Metadata = {
  title: "Автоматична Система за БАБХ Дневници & HACCP — Електронни Регистри",
  description:
    "Електронни БАБХ дневници и HACCP система за ресторанти, магазини и производства. Автоматично попълване на 10-те дневника по самоконтрол за 60 сек/ден, етикети за проследимост и 24/7 поддръжка от д-р Николова. Тествайте 14 дни безплатно.",
  keywords: [
    "бабх система",
    "електронни дневници бабх",
    "автоматична система за дневници бабх",
    "софтуер за бабх дневници",
    "дигитални бабх дневници",
    "haccp система онлайн",
    "система за самоконтрол бабх",
    "дневник температурни режими бабх",
    "дневник хигиена дезинфекция бабх"
  ],
  alternates: { canonical: "/babh-sistema" },
  openGraph: {
    title: "Автоматична Система за БАБХ Дневници & HACCP — Електронни Регистри",
    description:
      "Електронни БАБХ дневници и HACCP система с автоматично попълване за 60 секунди на ден. 100% законова защита от БАБХ актове и глоби.",
    url: "https://www.haccpspokoystvie.bg/babh-sistema",
    siteName: "БАБХ Спокойствие — д-р Данка Николова",
    locale: "bg_BG",
    type: "website",
  },
};

export default function BabhSistemaPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Система „Дигитално Спокойствие“ — Автоматични БАБХ Дневници",
    "operatingSystem": "Web, Mobile, Desktop",
    "applicationCategory": "BusinessApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "EUR",
      "priceValidUntil": "2027-12-31",
      "description": "14 Дни Безплатен Пробен Период"
    },
    "description": "Пълна автоматизация на 10-те задължителни БАБХ дневника по самоконтрол, генератор на етикети за проследимост и 24/7 поддръжка от експерти по безопасност на храните.",
    "publisher": {
      "@type": "Organization",
      "name": "Академия сигурен хранителен бизнес — д-р Данка Николова",
      "url": "https://www.haccpspokoystvie.bg"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BabhSistemaClient />
    </>
  );
}
