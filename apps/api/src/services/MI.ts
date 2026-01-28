import type {
  BankAccount,
  CashAccount,
  CryptoAsset,
  Deposit,
  InvestmentSummary,
  MILoginResponse,
  TokenData,
  UserProducts,
} from '@fintrak/types';
import { MIServiceError } from '@fintrak/types';
import axios, { type AxiosError } from 'axios';
import CryptoAssetModel from '../models/CryptoAssetModel';
import { aggregateBankAccounts } from './BankAccountAggregator';
import { fetchCryptoPrices } from './CoinGecko';
import {
  MICashAccountsToUserCashAccounts,
  MIDepositsToUserDeposits,
  MIETCsToETCsSummary,
  MIIndexedFundsToIndexedFundsSummary,
} from './MICast';

let tokenData: TokenData | null = null;

// Cache for user products with 60s TTL
interface CacheEntry {
  data: UserProducts;
  expiresAt: number;
}
const userProductsCache = new Map<string, CacheEntry>();
const CACHE_TTL = 60 * 1000; // 60 seconds

// Environment validation
const validateEnvironment = (): void => {
  const requiredVars = ['MI_AUTH_UI', 'MI_API', 'MI_USER', 'MI_PASS'];
  const missing = requiredVars.filter((varName) => !process.env[varName]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
};

// Configure axios with timeouts
const axiosConfig = {
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * Login to MI service and return token data.
 * Note: Although MI returns a refresh token, we currently re-login instead
 * of using it, as the refresh endpoint behavior isn't well-documented.
 */
async function loginToMI(): Promise<TokenData> {
  validateEnvironment();

  try {
    const response = await axios.post<MILoginResponse>(
      process.env.MI_AUTH_UI as string,
      {
        accessType: 'USERNAME',
        customerId: process.env.MI_USER,
        password: process.env.MI_PASS,
      },
      axiosConfig
    );

    const {
      accessToken,
      refreshToken,
      expiresIn = 3600,
      refreshExpiresIn = 3600,
    } = response.data.payload.data;

    const now = Date.now();
    return {
      accessToken,
      refreshToken,
      expiresAt: now + expiresIn * 1000,
      refreshExpiresAt: now + refreshExpiresIn * 1000,
    };
  } catch (error) {
    const axiosError = error as AxiosError;
    throw new MIServiceError(
      `Failed to login to MI service: ${axiosError.message}`,
      axiosError.response?.status,
      axiosError
    );
  }
}

/**
 * Get a valid access token, logging in if needed.
 * Uses a 5-minute buffer before expiration to avoid edge cases.
 */
async function getToken(): Promise<string> {
  const now = Date.now();
  const bufferTime = 5 * 60 * 1000; // 5 minutes buffer

  // Login if no token exists or if token is expired/about to expire
  if (!tokenData || now >= tokenData.expiresAt - bufferTime) {
    try {
      tokenData = await loginToMI();
    } catch (error) {
      console.error('Failed to login to MI service:', error);
      throw error;
    }
  }

  return tokenData.accessToken;
}

// Generic retry mechanism
async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 2,
  isRetryableError?: (error: AxiosError) => boolean
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      const axiosError = error as AxiosError;

      // Don't retry on the last attempt
      if (attempt === maxRetries) break;

      // Check if error is retryable
      if (axiosError.response?.status === 401) {
        // Clear token on 401 and retry
        tokenData = null;
        continue;
      }

      if (isRetryableError && !isRetryableError(axiosError)) {
        break;
      }

      // Wait before retry (exponential backoff)
      const delay = Math.min(1000 * 2 ** attempt, 5000);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError || new Error('Unknown error occurred during retry');
}

// Generic fetch function for MI endpoints
async function fetchFromMI<TInput, TOutput>(
  endpoint: string,
  transformer: (data: TInput[]) => TOutput[],
  dataExtractor?: (responseData: any) => TInput[],
  dataTypeName?: string
): Promise<TOutput[]> {
  return withRetry(async () => {
    const accessToken = await getToken();
    console.log(`[MI API] GET ${endpoint}`);
    const response = await axios.get(
      `${process.env.MI_API as string}${endpoint}`,
      {
        ...axiosConfig,
        headers: {
          ...axiosConfig.headers,
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Extract data using custom extractor or default to payload.data
    const rawData = dataExtractor
      ? dataExtractor(response.data?.payload?.data)
      : response.data?.payload?.data;

    if (!Array.isArray(rawData)) {
      console.warn(
        `MI API returned non-array ${dataTypeName || 'data'}:`,
        rawData
      );
      return [];
    }

    return transformer(rawData);
  });
}

async function fetchDeposits(): Promise<Deposit[]> {
  return fetchFromMI(
    '/deposits/self',
    MIDepositsToUserDeposits,
    undefined,
    'deposits data'
  );
}

async function fetchCashAccounts(): Promise<CashAccount[]> {
  return fetchFromMI(
    '/cash-accounts/self',
    MICashAccountsToUserCashAccounts,
    undefined,
    'cash accounts data'
  );
}

async function fetchSecuritiesData(): Promise<{
  indexedFunds: InvestmentSummary[];
  etcs: InvestmentSummary[];
}> {
  return withRetry(async () => {
    const accessToken = await getToken();
    console.log('[MI API] GET /securities-accounts/self');
    const response = await axios.get(
      `${process.env.MI_API as string}/securities-accounts/self`,
      {
        ...axiosConfig,
        headers: {
          ...axiosConfig.headers,
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const securitiesData = response.data?.payload?.data;

    if (!Array.isArray(securitiesData)) {
      console.warn(
        'MI API returned non-array securities data:',
        securitiesData
      );
      return { indexedFunds: [], etcs: [] };
    }

    const securitiesAccount = securitiesData.find(
      (account: any) => account.accountType === 'SECURITIES_ACCOUNT'
    );

    const indexedFundsList =
      securitiesAccount?.securitiesAccountInvestments?.INDEXED_FUND
        ?.investmentList || [];
    const etcsList =
      securitiesAccount?.securitiesAccountInvestments?.BROKER?.investmentList ||
      [];

    return {
      indexedFunds: MIIndexedFundsToIndexedFundsSummary(indexedFundsList),
      etcs: MIETCsToETCsSummary(etcsList),
    };
  });
}

async function fetchCryptoAssets(userId: string): Promise<CryptoAsset[]> {
  try {
    const cryptoAssets = await CryptoAssetModel.find({ userId });

    if (cryptoAssets.length === 0) {
      return [];
    }

    // Extract unique crypto codes
    const cryptoCodes = [...new Set(cryptoAssets.map((asset) => asset.code))];

    // Fetch current prices from CoinGecko
    const prices = await fetchCryptoPrices(cryptoCodes);

    // Map assets with populated values
    return cryptoAssets.map((asset) => {
      const assetPrices = prices[asset.code];
      const value: Record<string, number> = {};

      // Calculate value for each currency if prices are available
      if (assetPrices) {
        for (const [currency, price] of Object.entries(assetPrices)) {
          value[currency.toUpperCase()] = asset.amount * price;
        }
      }

      return {
        _id: asset._id?.toString(),
        userId: asset.userId,
        name: asset.name,
        code: asset.code,
        amount: asset.amount,
        value: Object.keys(value).length > 0 ? value : undefined,
      };
    });
  } catch (error) {
    console.error('Error fetching crypto assets:', error);
    return [];
  }
}

export const fetchUserProducts = async (
  userId?: string
): Promise<UserProducts> => {
  try {
    // Use userId or 'default' as cache key
    const cacheKey = userId || 'default';
    const now = Date.now();

    // Check if we have a valid cached entry
    const cachedEntry = userProductsCache.get(cacheKey);
    if (cachedEntry && now < cachedEntry.expiresAt) {
      console.log('Returning cached user products');
      return cachedEntry.data;
    }

    console.log('Fetching user products from MI API...');

    // Fetch all products in parallel for better performance
    const [deposits, cashAccounts, securities, cryptoAssets] =
      await Promise.allSettled([
        fetchDeposits(),
        fetchCashAccounts(),
        fetchSecuritiesData(),
        userId ? fetchCryptoAssets(userId) : Promise.resolve([]),
      ]);

    const depositItems = deposits.status === 'fulfilled' ? deposits.value : [];
    const miCashAccountItems =
      cashAccounts.status === 'fulfilled' ? cashAccounts.value : [];
    const indexedFundItems =
      securities.status === 'fulfilled' ? securities.value.indexedFunds : [];
    const etcItems =
      securities.status === 'fulfilled' ? securities.value.etcs : [];
    const cryptoAssetItems =
      cryptoAssets.status === 'fulfilled' ? cryptoAssets.value : [];

    // Aggregate bank accounts from all sources (MyInvestor + TrueLayer)
    let bankAccountItems: BankAccount[] = [];
    if (userId) {
      const aggregatorResult = await aggregateBankAccounts(
        userId,
        miCashAccountItems
      );
      bankAccountItems = aggregatorResult.accounts;
      if (aggregatorResult.errors.length > 0) {
        console.warn('Bank account aggregation errors:', aggregatorResult.errors);
      }
    } else {
      // If no userId, just transform MI cash accounts
      const MYINVESTOR_LOGO =
        'https://fintrak-media-prod.s3.eu-west-1.amazonaws.com/assets/bank-logos/myinvestor.png';
      bankAccountItems = miCashAccountItems.map((account) => ({
        accountId: account.accountId,
        source: 'myinvestor' as const,
        bankName: 'MyInvestor',
        bankId: 'myinvestor',
        logo: MYINVESTOR_LOGO,
        displayName: account.alias,
        iban: account.iban,
        accountType: 'CASH' as const,
        currency: account.currency,
        balance: account.balance,
      }));
    }

    // Calculate totals for each group
    const depositsTotal = depositItems.reduce((sum, d) => sum + d.amount, 0);
    const bankAccountsTotal = bankAccountItems.reduce(
      (sum, c) => sum + c.balance,
      0
    );
    const indexedFundsTotal = indexedFundItems.reduce(
      (sum, i) => sum + i.marketValue,
      0
    );
    const etcsTotal = etcItems.reduce((sum, e) => sum + e.marketValue, 0);
    const cryptoAssetsTotal = cryptoAssetItems.reduce((sum, crypto) => {
      // Use EUR value if available, otherwise 0
      return sum + (crypto.value?.EUR || 0);
    }, 0);

    // Calculate total value across all groups
    const totalValue =
      depositsTotal +
      bankAccountsTotal +
      indexedFundsTotal +
      etcsTotal +
      cryptoAssetsTotal;

    // Helper function to calculate percentage
    const calculatePercentage = (value: number): number => {
      if (totalValue === 0) return 0;
      return Number(((value / totalValue) * 100).toFixed(1));
    };

    const result: UserProducts = {
      totalValue,
      items: {
        deposits: {
          items: depositItems,
          value: depositsTotal,
          percentage: calculatePercentage(depositsTotal),
        },
        bankAccounts: {
          items: bankAccountItems,
          value: bankAccountsTotal,
          percentage: calculatePercentage(bankAccountsTotal),
        },
        indexedFunds: {
          items: indexedFundItems,
          value: indexedFundsTotal,
          percentage: calculatePercentage(indexedFundsTotal),
        },
        etcs: {
          items: etcItems,
          value: etcsTotal,
          percentage: calculatePercentage(etcsTotal),
        },
        cryptoAssets: {
          items: cryptoAssetItems,
          value: cryptoAssetsTotal,
          percentage: calculatePercentage(cryptoAssetsTotal),
        },
      },
    };

    // Cache the result
    userProductsCache.set(cacheKey, {
      data: result,
      expiresAt: now + CACHE_TTL,
    });

    return result;
  } catch (error) {
    console.error('Unexpected error fetching user products:', error);
    throw new MIServiceError(
      'Failed to fetch user products',
      500,
      error as Error
    );
  }
};

// Health check function
export const checkMIServiceHealth = async (): Promise<boolean> => {
  try {
    await getToken();
    return true;
  } catch (error) {
    console.error('MI service health check failed:', error);
    return false;
  }
};

// Clear cached tokens (useful for testing or manual token refresh)
export const clearTokenCache = (): void => {
  tokenData = null;
};

// Clear user products cache (useful for testing)
export const clearUserProductsCache = (): void => {
  userProductsCache.clear();
};

// Re-export MIServiceError for convenience
export { MIServiceError };
