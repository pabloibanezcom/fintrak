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
  showHeader?: boolean;
}

export function BankAccountCard({
  accounts,
  title = 'Bank Accounts',
  isLoading = false,
  emptyMessage = 'No bank accounts connected',
  onAccountClick,
  layout = 'vertical',
  showHeader = true,
}: BankAccountCardProps) {
  const isHorizontal = layout === 'horizontal';

  if (isLoading) {
    return (
      <div
        className={`${styles.card} ${isHorizontal ? styles.cardHorizontal : ''}`}
      >
        {showHeader && (
          <div className={styles.header}>
            <h3 className={styles.title}>{title}</h3>
          </div>
        )}
        <div
          className={`${styles.loading} ${isHorizontal ? styles.loadingHorizontal : ''}`}
        >
          <div
            className={`${styles.skeleton} ${isHorizontal ? styles.skeletonHorizontal : ''}`}
          />
          <div
            className={`${styles.skeleton} ${isHorizontal ? styles.skeletonHorizontal : ''}`}
          />
        </div>
      </div>
    );
  }

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const mainCurrency = accounts[0]?.currency || 'EUR';

  return (
    <div
      className={`${styles.card} ${isHorizontal ? styles.cardHorizontal : ''}`}
    >
      {showHeader && (
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h3 className={styles.title}>{title}</h3>
            <span className={styles.count}>{accounts.length} accounts</span>
          </div>
          {accounts.length > 0 && (
            <div className={styles.totalBalance}>
              <span className={styles.totalLabel}>Total</span>
              <span className={styles.totalAmount}>
                {formatCurrency(totalBalance, mainCurrency)}
              </span>
            </div>
          )}
        </div>
      )}

      {accounts.length === 0 ? (
        <div className={styles.empty}>{emptyMessage}</div>
      ) : (
        <div
          className={`${styles.list} ${isHorizontal ? styles.listHorizontal : ''}`}
        >
          {accounts.map((account) => (
            <div
              key={account.id}
              className={`${styles.account} ${isHorizontal ? styles.accountHorizontal : ''}`}
              onClick={() => onAccountClick?.(account)}
              role={onAccountClick ? 'button' : undefined}
              tabIndex={onAccountClick ? 0 : undefined}
            >
              <div className={styles.bankLogo}>
                {account.bankLogo ? (
                  <Image
                    src={account.bankLogo}
                    alt={account.bankName}
                    width={32}
                    height={32}
                    className={styles.logoImage}
                  />
                ) : (
                  <span className={styles.logoPlaceholder}>
                    {account.bankName.charAt(0)}
                  </span>
                )}
              </div>

              <div className={styles.accountInfo}>
                <span className={styles.bankName}>{account.bankName}</span>
                <span className={styles.accountName}>
                  {account.accountName}
                </span>
                {!isHorizontal && account.iban && (
                  <span className={styles.iban}>
                    {account.iban.replace(/(.{4})/g, '$1 ').trim()}
                  </span>
                )}
              </div>

              <div className={styles.balance}>
                <span className={styles.balanceAmount}>
                  {formatCurrency(account.balance, account.currency)}
                </span>
                {!isHorizontal && (
                  <span className={styles.currency}>{account.currency}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
