'use client';

import Link from 'next/link';
import { Card, Icon } from '@/components/ui';
import styles from '../showroom.module.css';
import shadowStyles from './page.module.css';

const shadows = [
  {
    name: 'Small',
    variable: '--shadow-sm',
    description: 'Subtle elevation for small elements',
  },
  {
    name: 'Medium',
    variable: '--shadow-md',
    description: 'Default elevation for cards and containers',
  },
  {
    name: 'Large',
    variable: '--shadow-lg',
    description: 'Higher elevation for dropdowns and popovers',
  },
  {
    name: 'Extra Large',
    variable: '--shadow-xl',
    description: 'Maximum elevation for modals and dialogs',
  },
  {
    name: 'Card',
    variable: '--shadow-card',
    description: 'Optimized shadow specifically for card components',
  },
];

export default function ShadowsShowroomPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/ui" className={styles.backLink}>
          <Icon name="arrowLeft" size={16} />
          <span>Back to UI</span>
        </Link>
        <h1 className={styles.title}>Shadows</h1>
        <p className={styles.subtitle}>
          Elevation shadows create depth and hierarchy. They automatically adapt
          for dark mode with increased opacity.
        </p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Shadow Scale</h2>
        <Card className={styles.showcase}>
          <div className={shadowStyles.shadowGrid}>
            {shadows.map((shadow) => (
              <div key={shadow.variable} className={shadowStyles.shadowItem}>
                <div
                  className={shadowStyles.shadowPreview}
                  style={{ boxShadow: `var(${shadow.variable})` }}
                />
                <div className={shadowStyles.shadowInfo}>
                  <span className={shadowStyles.shadowName}>{shadow.name}</span>
                  <code className={shadowStyles.shadowVariable}>
                    {shadow.variable}
                  </code>
                  <span className={shadowStyles.shadowDescription}>
                    {shadow.description}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Comparison</h2>
        <Card className={styles.showcase}>
          <div className={shadowStyles.comparison}>
            <div
              className={shadowStyles.comparisonBox}
              style={{ boxShadow: 'var(--shadow-sm)' }}
            >
              sm
            </div>
            <div
              className={shadowStyles.comparisonBox}
              style={{ boxShadow: 'var(--shadow-md)' }}
            >
              md
            </div>
            <div
              className={shadowStyles.comparisonBox}
              style={{ boxShadow: 'var(--shadow-lg)' }}
            >
              lg
            </div>
            <div
              className={shadowStyles.comparisonBox}
              style={{ boxShadow: 'var(--shadow-xl)' }}
            >
              xl
            </div>
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Usage</h2>
        <Card className={styles.showcase}>
          <div className={styles.examples}>
            <div className={styles.example}>
              <span className={styles.exampleLabel}>Box shadow:</span>
              <code>box-shadow: var(--shadow-md);</code>
            </div>
            <div className={styles.example}>
              <span className={styles.exampleLabel}>Card:</span>
              <code>box-shadow: var(--shadow-card);</code>
            </div>
            <div className={styles.example}>
              <span className={styles.exampleLabel}>Hover effect:</span>
              <code>box-shadow: var(--shadow-lg);</code>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
