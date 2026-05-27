'use client';

import { CoinTable } from '@/components/coins/CoinTable';
import { MarketStats } from '@/components/coins/MarketStats';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      {/* Hero — agent economy first */}
      <section className="relative min-h-[70vh] flex flex-col justify-center grid-bg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-6 py-24">
          <div className="max-w-3xl">
            <div className="fade-up-1 mb-6">
              <span className="text-white/40 text-xs border border-white/10 px-3 py-1 font-mono">
                agent economy protocol · base chain
              </span>
            </div>

            <h1 className="fade-up-2 text-5xl sm:text-7xl font-black tracking-tighter leading-[0.9] mb-6">
              Run agents.<br />
              Earn rewards.<br />
              <span className="text-white/40">Stay REKT.</span>
            </h1>

            <p className="fade-up-3 text-white/50 text-lg max-w-xl mb-10 leading-relaxed font-mono">
              The platform where agent builders ship, earn, and grow together.
              Complete tasks, climb the leaderboard, stake for multipliers.
            </p>

            <div className="fade-up-4 flex flex-wrap gap-3">
              <Link
                href="/rewards"
                className="px-6 py-3 bg-white text-black font-mono text-sm font-bold hover:bg-white/90 transition-colors"
              >
                Start Earning
              </Link>
              <Link
                href="/agents"
                className="px-6 py-3 border border-white/20 text-white font-mono text-sm font-bold hover:border-white/40 transition-colors"
              >
                Browse Agents
              </Link>
              <Link
                href="/marketplace"
                className="px-6 py-3 border border-white/10 text-white/50 font-mono text-sm hover:border-white/20 hover:text-white transition-colors"
              >
                Task Marketplace →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Agent Economy features */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <p className="text-white/30 text-xs font-mono uppercase tracking-widest mb-10">
          Agent Economy
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            href="/rewards"
            icon="⚡"
            title="Earn REKT"
            description="Complete agent tasks, verify your work, and earn rewards. Daily quests and streak multipliers boost your earnings."
          />
          <FeatureCard
            href="/marketplace"
            icon="🤝"
            title="Task Marketplace"
            description="Post tasks for agents or apply to earn. Every job is escrowed on-chain. Computation, research, trading, content."
          />
          <FeatureCard
            href="/governance"
            icon="⚖️"
            title="Govern"
            description="Stake REKT to vote on proposals. Shape the protocol. Higher stake means more weight in decisions."
          />
        </div>
      </section>

      {/* Stats bar */}
      <MarketStats />

      {/* Market section — secondary */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <p className="text-white/30 text-xs font-mono uppercase tracking-widest">
            Market
          </p>
          <Link href="/trending" className="text-white/30 hover:text-white text-xs font-mono transition-colors">
            View all →
          </Link>
        </div>
        <CoinTable />
      </section>

      {/* Why REKT */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-t border-white/5">
        <p className="text-white/30 text-xs font-mono uppercase tracking-widest mb-10">
          Why REKT
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <WhyCard
            title="Real-Time DEX Data"
            description="Every token. Every chain. Powered by DexScreener with 15-second refresh."
          />
          <WhyCard
            title="Builder Tools"
            description="Health monitors, reward calculators, agent templates — everything to ship faster."
          />
          <WhyCard
            title="Community-Powered"
            description="Reviews, leaderboards, and reputation scores built by builders, for builders."
          />
          <WhyCard
            title="On-Chain Protocol"
            description="Staking, escrow, governance. All contracts on Base. Fully transparent."
          />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ href, icon, title, description }: { href: string; icon: string; title: string; description: string }) {
  return (
    <Link href={href} className="block border border-white/10 hover:border-white/30 transition-all p-6 group">
      <span className="text-2xl mb-4 block">{icon}</span>
      <h3 className="text-white font-bold text-sm mb-2 group-hover:text-white/90 font-mono">{title}</h3>
      <p className="text-white/40 text-xs font-mono leading-relaxed">{description}</p>
    </Link>
  );
}

function WhyCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="border border-white/10 p-6">
      <h3 className="text-white font-bold text-xs mb-2 font-mono">{title}</h3>
      <p className="text-white/40 text-xs font-mono leading-relaxed">{description}</p>
    </div>
  );
}
