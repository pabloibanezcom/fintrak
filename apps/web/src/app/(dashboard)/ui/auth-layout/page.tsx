'use client';

import Link from 'next/link';
import { Card, Icon } from '@/components/primitives';
import styles from '../showroom.module.css';

export default function AuthLayoutShowroomPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/ui" className={styles.backLink}>
          <Icon name="arrowLeft" size={16} />
          <span>Back to UI</span>
        </Link>
        <h1 className={styles.title}>AuthLayout</h1>
        <p className={styles.subtitle}>
          A centered layout for authentication pages. Displays the Fintrak logo
          at the top and renders children in a vertically centered container.
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
            This layout wraps the login and register pages. It provides a
            full-height centered container with the Fintrak logo and brand name
            above the content.
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
            <li>Full-viewport centered container</li>
            <li>Fintrak logo icon (40px) with brand text</li>
            <li>Content slot for AuthCard or other auth content</li>
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
                <td>Content to render (typically an AuthCard)</td>
              </tr>
            </tbody>
          </table>
        </Card>
      </section>
    </div>
  );
}
