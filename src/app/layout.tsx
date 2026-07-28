import type { Metadata } from "next";
import { Inter, Playfair_Display, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { organizationSchema, personSchema, websiteSchema } from "@/lib/schema";

const cormorant = Cormorant_Garamond({
  variable: "--font-logo",
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const baseUrl = "https://www.haccpspokoystvie.bg";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Д-р Данка Николова | Консултант по безопасност на храните",
    template: "%s | Д-р Данка Николова",
  },
  description: "Професионални консултации, внедряване и одит на системи за безопасност на храните (HACCP, ISO 22000, IFS, GMP) от д-р Данка Николова. 27 години опит в хранителния контрол.",
  keywords: [
    "HACCP",
    "НАССР",
    "безопасност на храните",
    "ISO 22000",
    "IFS Food",
    "ДПХП",
    "БАБХ регистрация",
    "система за самоконтрол",
    "етикетиране на храни",
    "консултант храни България",
    "Данка Николова",
  ],
  authors: [{ name: "Д-р Данка Николова" }],
  creator: "Д-р Данка Николова",
  publisher: "HACCP Спокойствие",
  alternates: {
    canonical: "https://www.haccpspokoystvie.bg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "Академия 'Сигурен Хранителен Бизнес' | Д-р Данка Николова",
    description: "Професионални консултации, внедряване и одит на системи за безопасност на храните (HACCP, ISO 22000, IFS, GMP) от д-р Данка Николова.",
    url: "https://www.haccpspokoystvie.bg",
    siteName: "Д-р Данка Николова | HACCP Спокойствие",
    images: [
      {
        url: "https://www.haccpspokoystvie.bg/opengraph-image?v=5",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Академия Сигурен Хранителен Бизнес - Д-р Данка Николова",
      },
    ],
    locale: "bg_BG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Академия 'Сигурен Хранителен Бизнес' | Д-р Данка Николова",
    description: "Професионални консултации, внедряване и одит на системи за безопасност на храните от д-р Данка Николова.",
    images: ["https://www.haccpspokoystvie.bg/opengraph-image?v=5"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="bg"
      className={`${inter.variable} ${playfair.variable} ${cormorant.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
    >
      <head>
        {/* Pre-warm the TLS connection to Firebase Storage so cover images
            (catalog, training cards) start downloading without an extra RTT. */}
        <link rel="preconnect" href="https://firebasestorage.googleapis.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://firebasestorage.googleapis.com" />
      </head>
      <body className="min-h-full flex flex-col bg-transparent text-brand-dark">
        <JsonLd data={[organizationSchema(), personSchema(), websiteSchema()]} />
        <Header />
        <main className="flex-grow overflow-x-clip">{children}</main>
        <Footer />
      </body>
    </html>
  );
}


