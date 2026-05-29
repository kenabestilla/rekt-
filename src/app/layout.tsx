import type { Metadata } from "next";
import { Geist_Mono, Geist } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/layout/Navbar";
import { PriceTicker } from "@/components/layout/PriceTicker";
import { Footer } from "@/components/layout/Footer";
import { SearchOverlay } from "@/components/layout/SearchOverlay";
import { OnboardingModal } from "@/components/ui/OnboardingModal";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "REKT — Crypto Intelligence for Agent Builders",
  description: "Track every DEX token in real-time. Portfolio tracking, price alerts, agent directory, and builder tools. Powered by DexScreener.",
  metadataBase: new URL('https://rektagents.xyz'),
  icons: {
    icon: '/wreck.svg',
  },
  openGraph: {
    title: "REKT — Crypto Intelligence for Agent Builders",
    description: "Track every DEX token in real-time. Portfolio tracking, price alerts, agent directory, and builder tools.",
    url: 'https://rektagents.xyz',
    siteName: 'REKT',
    images: [
      {
        url: 'https://rektagents.xyz/og',
        width: 1200,
        height: 630,
        alt: 'REKT — Crypto Intelligence',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "REKT — Crypto Intelligence for Agent Builders",
    description: "Track every DEX token in real-time. Portfolio, alerts, agent directory, and builder tools.",
    images: ['https://rektagents.xyz/og'],
  },
  manifest: '/manifest.json',
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistMono.variable} ${geistSans.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "REKT",
              "url": "https://rektagents.xyz",
              "logo": "https://rektagents.xyz/wreck.svg",
              "description": "Crypto intelligence platform for agent builders. Track DEX tokens, manage portfolios, discover agents, and earn rewards.",
              "sameAs": [
                "https://x.com/rektsagents"
              ],
              "founder": {
                "@type": "Person",
                "name": "Ken Abestilla"
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "REKT",
              "url": "https://rektagents.xyz",
              "description": "The platform where agent builders ship, earn, and grow together.",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://rektagents.xyz/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-black text-white">
        <Providers>
          <Navbar />
          <PriceTicker />
          <main className="flex-1">{children}</main>
          <Footer />
          <SearchOverlay />
          <OnboardingModal />
        </Providers>
      </body>
    </html>
  );
}
