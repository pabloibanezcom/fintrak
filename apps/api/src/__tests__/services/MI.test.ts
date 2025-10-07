import axios from 'axios';
import type { UserProducts } from '@fintrak/types';
import {
  fetchUserProducts,
  clearUserProductsCache,
  clearTokenCache,
} from '../../services/MI';
import CryptoAssetModel from '../../models/CryptoAssetModel';
import * as CoinGecko from '../../services/CoinGecko';

jest.mock('axios');
jest.mock('../../models/CryptoAssetModel');
jest.mock('../../services/CoinGecko');

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedCryptoAssetModel = CryptoAssetModel as jest.Mocked<
  typeof CryptoAssetModel
>;
const mockedCoinGecko = CoinGecko as jest.Mocked<typeof CoinGecko>;

describe('MI Service - User Products Caching', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    clearUserProductsCache();
    clearTokenCache();

    // Mock environment variables
    process.env.MI_AUTH_UI = 'https://auth.example.com/login';
    process.env.MI_API = 'https://api.example.com';
    process.env.MI_USER = 'testuser';
    process.env.MI_PASS = 'testpass';

    // Mock login response
    mockedAxios.post.mockResolvedValue({
      data: {
        payload: {
          data: {
            accessToken: 'test-access-token',
            refreshToken: 'test-refresh-token',
            expiresIn: 3600,
            refreshExpiresIn: 7200,
          },
        },
      },
    });

    // Mock MI API responses with proper structure
    mockedAxios.get.mockImplementation((url) => {
      if (url.includes('/deposits/self')) {
        return Promise.resolve({
          data: {
            payload: {
              data: [
                {
                  accountId: 'dep1',
                  iban: 'ES1234567890123456',
                  alias: 'Savings Deposit',
                  creationDate: '2024-01-01',
                  expirationDate: '2025-01-01',
                  amount: 10000,
                  grossInterest: 250,
                  netInterest: 200,
                  retention: 50,
                  currency: 'EUR',
                  tae: 2.5,
                  numMonths: 12,
                },
              ],
            },
          },
        });
      }
      if (url.includes('/cash-accounts/self')) {
        return Promise.resolve({
          data: {
            payload: {
              data: [
                {
                  accountId: 'cash1',
                  accountCode: 'CASH001',
                  iban: 'ES1234567890',
                  alias: 'Main Account',
                  creationDate: '2024-01-01',
                  enabledBalance: 5000,
                  currency: 'EUR',
                },
              ],
            },
          },
        });
      }
      if (url.includes('/securities-accounts/self')) {
        return Promise.resolve({
          data: {
            payload: {
              data: [
                {
                  accountType: 'SECURITIES_ACCOUNT',
                  securitiesAccountInvestments: {
                    INDEXED_FUND: {
                      investmentList: [
                        {
                          isin: 'US1234567890',
                          investmentName: 'Test Fund',
                          initialInvestment: 1000,
                          marketValue: 1200,
                          profit: 200,
                          totalReturn: 200,
                          averageCost: 10,
                          liquidationValue: 1180,
                        },
                      ],
                    },
                    BROKER: {
                      investmentList: [],
                    },
                  },
                },
              ],
            },
          },
        });
      }
      return Promise.reject(new Error('Unknown endpoint'));
    });

    // Mock crypto assets
    mockedCryptoAssetModel.find.mockResolvedValue([]);
    mockedCoinGecko.fetchCryptoPrices.mockResolvedValue({});
  });

  afterEach(() => {
    delete process.env.MI_AUTH_UI;
    delete process.env.MI_API;
    delete process.env.MI_USER;
    delete process.env.MI_PASS;
  });

  it('should fetch user products from MI API on first call', async () => {
    const result = await fetchUserProducts('user123');

    // Login may be called multiple times due to retry logic
    expect(mockedAxios.post).toHaveBeenCalled();
    expect(mockedAxios.get).toHaveBeenCalled(); // At least one GET call
    expect(result).toHaveProperty('totalValue');
    expect(result).toHaveProperty('items');
    expect(result.items).toHaveProperty('deposits');
    expect(result.items).toHaveProperty('cashAccounts');
    expect(result.items).toHaveProperty('indexedFunds');
    expect(result.items).toHaveProperty('etcs');
    expect(result.items).toHaveProperty('cryptoAssets');
  });

  it('should use cached data on subsequent calls within cache TTL', async () => {
    // First call - fetches from API
    await fetchUserProducts('user123');

    // Clear mock call history
    mockedAxios.get.mockClear();
    mockedAxios.post.mockClear();

    // Second call - should use cache
    const consoleLogSpy = jest
      .spyOn(console, 'log')
      .mockImplementation(() => {});
    await fetchUserProducts('user123');

    expect(consoleLogSpy).toHaveBeenCalledWith('Returning cached user products');
    expect(mockedAxios.get).not.toHaveBeenCalled(); // No API calls
    expect(mockedAxios.post).not.toHaveBeenCalled(); // No login calls

    consoleLogSpy.mockRestore();
  });

  it('should cache separately for different users', async () => {
    // Fetch for user1
    const result1 = await fetchUserProducts('user1');

    mockedAxios.get.mockClear();
    mockedAxios.post.mockClear();

    // Fetch for user2 - should make new API calls
    const result2 = await fetchUserProducts('user2');
    expect(mockedAxios.get).toHaveBeenCalled();

    // Results should be the same structure but cached separately
    expect(result1).toEqual(result2);

    mockedAxios.get.mockClear();
    mockedAxios.post.mockClear();

    // Fetch user1 again - should use cache
    await fetchUserProducts('user1');
    expect(mockedAxios.get).not.toHaveBeenCalled();
    expect(mockedAxios.post).not.toHaveBeenCalled();
  });

  it('should calculate percentages correctly', async () => {
    const result = await fetchUserProducts('user123');

    // Expected totals: deposits=10000, cash=5000, indexedFunds=1200, etcs=0, crypto=0
    // Total = 16200
    expect(result.totalValue).toBe(16200);
    expect(result.items.deposits.percentage).toBe(61.7); // 10000/16200 * 100
    expect(result.items.cashAccounts.percentage).toBe(30.9); // 5000/16200 * 100
    expect(result.items.indexedFunds.percentage).toBe(7.4); // 1200/16200 * 100
    expect(result.items.etcs.percentage).toBe(0);
    expect(result.items.cryptoAssets.percentage).toBe(0);
  });

  it('should handle cache expiration after 60 seconds', async () => {
    jest.useFakeTimers();

    // First call
    await fetchUserProducts('user123');

    mockedAxios.get.mockClear();
    mockedAxios.post.mockClear();

    // Advance time by 59 seconds - still within cache
    jest.advanceTimersByTime(59000);
    await fetchUserProducts('user123');
    expect(mockedAxios.get).not.toHaveBeenCalled();
    expect(mockedAxios.post).not.toHaveBeenCalled();

    // Advance time by 2 more seconds - cache expired
    jest.advanceTimersByTime(2000);
    await fetchUserProducts('user123');
    expect(mockedAxios.get).toHaveBeenCalled();

    jest.useRealTimers();
  });

  it('should clear cache when clearUserProductsCache is called', async () => {
    // First call
    await fetchUserProducts('user123');

    mockedAxios.get.mockClear();
    mockedAxios.post.mockClear();

    // Clear cache
    clearUserProductsCache();

    // Second call - should fetch again
    await fetchUserProducts('user123');
    expect(mockedAxios.get).toHaveBeenCalled();
  });

  it('should include crypto assets in total when present', async () => {
    mockedCryptoAssetModel.find.mockResolvedValue([
      {
        _id: 'crypto1',
        userId: 'user123',
        name: 'Bitcoin',
        code: 'BTC',
        amount: 0.1,
      },
    ] as any);

    mockedCoinGecko.fetchCryptoPrices.mockResolvedValue({
      BTC: { usd: 50000, eur: 45000 },
    });

    const result = await fetchUserProducts('user123');

    // Expected: deposits=10000 + cash=5000 + indexedFunds=1200 + crypto=4500 (0.1 * 45000)
    expect(result.totalValue).toBe(20700);
    expect(result.items.cryptoAssets.value).toBe(4500);
    expect(result.items.cryptoAssets.percentage).toBeCloseTo(21.7, 1);
  });

  it('should log MI API calls', async () => {
    const consoleLogSpy = jest
      .spyOn(console, 'log')
      .mockImplementation(() => {});

    await fetchUserProducts('user123');

    expect(consoleLogSpy).toHaveBeenCalledWith(
      'Fetching user products from MI API...'
    );
    expect(consoleLogSpy).toHaveBeenCalledWith('[MI API] GET /deposits/self');
    expect(consoleLogSpy).toHaveBeenCalledWith(
      '[MI API] GET /cash-accounts/self'
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(
      '[MI API] GET /securities-accounts/self'
    );

    consoleLogSpy.mockRestore();
  });

  it('should handle API errors gracefully with Promise.allSettled', async () => {
    // When all requests fail, fetchUserProducts still returns a result with empty arrays
    mockedAxios.get.mockRejectedValue(new Error('Network error'));

    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const result = await fetchUserProducts('user123');

    // Promise.allSettled means the function doesn't throw, but returns empty items
    expect(result.totalValue).toBe(0);
    expect(result.items.deposits.items).toEqual([]);
    expect(result.items.cashAccounts.items).toEqual([]);

    consoleErrorSpy.mockRestore();
  });
});
