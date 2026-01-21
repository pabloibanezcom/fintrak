import { Card } from '@/components/ui';
import styles from './page.module.css';

export default function ActivityPage() {
  return (
    <div className={styles.page}>
      <Card padding="lg" className={styles.card}>
        <div className={styles.icon}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path
              d="M4 24h10l5-14 10 28 5-14h10"
              stroke="var(--color-primary-500)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1 className={styles.title}>Activity</h1>
        <p className={styles.description}>
          View all your transaction history and activities.
          <br />
          This feature is coming soon.
        </p>
      </Card>
    </div>
  );
}
