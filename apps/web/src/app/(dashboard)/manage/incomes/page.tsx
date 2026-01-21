import { Card } from '@/components/ui';
import styles from './page.module.css';

export default function IncomesPage() {
  return (
    <div className={styles.page}>
      <Card padding="lg" className={styles.card}>
        <div className={styles.icon}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path
              d="M24 40V8M36 20L24 8 12 20"
              stroke="var(--color-success-500)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1 className={styles.title}>Incomes</h1>
        <p className={styles.description}>
          Track all your income sources.
          <br />
          This feature is coming soon.
        </p>
      </Card>
    </div>
  );
}
