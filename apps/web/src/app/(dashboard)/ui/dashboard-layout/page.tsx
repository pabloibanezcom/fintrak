'use client';

import Link from 'next/link';
import { Card, Icon } from '@/components/primitives';
import styles from '../showroom.module.css';

export default function DashboardLayoutShowroomPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/ui" className={styles.backLink}>
          <Icon name="arrowLeft" size={16} />
          <span>Back to UI</span>
        </Link>
        <h1 className={styles.title}>DashboardLayout</h1>
        <p className={styles.subtitle}>
          The main authenticated app shell. Handles auth guards, and composes
          TopNav, Sidebar, Footer, and SyncOverlay into the workspace layout.
        </p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Overview</h2>
        <Card className={styles.showcase}>
          <p
            style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.6,
            }}
          >
            This layout cannot be previewed standalone as it requires
            authentication context. It wraps all dashboard routes.
          </p>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Structure</h2>
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
            <li>Auth guard: redirects to /login if not authenticated</li>
            <li>Loading state with spinner during auth check</li>
            <li>SyncOverlay shown during data synchronization</li>
            <li>TopNav at the top</li>
            <li>Sidebar + main content in horizontal workspace</li>
            <li>Footer at the bottom of the content area</li>
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
                  <code>children</code>
                </td>
                <td>
                  <code>ReactNode</code>
                </td>
                <td>—</td>
                <td>Page content rendered in the main area</td>
              </tr>
            </tbody>
          </table>
        </Card>
      </section>
    </div>
  );
}
