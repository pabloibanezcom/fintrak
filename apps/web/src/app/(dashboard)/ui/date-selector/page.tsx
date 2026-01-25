'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Card, DateSelector, Icon } from '@/components/ui';
import styles from '../showroom.module.css';

export default function DateSelectorShowroomPage() {
  const [dates1, setDates1] = useState<{ start: string; end: string }>({
    start: '',
    end: '',
  });
  const [dates2, setDates2] = useState<{ start: string; end: string }>({
    start: '2025-01-01',
    end: '2025-01-31',
  });

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/ui" className={styles.backLink}>
          <Icon name="arrowLeft" size={16} />
          <span>Back to UI</span>
        </Link>
        <h1 className={styles.title}>DateSelector</h1>
        <p className={styles.subtitle}>
          A date range picker with preset options and a visual calendar for
          intuitive range selection.
        </p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Default</h2>
        <Card className={styles.showcase}>
          <div className={styles.inputGrid}>
            <DateSelector
              startDate={dates1.start}
              endDate={dates1.end}
              onChange={(start, end) => setDates1({ start, end })}
            />
            <p
              style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-text-tertiary)',
              }}
            >
              Selected:{' '}
              {dates1.start && dates1.end
                ? `${dates1.start} to ${dates1.end}`
                : 'None'}
            </p>
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>With Initial Values</h2>
        <Card className={styles.showcase}>
          <div className={styles.inputGrid}>
            <DateSelector
              startDate={dates2.start}
              endDate={dates2.end}
              onChange={(start, end) => setDates2({ start, end })}
            />
            <p
              style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-text-tertiary)',
              }}
            >
              Selected:{' '}
              {dates2.start && dates2.end
                ? `${dates2.start} to ${dates2.end}`
                : 'None'}
            </p>
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Features</h2>
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
            <li>Quick preset buttons for common date ranges</li>
            <li>Single calendar with click-to-select range</li>
            <li>Hover preview shows range before confirming</li>
            <li>Month/year navigation with prev/next buttons</li>
            <li>Highlights today, selected dates, and date range</li>
            <li>Auto-swaps dates if end is before start</li>
            <li>Clear and Apply actions</li>
            <li>Keyboard accessible (Escape to close)</li>
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
                  <code>startDate</code>
                </td>
                <td>
                  <code>string</code>
                </td>
                <td>—</td>
                <td>Start date in YYYY-MM-DD format</td>
              </tr>
              <tr>
                <td>
                  <code>endDate</code>
                </td>
                <td>
                  <code>string</code>
                </td>
                <td>—</td>
                <td>End date in YYYY-MM-DD format</td>
              </tr>
              <tr>
                <td>
                  <code>onChange</code>
                </td>
                <td>
                  <code>(start: string, end: string) =&gt; void</code>
                </td>
                <td>—</td>
                <td>Callback when date range changes</td>
              </tr>
              <tr>
                <td>
                  <code>className</code>
                </td>
                <td>
                  <code>string</code>
                </td>
                <td>—</td>
                <td>Additional CSS class for the wrapper</td>
              </tr>
            </tbody>
          </table>
        </Card>
      </section>
    </div>
  );
}
