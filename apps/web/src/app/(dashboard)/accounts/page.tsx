import { Card } from '@/components/ui';
import styles from './page.module.css';

export default function AccountsPage() {
  return (
    <div className={styles.page}>
      <Card padding="lg" className={styles.card}>
        <div className={styles.icon}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <rect
              x="6"
              y="12"
              width="36"
              height="24"
              rx="4"
              stroke="var(--color-primary-500)"
              strokeWidth="3"
            />
            <path d="M6 20h36" stroke="var(--color-primary-500)" strokeWidth="3" />
          </svg>
        </div>
        <h1 className={styles.title}>Bank Accounts</h1>
        <p className={styles.description}>
          Connect and manage your bank accounts.
          <br />
          This feature is coming soon.
        </p>
      </Card>
    </div>
  );
}
