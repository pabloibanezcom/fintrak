'use client';

import { useTranslations } from 'next-intl';

import { Card } from '@/components/ui';
import styles from './page.module.css';

export default function InvestmentsPage() {
  const t = useTranslations();

  return (
    <div className={styles.page}>
      <Card padding="lg" className={styles.card}>
        <div className={styles.icon}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path
              d="M6 34l10-10 8 8 14-18"
              stroke="var(--color-primary-500)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M30 14h8v8"
              stroke="var(--color-primary-500)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1 className={styles.title}>{t('nav.investments')}</h1>
        <p className={styles.description}>{t('common.comingSoon')}</p>
      </Card>
    </div>
  );
}
