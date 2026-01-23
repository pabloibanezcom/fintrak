'use client';

import { Card, ProgressBar } from '@/components/ui';
import { formatCurrency } from '@/utils';
import styles from './SpendingLimitBar.module.css';

interface SpendingLimitBarProps {
  spent: number;
  limit: number;
  currency?: string;
}

export function SpendingLimitBar({
  spent,
  limit,
  currency = 'EUR',
}: SpendingLimitBarProps) {
  const percentage = limit > 0 ? (spent / limit) * 100 : 0;
  const variant =
    percentage > 90 ? 'error' : percentage > 70 ? 'warning' : 'default';
  const midPoint = limit / 2;

  return (
    <Card padding="md" className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Monthly Spending Limit</h3>
        <button className={styles.addButton}>+ Add new</button>
      </div>

      <div className={styles.barContainer}>
        <ProgressBar value={spent} max={limit} variant={variant} />
        <div className={styles.markers}>
          <span className={styles.marker}>{formatCurrency(0, currency)}</span>
          <span className={styles.marker}>
            {formatCurrency(midPoint, currency)}
          </span>
          <span className={styles.marker}>
            {formatCurrency(limit, currency)}
          </span>
        </div>
      </div>

      <div className={styles.footer}>
        <span className={styles.spent}>{formatCurrency(spent, currency)}</span>
        <span className={styles.spentLabel}>spent out of</span>
      </div>
    </Card>
  );
}
