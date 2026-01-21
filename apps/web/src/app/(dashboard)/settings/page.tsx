import { Card } from '@/components/ui';
import styles from './page.module.css';

export default function SettingsPage() {
  return (
    <div className={styles.page}>
      <Card padding="lg" className={styles.card}>
        <div className={styles.icon}>
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
        <h1 className={styles.title}>Settings</h1>
        <p className={styles.description}>
          Manage your account settings and preferences.
          <br />
          This feature is coming soon.
        </p>
      </Card>
    </div>
  );
}
