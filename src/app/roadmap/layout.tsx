import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Roadmap — REKT",
  description: "The REKT roadmap: agent economy protocol phases, FAQ, and vision for the future of agent builders.",
  openGraph: {
    title: "Roadmap — REKT",
    description: "The REKT roadmap and vision for agent builders.",
    url: "https://rektagents.xyz/roadmap",
  },
};

export default function RoadmapLayout({ children }: { children: React.ReactNode }) {
  return children;
}
