'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { CryptoAsset, InvestmentSummary } from '@fintrak/types';
import { productsService } from '@/services/products';

export interface InvestmentData {
  indexedFunds: InvestmentSummary[];
  etcs: InvestmentSummary[];
  cryptoAssets: CryptoAsset[];
  totals: {
    indexedFunds: number;
    etcs: number;
    cryptoAssets: number;
    all: number;
  };
  percentages: {
    indexedFunds: number;
    etcs: number;
    cryptoAssets: number;
  };
}

interface UseInvestmentProductsReturn {
  data: InvestmentData | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useInvestmentProducts(): UseInvestmentProductsReturn {
  const [data, setData] = useState<InvestmentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const products = await productsService.getProducts();

      const investmentData: InvestmentData = {
        indexedFunds: products.items.indexedFunds.items,
        etcs: products.items.etcs.items,
        cryptoAssets: products.items.cryptoAssets.items,
        totals: {
          indexedFunds: products.items.indexedFunds.value,
          etcs: products.items.etcs.value,
          cryptoAssets: products.items.cryptoAssets.value,
          all:
            products.items.indexedFunds.value +
            products.items.etcs.value +
            products.items.cryptoAssets.value,
        },
        percentages: {
          indexedFunds: products.items.indexedFunds.percentage,
          etcs: products.items.etcs.percentage,
          cryptoAssets: products.items.cryptoAssets.percentage,
        },
      };

      setData(investmentData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error('Failed to fetch investment products')
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
  };
}
