'use client';

import { useState } from 'react';
import { clsx } from 'clsx';
import { CATEGORY_LABELS } from '@/types/agent';
import type { Agent } from '@/types/agent';

interface AgentCardProps {
  agent: Agent;
  onClick?: () => void;
}

export function AgentCard({ agent, onClick }: AgentCardProps) {
  const [imgError, setImgError] = useState(false);
  const hasImage = agent.avatar && !imgError;

  return (
    <div
      onClick={onClick}
      className="p-5 cursor-pointer hover:bg-white/[0.02] transition-colors group"
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 border border-white/10 flex items-center justify-center shrink-0 bg-white/[0.03] overflow-hidden">
          {hasImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={agent.avatar}
              alt={agent.name}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <span className="text-lg text-white/40">{agent.name.charAt(0)}</span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 overflow-hidden">
          {/* Name + symbol + status row */}
          <div className="flex items-center gap-2 mb-1 overflow-hidden">
            <h3 className="text-sm font-medium text-white truncate flex-1 min-w-0">{agent.name}</h3>
            {agent.tokenSymbol && (
              <span className="text-[10px] px-1.5 py-0.5 border border-white/10 text-white/30 font-mono uppercase shrink-0">
                ${agent.tokenSymbol}
              </span>
            )}
            <span
              className={clsx(
                'px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-widest shrink-0 border',
                {
                  'border-green-500/20 text-green-400': agent.status === 'live',
                  'border-yellow-500/20 text-yellow-400': agent.status === 'beta',
                  'border-white/10 text-white/30': agent.status === 'coming-soon',
                }
              )}
            >
              {agent.status === 'live' ? 'live' : agent.status === 'beta' ? 'beta' : 'soon'}
            </span>
          </div>

          {/* Description */}
          <p className="text-xs text-white/40 line-clamp-2 mb-3 leading-relaxed break-words">
            {agent.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-3 overflow-hidden">
            <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest border border-white/10 text-white/40 shrink-0">
              {CATEGORY_LABELS[agent.category] || agent.category}
            </span>
            {agent.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-[10px] font-mono text-white/20 truncate max-w-[100px]"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Metrics */}
          <div className="flex items-center gap-3 text-[10px] text-white/20 font-mono overflow-hidden">
            {agent.metrics.users > 0 && (
              <span className="shrink-0">{formatNumber(agent.metrics.users)} users</span>
            )}
            {(agent.metrics.rating ?? 0) > 0 && (
              <span className="shrink-0">{(agent.metrics.rating ?? 0).toFixed(1)} rating</span>
            )}
            {agent.chain && (
              <span className="uppercase shrink-0">{agent.chain}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}
