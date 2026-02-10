'use client';

import Link from 'next/link';
import { PageContainer } from '@/components/layout';
import { Card, Icon } from '@/components/primitives';
import styles from '../showroom.module.css';

export default function PageContainerShowroomPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/ui" className={styles.backLink}>
          <Icon name="arrowLeft" size={16} />
          <span>Back to UI</span>
        </Link>
        <h1 className={styles.title}>PageContainer</h1>
        <p className={styles.subtitle}>
          A standard page wrapper that provides consistent max-width and padding
          for page content.
        </p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Preview</h2>
        <Card className={styles.showcase}>
          <div
            style={{
              border: '1px dashed var(--color-border)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <PageContainer>
              <div
                style={{
                  padding: 'var(--spacing-6)',
                  background: 'var(--color-primary-50)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-text-secondary)',
                  textAlign: 'center',
                }}
              >
                Page content goes here
              </div>
            </PageContainer>
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
                  <code>children</code>
                </td>
                <td>
                  <code>ReactNode</code>
                </td>
                <td>—</td>
                <td>Page content</td>
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
