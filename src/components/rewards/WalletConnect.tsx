'use client';

import { useState, useRef, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi';

const WALLET_LABELS: Record<string, string> = {
  MetaMask: 'MetaMask',
  'Coinbase Wallet': 'Coinbase',
  WalletConnect: 'WalletConnect',
  Injected: 'Browser Wallet',
};

function MetaMaskIcon() {
  return (
    <svg viewBox="0 0 35 33" fill="none" className="w-5 h-5">
      <path d="M32.96 1L19.67 10.93l2.46-5.82L32.96 1z" fill="#E17726" stroke="#E17726" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2.04 1l13.17 10.04-2.34-5.92L2.04 1z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M28.23 23.53l-3.53 5.42 7.56 2.07 2.17-7.35-6.2-0.14z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M.64 23.67l2.16 7.35 7.55-2.07-3.52-5.42-6.19.14z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9.93 14.59l-2.14 3.24 7.5.34-.24-8.05-5.12 4.47z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M25.07 14.59l-5.24-4.56-.17 8.14 7.5-.34-2.09-3.24z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10.26 28.95l5.28-2.56-4.56-3.55-7.2 2.1 6.48 4.01z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M24.74 28.95l-6.48-4.01-4.65 3.55 5.37 2.56 5.76-.1z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M29.52 31.02l-5.76.1-5.28-2.56 1.69 2.79 3.97 1.19 5.38-1.52z" fill="#D5BFB2" stroke="#D5BFB2" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5.48 31.02l5.38 1.52 3.97-1.19 1.57-2.79-5.14 2.56-5.78-.1z" fill="#D5BFB2" stroke="#D5BFB2" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M19.32 26.39l-1.69-2.79h3.74l-2.05 2.79z" fill="#233447" stroke="#233447" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function CoinbaseIcon() {
  return (
    <svg viewBox="0 0 28 28" fill="none" className="w-5 h-5">
      <circle cx="14" cy="14" r="14" fill="#0052FF"/>
      <path d="M14 24.08c5.57 0 10.08-4.51 10.08-10.08S19.57 3.92 14 3.92 3.92 8.43 3.92 14 8.43 24.08 14 24.08z" fill="#0052FF"/>
      <path d="M14.32 10.96c3.06 0 5.18 2.08 5.18 5.04 0 2.95-2.12 5.04-5.18 5.04h-2.14v-10.08h2.14zm-.36 8.24c1.78 0 2.88-1.34 2.88-3.2s-1.1-3.2-2.88-3.2h-1.78v6.4h1.78z" fill="white"/>
    </svg>
  );
}

function WalletConnectIcon() {
  return (
    <svg viewBox="0 0 28 28" fill="none" className="w-5 h-5">
      <circle cx="14" cy="14" r="14" fill="#3B99FC"/>
      <path d="M8.68 11.18c3.2-3.14 8.44-3.14 11.64 0l.38.38a.32.32 0 010 .46l-1.32 1.3a.32.32 0 01-.44 0l-.53-.52c-2.26-2.22-5.94-2.22-8.2 0l-.57.56a.32.32 0 01-.44 0L8.08 12a.32.32 0 010-.46l.6-.36zm13.14 3.04l1.18 1.16a.32.32 0 010 .46l-5.3 5.22a.36.36 0 01-.5 0l-3.74-3.68a.1.1 0 00-.14 0l-3.74 3.68a.36.36 0 01-.5 0l-5.3-5.22a.32.32 0 010-.46l1.18-1.16a.32.32 0 01.44 0l3.74 3.68a.1.1 0 00.14 0l3.74-3.68a.32.32 0 01.44 0l3.74 3.68a.1.1 0 00.14 0l3.74-3.68a.32.32 0 01.44 0z" fill="white"/>
    </svg>
  );
}

function WalletIcon({ name }: { name: string }) {
  switch (name) {
    case 'MetaMask': return <MetaMaskIcon />;
    case 'Coinbase Wallet': return <CoinbaseIcon />;
    case 'WalletConnect': return <WalletConnectIcon />;
    default: return <span className="text-xs font-mono text-white/40">◈</span>;
  }
}

export function WalletConnect() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({ address });

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  if (isConnected && address) {
    return (
      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="w-full p-4 border border-white/10 hover:border-white/20 transition-colors text-left"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] text-white/30 font-mono uppercase tracking-widest">connected</p>
            <span className="flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-green-400" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400" />
              </span>
              <span className="text-[10px] text-green-400 font-mono">{chain?.name || 'Unknown'}</span>
            </span>
          </div>
          <p className="text-sm text-white font-mono tabular-nums mb-1">
            {address.slice(0, 6)}...{address.slice(-4)}
          </p>
          {balance && (
            <p className="text-xs text-white/40 font-mono tabular-nums">
              {(Number(balance.value) / 10 ** balance.decimals).toFixed(4)} {balance.symbol}
            </p>
          )}
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-white/20 font-mono">
            {open ? '▲' : '▼'}
          </span>
        </button>

        {open && (
          <div className="absolute z-10 w-full border border-white/10 border-t-0 bg-black">
            <button
              onClick={() => { disconnect(); setOpen(false); }}
              className="w-full px-4 py-3 text-left text-xs font-mono text-white/30 hover:text-white hover:bg-white/[0.03] transition-colors uppercase tracking-widest"
            >
              disconnect
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full p-6 border border-white/10 hover:border-white/20 transition-colors"
      >
        <p className="text-[10px] text-white/30 font-mono uppercase tracking-widest mb-2 text-center">
          connect wallet
        </p>
        <p className="text-center text-[10px] text-white/15 font-mono">
          {open ? '▲' : '▼'} select wallet
        </p>
      </button>

      {open && (
        <div className="absolute z-10 w-full border border-white/10 border-t-0 bg-black">
          {connectors.map((connector) => (
            <button
              key={connector.uid}
              onClick={() => { connect({ connector }); setOpen(false); }}
              disabled={isPending}
              className="w-full flex items-center gap-3 px-4 py-3 text-white/60 hover:text-white hover:bg-white/[0.03] transition-colors disabled:opacity-30 border-b border-white/5 last:border-b-0"
            >
              <span className="w-6 h-6 flex items-center justify-center">
                <WalletIcon name={connector.name} />
              </span>
              <span className="text-sm font-mono flex-1 text-left">
                {WALLET_LABELS[connector.name] || connector.name}
              </span>
              <span className="text-[10px] text-white/20 font-mono">→</span>
            </button>
          ))}
          <div className="px-4 py-2">
            <p className="text-[10px] text-white/15 font-mono text-center">
              Base network (mainnet / testnet)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
