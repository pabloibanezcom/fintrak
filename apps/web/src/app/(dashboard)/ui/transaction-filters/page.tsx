'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  TransactionFilters,
  type TransactionFiltersValue,
} from '@/components/features';
import { Card, Icon } from '@/components/primitives';
import styles from '../showroom.module.css';

const sampleBanks = [
  { value: 'santander', label: 'Santander' },
  { value: 'bbva', label: 'BBVA' },
  { value: 'caixabank', label: 'CaixaBank' },
];

const sampleAccounts = [
  { value: 'santander-main', label: 'Main Account' },
  { value: 'santander-savings', label: 'Savings' },
  { value: 'bbva-payroll', label: 'Payroll Account' },
  { value: 'caixabank-business', label: 'Business Account' },
];

const emptyFilters: TransactionFiltersValue = {
  search: '',
  dateFrom: '',
  dateTo: '',
  bankId: '',
  accountId: '',
  reviewStatus: '',
};

export default function TransactionFiltersShowroomPage() {
  const [filters, setFilters] = useState<TransactionFiltersValue>(emptyFilters);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/ui" className={styles.backLink}>
          <Icon name="arrowLeft" size={16} />
          <span>Back to UI</span>
        </Link>
        <h1 className={styles.title}>TransactionFilters</h1>
        <p className={styles.subtitle}>
          An expandable filter bar with search, date range, bank/account
          selectors, and review status filtering for transaction lists.
        </p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Interactive Demo</h2>
        <Card className={styles.showcase}>
          <TransactionFilters
            value={filters}
            onChange={setFilters}
            totalCount={142}
            banks={sampleBanks}
            accounts={sampleAccounts}
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
            <li>Search input with icon</li>
            <li>Expandable filter panel</li>
            <li>Bank and account selectors (accounts filter by bank)</li>
            <li>Review status filter: Unreviewed, Linked, Dismissed</li>
            <li>Date range picker with presets</li>
            <li>Clear all filters button</li>
            <li>Result count display</li>
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
                  <code>value</code>
                </td>
                <td>
                  <code>TransactionFiltersValue</code>
                </td>
                <td>—</td>
                <td>Current filter state</td>
              </tr>
              <tr>
                <td>
                  <code>onChange</code>
                </td>
                <td>
                  <code>(filters: TransactionFiltersValue) =&gt; void</code>
                </td>
                <td>—</td>
                <td>Callback when any filter changes</td>
              </tr>
              <tr>
                <td>
                  <code>totalCount</code>
                </td>
                <td>
                  <code>number</code>
                </td>
                <td>—</td>
                <td>Total results count to display</td>
              </tr>
              <tr>
                <td>
                  <code>banks</code>
                </td>
                <td>
                  <code>FilterOption[]</code>
                </td>
                <td>
                  <code>[]</code>
                </td>
                <td>Available bank options</td>
              </tr>
              <tr>
                <td>
                  <code>accounts</code>
                </td>
                <td>
                  <code>FilterOption[]</code>
                </td>
                <td>
                  <code>[]</code>
                </td>
                <td>Available account options</td>
              </tr>
            </tbody>
          </table>
        </Card>
      </section>
    </div>
  );
}
