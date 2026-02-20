'use client';

import Link from 'next/link';
import { Card, ErrorMessage, Icon } from '@/components/primitives';
import styles from '../showroom.module.css';

export default function ErrorMessageShowroomPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/ui" className={styles.backLink}>
          <Icon name="arrowLeft" size={16} />
          <span>Back to UI</span>
        </Link>
        <h1 className={styles.title}>ErrorMessage</h1>
        <p className={styles.subtitle}>
          Displays an error alert box. Returns null when the message is empty,
          so it can be conditionally rendered inline.
        </p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Default</h2>
        <Card className={styles.showcase}>
          <div style={{ maxWidth: 400 }}>
            <ErrorMessage message="Invalid email or password" />
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Long Message</h2>
        <Card className={styles.showcase}>
          <div style={{ maxWidth: 400 }}>
            <ErrorMessage message="Something went wrong while processing your request. Please check your connection and try again later." />
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Empty (renders nothing)</h2>
        <Card className={styles.showcase}>
          <div style={{ maxWidth: 400 }}>
            <p
              style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-text-secondary)',
              }}
            >
              An ErrorMessage with an empty string renders nothing:
            </p>
            <ErrorMessage message="" />
            <p
              style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-text-secondary)',
              }}
            >
              (nothing above this line)
            </p>
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
                  <code>message</code>
                </td>
                <td>
                  <code>string</code>
                </td>
                <td>—</td>
                <td>The error message to display. Returns null when empty.</td>
              </tr>
            </tbody>
          </table>
        </Card>
      </section>
    </div>
  );
}
