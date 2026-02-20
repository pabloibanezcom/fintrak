'use client';

import Link from 'next/link';
import { Card, Icon } from '@/components/primitives';
import styles from '../showroom.module.css';

export default function TopNavShowroomPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/ui" className={styles.backLink}>
          <Icon name="arrowLeft" size={16} />
          <span>Back to UI</span>
        </Link>
        <h1 className={styles.title}>TopNav</h1>
        <p className={styles.subtitle}>
          The top navigation bar with brand, page tabs, action buttons, and a
          user menu dropdown.
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
            The TopNav is always visible in the DashboardLayout. It cannot be
            previewed in isolation as it depends on authentication, routing,
            i18n, and theme contexts.
          </p>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Sections</h2>
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
            <li>
              <strong>Brand:</strong> Fintrak logo and name
            </li>
            <li>
              <strong>Tabs:</strong> Overview, Budget, Banking, Investments,
              Reports
            </li>
            <li>
              <strong>Actions:</strong> Search, Sync, Notifications, Theme
              toggle, Language toggle
            </li>
            <li>
              <strong>User menu:</strong> Avatar, name, email, settings link,
              sign out
            </li>
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
            <li>Expandable search bar</li>
            <li>Animated tab navigation with active state</li>
            <li>Sync button triggers bank transaction sync</li>
            <li>Theme toggle (dark/light)</li>
            <li>Language toggle (en/es) with flag icons</li>
            <li>User dropdown with DropdownMenu component</li>
            <li>All labels internationalized via next-intl</li>
            <li>No props — self-contained component</li>
          </ul>
        </Card>
      </section>
    </div>
  );
}
