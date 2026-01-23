'use client';

import Link from 'next/link';
import { Card, Icon, Input } from '@/components/ui';
import styles from '../showroom.module.css';

export default function InputShowroomPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/ui" className={styles.backLink}>
          <Icon name="arrowLeft" size={16} />
          <span>Back to UI</span>
        </Link>
        <h1 className={styles.title}>Input</h1>
        <p className={styles.subtitle}>
          Input fields allow users to enter text. They support labels, hints,
          and error states.
        </p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Basic</h2>
        <Card className={styles.showcase}>
          <div className={styles.inputGrid}>
            <Input placeholder="Enter text..." />
            <Input label="With Label" placeholder="Enter text..." />
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>With Hint</h2>
        <Card className={styles.showcase}>
          <div className={styles.inputGrid}>
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              hint="We'll never share your email"
            />
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Error State</h2>
        <Card className={styles.showcase}>
          <div className={styles.inputGrid}>
            <Input
              label="Password"
              type="password"
              placeholder="Enter password"
              error="Password must be at least 8 characters"
            />
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Disabled</h2>
        <Card className={styles.showcase}>
          <div className={styles.inputGrid}>
            <Input
              label="Disabled Input"
              placeholder="Cannot edit"
              disabled
              value="Disabled value"
            />
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
                <td>Label text displayed above the input</td>
              </tr>
              <tr>
                <td>
                  <code>error</code>
                </td>
                <td>
                  <code>string</code>
                </td>
                <td>—</td>
                <td>Error message displayed below the input</td>
              </tr>
              <tr>
                <td>
                  <code>hint</code>
                </td>
                <td>
                  <code>string</code>
                </td>
                <td>—</td>
                <td>
                  Help text displayed below the input (hidden when error is
                  shown)
                </td>
              </tr>
              <tr>
                <td>
                  <code>...rest</code>
                </td>
                <td>
                  <code>InputHTMLAttributes</code>
                </td>
                <td>—</td>
                <td>All standard HTML input attributes are supported</td>
              </tr>
            </tbody>
          </table>
        </Card>
      </section>
    </div>
  );
}
