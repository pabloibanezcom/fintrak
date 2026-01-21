'use client';

import { formatCurrency } from '@/utils';
import styles from './WalletCard.module.css';

const flagIcons: Record<string, string> = {
  USD: '🇺🇸',
  EUR: '🇪🇺',
  GBP: '🇬🇧',
};

interface WalletCardProps {
  currency: string;
  balance: number;
  label?: string;
  isActive?: boolean;
}

export function WalletCard({
  currency,
  balance,
  label,
  isActive = false,
}: WalletCardProps) {
  return (
    <div className={`${styles.card} ${isActive ? styles.active : ''}`}>
      <div className={styles.flag}>
        {flagIcons[currency] || currency}
      </div>
      <div className={styles.info}>
        <span className={styles.currency}>{currency}</span>
        <span className={styles.balance}>{formatCurrency(balance, currency)}</span>
        {label && <span className={styles.label}>{label}</span>}
      </div>
      {isActive && <span className={styles.badge}>Active</span>}
    </div>
  );
}
