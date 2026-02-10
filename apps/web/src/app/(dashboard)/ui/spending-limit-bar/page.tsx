'use client';

import Link from 'next/link';
import { SpendingLimitBar } from '@/components/data-display';
import { Card, Icon } from '@/components/primitives';
import styles from '../showroom.module.css';

export default function SpendingLimitBarShowroomPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/ui" className={styles.backLink}>
          <Icon name="arrowLeft" size={16} />
          <span>Back to UI</span>
        </Link>
        <h1 className={styles.title}>SpendingLimitBar</h1>
        <p className={styles.subtitle}>
          A card showing monthly spending progress against a defined limit, with
          color-coded status based on usage percentage.
        </p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Normal (under 70%)</h2>
        <Card className={styles.showcase}>
          <div style={{ maxWidth: 480 }}>
            <SpendingLimitBar spent={850} limit={2000} />
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Warning (70-90%)</h2>
        <Card className={styles.showcase}>
          <div style={{ maxWidth: 480 }}>
            <SpendingLimitBar spent={1650} limit={2000} />
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Critical (over 90%)</h2>
        <Card className={styles.showcase}>
          <div style={{ maxWidth: 480 }}>
            <SpendingLimitBar spent={1900} limit={2000} />
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
                  <code>spent</code>
                </td>
                <td>
                  <code>number</code>
                </td>
                <td>—</td>
                <td>Amount spent so far</td>
              </tr>
              <tr>
                <td>
                  <code>limit</code>
                </td>
                <td>
                  <code>number</code>
                </td>
                <td>—</td>
                <td>The spending limit</td>
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
            </tbody>
          </table>
        </Card>
      </section>
    </div>
  );
}
