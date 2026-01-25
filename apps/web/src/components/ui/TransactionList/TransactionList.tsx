'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef } from 'react';
import { Card } from '../Card/Card';
import { Icon } from '../Icon';
import styles from './TransactionList.module.css';

export interface TransactionListItem {
  id: string;
  title: string;
  description?: string;
  amount: number;
  currency: string;
  date: string;
  type: 'credit' | 'debit';
  bank?: string;
  bankLogo?: string;
  account?: string;
}

interface TransactionListProps {
  transactions: TransactionListItem[];
  isLoading?: boolean;
  isLoadingMore?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  formatAmount?: (amount: number, currency: string) => string;
  formatDate?: (date: string) => string;
  emptyMessage?: string;
}

export function TransactionList({
  transactions,
  isLoading = false,
  isLoadingMore = false,
  hasMore = false,
  onLoadMore,
  formatAmount = (amount, currency) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount),
  formatDate = (date) =>
    new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
  emptyMessage = 'No transactions found',
}: TransactionListProps) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !isLoadingMore && onLoadMore) {
        onLoadMore();
      }
    },
    [hasMore, isLoadingMore, onLoadMore]
  );

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '100px',
      threshold: 0,
    });

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver]);

  if (isLoading) {
    return (
      <Card padding="md" className={styles.card}>
        <div className={styles.loading}>
          <Icon name="Loader" className={styles.spinner} />
          <span>Loading transactions...</span>
        </div>
      </Card>
    );
  }

  return (
    <Card padding="md" className={styles.card}>
      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <span>Date</span>
          <span>Description</span>
          <span>Bank</span>
          <span>Account</span>
          <span>Amount</span>
        </div>

        <div className={styles.tableBody}>
          {transactions.length === 0 ? (
            <div className={styles.empty}>{emptyMessage}</div>
          ) : (
            <>
              {transactions.map((tx) => (
                <div key={tx.id} className={styles.row}>
                  <span className={styles.date}>{formatDate(tx.date)}</span>
                  <div className={styles.description}>
                    <span className={styles.title}>{tx.title}</span>
                    {tx.description && (
                      <span className={styles.subtitle}>{tx.description}</span>
                    )}
                  </div>
                  <span className={styles.bank}>
                    {tx.bankLogo && (
                      <Image
                        src={tx.bankLogo}
                        alt={tx.bank || 'Bank'}
                        width={20}
                        height={20}
                        className={styles.bankLogo}
                      />
                    )}
                    {tx.bank || '-'}
                  </span>
                  <span className={styles.account}>{tx.account || '-'}</span>
                  <span
                    className={`${styles.amount} ${tx.type === 'credit' ? styles.credit : styles.debit}`}
                  >
                    {tx.type === 'credit' ? '+' : '-'}
                    {formatAmount(Math.abs(tx.amount), tx.currency)}
                  </span>
                </div>
              ))}

              <div ref={loadMoreRef} className={styles.loadMore}>
                {isLoadingMore && (
                  <div className={styles.loadingMore}>
                    <Icon name="Loader" className={styles.spinner} />
                    <span>Loading more...</span>
                  </div>
                )}
                {!hasMore && transactions.length > 0 && (
                  <span className={styles.endMessage}>
                    No more transactions
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
