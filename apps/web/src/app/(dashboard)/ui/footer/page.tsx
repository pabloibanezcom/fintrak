'use client';

import Link from 'next/link';
import { Footer } from '@/components/layout';
import { Card, Icon } from '@/components/primitives';
import styles from '../showroom.module.css';

export default function FooterShowroomPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/ui" className={styles.backLink}>
          <Icon name="arrowLeft" size={16} />
          <span>Back to UI</span>
        </Link>
        <h1 className={styles.title}>Footer</h1>
        <p className={styles.subtitle}>
          The application footer with a link to the Design System and a
          copyright notice with the developer&apos;s attribution.
        </p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Preview</h2>
        <Card className={styles.showcase}>
          <Footer />
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
            <li>Link to the Design System (/ui)</li>
            <li>Dynamic copyright year</li>
            <li>Developer attribution link</li>
            <li>No props — self-contained component</li>
          </ul>
        </Card>
      </section>
    </div>
  );
}
