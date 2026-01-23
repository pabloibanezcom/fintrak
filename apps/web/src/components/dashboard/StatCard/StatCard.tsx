'use client';

import { formatCurrency, formatPercentage } from '@/utils';
import styles from './StatCard.module.css';

interface StatCardProps {
  label: string;
  value: number;
  currency?: string;
  change?: number;
  variant?: 'primary' | 'default';
}

export function StatCard({
  label,
  value,
  currency = 'EUR',
  change,
  variant = 'default',
}: StatCardProps) {
  return (
    <div className={`${styles.card} ${styles[variant]}`}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{formatCurrency(value, currency)}</span>
      {change !== undefined && (
        <div className={styles.changeRow}>
          <span
            className={`${styles.change} ${change >= 0 ? styles.positive : styles.negative}`}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path
                d={change >= 0 ? 'M5 1v8M2 4l3-3 3 3' : 'M5 9V1M2 6l3 3 3-3'}
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {formatPercentage(Math.abs(change))}
          </span>
          <span className={styles.period}>This month</span>
        </div>
      )}
    </div>
  );
}
