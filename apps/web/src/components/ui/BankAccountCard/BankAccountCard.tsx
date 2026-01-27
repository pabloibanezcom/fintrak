'use client';

import Image from 'next/image';
import { formatCurrency } from '@/utils';
import styles from './BankAccountCard.module.css';

export interface BankAccountItem {
  id: string;
  bankName: string;
  bankLogo?: string;
  accountName: string;
  balance: number;
  currency: string;
  iban?: string;
}

export interface BankAccountCardProps {
  accounts: BankAccountItem[];
  title?: string;
  isLoading?: boolean;
  emptyMessage?: string;
  onAccountClick?: (account: BankAccountItem) => void;
  layout?: 'vertical' | 'horizontal';
}

export function BankAccountCard({
  accounts,
  title = 'Bank Accounts',
  isLoading = false,
  emptyMessage = 'No bank accounts connected',
  onAccountClick,
  layout = 'vertical',
}: BankAccountCardProps) {
  const isHorizontal = layout === 'horizontal';

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.skeletonText} />
        <div className={styles.skeletonList}>
          <div className={styles.skeletonCard} />
          <div className={styles.skeletonCard} />
          <div className={styles.skeletonCard} />
        </div>
      </div>
    );
  }

  // Calculate total balance
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const mainCurrency = accounts[0]?.currency || 'EUR';

  if (accounts.length === 0) {
    return (
      <div
        className={styles.accountCard}
        style={{
          width: '100%',
          textAlign: 'center',
          color: 'var(--color-text-tertiary)',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '140px',
        }}
      >
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Total Balance Section */}
      <div className={styles.totalSection}>
        <span className={styles.totalLabel}>Bank accounts balance</span>
        <span className={`${styles.totalAmount} ${totalBalance < 0 ? styles.negative : ''}`}>
          {formatCurrency(totalBalance, mainCurrency)}
        </span>
      </div>

      {/* Account Cards */}
      <div
        className={`${styles.accountsList} ${isHorizontal ? styles.horizontal : styles.vertical}`}
      >
        {accounts.map((account) => (
          <div
            key={account.id}
            className={styles.accountCard}
            onClick={() => onAccountClick?.(account)}
            role={onAccountClick ? 'button' : undefined}
            tabIndex={onAccountClick ? 0 : undefined}
          >
            <div className={styles.header}>
              <div className={styles.bankLogo}>
                {account.bankLogo ? (
                  <Image
                    src={account.bankLogo}
                    alt={account.bankName}
                    width={24}
                    height={24}
                    className={styles.logoImage}
                  />
                ) : (
                  <span className={styles.logoPlaceholder}>
                    {account.bankName.charAt(0)}
                  </span>
                )}
              </div>
              <div className={styles.bankInfo}>
                <span className={styles.bankName}>{account.bankName}</span>
                <span className={styles.accountName}>
                  {account.accountName}
                </span>
              </div>
            </div>

            <div className={styles.balanceSection}>
              <div className={`${styles.balanceAmount} ${account.balance < 0 ? styles.negative : ''}`}>
                {formatCurrency(account.balance, account.currency)}
              </div>
              {account.iban && (
                <div className={styles.accountNumber}>
                  •••• {account.iban.replace(/\s/g, '').slice(-4)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
