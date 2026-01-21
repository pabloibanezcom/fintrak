import { Card } from '@/components/ui';
import styles from './page.module.css';

export default function ReportsPage() {
  return (
    <div className={styles.page}>
      <Card padding="lg" className={styles.card}>
        <div className={styles.icon}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path
              d="M10 34V26M18 34V22M26 34V18M34 34V14"
              stroke="var(--color-primary-500)"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <h1 className={styles.title}>Reports</h1>
        <p className={styles.description}>
          View detailed analytics and reports.
          <br />
          This feature is coming soon.
        </p>
      </Card>
    </div>
  );
}
