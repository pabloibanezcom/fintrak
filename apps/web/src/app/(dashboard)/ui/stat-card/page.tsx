'use client';

import Link from 'next/link';
import { StatCard } from '@/components/data-display';
import { Card, Icon } from '@/components/primitives';
import styles from '../showroom.module.css';

export default function StatCardShowroomPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/ui" className={styles.backLink}>
          <Icon name="arrowLeft" size={16} />
          <span>Back to UI</span>
        </Link>
        <h1 className={styles.title}>StatCard</h1>
        <p className={styles.subtitle}>
          Displays a key financial metric with a label, formatted currency
          value, and optional percentage change indicator.
        </p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Default Variant</h2>
        <Card className={styles.showcase}>
          <div className={styles.row}>
            <div className={styles.item}>
              <StatCard label="Total Balance" value={24500.75} change={5.2} />
            </div>
            <div className={styles.item}>
              <StatCard label="Monthly Expenses" value={1850.3} change={-2.8} />
            </div>
            <div className={styles.item}>
              <StatCard label="Savings" value={8200} />
            </div>
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Primary Variant</h2>
        <Card className={styles.showcase}>
          <div className={styles.row}>
            <div className={styles.item}>
              <StatCard
                label="Net Worth"
                value={52400}
                change={12.5}
                variant="primary"
              />
            </div>
          </div>
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
                  <code>label</code>
                </td>
                <td>
                  <code>string</code>
                </td>
                <td>—</td>
                <td>The label above the value</td>
              </tr>
              <tr>
                <td>
                  <code>value</code>
                </td>
                <td>
                  <code>number</code>
                </td>
                <td>—</td>
                <td>The numeric value (formatted as currency)</td>
              </tr>
              <tr>
                <td>
                  <code>currency</code>
                </td>
                <td>
                  <code>string</code>
                </td>
                <td>
                  <code>'EUR'</code>
                </td>
                <td>Currency code for formatting</td>
              </tr>
              <tr>
                <td>
                  <code>change</code>
                </td>
                <td>
                  <code>number</code>
                </td>
                <td>—</td>
                <td>
                  Percentage change (shows trend arrow and &quot;This
                  month&quot; label)
                </td>
              </tr>
              <tr>
                <td>
                  <code>variant</code>
                </td>
                <td>
                  <code>'primary' | 'default'</code>
                </td>
                <td>
                  <code>'default'</code>
                </td>
                <td>Visual style variant</td>
              </tr>
            </tbody>
          </table>
        </Card>
      </section>
    </div>
  );
}
