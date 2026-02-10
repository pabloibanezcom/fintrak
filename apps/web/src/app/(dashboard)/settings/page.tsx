import { PageContainer } from '@/components/layout';
import { Card } from '@/components/primitives';

export default function SettingsPage() {
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
              r="8"
              stroke="var(--color-primary-500)"
              strokeWidth="3"
            />
            <path
              d="M24 8v4M24 36v4M8 24h4M36 24h4M12.7 12.7l2.8 2.8M32.5 32.5l2.8 2.8M12.7 35.3l2.8-2.8M32.5 15.5l2.8-2.8"
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
          Settings
        </h1>
        <p
          style={{
            fontSize: 'var(--font-size-base)',
            color: 'var(--color-text-secondary)',
          }}
        >
          Manage your account settings and preferences.
          <br />
          This feature is coming soon.
        </p>
      </Card>
    </PageContainer>
  );
}
