'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Button, Card } from '@/components/primitives';

export default function NotFound() {
  const t = useTranslations();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg-body)',
      }}
    >
      <Card
        padding="lg"
        style={{
          maxWidth: '400px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--spacing-4)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80px',
            height: '80px',
            backgroundColor: 'var(--color-primary-50)',
            borderRadius: 'var(--radius-full)',
          }}
        >
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
        <span
          style={{
            fontSize: 'var(--font-size-5xl)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-primary-500)',
            lineHeight: 1,
          }}
        >
          404
        </span>
        <h1
          style={{
            fontSize: 'var(--font-size-2xl)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-text-primary)',
          }}
        >
          {t('notFound.title')}
        </h1>
        <p
          style={{
            fontSize: 'var(--font-size-base)',
            color: 'var(--color-text-secondary)',
            lineHeight: 'var(--line-height-relaxed)',
          }}
        >
          {t('notFound.description')}
        </p>
        <Link href="/overview">
          <Button>{t('common.goHome')}</Button>
        </Link>
      </Card>
    </div>
  );
}
