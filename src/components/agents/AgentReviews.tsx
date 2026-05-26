'use client';

import { useState } from 'react';
import { clsx } from 'clsx';
import { useAgentReviews, useSubmitReview } from '@/hooks/useAgents';
import { useWallet } from '@/hooks/useWallet';

interface AgentReviewsProps {
  agentId: string;
}

export function AgentReviews({ agentId }: AgentReviewsProps) {
  const { data: reviews, isLoading } = useAgentReviews(agentId);
  const submitReview = useSubmitReview();
  const { address } = useWallet();
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(5);
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');

  const reviewList = reviews || [];
  const sorted = [...reviewList].sort((a: any, b: any) => {
    if (sortBy === 'popular') return (b.likes || 0) - (a.likes || 0);
    return 0;
  });

  const averageRating = reviewList.length > 0
    ? reviewList.reduce((sum: number, r: any) => sum + r.rating, 0) / reviewList.length
    : 0;

  const handleSubmit = () => {
    if (!address || !newReview.trim()) return;
    submitReview.mutate({
      agentId,
      reviewer_wallet: address,
      rating,
      comment: newReview,
    });
    setNewReview('');
    setRating(5);
  };

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="border border-white/10 p-6">
        <div className="flex items-center gap-8">
          <div className="text-center">
            <div className="text-4xl font-black text-white font-mono tabular-nums">{averageRating.toFixed(1)}</div>
            <div className="flex items-center gap-0.5 mt-1 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={clsx(
                    'text-xs',
                    star <= Math.round(averageRating) ? 'text-white' : 'text-white/20'
                  )}
                >
                  *
                </span>
              ))}
            </div>
            <div className="text-[10px] text-white/30 font-mono mt-1">{reviewList.length} reviews</div>
          </div>

          <div className="flex-1 space-y-1.5">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviewList.filter((r: any) => r.rating === star).length;
              const percentage = reviewList.length > 0 ? (count / reviewList.length) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-[10px] text-white/30 font-mono w-3">{star}</span>
                  <div className="flex-1 h-1 bg-white/5 overflow-hidden">
                    <div
                      className="h-full bg-white/30"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-white/20 font-mono w-6 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Write Review */}
      <div className="border border-white/10 p-6">
        <h3 className="text-xs font-bold text-white/60 uppercase font-mono tracking-widest mb-4">Write a Review</h3>
        {!address ? (
          <p className="text-white/30 text-xs font-mono">Connect your wallet to write a review</p>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] text-white/30 font-mono uppercase tracking-widest">Rating:</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={clsx(
                    'text-sm font-mono transition-colors',
                    star <= rating ? 'text-white' : 'text-white/20'
                  )}
                >
                  *
                </button>
              ))}
            </div>
            <textarea
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              placeholder="Share your experience..."
              className="w-full bg-transparent text-white text-sm font-mono px-4 py-3 border border-white/10 focus:outline-none focus:border-white/30 min-h-[80px] resize-none placeholder-white/20"
            />
            <button
              onClick={handleSubmit}
              disabled={!newReview.trim() || submitReview.isPending}
              className="mt-3 px-6 py-2.5 bg-white text-black text-xs font-bold font-mono uppercase tracking-widest hover:bg-white/90 transition-colors disabled:opacity-30"
            >
              {submitReview.isPending ? 'submitting...' : 'submit review'}
            </button>
          </>
        )}
      </div>

      {/* Sort */}
      <div className="flex items-center gap-1">
        {(['recent', 'popular'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setSortBy(s)}
            className={clsx(
              'px-3 py-1.5 text-xs font-mono transition-colors border',
              sortBy === s
                ? 'border-white/20 text-white bg-white/[0.03]'
                : 'border-transparent text-white/30 hover:text-white'
            )}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Reviews */}
      {isLoading ? (
        <div className="text-center py-8 text-white/30 font-mono text-sm">Loading reviews...</div>
      ) : (
        <div className="space-y-px border border-white/10 bg-white/10">
          {sorted.length === 0 ? (
            <div className="bg-black p-8 text-center text-white/30 font-mono text-sm">
              No reviews yet
            </div>
          ) : (
            sorted.map((review: any) => (
              <div key={review.id} className="bg-black p-5">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 border border-white/10 flex items-center justify-center text-xs font-mono text-white/40 shrink-0">
                    {review.reviewer_wallet?.slice(2, 4).toUpperCase() || '??'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-white">
                        {review.reviewer_name || `${review.reviewer_wallet?.slice(0, 6)}...${review.reviewer_wallet?.slice(-4)}`}
                      </span>
                      <span className="text-[10px] text-white/20 font-mono">
                        {'*'.repeat(review.rating)}{'.'.repeat(5 - review.rating)}
                      </span>
                      <span className="text-[10px] text-white/20 font-mono">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-white/50 mb-3 leading-relaxed">{review.comment}</p>
                    <div className="flex items-center gap-4 text-[10px] text-white/20 font-mono">
                      <span>+{review.likes || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
