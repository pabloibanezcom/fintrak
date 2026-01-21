import { Card } from '@/components/ui';
import styles from './page.module.css';

export default function ExpensesPage() {
  return (
    <div className={styles.page}>
      <Card padding="lg" className={styles.card}>
        <div className={styles.icon}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path
              d="M24 8v32M12 16l12-8 12 8M12 32l12 8 12-8"
              stroke="var(--color-primary-500)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1 className={styles.title}>Expenses</h1>
        <p className={styles.description}>
          Manage and track all your expenses.
          <br />
          This feature is coming soon.
        </p>
      </Card>
    </div>
  );
}
