import axios from 'axios';

// Map common crypto codes to CoinGecko IDs
const CRYPTO_CODE_TO_COINGECKO_ID: Record<string, string> = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  ADA: 'cardano',
  SOL: 'solana',
  DOT: 'polkadot',
  LINK: 'chainlink',
  MATIC: 'matic-network',
  AVAX: 'avalanche-2',
  XRP: 'ripple',
  LTC: 'litecoin',
  DOGE: 'dogecoin',
  UNI: 'uniswap',
  ATOM: 'cosmos',
  XLM: 'stellar',
  ALGO: 'algorand',
  VET: 'vechain',
  ICP: 'internet-computer',
  FIL: 'filecoin',
  TRX: 'tron',
  ETC: 'ethereum-classic',
  XMR: 'monero',
  NEAR: 'near',
  APT: 'aptos',
  ARB: 'arbitrum',
  OP: 'optimism',
};

// Supported fiat currencies
const SUPPORTED_CURRENCIES = ['usd', 'eur'];

// Cache for prices
interface PriceCache {
  prices: Record<string, Record<string, number>>;
  timestamp: number;
}

let priceCache: PriceCache | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetches current prices for given crypto codes in multiple currencies
 * @param codes - Array of crypto codes (e.g., ['BTC', 'ETH'])
 * @returns Object with prices per crypto code and currency
 */
export async function fetchCryptoPrices(
  codes: string[]
): Promise<Record<string, Record<string, number>>> {
  // Check cache first
  if (priceCache && Date.now() - priceCache.timestamp < CACHE_DURATION) {
    const cachedPrices: Record<string, Record<string, number>> = {};
    let allFound = true;

    for (const code of codes) {
      const coinId = CRYPTO_CODE_TO_COINGECKO_ID[code.toUpperCase()];
      if (coinId && priceCache.prices[coinId]) {
        cachedPrices[code] = priceCache.prices[coinId];
      } else {
        allFound = false;
        break;
      }
    }

    if (allFound) {
      console.log('Using cached crypto prices');
      return cachedPrices;
    }
  }

  // Map codes to CoinGecko IDs
  const coinIds = codes
    .map((code) => CRYPTO_CODE_TO_COINGECKO_ID[code.toUpperCase()])
    .filter(Boolean);

  if (coinIds.length === 0) {
    console.warn('No valid CoinGecko IDs found for codes:', codes);
    return {};
  }

  try {
    // Fetch prices from CoinGecko
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price',
      {
        params: {
          ids: coinIds.join(','),
          vs_currencies: SUPPORTED_CURRENCIES.join(','),
        },
        timeout: 10000, // 10 second timeout
      }
    );

    // Update cache
    priceCache = {
      prices: response.data,
      timestamp: Date.now(),
    };

    // Map back to original codes
    const prices: Record<string, Record<string, number>> = {};
    for (const code of codes) {
      const coinId = CRYPTO_CODE_TO_COINGECKO_ID[code.toUpperCase()];
      if (coinId && response.data[coinId]) {
        prices[code] = response.data[coinId];
      }
    }

    return prices;
  } catch (error) {
    console.error('Error fetching crypto prices from CoinGecko:', error);
    // Return empty object on error, don't fail the whole request
    return {};
  }
}

/**
 * Clears the price cache (useful for testing)
 */
export function clearPriceCache(): void {
  priceCache = null;
}

/**
 * Gets the CoinGecko ID for a crypto code
 * @param code - Crypto code (e.g., 'BTC')
 * @returns CoinGecko ID or undefined if not found
 */
export function getCoinGeckoId(code: string): string | undefined {
  return CRYPTO_CODE_TO_COINGECKO_ID[code.toUpperCase()];
}
