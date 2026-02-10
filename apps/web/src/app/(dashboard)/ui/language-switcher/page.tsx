'use client';

import Link from 'next/link';
import { Card, Icon } from '@/components/primitives';
import styles from '../showroom.module.css';

export default function LanguageSwitcherShowroomPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/ui" className={styles.backLink}>
          <Icon name="arrowLeft" size={16} />
          <span>Back to UI</span>
        </Link>
        <h1 className={styles.title}>LanguageSwitcher</h1>
        <p className={styles.subtitle}>
          A button that toggles between English and Spanish locales. Displays
          the current language flag and persists the choice via cookie.
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
            The LanguageSwitcher is embedded in the TopNav. It toggles between
            English and Spanish by setting a <code>NEXT_LOCALE</code> cookie and
            triggering a router refresh.
          </p>
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
            <li>Toggles between en/es locales</li>
            <li>Shows country flag for current locale</li>
            <li>Persists preference in NEXT_LOCALE cookie</li>
            <li>Uses React transition for non-blocking refresh</li>
            <li>Disabled state during locale transition</li>
            <li>No props — self-contained component</li>
          </ul>
        </Card>
      </section>
    </div>
  );
}
