import type { Metadata } from "next";
import { Inter, Playfair_Display, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import MetaPixel from "@/components/MetaPixel";
import { organizationSchema, personSchema, websiteSchema } from "@/lib/schema";
import { Analytics } from "@vercel/analytics/next";

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
  description: "Разработка и внедряване на HACCP (НАССР / ХАСЕП) системи, системи за самоконтрол, ISO 22000, IFS Food и ДПХП от д-р Данка Николова. Пълна документация за БАБХ, обекти в цяла България, 27 години опит в хранителния контрол.",
  keywords: [
    "HACCP",
    "НАССР",
    "ХАСЕП",
    "ХАСАП",
    "разработка и внедряване на HACCP система",
    "внедряване на ХАСЕП система",
    "НАССР система",
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
        url: "https://www.haccpspokoystvie.bg/og-image.jpg?v=6",
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "HACCP Спокойствие — дигитално решение за хранителна безопасност | Д-р Данка Николова",
      },
    ],
    locale: "bg_BG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Академия 'Сигурен Хранителен Бизнес' | Д-р Данка Николова",
    description: "Професионални консултации, внедряване и одит на системи за безопасност на храните от д-р Данка Николова.",
    images: ["https://www.haccpspokoystvie.bg/og-image.jpg?v=6"],
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
        {/* llms.txt lives at the root by convention; advertising it here too
            costs nothing and helps the agents that look for a declared copy. */}
        <link rel="alternate" type="text/plain" href="/llms.txt" title="llms.txt" />
        {/* Meta Pixel Base Code */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '2170194070520793');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=2170194070520793&ev=PageView&noscript=1"
            alt="facebook-pixel"
          />
        </noscript>
      </head>
      <body className="min-h-full flex flex-col bg-transparent text-brand-dark">
        <JsonLd data={[organizationSchema(), personSchema(), websiteSchema()]} />
        <MetaPixel />
        <Header />
        <main className="flex-grow overflow-x-clip">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}


