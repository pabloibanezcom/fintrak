import type {
  CashAccount,
  Deposit,
  IndexedFund,
  MILoginResponse,
  TokenData,
  UserProducts,
} from '@fintrak/types';
import { MIServiceError } from '@fintrak/types';
import axios, { type AxiosError } from 'axios';
import {
  MICashAccountsToUserCashAccounts,
  MIDepositsToUserDeposits,
  MIIndexedFundsToIndexedFunds,
} from './MICast';

let tokenData: TokenData | null = null;

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

async function refreshTokenIfNeeded(): Promise<void> {
  if (!tokenData) return;

  const now = Date.now();
  const bufferTime = 5 * 60 * 1000; // 5 minutes buffer

  // If refresh token is about to expire, force re-login
  if (now >= tokenData.refreshExpiresAt - bufferTime) {
    tokenData = null;
    return;
  }

  // If access token needs refresh
  if (now >= tokenData.expiresAt - bufferTime) {
    try {
      // For now, we'll re-login instead of using refresh token
      // This can be enhanced later if MI service supports token refresh
      tokenData = await loginToMI();
    } catch (error) {
      console.error(
        'Failed to refresh token, will re-login on next request:',
        error
      );
      tokenData = null;
    }
  }
}

async function getToken(): Promise<string> {
  if (!tokenData || Date.now() >= tokenData.expiresAt) {
    tokenData = await loginToMI();
  } else {
    await refreshTokenIfNeeded();
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

async function fetchIndexedFunds(): Promise<IndexedFund[]> {
  return fetchFromMI(
    '/securities-accounts/self',
    MIIndexedFundsToIndexedFunds,
    (securitiesData) => {
      if (!Array.isArray(securitiesData)) {
        console.warn(
          'MI API returned non-array securities data:',
          securitiesData
        );
        return [];
      }

      const securitiesAccount = securitiesData.find(
        (account: any) => account.accountType === 'SECURITIES_ACCOUNT'
      );

      return (
        securitiesAccount?.securitiesAccountInvestments?.INDEXED_FUND
          ?.investmentList || []
      );
    },
    'indexed funds data'
  );
}

export const fetchUserProducts = async (): Promise<UserProducts> => {
  try {
    console.log('Fetching user products...');

    // Fetch all products in parallel for better performance
    const [deposits, cashAccounts, indexedFunds] = await Promise.allSettled([
      fetchDeposits(),
      fetchCashAccounts(),
      fetchIndexedFunds(),
    ]);

    return {
      deposits: deposits.status === 'fulfilled' ? deposits.value : [],
      cashAccounts:
        cashAccounts.status === 'fulfilled' ? cashAccounts.value : [],
      indexedFunds:
        indexedFunds.status === 'fulfilled' ? indexedFunds.value : [],
    };
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

// Re-export MIServiceError for convenience
export { MIServiceError };
