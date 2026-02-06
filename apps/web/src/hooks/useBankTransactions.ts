'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  type BankTransaction,
  bankTransactionsService,
  type GetBankTransactionsParams,
  type ReviewStatus,
} from '@/services/bankTransactions';

const DEFAULT_LIMIT = 20;

interface UseBankTransactionsOptions {
  accountId?: string;
  bankId?: string;
  from?: string;
  to?: string;
  search?: string;
  reviewStatus?: ReviewStatus;
}

interface UseBankTransactionsReturn {
  transactions: BankTransaction[];
  linkedTransactionIds: Map<string, string>;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: Error | null;
  hasMore: boolean;
  total: number;
  loadMore: () => void;
  refetch: () => void;
  updateTransaction: (id: string, updates: Partial<BankTransaction>) => void;
}

export function useBankTransactions(
  options: UseBankTransactionsOptions = {}
): UseBankTransactionsReturn {
  const [transactions, setTransactions] = useState<BankTransaction[]>([]);
  const [linkedTransactionIds, setLinkedTransactionIds] = useState<
    Map<string, string>
  >(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const offsetRef = useRef(0);

  const { accountId, bankId, from, to, search, reviewStatus } = options;

  const fetchTransactions = useCallback(
    async (isLoadMore = false) => {
      if (isLoadMore) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
        offsetRef.current = 0;
      }
      setError(null);

      try {
        const params: GetBankTransactionsParams = {
          limit: DEFAULT_LIMIT,
          offset: isLoadMore ? offsetRef.current : 0,
        };

        if (accountId) params.accountId = accountId;
        if (bankId) params.bankId = bankId;
        if (from) params.from = from;
        if (to) params.to = to;
        if (search) params.search = search;
        if (reviewStatus) params.reviewStatus = reviewStatus;

        const response = await bankTransactionsService.getTransactions(params);

        if (isLoadMore) {
          setTransactions((prev) => [...prev, ...response.transactions]);
        } else {
          setTransactions(response.transactions);
        }

        setTotal(response.pagination.total);
        offsetRef.current += response.transactions.length;
        setHasMore(offsetRef.current < response.pagination.total);

        // Use batch linked IDs from API response
        const newLinkedMap = new Map<string, string>(
          Object.entries(response.linkedTransactionIds || {})
        );

        if (isLoadMore) {
          setLinkedTransactionIds((prev) => {
            const updated = new Map(prev);
            newLinkedMap.forEach((txId, bankTxId) =>
              updated.set(bankTxId, txId)
            );
            return updated;
          });
        } else {
          setLinkedTransactionIds(newLinkedMap);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to fetch transactions')
        );
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [accountId, bankId, from, to, search, reviewStatus]
  );

  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      fetchTransactions(true);
    }
  }, [fetchTransactions, isLoadingMore, hasMore]);

  const refetch = useCallback(() => {
    fetchTransactions(false);
  }, [fetchTransactions]);

  const updateTransaction = useCallback(
    (id: string, updates: Partial<BankTransaction>) => {
      setTransactions((prev) =>
        prev.map((tx) => (tx._id === id ? { ...tx, ...updates } : tx))
      );
    },
    []
  );

  useEffect(() => {
    fetchTransactions(false);
  }, [fetchTransactions]);

  return {
    transactions,
    linkedTransactionIds,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    total,
    loadMore,
    refetch,
    updateTransaction,
  };
}
