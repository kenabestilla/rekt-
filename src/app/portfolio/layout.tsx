import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio Tracker — REKT",
  description: "Track your crypto portfolio across all chains. Real-time P&L, allocation charts, and price alerts.",
  openGraph: {
    title: "Portfolio Tracker — REKT",
    description: "Track your crypto portfolio across all chains.",
    url: "https://rektagents.xyz/portfolio",
  },
};

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
