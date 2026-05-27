import type { Metadata } from "next";
import { Inter, Playfair_Display, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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

const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "https://drdanka.bg";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "Д-р Данка Николова | Консултант по безопасност на храните",
  description: "Професионални консултации, внедряване и одит на системи за безопасност на храните (HACCP, ISO 22000, IFS, GMP) от д-р Данка Николова. 27 години опит в хранителния контрол.",
  openGraph: {
    title: "Д-р Данка Николова | Консултант по безопасност на храните",
    description: "Професионални консултации, внедряване и одит на системи за безопасност на храните (HACCP, ISO 22000, IFS, GMP) от д-р Данка Николова. 27 години опит в хранителния контрол.",
    url: "https://drdanka.bg",
    siteName: "Д-р Данка Николова",
    images: [
      {
        url: "/share-logo.jpg",
        width: 1200,
        height: 630,
        alt: "Д-р Данка Николова - Безопасност на храните",
      },
    ],
    locale: "bg_BG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Д-р Данка Николова | Консултант по безопасност на храните",
    description: "Професионални консултации, внедряване и одит на системи за безопасност на храните (HACCP, ISO 22000, IFS, GMP) от д-р Данка Николова. 27 години опит в хранителния контрол.",
    images: ["/share-logo.jpg"],
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
    >
      <head>
        {/* Pre-warm the TLS connection to Firebase Storage so cover images
            (catalog, training cards) start downloading without an extra RTT. */}
        <link rel="preconnect" href="https://firebasestorage.googleapis.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://firebasestorage.googleapis.com" />
      </head>
      <body className="min-h-full flex flex-col bg-transparent text-brand-dark">
        <Header />
        <main className="flex-grow overflow-x-clip">{children}</main>
        <Footer />
      </body>
    </html>
  );
}


