'use client';

import type { CryptoAsset, InvestmentSummary } from '@fintrak/types';
import { useEffect, useState } from 'react';
import { formatCurrency, formatPercentage } from '@/utils';
import styles from './InvestmentCard.module.css';

const STORAGE_KEY = 'fintrak-investment-card-visible';

export interface InvestmentItem {
  id: string;
  name: string;
  type: 'fund' | 'etc' | 'crypto';
  marketValue: number;
  profit: number;
  profitPercentage: number;
  currency: string;
  code?: string;
}

export interface InvestmentCardProps {
  funds?: InvestmentSummary[];
  etcs?: InvestmentSummary[];
  cryptoAssets?: CryptoAsset[];
  totalValue?: number;
  title?: string;
  isLoading?: boolean;
  emptyMessage?: string;
  onItemClick?: (item: InvestmentItem) => void;
  defaultVisible?: boolean;
}

interface InvestmentGroup {
  type: 'fund' | 'etc' | 'crypto';
  label: string;
  items: InvestmentItem[];
  totalValue: number;
  totalProfit: number;
}

function mapFundToItem(
  fund: InvestmentSummary,
  type: 'fund' | 'etc'
): InvestmentItem {
  const profitPercentage =
    fund.initialInvestment > 0
      ? (fund.profit / fund.initialInvestment) * 100
      : 0;

  return {
    id: fund.isin,
    name: fund.investmentName,
    type,
    marketValue: fund.marketValue,
    profit: fund.profit,
    profitPercentage,
    currency: 'EUR',
  };
}

function mapCryptoToItem(crypto: CryptoAsset): InvestmentItem {
  const value = crypto.value?.EUR || 0;
  return {
    id: crypto._id || crypto.code,
    name: crypto.name,
    type: 'crypto',
    marketValue: value,
    profit: 0,
    profitPercentage: 0,
    currency: 'EUR',
    code: crypto.code,
  };
}

function getGroupIcon(type: 'fund' | 'etc' | 'crypto'): React.ReactNode {
  switch (type) {
    case 'fund':
      return (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M3 3v18h18" />
          <path d="M18 9l-5 5-4-4-3 3" />
        </svg>
      );
    case 'etc':
      return (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      );
    case 'crypto':
      return (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M9.5 9.5c.5-1 1.5-1.5 2.5-1.5 1.5 0 2.5 1 2.5 2.5 0 1.5-1.5 2-2.5 2.5V15" />
          <circle cx="12" cy="18" r="0.5" fill="currentColor" />
        </svg>
      );
  }
}

function VisibilityToggle({
  isVisible,
  onToggle,
}: {
  isVisible: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      className={styles.visibilityToggle}
      onClick={onToggle}
      aria-label={isVisible ? 'Hide investment details' : 'Show investment details'}
    >
      {isVisible ? (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ) : (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
      )}
    </button>
  );
}

export function InvestmentCard({
  funds = [],
  etcs = [],
  cryptoAssets = [],
  totalValue,
  isLoading = false,
  emptyMessage = 'No investments found',
  onItemClick,
  defaultVisible = true,
}: InvestmentCardProps) {
  const [isVisible, setIsVisible] = useState<boolean | null>(null);

  // Load persisted visibility state from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    setIsVisible(stored !== null ? stored === 'true' : defaultVisible);
  }, [defaultVisible]);

  // Persist visibility state to localStorage
  useEffect(() => {
    if (isVisible !== null) {
      localStorage.setItem(STORAGE_KEY, String(isVisible));
    }
  }, [isVisible]);

  // Derive the actual visibility, defaulting to hidden until hydrated
  const showContent = isVisible ?? false;

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.skeletonHeader} />
        <div className={styles.skeletonList}>
          <div className={styles.skeletonGroup} />
          <div className={styles.skeletonGroup} />
        </div>
      </div>
    );
  }

  const fundItems = funds
    .map((f) => mapFundToItem(f, 'fund'))
    .sort((a, b) => b.marketValue - a.marketValue);
  const etcItems = etcs
    .map((e) => mapFundToItem(e, 'etc'))
    .sort((a, b) => b.marketValue - a.marketValue);
  const cryptoItems = cryptoAssets
    .map(mapCryptoToItem)
    .sort((a, b) => b.marketValue - a.marketValue);

  const groups: InvestmentGroup[] = [
    {
      type: 'fund' as const,
      label: 'Funds',
      items: fundItems,
      totalValue: fundItems.reduce((sum, item) => sum + item.marketValue, 0),
      totalProfit: fundItems.reduce((sum, item) => sum + item.profit, 0),
    },
    {
      type: 'etc' as const,
      label: 'ETCs',
      items: etcItems,
      totalValue: etcItems.reduce((sum, item) => sum + item.marketValue, 0),
      totalProfit: etcItems.reduce((sum, item) => sum + item.profit, 0),
    },
    {
      type: 'crypto' as const,
      label: 'Crypto',
      items: cryptoItems,
      totalValue: cryptoItems.reduce((sum, item) => sum + item.marketValue, 0),
      totalProfit: cryptoItems.reduce((sum, item) => sum + item.profit, 0),
    },
  ].filter((group) => group.items.length > 0);

  const allItems = [...fundItems, ...etcItems, ...cryptoItems];
  const calculatedTotal =
    totalValue ?? allItems.reduce((sum, item) => sum + item.marketValue, 0);
  const totalProfit = allItems.reduce((sum, item) => sum + item.profit, 0);

  if (allItems.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>{emptyMessage}</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.totalSection}>
          <span className={styles.totalLabel}>Investment portfolio</span>
          <div className={styles.totalRow}>
            {showContent ? (
              <>
                <span className={styles.totalAmount}>
                  {formatCurrency(calculatedTotal, 'EUR')}
                </span>
                {totalProfit !== 0 && (
                  <span
                    className={`${styles.totalProfit} ${totalProfit >= 0 ? styles.positive : styles.negative}`}
                  >
                    {totalProfit >= 0 ? '+' : ''}
                    {formatCurrency(totalProfit, 'EUR')}
                  </span>
                )}
              </>
            ) : (
              <span className={styles.totalAmount}>€ ******</span>
            )}
          </div>
        </div>
        <VisibilityToggle
          isVisible={showContent}
          onToggle={() => setIsVisible(!showContent)}
        />
      </div>

      <div
        className={`${styles.groupsList} ${showContent ? styles.visible : styles.hidden}`}
      >
        {groups.map((group) => (
          <div key={group.type} className={styles.group}>
            <div className={styles.groupHeader}>
              <div className={`${styles.groupIcon} ${styles[group.type]}`}>
                {getGroupIcon(group.type)}
              </div>
              <span className={styles.groupLabel}>{group.label}</span>
              <span className={styles.groupTotal}>
                {formatCurrency(group.totalValue, 'EUR')}
              </span>
            </div>

            <div className={styles.itemsList}>
              {group.items.map((item) => {
                const content = (
                  <>
                    <div className={styles.itemInfo}>
                      <span className={styles.itemName}>{item.name}</span>
                      {item.code && (
                        <span className={styles.itemCode}>{item.code}</span>
                      )}
                    </div>
                    <div className={styles.itemValues}>
                      <span className={styles.itemValue}>
                        {formatCurrency(item.marketValue, item.currency)}
                      </span>
                      {item.profit !== 0 && (
                        <span
                          className={`${styles.itemProfit} ${item.profit >= 0 ? styles.positive : styles.negative}`}
                        >
                          {formatPercentage(item.profitPercentage)}
                        </span>
                      )}
                    </div>
                  </>
                );

                return onItemClick ? (
                  <button
                    key={item.id}
                    type="button"
                    className={`${styles.item} ${styles.clickable}`}
                    onClick={() => onItemClick(item)}
                  >
                    {content}
                  </button>
                ) : (
                  <div key={item.id} className={styles.item}>
                    {content}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
