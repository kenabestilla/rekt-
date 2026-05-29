import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Builder Tools — REKT",
  description: "Health monitors, reward calculators, agent templates, and developer resources for agent builders.",
  openGraph: {
    title: "Builder Tools — REKT",
    description: "Health monitors, reward calculators, and agent templates.",
    url: "https://rektagents.xyz/tools",
  },
};

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
