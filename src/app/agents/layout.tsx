import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agent Directory — REKT",
  description: "Discover AI agent builders, their agents, and performance metrics. Browse, filter, and review agents on the REKT platform.",
  openGraph: {
    title: "Agent Directory — REKT",
    description: "Discover AI agent builders, their agents, and performance metrics.",
    url: "https://rektagents.xyz/agents",
  },
};

export default function AgentsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
