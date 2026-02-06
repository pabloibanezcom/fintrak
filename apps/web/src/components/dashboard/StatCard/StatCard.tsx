'use client';

import { formatCurrency, formatPercentage } from '@/utils';
import { Icon } from '../../ui/Icon';
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
            <Icon
              name={change >= 0 ? 'arrowUp' : 'arrowDown'}
              size={10}
              className={styles.trendIcon}
            />
            {formatPercentage(Math.abs(change))}
          </span>
          <span className={styles.period}>This month</span>
        </div>
      )}
    </div>
  );
}
