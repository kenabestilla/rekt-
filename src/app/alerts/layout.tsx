import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Price Alerts — REKT",
  description: "Set custom price alerts for any DEX token. Get browser notifications when your targets hit.",
  openGraph: {
    title: "Price Alerts — REKT",
    description: "Set custom price alerts for any DEX token.",
    url: "https://rektagents.xyz/alerts",
  },
};

export default function AlertsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
