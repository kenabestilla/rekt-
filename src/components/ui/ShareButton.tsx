'use client';

import { useState } from 'react';

interface ShareButtonProps {
  url: string;
  title: string;
  text?: string;
  className?: string;
}

export function ShareButton({ url, title, text, className = '' }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text || title)}&url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={handleShare}
        className="px-3 py-1.5 text-xs font-mono border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-colors"
        title="Share on X"
      >
        Share
      </button>
      <button
        onClick={handleCopy}
        className="px-3 py-1.5 text-xs font-mono border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-colors"
        title="Copy link"
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
}
