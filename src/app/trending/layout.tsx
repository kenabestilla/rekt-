import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trending Tokens — REKT",
  description: "Real-time trending DEX tokens across all chains. Top movers, biggest gainers, and volume leaders powered by DexScreener.",
  openGraph: {
    title: "Trending Tokens — REKT",
    description: "Real-time trending DEX tokens across all chains.",
    url: "https://rektagents.xyz/trending",
  },
};

export default function TrendingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
