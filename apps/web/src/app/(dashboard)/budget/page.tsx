'use client';

import { useTranslations } from 'next-intl';

import { PageContainer } from '@/components/layout';
import { Card } from '@/components/primitives';

export default function BudgetPage() {
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
        <h1
          style={{
            fontSize: 'var(--font-size-2xl)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-text-primary)',
          }}
        >
          {t('nav.budget')}
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
