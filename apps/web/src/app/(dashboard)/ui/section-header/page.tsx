'use client';

import Link from 'next/link';
import { SectionHeader } from '@/components/layout';
import { Button, Card, Icon } from '@/components/primitives';
import styles from '../showroom.module.css';

export default function SectionHeaderShowroomPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/ui" className={styles.backLink}>
          <Icon name="arrowLeft" size={16} />
          <span>Back to UI</span>
        </Link>
        <h1 className={styles.title}>SectionHeader</h1>
        <p className={styles.subtitle}>
          A section-level header (h2) with an optional action slot, used to
          separate content areas within a page.
        </p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Title Only</h2>
        <Card className={styles.showcase}>
          <SectionHeader title="Recent Transactions" />
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>With Action</h2>
        <Card className={styles.showcase}>
          <SectionHeader
            title="Bank Accounts"
            action={
              <Button variant="ghost" size="sm">
                View All
              </Button>
            }
          />
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
                  <code>title</code>
                </td>
                <td>
                  <code>string</code>
                </td>
                <td>—</td>
                <td>Section heading text (h2)</td>
              </tr>
              <tr>
                <td>
                  <code>action</code>
                </td>
                <td>
                  <code>ReactNode</code>
                </td>
                <td>—</td>
                <td>Right-aligned action element</td>
              </tr>
              <tr>
                <td>
                  <code>className</code>
                </td>
                <td>
                  <code>string</code>
                </td>
                <td>—</td>
                <td>Additional CSS class</td>
              </tr>
            </tbody>
          </table>
        </Card>
      </section>
    </div>
  );
}
