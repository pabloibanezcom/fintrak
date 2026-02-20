'use client';

import Link from 'next/link';
import {
  TransactionList,
  type TransactionListItem,
} from '@/components/data-display';
import { Card, Icon } from '@/components/primitives';
import styles from '../showroom.module.css';

const sampleTransactions: TransactionListItem[] = [
  {
    id: '1',
    title: 'Mercadona',
    description: 'Weekly groceries',
    amount: 67.45,
    currency: 'EUR',
    date: '2025-01-15T10:30:00Z',
    type: 'debit',
    bank: 'Santander',
    account: 'Main Account',
  },
  {
    id: '2',
    title: 'Salary - January',
    amount: 2800.0,
    currency: 'EUR',
    date: '2025-01-14T09:00:00Z',
    type: 'credit',
    bank: 'BBVA',
    account: 'Payroll Account',
  },
  {
    id: '3',
    title: 'Netflix',
    description: 'Monthly subscription',
    amount: 15.99,
    currency: 'EUR',
    date: '2025-01-13T12:00:00Z',
    type: 'debit',
    bank: 'Santander',
    account: 'Main Account',
    isLinked: true,
    linkedTransactionId: 'tx-123',
  },
  {
    id: '4',
    title: 'ATM Withdrawal',
    amount: 100.0,
    currency: 'EUR',
    date: '2025-01-12T16:30:00Z',
    type: 'debit',
    bank: 'CaixaBank',
    account: 'Savings',
    isDismissed: true,
  },
];

export default function TransactionListShowroomPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/ui" className={styles.backLink}>
          <Icon name="arrowLeft" size={16} />
          <span>Back to UI</span>
        </Link>
        <h1 className={styles.title}>TransactionList</h1>
        <p className={styles.subtitle}>
          A table-style list of financial transactions with date, description,
          bank info, amounts, and infinite scroll support.
        </p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Default (with bank info)</h2>
        <Card className={styles.showcase}>
          <TransactionList transactions={sampleTransactions} />
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Simple (no bank info)</h2>
        <Card className={styles.showcase}>
          <TransactionList
            transactions={sampleTransactions}
            showBankInfo={false}
          />
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Loading State</h2>
        <Card className={styles.showcase}>
          <TransactionList transactions={[]} isLoading />
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Empty State</h2>
        <Card className={styles.showcase}>
          <TransactionList
            transactions={[]}
            emptyMessage="No transactions match your filters"
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
            <li>Table layout with date, description, bank, account, amount</li>
            <li>Color-coded amounts: green for credits, red for debits</li>
            <li>Linked transaction indicator with navigation</li>
            <li>Dismissed transaction visual state</li>
            <li>Infinite scroll via IntersectionObserver</li>
            <li>Loading and empty states</li>
            <li>Optional bank info columns</li>
            <li>Customizable amount and date formatters</li>
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
                  <code>TransactionListItem[]</code>
                </td>
                <td>—</td>
                <td>Array of transactions to display</td>
              </tr>
              <tr>
                <td>
                  <code>isLoading</code>
                </td>
                <td>
                  <code>boolean</code>
                </td>
                <td>
                  <code>false</code>
                </td>
                <td>Shows loading spinner</td>
              </tr>
              <tr>
                <td>
                  <code>hasMore</code>
                </td>
                <td>
                  <code>boolean</code>
                </td>
                <td>
                  <code>false</code>
                </td>
                <td>Whether more data is available for infinite scroll</td>
              </tr>
              <tr>
                <td>
                  <code>onLoadMore</code>
                </td>
                <td>
                  <code>() =&gt; void</code>
                </td>
                <td>—</td>
                <td>Callback to load more transactions</td>
              </tr>
              <tr>
                <td>
                  <code>onTransactionClick</code>
                </td>
                <td>
                  <code>(tx: TransactionListItem) =&gt; void</code>
                </td>
                <td>—</td>
                <td>Callback when a row is clicked</td>
              </tr>
              <tr>
                <td>
                  <code>showBankInfo</code>
                </td>
                <td>
                  <code>boolean</code>
                </td>
                <td>
                  <code>true</code>
                </td>
                <td>Show bank and account columns</td>
              </tr>
              <tr>
                <td>
                  <code>emptyMessage</code>
                </td>
                <td>
                  <code>string</code>
                </td>
                <td>&quot;No transactions found&quot;</td>
                <td>Message when no transactions exist</td>
              </tr>
            </tbody>
          </table>
        </Card>
      </section>
    </div>
  );
}
