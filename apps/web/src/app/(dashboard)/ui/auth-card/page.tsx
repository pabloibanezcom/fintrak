'use client';

import Link from 'next/link';
import { AuthCard } from '@/components/layout';
import { Button, Card, Icon, Input } from '@/components/primitives';
import styles from '../showroom.module.css';

export default function AuthCardShowroomPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/ui" className={styles.backLink}>
          <Icon name="arrowLeft" size={16} />
          <span>Back to UI</span>
        </Link>
        <h1 className={styles.title}>AuthCard</h1>
        <p className={styles.subtitle}>
          A card wrapper for authentication pages with a title, optional
          subtitle, and content area. Built on top of the Card primitive.
        </p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>With Title and Subtitle</h2>
        <Card className={styles.showcase}>
          <div style={{ maxWidth: 420 }}>
            <AuthCard title="Welcome back" subtitle="Sign in to your account">
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--spacing-4)',
                }}
              >
                <Input label="Email" placeholder="you@example.com" />
                <Input
                  label="Password"
                  type="password"
                  placeholder="********"
                />
                <Button fullWidth>Sign In</Button>
              </div>
            </AuthCard>
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Title Only</h2>
        <Card className={styles.showcase}>
          <div style={{ maxWidth: 420 }}>
            <AuthCard title="Create Account">
              <p
                style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-text-secondary)',
                }}
              >
                Form content goes here.
              </p>
            </AuthCard>
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
                  <code>title</code>
                </td>
                <td>
                  <code>string</code>
                </td>
                <td>—</td>
                <td>Card heading text</td>
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
                  <code>children</code>
                </td>
                <td>
                  <code>ReactNode</code>
                </td>
                <td>—</td>
                <td>Card content (typically a form)</td>
              </tr>
            </tbody>
          </table>
        </Card>
      </section>
    </div>
  );
}
