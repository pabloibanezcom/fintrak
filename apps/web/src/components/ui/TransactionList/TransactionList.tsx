'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
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
  isLinked?: boolean;
  isDismissed?: boolean;
  linkedTransactionId?: string;
}

interface TransactionListProps {
  transactions: TransactionListItem[];
  isLoading?: boolean;
  isLoadingMore?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onTransactionClick?: (transaction: TransactionListItem) => void;
  formatAmount?: (amount: number, currency: string) => string;
  formatDate?: (date: string) => string;
  emptyMessage?: string;
  showBankInfo?: boolean;
}

export function TransactionList({
  transactions,
  isLoading = false,
  isLoadingMore = false,
  hasMore = false,
  onLoadMore,
  onTransactionClick,
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
  showBankInfo = true,
}: TransactionListProps) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const scrollRootRef = useRef<Element | null>(null);
  const [sentinelNode, setSentinelNode] = useState<HTMLDivElement | null>(
    null
  );

  // Callback ref: fires when the sentinel div mounts/unmounts
  const loadMoreRef = useCallback((node: HTMLDivElement | null) => {
    setSentinelNode(node);
  }, []);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    if (!sentinelNode) return;

    // Find the closest scrollable ancestor to use as root
    if (!scrollRootRef.current) {
      let el: Element | null = sentinelNode.parentElement;
      while (el) {
        const { overflowY } = getComputedStyle(el);
        if (overflowY === 'auto' || overflowY === 'scroll') {
          scrollRootRef.current = el;
          break;
        }
        el = el.parentElement;
      }
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !isLoadingMore &&
          onLoadMore
        ) {
          onLoadMore();
        }
      },
      {
        root: scrollRootRef.current || null,
        rootMargin: '200px',
        threshold: 0,
      }
    );

    observerRef.current.observe(sentinelNode);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [sentinelNode, hasMore, isLoadingMore, onLoadMore]);

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

  const tableClass = showBankInfo ? styles.table : styles.tableSimple;

  return (
    <Card padding="md" className={styles.card}>
      <div className={tableClass}>
        <div className={styles.tableHeader}>
          <span>Date</span>
          <span>Description</span>
          {showBankInfo && <span className={styles.statusHeader}>Income/Expense</span>}
          {showBankInfo && <span>Bank</span>}
          {showBankInfo && <span>Account</span>}
          <span>Amount</span>
        </div>

        <div className={styles.tableBody}>
          {transactions.length === 0 ? (
            <div className={styles.empty}>{emptyMessage}</div>
          ) : (
            <>
              {transactions.map((tx) => {
                const rowClass = [
                  styles.row,
                  onTransactionClick ? styles.clickable : '',
                  tx.isDismissed ? styles.dismissedRow : '',
                ]
                  .filter(Boolean)
                  .join(' ');

                const rowContent = (
                  <>
                    <span className={styles.date}>{formatDate(tx.date)}</span>
                    <div className={styles.description}>
                      <span className={styles.title}>{tx.title}</span>
                      {tx.description && (
                        <span className={styles.subtitle}>
                          {tx.description}
                        </span>
                      )}
                    </div>
                    {showBankInfo && (
                      <span className={styles.statusCell}>
                        {tx.isLinked && tx.linkedTransactionId && (
                          <Link
                            href={`/budget/transactions/${tx.linkedTransactionId}`}
                            className={styles.statusIcon}
                            onClick={(e) => e.stopPropagation()}
                            aria-label="View linked transaction"
                          >
                            <Icon name="transfer" size={16} />
                          </Link>
                        )}
                        {tx.isDismissed && (
                          <Icon
                            name="close"
                            size={14}
                            className={styles.dismissedIcon}
                            aria-label="Dismissed"
                          />
                        )}
                      </span>
                    )}
                    {showBankInfo && (
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
                    )}
                    {showBankInfo && (
                      <span className={styles.account}>
                        {tx.account || '-'}
                      </span>
                    )}
                    <span
                      className={`${styles.amount} ${tx.type === 'credit' ? styles.credit : styles.debit}`}
                    >
                      {tx.type === 'credit' ? '+' : '-'}
                      {formatAmount(Math.abs(tx.amount), tx.currency)}
                    </span>
                  </>
                );

                return onTransactionClick ? (
                  <button
                    key={tx.id}
                    type="button"
                    className={rowClass}
                    onClick={() => onTransactionClick(tx)}
                  >
                    {rowContent}
                  </button>
                ) : (
                  <div key={tx.id} className={rowClass}>
                    {rowContent}
                  </div>
                );
              })}

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
