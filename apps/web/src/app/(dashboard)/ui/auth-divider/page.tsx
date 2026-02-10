'use client';

import Link from 'next/link';
import { AuthDivider } from '@/components/primitives';
import { Card, Icon } from '@/components/primitives';
import styles from '../showroom.module.css';

export default function AuthDividerShowroomPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/ui" className={styles.backLink}>
          <Icon name="arrowLeft" size={16} />
          <span>Back to UI</span>
        </Link>
        <h1 className={styles.title}>AuthDivider</h1>
        <p className={styles.subtitle}>
          A horizontal line divider with centered text, used in authentication
          pages to separate form sections (e.g., between social login and email
          login).
        </p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Default</h2>
        <Card className={styles.showcase}>
          <div style={{ maxWidth: 400 }}>
            <AuthDivider text="OR" />
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Custom Text</h2>
        <Card className={styles.showcase}>
          <div
            style={{
              maxWidth: 400,
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-6)',
            }}
          >
            <AuthDivider text="or continue with" />
            <AuthDivider text="new here?" />
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
                  <code>text</code>
                </td>
                <td>
                  <code>string</code>
                </td>
                <td>—</td>
                <td>The text displayed in the center of the divider</td>
              </tr>
            </tbody>
          </table>
        </Card>
      </section>
    </div>
  );
}
