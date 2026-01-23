'use client';

import { Card, Button, Badge } from '@/components/ui';
import { formatCurrency, formatPercentage } from '@/utils';
import styles from './TotalBalanceCard.module.css';

interface TotalBalanceCardProps {
  balance: number;
  currency?: string;
  change?: number;
  onTransfer?: () => void;
  onRequest?: () => void;
}

export function TotalBalanceCard({
  balance,
  currency = 'EUR',
  change = 0,
  onTransfer,
  onRequest,
}: TotalBalanceCardProps) {
  return (
    <Card padding="lg" className={styles.card}>
      <div className={styles.avatarIndicator}>
        <div className={styles.avatarOuter}>
          <div className={styles.avatarInner} />
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.label}>Total Balance</span>
          <Badge variant="default" className={styles.badge}>
            {currency}
          </Badge>
        </div>

        <div className={styles.balance}>
          <span className={styles.amount}>
            {formatCurrency(balance, currency)}
          </span>
          <span
            className={`${styles.change} ${change >= 0 ? styles.positive : styles.negative}`}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d={change >= 0 ? 'M6 2v8M3 5l3-3 3 3' : 'M6 10V2M3 7l3 3 3-3'}
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {formatPercentage(Math.abs(change))} than last month
          </span>
        </div>

        <div className={styles.actions}>
          <Button
            variant="secondary"
            onClick={onTransfer}
            className={styles.transferBtn}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M2 8h12M10 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Transfer
          </Button>
          <Button
            variant="outline"
            onClick={onRequest}
            className={styles.requestBtn}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M14 8H2M6 4L2 8l4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Request
          </Button>
        </div>
      </div>
    </Card>
  );
}
