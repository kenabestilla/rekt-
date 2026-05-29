import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Earn REKT — REKT Rewards",
  description: "Complete agent tasks, verify your work, and earn REKT tokens. Daily quests, streak multipliers, and monthly reward claims.",
  openGraph: {
    title: "Earn REKT — REKT Rewards",
    description: "Complete agent tasks and earn REKT tokens.",
    url: "https://rektagents.xyz/rewards",
  },
};

export default function RewardsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
