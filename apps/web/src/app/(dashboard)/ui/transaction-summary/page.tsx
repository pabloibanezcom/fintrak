'use client';

import Link from 'next/link';
import { TransactionSummary } from '@/components/features';
import { Card, Icon } from '@/components/primitives';
import type { BankTransaction } from '@/services';
import styles from '../showroom.module.css';

const sampleTransactions: BankTransaction[] = [
  {
    _id: 'bt-1',
    userId: 'user-1',
    accountId: 'acc-main',
    bankId: 'bank-1',
    transactionId: 'external-1',
    timestamp: '2026-02-01T10:00:00.000Z',
    amount: -82.45,
    currency: 'EUR',
    type: 'DEBIT',
    description: 'Weekly groceries',
    merchantName: 'Mercadona',
    status: 'settled',
    processed: false,
    notified: false,
    dismissed: false,
    createdAt: '2026-02-01T10:00:00.000Z',
    updatedAt: '2026-02-01T10:00:00.000Z',
  },
  {
    _id: 'bt-2',
    userId: 'user-1',
    accountId: 'acc-main',
    bankId: 'bank-1',
    transactionId: 'external-2',
    timestamp: '2026-02-03T09:00:00.000Z',
    amount: 2500,
    currency: 'EUR',
    type: 'CREDIT',
    description: 'Monthly salary',
    merchantName: 'Employer Ltd',
    status: 'settled',
    processed: true,
    notified: true,
    dismissed: false,
    createdAt: '2026-02-03T09:00:00.000Z',
    updatedAt: '2026-02-03T09:00:00.000Z',
  },
  {
    _id: 'bt-3',
    userId: 'user-1',
    accountId: 'acc-savings',
    bankId: 'bank-2',
    transactionId: 'external-3',
    timestamp: '2026-02-05T17:20:00.000Z',
    amount: -15.99,
    currency: 'EUR',
    type: 'DEBIT',
    description: 'Streaming subscription',
    merchantName: 'Netflix',
    status: 'settled',
    processed: true,
    notified: true,
    dismissed: true,
    dismissNote: 'Personal expense not tracked',
    createdAt: '2026-02-05T17:20:00.000Z',
    updatedAt: '2026-02-05T17:20:00.000Z',
  },
  {
    _id: 'bt-4',
    userId: 'user-1',
    accountId: 'acc-foreign',
    bankId: 'bank-3',
    transactionId: 'external-4',
    timestamp: '2026-02-06T12:45:00.000Z',
    amount: -120.0,
    currency: 'USD',
    type: 'DEBIT',
    description: 'Business lunch',
    merchantName: 'Bistro NYC',
    status: 'settled',
    processed: false,
    notified: false,
    dismissed: false,
    createdAt: '2026-02-06T12:45:00.000Z',
    updatedAt: '2026-02-06T12:45:00.000Z',
  },
];

const sampleLinkedTransactionIds = new Map<string, string>([
  ['bt-1', 'ut-101'],
  ['bt-2', 'ut-102'],
]);

export default function TransactionSummaryShowroomPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/ui" className={styles.backLink}>
          <Icon name="arrowLeft" size={16} />
          <span>Back to UI</span>
        </Link>
        <h1 className={styles.title}>TransactionSummary</h1>
        <p className={styles.subtitle}>
          Shows aggregate totals and review status counts for active bank
          transactions (dismissed ones are excluded).
        </p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Default</h2>
        <Card className={styles.showcase}>
          <TransactionSummary
            transactions={sampleTransactions}
            linkedTransactionIds={sampleLinkedTransactionIds}
          />
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Empty State</h2>
        <Card className={styles.showcase}>
          <TransactionSummary
            transactions={[]}
            linkedTransactionIds={new Map()}
          />
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Features</h2>
        <Card className={styles.showcase}>
          <ul
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-2)',
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-secondary)',
              paddingLeft: 'var(--spacing-4)',
            }}
          >
            <li>Total amount aggregated across visible transactions</li>
            <li>Dismissed transactions are excluded from all calculations</li>
            <li>Multi-currency total formatting when needed</li>
            <li>Total transaction count</li>
            <li>Linked and unlinked transaction counts</li>
            <li>Responsive card layout</li>
          </ul>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Props</h2>
        <Card className={styles.propsCard}>
          <table className={styles.propsTable}>
            <thead>
              <tr>
                <th>Prop</th>
                <th>Type</th>
                <th>Default</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>transactions</code>
                </td>
                <td>
                  <code>BankTransaction[]</code>
                </td>
                <td>—</td>
                <td>Bank transactions used to compute aggregates</td>
              </tr>
              <tr>
                <td>
                  <code>linkedTransactionIds</code>
                </td>
                <td>
                  <code>Map&lt;string, string&gt;</code>
                </td>
                <td>—</td>
                <td>
                  Map of bank transaction IDs to linked user transaction IDs
                </td>
              </tr>
            </tbody>
          </table>
        </Card>
      </section>
    </div>
  );
}
