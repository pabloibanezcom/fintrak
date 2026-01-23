'use client';

import { useTranslations } from 'next-intl';

import { Card } from '@/components/ui';
import styles from './page.module.css';

export default function BudgetPage() {
  const t = useTranslations();

  return (
    <div className={styles.page}>
      <Card padding="lg" className={styles.card}>
        <div className={styles.icon}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle
              cx="24"
              cy="24"
              r="16"
              stroke="var(--color-primary-500)"
              strokeWidth="3"
            />
            <path
              d="M24 8v16l11 7"
              stroke="var(--color-primary-500)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1 className={styles.title}>{t('nav.budget')}</h1>
        <p className={styles.description}>{t('common.comingSoon')}</p>
      </Card>
    </div>
  );
}
