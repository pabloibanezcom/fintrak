'use client';

import Link from 'next/link';
import { Card, Icon } from '@/components/primitives';
import styles from '../showroom.module.css';
import radiusStyles from './page.module.css';

const radiusScale = [
  { name: 'sm', variable: '--radius-sm', value: '0.375rem (6px)' },
  { name: 'md', variable: '--radius-md', value: '0.5rem (8px)' },
  { name: 'lg', variable: '--radius-lg', value: '0.75rem (12px)' },
  { name: 'xl', variable: '--radius-xl', value: '1rem (16px)' },
  { name: '2xl', variable: '--radius-2xl', value: '1.25rem (20px)' },
  { name: '3xl', variable: '--radius-3xl', value: '1.5rem (24px)' },
  { name: 'full', variable: '--radius-full', value: '9999px' },
];

export default function RadiusShowroomPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/ui" className={styles.backLink}>
          <Icon name="arrowLeft" size={16} />
          <span>Back to UI</span>
        </Link>
        <h1 className={styles.title}>Border Radius</h1>
        <p className={styles.subtitle}>
          Consistent border radius values for creating rounded corners across
          the design system.
        </p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Scale</h2>
        <Card className={styles.showcase}>
          <div className={radiusStyles.radiusGrid}>
            {radiusScale.map((radius) => (
              <div key={radius.variable} className={radiusStyles.radiusItem}>
                <div
                  className={radiusStyles.radiusPreview}
                  style={{ borderRadius: `var(${radius.variable})` }}
                />
                <div className={radiusStyles.radiusInfo}>
                  <span className={radiusStyles.radiusName}>{radius.name}</span>
                  <code className={radiusStyles.radiusVariable}>
                    {radius.variable}
                  </code>
                  <span className={radiusStyles.radiusValue}>
                    {radius.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Common Uses</h2>
        <Card className={styles.showcase}>
          <div className={radiusStyles.useCases}>
            <div className={radiusStyles.useCase}>
              <div
                className={radiusStyles.useCaseBox}
                style={{ borderRadius: 'var(--radius-sm)' }}
              >
                Badges
              </div>
              <code>--radius-sm</code>
            </div>
            <div className={radiusStyles.useCase}>
              <div
                className={radiusStyles.useCaseBox}
                style={{ borderRadius: 'var(--radius-lg)' }}
              >
                Buttons
              </div>
              <code>--radius-lg</code>
            </div>
            <div className={radiusStyles.useCase}>
              <div
                className={radiusStyles.useCaseBox}
                style={{ borderRadius: 'var(--radius-2xl)' }}
              >
                Cards
              </div>
              <code>--radius-2xl</code>
            </div>
            <div className={radiusStyles.useCase}>
              <div
                className={radiusStyles.useCaseBoxCircle}
                style={{ borderRadius: 'var(--radius-full)' }}
              >
                Av
              </div>
              <code>--radius-full</code>
            </div>
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Usage</h2>
        <Card className={styles.showcase}>
          <div className={styles.examples}>
            <div className={styles.example}>
              <span className={styles.exampleLabel}>Border radius:</span>
              <code>border-radius: var(--radius-lg);</code>
            </div>
            <div className={styles.example}>
              <span className={styles.exampleLabel}>Pill shape:</span>
              <code>border-radius: var(--radius-full);</code>
            </div>
            <div className={styles.example}>
              <span className={styles.exampleLabel}>Top only:</span>
              <code>border-radius: var(--radius-xl) var(--radius-xl) 0 0;</code>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
