'use client';

import Link from 'next/link';
import { Card, Icon } from '@/components/primitives';
import styles from '../showroom.module.css';

export default function SyncOverlayShowroomPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/ui" className={styles.backLink}>
          <Icon name="arrowLeft" size={16} />
          <span>Back to UI</span>
        </Link>
        <h1 className={styles.title}>SyncOverlay</h1>
        <p className={styles.subtitle}>
          A full-screen loading overlay shown during data synchronization.
          Blocks interaction while syncing bank transactions.
        </p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Preview</h2>
        <Card className={styles.showcase}>
          <div
            style={{
              position: 'relative',
              height: 200,
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              background: 'var(--color-bg-secondary)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--spacing-3)',
                background: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <Icon name="loader" size={48} />
              <p style={{ fontSize: 'var(--font-size-sm)' }}>Syncing...</p>
            </div>
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
            <li>Full-screen overlay with semi-transparent backdrop</li>
            <li>Centered loader icon and syncing message</li>
            <li>Internationalized text via next-intl</li>
            <li>Shown by DashboardLayout when isSyncing is true</li>
            <li>No props — self-contained component</li>
          </ul>
        </Card>
      </section>
    </div>
  );
}
