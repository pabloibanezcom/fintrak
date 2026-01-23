'use client';

import { useTranslations } from 'next-intl';

import { Card } from '@/components/ui';
import styles from './page.module.css';

export default function BankingPage() {
  const t = useTranslations();

  return (
    <div className={styles.page}>
      <Card padding="lg" className={styles.card}>
        <div className={styles.icon}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <ellipse
              cx="17"
              cy="35"
              rx="11"
              ry="4"
              stroke="var(--color-primary-500)"
              strokeWidth="3"
            />
            <path
              d="M6 35v-4c0-2.2 4.9-4 11-4s11 1.8 11 4v4"
              stroke="var(--color-primary-500)"
              strokeWidth="3"
            />
            <path
              d="M6 31v-4c0-2.2 4.9-4 11-4s11 1.8 11 4"
              stroke="var(--color-primary-500)"
              strokeWidth="3"
            />
            <ellipse
              cx="31"
              cy="17"
              rx="11"
              ry="4"
              stroke="var(--color-primary-500)"
              strokeWidth="3"
            />
            <path
              d="M20 17v4c0 2.2 4.9 4 11 4s11-1.8 11-4v-4"
              stroke="var(--color-primary-500)"
              strokeWidth="3"
            />
            <path
              d="M20 13c0-2.2 4.9-4 11-4s11 1.8 11 4v4"
              stroke="var(--color-primary-500)"
              strokeWidth="3"
            />
          </svg>
        </div>
        <h1 className={styles.title}>{t('nav.banking')}</h1>
        <p className={styles.description}>{t('common.comingSoon')}</p>
      </Card>
    </div>
  );
}
