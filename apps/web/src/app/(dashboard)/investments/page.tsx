'use client';

import { useTranslations } from 'next-intl';

import { PageContainer } from '@/components/layout';
import { Card } from '@/components/primitives';

export default function InvestmentsPage() {
  const t = useTranslations();

  return (
    <PageContainer>
      <Card
        padding="lg"
        style={{
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--spacing-3)',
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
        <h1
          style={{
            fontSize: 'var(--font-size-2xl)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-text-primary)',
          }}
        >
          {t('nav.investments')}
        </h1>
        <p
          style={{
            fontSize: 'var(--font-size-base)',
            color: 'var(--color-text-secondary)',
          }}
        >
          {t('common.comingSoon')}
        </p>
      </Card>
    </PageContainer>
  );
}
