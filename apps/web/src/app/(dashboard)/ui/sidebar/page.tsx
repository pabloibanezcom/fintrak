'use client';

import Link from 'next/link';
import { Card, Icon } from '@/components/primitives';
import styles from '../showroom.module.css';

export default function SidebarShowroomPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/ui" className={styles.backLink}>
          <Icon name="arrowLeft" size={16} />
          <span>Back to UI</span>
        </Link>
        <h1 className={styles.title}>Sidebar</h1>
        <p className={styles.subtitle}>
          The main navigation sidebar with icon-based ButtonGroup links.
          Highlights the active route and shows tooltips on hover.
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
            The Sidebar is always visible in the DashboardLayout. It cannot be
            previewed in isolation as it depends on routing and i18n context.
          </p>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Navigation Items</h2>
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
            <li>Overview (/overview)</li>
            <li>Budget (/budget)</li>
            <li>Banking (/banking)</li>
            <li>Investments (/investments)</li>
            <li>Reports (/reports)</li>
          </ul>
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
            <li>Vertical icon-only ButtonGroup with nav variant</li>
            <li>Active state based on current pathname</li>
            <li>Tooltips showing page names on hover</li>
            <li>Animated transitions between states</li>
            <li>Internationalized labels via next-intl</li>
            <li>No props — self-contained component</li>
          </ul>
        </Card>
      </section>
    </div>
  );
}
