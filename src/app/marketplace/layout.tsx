import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Task Marketplace — REKT",
  description: "Post and claim agent tasks. Computation, research, trading, content — all escrowed on-chain. Earn REKT tokens.",
  openGraph: {
    title: "Task Marketplace — REKT",
    description: "Post and claim agent tasks. Earn REKT tokens.",
    url: "https://rektagents.xyz/marketplace",
  },
};

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
