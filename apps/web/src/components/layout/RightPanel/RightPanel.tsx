'use client';

import { Card } from '@/components/ui';
import { formatCurrency, formatPercentage } from '@/utils';
import styles from './RightPanel.module.css';

interface RightPanelProps {
  totalIncome?: number;
  incomeChange?: number;
  currency?: string;
}

export function RightPanel({
  totalIncome = 0,
  incomeChange = 0,
  currency = 'EUR',
}: RightPanelProps) {
  return (
    <aside className={styles.panel}>
      <Card padding="md" className={styles.card}>
        <div className={styles.header}>
          <h3 className={styles.title}>Total Income</h3>
          <span className={styles.viewAll}>View your income</span>
        </div>

        <div className={styles.chart}>
          <svg viewBox="0 0 200 80" className={styles.chartSvg}>
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF6B35" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#FF6B35" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0 60 Q25 55, 50 50 T100 35 T150 25 T200 15 V80 H0 Z"
              fill="url(#incomeGradient)"
            />
            <path
              d="M0 60 Q25 55, 50 50 T100 35 T150 25 T200 15"
              fill="none"
              stroke="#FF6B35"
              strokeWidth="2"
            />
          </svg>
        </div>

        <div className={styles.stats}>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>Total income</span>
            <span className={styles.statValue}>
              {formatCurrency(totalIncome, currency)}
            </span>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>vs last month</span>
            <span
              className={`${styles.statChange} ${incomeChange >= 0 ? styles.positive : styles.negative}`}
            >
              {formatPercentage(incomeChange)}
            </span>
          </div>
        </div>
      </Card>

      <Card padding="md" className={styles.card}>
        <div className={styles.header}>
          <h3 className={styles.title}>Profit and Loss</h3>
        </div>

        <div className={styles.profitList}>
          <div className={styles.profitItem}>
            <div className={styles.profitIcon} style={{ backgroundColor: '#22c55e' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 3v10M4 7l4-4 4 4"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className={styles.profitInfo}>
              <span className={styles.profitLabel}>Income</span>
              <span className={styles.profitValue}>
                {formatCurrency(totalIncome, currency)}
              </span>
            </div>
          </div>

          <div className={styles.profitItem}>
            <div className={styles.profitIcon} style={{ backgroundColor: '#ef4444' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 13V3M4 9l4 4 4-4"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className={styles.profitInfo}>
              <span className={styles.profitLabel}>Expenses</span>
              <span className={styles.profitValue}>
                {formatCurrency(0, currency)}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </aside>
  );
}
