'use client';

import Link from 'next/link';
import { Card, Icon } from '@/components/ui';
import styles from '../showroom.module.css';
import colorStyles from './page.module.css';

interface ColorSwatch {
  name: string;
  variable: string;
  value: string;
}

interface ColorGroup {
  title: string;
  colors: ColorSwatch[];
}

const colorGroups: ColorGroup[] = [
  {
    title: 'Primary',
    colors: [
      { name: '50', variable: '--color-primary-50', value: '#fff4ed' },
      { name: '100', variable: '--color-primary-100', value: '#ffe6d5' },
      { name: '200', variable: '--color-primary-200', value: '#feccab' },
      { name: '300', variable: '--color-primary-300', value: '#fda976' },
      { name: '400', variable: '--color-primary-400', value: '#fb8140' },
      { name: '500', variable: '--color-primary-500', value: '#ff6b35' },
      { name: '600', variable: '--color-primary-600', value: '#e8551c' },
      { name: '700', variable: '--color-primary-700', value: '#c24011' },
      { name: '800', variable: '--color-primary-800', value: '#9a3412' },
      { name: '900', variable: '--color-primary-900', value: '#7c2d12' },
    ],
  },
  {
    title: 'Neutral',
    colors: [
      { name: '0', variable: '--color-neutral-0', value: '#ffffff' },
      { name: '50', variable: '--color-neutral-50', value: '#f9fafb' },
      { name: '100', variable: '--color-neutral-100', value: '#f3f4f6' },
      { name: '200', variable: '--color-neutral-200', value: '#e5e7eb' },
      { name: '300', variable: '--color-neutral-300', value: '#d1d5db' },
      { name: '400', variable: '--color-neutral-400', value: '#9ca3af' },
      { name: '500', variable: '--color-neutral-500', value: '#6b7280' },
      { name: '600', variable: '--color-neutral-600', value: '#4b5563' },
      { name: '700', variable: '--color-neutral-700', value: '#374151' },
      { name: '800', variable: '--color-neutral-800', value: '#1f2937' },
      { name: '900', variable: '--color-neutral-900', value: '#111827' },
    ],
  },
  {
    title: 'Success',
    colors: [
      { name: '50', variable: '--color-success-50', value: '#ecfdf5' },
      { name: '100', variable: '--color-success-100', value: '#d1fae5' },
      { name: '500', variable: '--color-success-500', value: '#22c55e' },
      { name: '600', variable: '--color-success-600', value: '#16a34a' },
    ],
  },
  {
    title: 'Error',
    colors: [
      { name: '50', variable: '--color-error-50', value: '#fef2f2' },
      { name: '100', variable: '--color-error-100', value: '#fee2e2' },
      { name: '500', variable: '--color-error-500', value: '#ef4444' },
      { name: '600', variable: '--color-error-600', value: '#dc2626' },
    ],
  },
  {
    title: 'Warning',
    colors: [
      { name: '50', variable: '--color-warning-50', value: '#fffbeb' },
      { name: '100', variable: '--color-warning-100', value: '#fef3c7' },
      { name: '500', variable: '--color-warning-500', value: '#f59e0b' },
      { name: '600', variable: '--color-warning-600', value: '#d97706' },
    ],
  },
];

const semanticColors = [
  {
    title: 'Text',
    colors: [
      { name: 'Primary', variable: '--color-text-primary' },
      { name: 'Secondary', variable: '--color-text-secondary' },
      { name: 'Tertiary', variable: '--color-text-tertiary' },
      { name: 'Inverse', variable: '--color-text-inverse' },
    ],
  },
  {
    title: 'Background',
    colors: [
      { name: 'Body', variable: '--color-bg-body' },
      { name: 'Primary', variable: '--color-bg-primary' },
      { name: 'Secondary', variable: '--color-bg-secondary' },
      { name: 'Card', variable: '--color-bg-card' },
    ],
  },
  {
    title: 'Border',
    colors: [
      { name: 'Light', variable: '--color-border-light' },
      { name: 'Medium', variable: '--color-border-medium' },
      { name: 'Dark', variable: '--color-border-dark' },
    ],
  },
];

export default function ColorsShowroomPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/ui" className={styles.backLink}>
          <Icon name="arrowLeft" size={16} />
          <span>Back to UI</span>
        </Link>
        <h1 className={styles.title}>Colors</h1>
        <p className={styles.subtitle}>
          The color system includes primary, neutral, and semantic colors. All
          colors adapt automatically for dark mode.
        </p>
      </header>

      {colorGroups.map((group) => (
        <section key={group.title} className={styles.section}>
          <h2 className={styles.sectionTitle}>{group.title}</h2>
          <Card className={styles.showcase}>
            <div className={colorStyles.colorRow}>
              {group.colors.map((color) => (
                <div key={color.variable} className={colorStyles.colorSwatch}>
                  <div
                    className={colorStyles.swatchPreview}
                    style={{ backgroundColor: `var(${color.variable})` }}
                  />
                  <span className={colorStyles.swatchName}>{color.name}</span>
                  <span className={colorStyles.swatchValue}>{color.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </section>
      ))}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Semantic Colors</h2>
        <p className={colorStyles.semanticDescription}>
          These colors change based on the current theme (light/dark).
        </p>
        <Card className={styles.showcase}>
          <div className={colorStyles.semanticGrid}>
            {semanticColors.map((group) => (
              <div key={group.title} className={colorStyles.semanticGroup}>
                <h3 className={colorStyles.semanticTitle}>{group.title}</h3>
                <div className={colorStyles.semanticList}>
                  {group.colors.map((color) => (
                    <div
                      key={color.variable}
                      className={colorStyles.semanticItem}
                    >
                      <div
                        className={colorStyles.semanticPreview}
                        style={{ backgroundColor: `var(${color.variable})` }}
                      />
                      <div className={colorStyles.semanticInfo}>
                        <span className={colorStyles.semanticName}>
                          {color.name}
                        </span>
                        <code className={colorStyles.semanticVariable}>
                          {color.variable}
                        </code>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Usage</h2>
        <Card className={styles.showcase}>
          <div className={styles.examples}>
            <div className={styles.example}>
              <span className={styles.exampleLabel}>In CSS:</span>
              <code>color: var(--color-primary-500);</code>
            </div>
            <div className={styles.example}>
              <span className={styles.exampleLabel}>Background:</span>
              <code>background-color: var(--color-bg-card);</code>
            </div>
            <div className={styles.example}>
              <span className={styles.exampleLabel}>Border:</span>
              <code>border: 1px solid var(--color-border-light);</code>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
