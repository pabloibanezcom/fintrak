'use client';

import Link from 'next/link';
import { Card, Icon } from '@/components/ui';
import styles from '../showroom.module.css';
import spacingStyles from './page.module.css';

const spacingScale = [
  { name: '0', variable: '--spacing-0', value: '0' },
  { name: '1', variable: '--spacing-1', value: '0.25rem (4px)' },
  { name: '2', variable: '--spacing-2', value: '0.5rem (8px)' },
  { name: '3', variable: '--spacing-3', value: '0.75rem (12px)' },
  { name: '4', variable: '--spacing-4', value: '1rem (16px)' },
  { name: '5', variable: '--spacing-5', value: '1.25rem (20px)' },
  { name: '6', variable: '--spacing-6', value: '1.5rem (24px)' },
  { name: '8', variable: '--spacing-8', value: '2rem (32px)' },
  { name: '10', variable: '--spacing-10', value: '2.5rem (40px)' },
  { name: '12', variable: '--spacing-12', value: '3rem (48px)' },
  { name: '16', variable: '--spacing-16', value: '4rem (64px)' },
  { name: '20', variable: '--spacing-20', value: '5rem (80px)' },
  { name: '24', variable: '--spacing-24', value: '6rem (96px)' },
];

export default function SpacingShowroomPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/ui" className={styles.backLink}>
          <Icon name="arrowLeft" size={16} />
          <span>Back to UI</span>
        </Link>
        <h1 className={styles.title}>Spacing</h1>
        <p className={styles.subtitle}>
          A consistent spacing scale used for margins, padding, and gaps
          throughout the application.
        </p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Scale</h2>
        <Card className={styles.showcase}>
          <div className={spacingStyles.scaleList}>
            {spacingScale.map((space) => (
              <div key={space.name} className={spacingStyles.scaleItem}>
                <div className={spacingStyles.scaleVisual}>
                  <div
                    className={spacingStyles.scaleBar}
                    style={{ width: `var(${space.variable})` }}
                  />
                </div>
                <div className={spacingStyles.scaleInfo}>
                  <span className={spacingStyles.scaleName}>{space.name}</span>
                  <code className={spacingStyles.scaleVariable}>
                    {space.variable}
                  </code>
                  <span className={spacingStyles.scaleValue}>
                    {space.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Usage Examples</h2>
        <Card className={styles.showcase}>
          <div className={spacingStyles.examples}>
            <div className={spacingStyles.exampleItem}>
              <span className={spacingStyles.exampleLabel}>Tight spacing</span>
              <div className={spacingStyles.exampleBoxes}>
                <div
                  className={spacingStyles.box}
                  style={{ marginRight: 'var(--spacing-1)' }}
                />
                <div
                  className={spacingStyles.box}
                  style={{ marginRight: 'var(--spacing-1)' }}
                />
                <div className={spacingStyles.box} />
              </div>
              <code>gap: var(--spacing-1)</code>
            </div>
            <div className={spacingStyles.exampleItem}>
              <span className={spacingStyles.exampleLabel}>
                Default spacing
              </span>
              <div className={spacingStyles.exampleBoxes}>
                <div
                  className={spacingStyles.box}
                  style={{ marginRight: 'var(--spacing-4)' }}
                />
                <div
                  className={spacingStyles.box}
                  style={{ marginRight: 'var(--spacing-4)' }}
                />
                <div className={spacingStyles.box} />
              </div>
              <code>gap: var(--spacing-4)</code>
            </div>
            <div className={spacingStyles.exampleItem}>
              <span className={spacingStyles.exampleLabel}>Loose spacing</span>
              <div className={spacingStyles.exampleBoxes}>
                <div
                  className={spacingStyles.box}
                  style={{ marginRight: 'var(--spacing-8)' }}
                />
                <div
                  className={spacingStyles.box}
                  style={{ marginRight: 'var(--spacing-8)' }}
                />
                <div className={spacingStyles.box} />
              </div>
              <code>gap: var(--spacing-8)</code>
            </div>
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Usage</h2>
        <Card className={styles.showcase}>
          <div className={styles.examples}>
            <div className={styles.example}>
              <span className={styles.exampleLabel}>Padding:</span>
              <code>padding: var(--spacing-4);</code>
            </div>
            <div className={styles.example}>
              <span className={styles.exampleLabel}>Margin:</span>
              <code>margin-bottom: var(--spacing-6);</code>
            </div>
            <div className={styles.example}>
              <span className={styles.exampleLabel}>Gap:</span>
              <code>gap: var(--spacing-2);</code>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
