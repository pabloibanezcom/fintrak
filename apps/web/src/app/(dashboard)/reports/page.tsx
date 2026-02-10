import { PageContainer } from '@/components/layout';
import { Card } from '@/components/primitives';

export default function ReportsPage() {
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
              d="M10 34V26M18 34V22M26 34V18M34 34V14"
              stroke="var(--color-primary-500)"
              strokeWidth="3"
              strokeLinecap="round"
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
          Reports
        </h1>
        <p
          style={{
            fontSize: 'var(--font-size-base)',
            color: 'var(--color-text-secondary)',
          }}
        >
          View detailed analytics and reports.
          <br />
          This feature is coming soon.
        </p>
      </Card>
    </PageContainer>
  );
}
