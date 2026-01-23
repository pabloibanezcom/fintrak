'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Button, Card } from '@/components/ui';
import styles from './not-found.module.css';

export default function NotFound() {
  const t = useTranslations();

  return (
    <div className={styles.page}>
      <Card padding="lg" className={styles.card}>
        <div className={styles.icon}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle
              cx="24"
              cy="24"
              r="18"
              stroke="var(--color-primary-500)"
              strokeWidth="3"
            />
            <path
              d="M24 14v12"
              stroke="var(--color-primary-500)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx="24" cy="32" r="2" fill="var(--color-primary-500)" />
          </svg>
        </div>
        <span className={styles.code}>404</span>
        <h1 className={styles.title}>{t('notFound.title')}</h1>
        <p className={styles.description}>{t('notFound.description')}</p>
        <Link href="/overview">
          <Button>{t('common.goHome')}</Button>
        </Link>
      </Card>
    </div>
  );
}
