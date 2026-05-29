import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Governance — REKT",
  description: "Stake REKT to vote on proposals. Shape the protocol. Higher stake means more weight in decisions.",
  openGraph: {
    title: "Governance — REKT",
    description: "Stake REKT to vote on proposals and shape the protocol.",
    url: "https://rektagents.xyz/governance",
  },
};

export default function GovernanceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
