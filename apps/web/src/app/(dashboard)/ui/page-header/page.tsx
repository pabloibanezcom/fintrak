'use client';

import Link from 'next/link';
import { PageHeader } from '@/components/layout';
import { Button, Card, Icon } from '@/components/primitives';
import styles from '../showroom.module.css';

export default function PageHeaderShowroomPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/ui" className={styles.backLink}>
          <Icon name="arrowLeft" size={16} />
          <span>Back to UI</span>
        </Link>
        <h1 className={styles.title}>PageHeader</h1>
        <p className={styles.subtitle}>
          A page-level header with title, optional subtitle, and an actions slot
          for buttons or controls.
        </p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Title Only</h2>
        <Card className={styles.showcase}>
          <PageHeader title="Overview" />
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>With Subtitle</h2>
        <Card className={styles.showcase}>
          <PageHeader
            title="Banking"
            subtitle="View and manage your bank transactions"
          />
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>With Actions</h2>
        <Card className={styles.showcase}>
          <PageHeader
            title="Categories"
            subtitle="Manage your budget categories"
            actions={<Button size="sm">+ New Category</Button>}
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
                <td>Page title (h1)</td>
              </tr>
              <tr>
                <td>
                  <code>subtitle</code>
                </td>
                <td>
                  <code>string</code>
                </td>
                <td>—</td>
                <td>Optional description below the title</td>
              </tr>
              <tr>
                <td>
                  <code>actions</code>
                </td>
                <td>
                  <code>ReactNode</code>
                </td>
                <td>—</td>
                <td>Right-aligned action buttons or controls</td>
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
