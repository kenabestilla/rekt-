import { NextRequest, NextResponse } from 'next/server';

// Server-side icon proxy — tries multiple sources, returns first valid image
// Caches successful URLs for 24 hours

const SOURCES = {
  // Jupiter CDN for Solana
  jupiter: (address: string) =>
    `https://raw.githubusercontent.com/jup-ag/token-list/main/assets/mainnet/${address}/logo.png`,
  // TrustWallet for EVM chains
  trustwallet: (chain: string, address: string) => {
    const chainMap: Record<string, string> = {
      ethereum: 'ethereum',
      bsc: 'smartchain',
      base: 'base',
      arbitrum: 'arbitrum',
      polygon: 'polygon',
      avalanche: 'avalanche',
      optimism: 'optimism',
    };
    const twChain = chainMap[chain];
    if (!twChain) return '';
    return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${twChain}/assets/${address.toLowerCase()}/logo.png`;
  },
  // CoinGecko search-based fallback
  coingecko: (symbol: string) =>
    `https://assets.coingecko.com/coins/images/small/${symbol.toLowerCase()}.png`,
};

// In-memory cache (survives across requests in same server process)
const iconCache = new Map<string, { url: string; timestamp: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

async function checkUrl(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, {
      method: 'HEAD',
      signal: AbortSignal.timeout(3000),
    });
    return res.ok && (res.headers.get('content-type')?.startsWith('image/') ?? false);
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const chain = searchParams.get('chain') || '';
  const address = searchParams.get('address') || '';
  const symbol = searchParams.get('symbol') || '';

  if (!chain || !address) {
    return NextResponse.json({ error: 'chain and address required' }, { status: 400 });
  }

  const cacheKey = `${chain}:${address.toLowerCase()}`;

  // Check cache
  const cached = iconCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json({ url: cached.url, cached: true });
  }

  // Build candidate URLs
  const candidates: string[] = [];

  // Solana → Jupiter first
  if (chain === 'solana') {
    candidates.push(SOURCES.jupiter(address));
  }

  // EVM → TrustWallet
  if (chain !== 'solana') {
    const tw = SOURCES.trustwallet(chain, address);
    if (tw) candidates.push(tw);
  }

  // Try each candidate
  for (const url of candidates) {
    if (await checkUrl(url)) {
      iconCache.set(cacheKey, { url, timestamp: Date.now() });
      return NextResponse.json({ url, source: 'cdn' });
    }
  }

  // No icon found
  return NextResponse.json({ url: null, source: 'none' });
}
