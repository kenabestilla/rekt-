import { NextRequest, NextResponse } from 'next/server';

// CoinGecko platform mapping
const COINGECKO_PLATFORMS: Record<string, string> = {
  ethereum: 'ethereum',
  bsc: 'binance-smart-chain',
  base: 'base',
  arbitrum: 'arbitrum-one',
  polygon: 'polygon-pos',
  avalanche: 'avalanche',
  optimism: 'optimistic-ethereum',
  solana: 'solana',
  linea: 'linea',
  scroll: 'scroll',
  zksync: 'zksync',
  mantle: 'mantle',
  blast: 'blast',
  sonic: 'sonic',
  bnb: 'binance-smart-chain',
  cronos: 'cronos',
  fantom: 'fantom',
  pulsechain: 'pulsechain',
};

// Static icon registry for popular tokens (no API call needed)
const POPULAR_ICONS: Record<string, string> = {
  // Ethereum
  'ethereum:0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2': 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
  'ethereum:0xdac17f958d2ee523a2206206994597c13d831ec7': 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
  'ethereum:0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': 'https://assets.coingecko.com/coins/images/6319/small/usdc.png',
  'ethereum:0x6b175474e89094c44da98b954eedeac495271d0f': 'https://assets.coingecko.com/coins/images/9956/small/4943.png',
  'ethereum:0x2260fac5e5542a773aa44fbcfedf7c193bc2c599': 'https://assets.coingecko.com/coins/images/7598/small/WBTCLOGO.png',
  'ethereum:0x514910771af9ca656af840dff83e8264ecf986ca': 'https://assets.coingecko.com/coins/images/877/small/chainlink.png',
  'ethereum:0x1f9840a85d5af5bf1d1762f925bdaddc4201f984': 'https://assets.coingecko.com/coins/images/12504/small/uniswap-logo.png',
  'ethereum:0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9': 'https://assets.coingecko.com/coins/images/12645/small/AAVE.png',
  'ethereum:0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2': 'https://assets.coingecko.com/coins/images/1389/small/maker.png',
  'ethereum:0xc00e94cb662c3520282e6f5717214004a7f26888': 'https://assets.coingecko.com/coins/images/8780/small/COMP.png',
  'ethereum:0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0': 'https://assets.coingecko.com/coins/images/4713/small/polygon-token.png',
  'ethereum:0x6810e776880c02933d47db1b9fc05908e5386b96': 'https://assets.coingecko.com/coins/images/662/small/GNO.png',
  'ethereum:0xae78736cd615f374d3085123a210448e74fc6393': 'https://assets.coingecko.com/coins/images/20765/small/RPL.png',
  'ethereum:0x853d955acef822db058eb8505911ed77f175b99e': 'https://assets.coingecko.com/coins/images/13180/small/frax-logo.png',
  'ethereum:0x5f98805a4e8be255a32880fdec7f6728c6568ba0': 'https://assets.coingecko.com/coins/images/14666/small/axlusdc.png',
  // Base
  'base:0x532f27101965dd16442e59d40670faf5ebb142e4': 'https://assets.coingecko.com/coins/images/35529/small/1000050750.png',
  'base:0x4ed4e862860bed51a9570b96d89af5e1b0efef9d': 'https://assets.coingecko.com/coins/images/35529/small/1000050750.png',
  'base:0x50c5725949a6f0c72e6c4a641f24049a917db0cb': 'https://assets.coingecko.com/coins/images/35529/small/1000050750.png',
  'base:0x833589fcd6edb6e08f4c7c32d4f71b54bda02913': 'https://assets.coingecko.com/coins/images/6319/small/usdc.png',
  'base:0x4200000000000000000000000000000000000006': 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
  // BSC
  'bsc:0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c': 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png',
  'bsc:0xe9e7cea3dedca5984780bafc599bd69add087d56': 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
  'bsc:0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d': 'https://assets.coingecko.com/coins/images/6319/small/usdc.png',
  'bsc:0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c': 'https://assets.coingecko.com/coins/images/7598/small/WBTCLOGO.png',
  'bsc:0x2170ed0880ac9a755fd29b2688956bd959f933f8': 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
  // Arbitrum
  'arbitrum:0x82af49447d8a07e3bd95bd0d56f35241523fbab1': 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
  'arbitrum:0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9': 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
  'arbitrum:0xff970a61a04b1ca14834a43f5de4533ebddb5cc8': 'https://assets.coingecko.com/coins/images/6319/small/usdc.png',
  // Solana
  'solana:So11111111111111111111111111111111111111112': 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
  'solana:EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': 'https://assets.coingecko.com/coins/images/6319/small/usdc.png',
  'solana:Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB': 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
  // Polygon
  'polygon:0x2791bca1f2de4661ed88a30c99a7a9449aa84174': 'https://assets.coingecko.com/coins/images/6319/small/usdc.png',
  'polygon:0xc2132d05d31c914a87c6611c10748aeb04b58e8f': 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
};

// Server-side icon cache (persists across requests)
const iconCache = new Map<string, string>();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const cacheTimestamps = new Map<string, number>();

// Rate limiting — CoinGecko free: ~30 calls/min
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 2200; // 2.2 seconds between calls

async function fetchCoinGeckoIcon(chainId: string, address: string): Promise<string> {
  const key = `${chainId}:${address.toLowerCase()}`;

  // Check static registry first
  if (POPULAR_ICONS[key]) return POPULAR_ICONS[key];

  // Check server cache
  const cached = iconCache.get(key);
  const ts = cacheTimestamps.get(key);
  if (cached && ts && Date.now() - ts < CACHE_DURATION) return cached;

  const platform = COINGECKO_PLATFORMS[chainId];
  if (!platform) return '';

  // Rate limit
  const now = Date.now();
  const wait = MIN_REQUEST_INTERVAL - (now - lastRequestTime);
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastRequestTime = Date.now();

  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/${platform}/contract/${address}`
    );
    if (!res.ok) return '';
    const data = await res.json();
    const img = data.image?.small || data.image?.thumb || '';
    if (img) {
      iconCache.set(key, img);
      cacheTimestamps.set(key, Date.now());
    }
    return img;
  } catch {
    return '';
  }
}

// GET /api/icons?chain=ethereum&address=0x...
export async function GET(request: NextRequest) {
  const chain = request.nextUrl.searchParams.get('chain');
  const address = request.nextUrl.searchParams.get('address');

  if (!chain || !address) {
    return NextResponse.json({ error: 'Missing chain or address' }, { status: 400 });
  }

  const icon = await fetchCoinGeckoIcon(chain, address);
  return NextResponse.json({ icon });
}

// POST /api/icons  { tokens: [{ chainId, address }] }
export async function POST(request: NextRequest) {
  const body = await request.json();
  const tokens = body.tokens;

  if (!Array.isArray(tokens)) {
    return NextResponse.json({ error: 'tokens must be an array' }, { status: 400 });
  }

  const icons: Record<string, string> = {};

  // Separate static hits from API lookups
  const needsApi: typeof tokens = [];
  for (const token of tokens) {
    const key = `${token.chainId}:${token.address.toLowerCase()}`;
    // Check static registry
    if (POPULAR_ICONS[key]) {
      icons[key] = POPULAR_ICONS[key];
      continue;
    }
    // Check server cache
    const cached = iconCache.get(key);
    const ts = cacheTimestamps.get(key);
    if (cached && ts && Date.now() - ts < CACHE_DURATION) {
      icons[key] = cached;
      continue;
    }
    needsApi.push(token);
  }

  // Only hit CoinGecko for unknown tokens
  for (const token of needsApi) {
    const key = `${token.chainId}:${token.address.toLowerCase()}`;
    const icon = await fetchCoinGeckoIcon(token.chainId, token.address);
    if (icon) icons[key] = icon;
  }

  return NextResponse.json({ icons });
}
