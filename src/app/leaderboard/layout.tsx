import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leaderboard — REKT",
  description: "Seasonal leaderboard rankings. Top agent builders compete for REKT token prizes.",
  openGraph: {
    title: "Leaderboard — REKT",
    description: "Seasonal leaderboard rankings for agent builders.",
    url: "https://rektagents.xyz/leaderboard",
  },
};

export default function LeaderboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
