'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAccount } from 'wagmi';

const STATUS_COLORS: Record<string, string> = {
  open: 'text-green-400 border-green-400/30 bg-green-400/5',
  claimed: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/5',
  submitted: 'text-blue-400 border-blue-400/30 bg-blue-400/5',
  verified: 'text-purple-400 border-purple-400/30 bg-purple-400/5',
  disputed: 'text-red-400 border-red-400/30 bg-red-400/5',
  cancelled: 'text-white/30 border-white/10',
  expired: 'text-white/30 border-white/10',
};

export default function MarketplaceDetailPage() {
  const params = useParams();
  const { address } = useAccount();
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    async function fetchTask() {
      try {
        const res = await fetch(`/api/marketplace/tasks/${params.id}`);
        if (!res.ok) throw new Error('Not found');
        const data = await res.json();
        setTask(data);
      } catch {
        setTask(null);
      } finally {
        setLoading(false);
      }
    }
    fetchTask();
  }, [params.id]);

  const handleApply = async () => {
    if (!address) return;
    setApplying(true);
    try {
      const res = await fetch(`/api/marketplace/tasks/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ worker_address: address, status: 'claimed' }),
      });
      if (res.ok) {
        const updated = await res.json();
        setTask(updated);
      }
    } catch (err) {
      console.error('Failed to apply:', err);
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-white/40 font-mono">Task not found</p>
        <Link href="/marketplace" className="text-white/60 hover:text-white font-mono text-sm underline">
          ← Back to marketplace
        </Link>
      </div>
    );
  }

  const statusClass = STATUS_COLORS[task.status] || 'text-white/40 border-white/10';
  const isOwner = address && task.poster_address?.toLowerCase() === address.toLowerCase();
  const isWorker = address && task.worker_address?.toLowerCase() === address.toLowerCase();
  const canApply = task.status === 'open' && address && !isOwner;

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <Link href="/marketplace" className="text-white/40 hover:text-white font-mono text-xs mb-8 inline-block">
          ← marketplace
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-xs font-mono px-2 py-1 border ${statusClass}`}>
              {task.status?.toUpperCase()}
            </span>
            <span className="text-white/30 text-xs font-mono">
              {task.task_type}
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight mb-4">{task.title}</h1>
          <p className="text-white/50 font-mono text-sm leading-relaxed">{task.description}</p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="border border-white/10 p-6">
            <p className="text-white/40 text-xs font-mono mb-2">REWARD</p>
            <p className="text-white text-2xl font-bold font-mono">
              {parseFloat(task.reward_amount).toLocaleString()} {task.reward_token || 'REKT'}
            </p>
          </div>

          <div className="border border-white/10 p-6">
            <p className="text-white/40 text-xs font-mono mb-2">DEADLINE</p>
            <p className="text-white text-2xl font-bold font-mono">
              {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}
            </p>
          </div>

          <div className="border border-white/10 p-6">
            <p className="text-white/40 text-xs font-mono mb-2">POSTED BY</p>
            <p className="text-white font-mono text-sm truncate">
              {task.poster_address || 'Unknown'}
            </p>
          </div>

          <div className="border border-white/10 p-6">
            <p className="text-white/40 text-xs font-mono mb-2">ASSIGNED TO</p>
            <p className="text-white font-mono text-sm truncate">
              {task.worker_address || 'Unassigned'}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="border border-white/10 p-6">
          <p className="text-white/40 text-xs font-mono mb-4">ACTIONS</p>

          {!address && (
            <p className="text-white/30 font-mono text-sm">Connect your wallet to interact with this task.</p>
          )}

          {canApply && (
            <button
              onClick={handleApply}
              disabled={applying}
              className="px-6 py-3 bg-white text-black font-mono text-sm font-bold hover:bg-white/90 transition-colors disabled:opacity-50"
            >
              {applying ? 'Applying...' : 'Apply for this Task'}
            </button>
          )}

          {isOwner && task.status === 'open' && (
            <p className="text-white/50 font-mono text-sm">You posted this task. Waiting for an agent to apply.</p>
          )}

          {isWorker && task.status === 'claimed' && (
            <div>
              <p className="text-white/50 font-mono text-sm mb-4">You&apos;re assigned to this task. Submit your work below.</p>
              <button className="px-6 py-3 bg-white text-black font-mono text-sm font-bold hover:bg-white/90 transition-colors">
                Submit Work
              </button>
            </div>
          )}

          {isOwner && task.status === 'submitted' && (
            <div>
              <p className="text-white/50 font-mono text-sm mb-4">Work has been submitted. Review and verify.</p>
              <div className="flex gap-3">
                <button className="px-6 py-3 bg-green-500 text-black font-mono text-sm font-bold hover:bg-green-400 transition-colors">
                  Approve
                </button>
                <button className="px-6 py-3 bg-red-500 text-white font-mono text-sm font-bold hover:bg-red-400 transition-colors">
                  Reject
                </button>
              </div>
            </div>
          )}

          {task.status === 'verified' && (
            <p className="text-purple-400 font-mono text-sm">Task completed and verified.</p>
          )}
        </div>

        {/* Metadata */}
        <div className="mt-6 text-white/20 text-xs font-mono">
          <p>Created: {new Date(task.created_at).toLocaleString()}</p>
          <p>Task ID: {task.id}</p>
        </div>
      </div>
    </div>
  );
}
