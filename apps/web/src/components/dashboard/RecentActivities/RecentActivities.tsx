'use client';

import { Badge, Card } from '@/components/ui';
import type { TransactionSummary } from '@/services/analytics';
import { formatCurrency, formatDate } from '@/utils';
import styles from './RecentActivities.module.css';

interface RecentActivitiesProps {
  transactions: TransactionSummary[];
  currency?: string;
}

export function RecentActivities({
  transactions,
  currency = 'EUR',
}: RecentActivitiesProps) {
  return (
    <Card padding="md" className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Recent Activities</h3>
        <button className={styles.viewAll}>View all</button>
      </div>

      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <span>Order ID</span>
          <span>Activity</span>
          <span>Price</span>
          <span>Status</span>
        </div>

        <div className={styles.tableBody}>
          {transactions.length === 0 ? (
            <div className={styles.empty}>No recent activities</div>
          ) : (
            transactions.map((tx) => (
              <div key={tx.id} className={styles.row}>
                <span className={styles.orderId}>
                  {tx.id?.slice(0, 8).toUpperCase()}
                </span>
                <div className={styles.activity}>
                  <span
                    className={styles.categoryDot}
                    style={{
                      backgroundColor: tx.category?.color || '#6b7280',
                    }}
                  />
                  <span className={styles.activityTitle}>{tx.title}</span>
                </div>
                <span
                  className={`${styles.price} ${tx.type === 'income' ? styles.income : styles.expense}`}
                >
                  {tx.type === 'income' ? '+' : '-'}
                  {formatCurrency(tx.amount, tx.currency || currency)}
                </span>
                <Badge variant={tx.type === 'income' ? 'success' : 'default'}>
                  {tx.type === 'income' ? 'Received' : 'Paid'}
                </Badge>
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  );
}
