import axios from 'axios';
import {
  clearPriceCache,
  fetchCryptoPrices,
  getCoinGeckoId,
} from '../../services/CoinGecko';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('CoinGecko Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    clearPriceCache();
  });

  describe('getCoinGeckoId', () => {
    it('should return correct CoinGecko ID for known crypto codes', () => {
      expect(getCoinGeckoId('BTC')).toBe('bitcoin');
      expect(getCoinGeckoId('ETH')).toBe('ethereum');
      expect(getCoinGeckoId('ADA')).toBe('cardano');
    });

    it('should handle lowercase codes', () => {
      expect(getCoinGeckoId('btc')).toBe('bitcoin');
      expect(getCoinGeckoId('eth')).toBe('ethereum');
    });

    it('should return undefined for unknown codes', () => {
      expect(getCoinGeckoId('UNKNOWN')).toBeUndefined();
    });
  });

  describe('fetchCryptoPrices', () => {
    it('should fetch prices for valid crypto codes', async () => {
      const mockResponse = {
        data: {
          bitcoin: { usd: 43250, eur: 39800 },
          ethereum: { usd: 2280, eur: 2100 },
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await fetchCryptoPrices(['BTC', 'ETH']);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.coingecko.com/api/v3/simple/price',
        {
          params: {
            ids: 'bitcoin,ethereum',
            vs_currencies: 'usd,eur',
          },
          timeout: 10000,
        }
      );

      expect(result).toEqual({
        BTC: { usd: 43250, eur: 39800 },
        ETH: { usd: 2280, eur: 2100 },
      });
    });

    it('should return empty object for invalid crypto codes', async () => {
      const result = await fetchCryptoPrices(['INVALID', 'UNKNOWN']);

      expect(mockedAxios.get).not.toHaveBeenCalled();
      expect(result).toEqual({});
    });

    it('should handle API errors gracefully', async () => {
      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      mockedAxios.get.mockRejectedValue(new Error('API Error'));

      const result = await fetchCryptoPrices(['BTC']);

      expect(result).toEqual({});
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it('should use cached prices within cache duration', async () => {
      const mockResponse = {
        data: {
          bitcoin: { usd: 43250, eur: 39800 },
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      // First call - should fetch from API
      await fetchCryptoPrices(['BTC']);
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);

      // Second call - should use cache
      const consoleLogSpy = jest
        .spyOn(console, 'log')
        .mockImplementation(() => {});
      await fetchCryptoPrices(['BTC']);
      expect(mockedAxios.get).toHaveBeenCalledTimes(1); // Not called again
      expect(consoleLogSpy).toHaveBeenCalledWith('Using cached crypto prices');

      consoleLogSpy.mockRestore();
    });

    it('should filter out unknown codes and fetch only valid ones', async () => {
      const mockResponse = {
        data: {
          bitcoin: { usd: 43250, eur: 39800 },
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await fetchCryptoPrices(['BTC', 'INVALID', 'UNKNOWN']);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.coingecko.com/api/v3/simple/price',
        {
          params: {
            ids: 'bitcoin',
            vs_currencies: 'usd,eur',
          },
          timeout: 10000,
        }
      );

      expect(result).toEqual({
        BTC: { usd: 43250, eur: 39800 },
      });
    });

    it('should handle empty input array', async () => {
      const result = await fetchCryptoPrices([]);

      expect(mockedAxios.get).not.toHaveBeenCalled();
      expect(result).toEqual({});
    });

    it('should handle partial API responses', async () => {
      const mockResponse = {
        data: {
          bitcoin: { usd: 43250, eur: 39800 },
          // ethereum missing
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await fetchCryptoPrices(['BTC', 'ETH']);

      expect(result).toEqual({
        BTC: { usd: 43250, eur: 39800 },
        // ETH not included since it wasn't in response
      });
    });
  });

  describe('clearPriceCache', () => {
    it('should clear the cache', async () => {
      const mockResponse = {
        data: {
          bitcoin: { usd: 43250, eur: 39800 },
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      // First call - populates cache
      await fetchCryptoPrices(['BTC']);
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);

      // Clear cache
      clearPriceCache();

      // Second call - should fetch again after cache cleared
      await fetchCryptoPrices(['BTC']);
      expect(mockedAxios.get).toHaveBeenCalledTimes(2);
    });
  });
});
