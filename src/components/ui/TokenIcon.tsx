'use client';

import { useState, useEffect, useCallback } from 'react';

interface TokenIconProps {
  src?: string;
  alt: string;
  symbol?: string;
  size: number;
  className?: string;
  chainId?: string;
  address?: string;
}

// Global icon URL cache — survives across renders, persists successful URLs
const iconCache = new Map<string, string>();
const failedUrls = new Set<string>();
const proxyChecked = new Set<string>();

// Jupiter CDN for Solana tokens
function getJupiterIcon(mint: string): string {
  return `https://raw.githubusercontent.com/jup-ag/token-list/main/assets/mainnet/${mint}/logo.png`;
}

// TrustWallet CDN for EVM tokens
function getTrustWalletIcon(chainId: string, address: string): string {
  const chainMap: Record<string, string> = {
    ethereum: 'ethereum',
    bsc: 'smartchain',
    base: 'base',
    arbitrum: 'arbitrum',
    polygon: 'polygon',
    avalanche: 'avalanche',
    optimism: 'optimism',
  };
  const twChain = chainMap[chainId];
  if (!twChain) return '';
  return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${twChain}/assets/${address.toLowerCase()}/logo.png`;
}

// Expanded static icon registry
const STATIC_ICONS: Record<string, string> = {
  // Ethereum native & major ERC-20s
  'ethereum:0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2': 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
  'ethereum:0xdac17f958d2ee523a2206206994597c13d831ec7': 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
  'ethereum:0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': 'https://assets.coingecko.com/coins/images/6319/small/usdc.png',
  'ethereum:0x6b175474e89094c44da98b954eedeac495271d0f': 'https://assets.coingecko.com/coins/images/9956/small/4943.png',
  'ethereum:0x2260fac5e5542a773aa44fbcfedf7c193bc2c599': 'https://assets.coingecko.com/coins/images/7598/small/WBTCLOGO.png',
  'ethereum:0x514910771af9ca656af840dff83e8264ecf986ca': 'https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png',
  'ethereum:0x1f9840a85d5af5bf1d1762f925bdaddc4201f984': 'https://assets.coingecko.com/coins/images/12504/small/uniswap-logo.jpg',
  'ethereum:0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9': 'https://assets.coingecko.com/coins/images/12645/small/AAVE.png',
  'ethereum:0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2': 'https://assets.coingecko.com/coins/images/1389/small/maker.png',
  'ethereum:0xc00e94cb662c3520282e6f5717214004a7f26888': 'https://assets.coingecko.com/coins/images/8780/small/COMP.png',
  'ethereum:0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0': 'https://assets.coingecko.com/coins/images/4713/small/polygon-token.png',
  'ethereum:0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0': 'https://assets.coingecko.com/coins/images/18753/small/wstETH.png',
  'ethereum:0xae78736cd615f374d3085123a210448e74fc6393': 'https://assets.coingecko.com/coins/images/20765/small/RPL.png',
  'ethereum:0x853d955acef822db058eb8505911ed77f175b99e': 'https://assets.coingecko.com/coins/images/13180/small/frax-logo.png',
  'ethereum:0x6982508145454ce325ddbe47a25d4ec3d2311933': 'https://assets.coingecko.com/coins/images/29850/small/pepe-token.jpeg',
  'ethereum:0x95ad61b0a150d79219dcf64e1e6cc01f0b6b6798': 'https://assets.coingecko.com/coins/images/11939/small/shiba.png',
  'ethereum:0x4d224452801aced8b2f0aebe155379bb5d594381': 'https://assets.coingecko.com/coins/images/24383/small/ape.png',
  'ethereum:0xbb0e17ef65f82ab018d8edd776e8dd940327b28b': 'https://assets.coingecko.com/coins/images/18323/small/AxieInfinityLogo.png',
  'ethereum:0x3845badAde8e6dFF049820680d1F14bD3903a5d0': 'https://assets.coingecko.com/coins/images/12451/small/The_Sandbox_Logo_Transparent.png',
  'ethereum:0x0f5d2fb29fb7d3cfee444a200298f468908cc942': 'https://assets.coingecko.com/coins/images/16547/small/Mana.png',
  'ethereum:0x744d70fdbe2ba4cf95131626614a1763df805b9e': 'https://assets.coingecko.com/coins/images/8780/small/COMP.png',
  'ethereum:0xc944e90c64b2c07662a292be6244bdf05cda44a7': 'https://assets.coingecko.com/coins/images/10348/small/TheGraphLogo.png',
  'ethereum:0x6b3595068778dd592e39a122f4f5a5cf09c90fe2': 'https://assets.coingecko.com/coins/images/12271/small/512x512_Logo_no_chop.png',
  'ethereum:0x0000000000085d4780B73119b644AE5ecd22b376': 'https://assets.coingecko.com/coins/images/13714/small/TUSD.png',
  'ethereum:0x4fabb145d64652a948d72533023f6e7a623c7c53': 'https://assets.coingecko.com/coins/images/11676/small/BUSD.png',
  'ethereum:0x5f98805A4E8be255a32880FDeC7F6728C6568bA0': 'https://assets.coingecko.com/coins/images/14666/small/Group_10572.png',
  // Base
  'base:0x532f27101965dd16442e59d40670faf5ebb142e4': 'https://assets.coingecko.com/coins/images/35529/small/1000050750.png',
  'base:0x833589fcd6edb6e08f4c7c32d4f71b54bda02913': 'https://assets.coingecko.com/coins/images/6319/small/usdc.png',
  'base:0x4200000000000000000000000000000000000006': 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
  'base:0x2ae3f1ec7f1f5032768e536d2e23e7e66b6b5c14': 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
  'base:0x50c5725949a6f0c72e6c4a641f24049a917db0cb': 'https://assets.coingecko.com/coins/images/16786/small/lon_visual_-_200_x_200.png',
  'base:0x940181a94a35a4569e4529a3cdfb74e38fd98631': 'https://assets.coingecko.com/coins/images/35436/small/AERO-COIN-256.png',
  'base:0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca': 'https://assets.coingecko.com/coins/images/6319/small/usdc.png',
  // BSC
  'bsc:0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c': 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png',
  'bsc:0xe9e7cea3dedca5984780bafc599bd69add087d56': 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
  'bsc:0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d': 'https://assets.coingecko.com/coins/images/6319/small/usdc.png',
  'bsc:0x55d398326f99059ff775485246999027b3197955': 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
  'bsc:0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c': 'https://assets.coingecko.com/coins/images/7598/small/WBTCLOGO.png',
  'bsc:0x2170ed0880ac9a755fd29b2688956bd959f933f8': 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
  // Arbitrum
  'arbitrum:0x82af49447d8a07e3bd95bd0d56f35241523fbab1': 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
  'arbitrum:0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9': 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
  'arbitrum:0xaf88d065e77c8cc2239327c5edb3a432268e5831': 'https://assets.coingecko.com/coins/images/6319/small/usdc.png',
  'arbitrum:0xff970a61a04b1ca14834a43f5de4533ebddb5cc8': 'https://assets.coingecko.com/coins/images/6319/small/usdc.png',
  'arbitrum:0x912ce5914400e4b4cb32dbca2f0b23e7a4dd35e6': 'https://assets.coingecko.com/coins/images/32502/small/arb.jpg',
  // Polygon
  'polygon:0x2791bca1f2de4661ed88a30c99a7a9449aa84174': 'https://assets.coingecko.com/coins/images/6319/small/usdc.png',
  'polygon:0xc2132d05d31c914a87c6611c10748aeb04b58e8f': 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
  'polygon:0x0000000000000000000000000000000000001010': 'https://assets.coingecko.com/coins/images/4713/small/polygon-token.png',
  // Solana
  'solana:So11111111111111111111111111111111111111112': 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
  'solana:EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': 'https://assets.coingecko.com/coins/images/6319/small/usdc.png',
  'solana:Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB': 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
  'solana:DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263': 'https://assets.coingecko.com/coins/images/25244/small/Bonk_Logo.png',
  'solana:7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr': 'https://assets.coingecko.com/coins/images/33839/small/poop.png',
  'solana:HeLp6NuQkmYB1pYV2vfEqBKpHhZqEUYjEXkXpNjKLASw': 'https://assets.coingecko.com/coins/images/50382/small/ai16z.jpg',
  'solana:z3dn17yLaGMKffVogeFHQ9zWVcXgqgfX7SBR9CyGRA': 'https://assets.coingecko.com/coins/images/50735/small/GOAT.jpg',
  'solana:8x5VqbHA8D7NkD52uNuS5nnt3PwApspXJHApYghjVi4': 'https://assets.coingecko.com/coins/images/50744/small/zerebro.png',
  'solana:CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump': 'https://assets.coingecko.com/coins/images/50744/small/zerebro.png',
  'solana:JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN': 'https://assets.coingecko.com/coins/images/35584/small/jup.png',
  'solana:HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3': 'https://assets.coingecko.com/coins/images/35437/small/pyth.png',
  'solana:SHDWyBxihqiCj6YekG2GUr7wqKLeTAM5Tg42T8AQ7q': 'https://assets.coingecko.com/coins/images/24080/small/shdw.png',
};

// Build all possible icon URLs for a token
function buildIconUrls(chainId: string, address: string, src?: string): string[] {
  const urls: string[] = [];
  const key = `${chainId}:${address.toLowerCase()}`;

  // 1. Provided src (highest priority)
  if (src && !failedUrls.has(src)) urls.push(src);

  // 2. Static registry (instant, no API)
  const staticIcon = STATIC_ICONS[key] || STATIC_ICONS[`${chainId}:${address}`];
  if (staticIcon && !failedUrls.has(staticIcon) && !urls.includes(staticIcon)) urls.push(staticIcon);

  // 3. Jupiter CDN for Solana
  if (chainId === 'solana') {
    const jupUrl = getJupiterIcon(address);
    if (!failedUrls.has(jupUrl) && !urls.includes(jupUrl)) urls.push(jupUrl);
  }

  // 4. TrustWallet CDN for EVM chains
  if (chainId !== 'solana') {
    const twUrl = getTrustWalletIcon(chainId, address);
    if (twUrl && !failedUrls.has(twUrl) && !urls.includes(twUrl)) urls.push(twUrl);
  }

  return urls;
}

// Fetch icon from server-side proxy (tries multiple sources, returns first valid)
async function fetchProxyIcon(chainId: string, address: string, symbol?: string): Promise<string | null> {
  const cacheKey = `${chainId}:${address.toLowerCase()}`;
  if (proxyChecked.has(cacheKey)) return null;
  proxyChecked.add(cacheKey);

  try {
    const params = new URLSearchParams({ chain: chainId, address });
    if (symbol) params.set('symbol', symbol);
    const res = await fetch(`/api/icons?${params}`);
    const data = await res.json();
    if (data.url) {
      iconCache.set(cacheKey, data.url);
      return data.url;
    }
  } catch {
    // Proxy failed — fall through to letter placeholder
  }
  return null;
}

export function TokenIcon({ src, alt, symbol, size, className = '', chainId, address }: TokenIconProps) {
  const cacheKey = chainId && address ? `${chainId}:${address.toLowerCase()}` : (src || alt);
  const [urlIndex, setUrlIndex] = useState(0);
  const [error, setError] = useState(false);
  const [proxyUrl, setProxyUrl] = useState<string | null>(null);

  // Check global cache first
  const cachedUrl = iconCache.get(cacheKey);

  // Build fallback URLs
  const urls = chainId && address
    ? buildIconUrls(chainId, address, src)
    : src ? [src] : [];

  // If we have a cached URL that hasn't failed, use it
  const activeUrl = cachedUrl && !failedUrls.has(cachedUrl)
    ? cachedUrl
    : proxyUrl && !failedUrls.has(proxyUrl)
      ? proxyUrl
      : urls[urlIndex] || '';

  const handleError = useCallback(() => {
    if (activeUrl) failedUrls.add(activeUrl);

    // Try next URL in the fallback chain
    if (urlIndex < urls.length - 1) {
      setUrlIndex((i) => i + 1);
      setError(false);
    } else if (chainId && address && !proxyChecked.has(`${chainId}:${address.toLowerCase()}`)) {
      // All CDN sources failed — try server-side proxy as last resort
      fetchProxyIcon(chainId, address, symbol).then((url) => {
        if (url) {
          setProxyUrl(url);
          setError(false);
        } else {
          setError(true);
        }
      });
    } else {
      setError(true);
    }
  }, [activeUrl, urlIndex, urls.length, chainId, address, symbol]);

  const handleLoad = useCallback(() => {
    if (activeUrl) {
      iconCache.set(cacheKey, activeUrl);
    }
  }, [activeUrl, cacheKey]);

  // Reset when props change
  useEffect(() => {
    setUrlIndex(0);
    setError(false);
    setProxyUrl(null);
  }, [src, chainId, address]);

  // Show placeholder if no URLs to try or all failed
  if (!activeUrl || error) {
    const letter = (symbol || alt || '?')[0].toUpperCase();
    return (
      <span
        className={`inline-flex items-center justify-center rounded-full bg-white/10 text-white/40 font-mono font-bold shrink-0 ${className}`}
        style={{ width: size, height: size, fontSize: size * 0.4 }}
      >
        {letter}
      </span>
    );
  }

  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={activeUrl}
      alt={alt}
      width={size}
      height={size}
      className={`rounded-full ${className}`}
      onError={handleError}
      onLoad={handleLoad}
    />
  );
}
