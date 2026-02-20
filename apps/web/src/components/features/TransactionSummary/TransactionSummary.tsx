'use client';

import { useMemo } from 'react';
import { Card } from '@/components/primitives';
import type { BankTransaction } from '@/services';
import { formatCurrency } from '@/utils';
import styles from './TransactionSummary.module.css';

interface TransactionSummaryProps {
  transactions: BankTransaction[];
  linkedTransactionIds: Map<string, string>;
}

export function TransactionSummary({
  transactions,
  linkedTransactionIds,
}: TransactionSummaryProps) {
  const summary = useMemo(() => {
    const totalsByCurrency = new Map<string, number>();
    let linkedCount = 0;
    let totalCount = 0;

    for (const transaction of transactions) {
      if (transaction.dismissed) {
        continue;
      }

      totalCount += 1;
      const currentTotal = totalsByCurrency.get(transaction.currency) || 0;
      totalsByCurrency.set(
        transaction.currency,
        currentTotal + transaction.amount
      );

      if (linkedTransactionIds.has(transaction._id)) {
        linkedCount += 1;
      }
    }

    const totalAmount = Array.from(totalsByCurrency.entries())
      .sort(([currencyA], [currencyB]) => currencyA.localeCompare(currencyB))
      .map(
        ([currency, amount]) =>
          `${formatCurrency(amount, currency)} ${currency}`
      )
      .join(' | ');

    return {
      totalAmount: totalAmount || '-',
      totalCount,
      linkedCount,
      unlinkedCount: totalCount - linkedCount,
    };
  }, [transactions, linkedTransactionIds]);

  return (
    <Card padding="md" className={styles.card}>
      <div className={styles.grid}>
        <div className={styles.metric}>
          <span className={styles.label}>Total amount</span>
          <span className={styles.value}>{summary.totalAmount}</span>
        </div>
        <div className={styles.metric}>
          <span className={styles.label}>Transactions</span>
          <span className={styles.value}>{summary.totalCount}</span>
        </div>
        <div className={styles.metric}>
          <span className={styles.label}>Linked</span>
          <span className={styles.value}>{summary.linkedCount}</span>
        </div>
        <div className={styles.metric}>
          <span className={styles.label}>Unlinked</span>
          <span className={styles.value}>{summary.unlinkedCount}</span>
        </div>
      </div>
    </Card>
  );
}
