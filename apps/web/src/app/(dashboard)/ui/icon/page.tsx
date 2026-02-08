'use client';

import Link from 'next/link';
import { Card, Icon } from '@/components/ui';
import styles from '../showroom.module.css';

const iconNames = [
  'arrowDown',
  'arrowLeft',
  'arrowRight',
  'arrowUp',
  'banking',
  'bitcoin',
  'budget',
  'calendar',
  'chartLine',
  'check',
  'chevronDown',
  'close',
  'eye',
  'eyeOff',
  'google',
  'investments',
  'layers',
  'loader',
  'logo',
  'moon',
  'notifications',
  'overview',
  'reports',
  'search',
  'settings',
  'signOut',
  'spinner',
  'sun',
  'sync',
  'transfer',
  'shopping',
  'entertainment',
  'mortgage',
  'tax',
  'payroll',
  'other',
  'health',
  'insurance',
  'utilities',
  'grocery',
  'transport',
];

export default function IconShowroomPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/ui" className={styles.backLink}>
          <Icon name="arrowLeft" size={16} />
          <span>Back to UI</span>
        </Link>
        <h1 className={styles.title}>Icon</h1>
        <p className={styles.subtitle}>
          Icons are SVG-based components for visual communication. They support
          custom sizes and accessibility attributes.
        </p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Available Icons</h2>
        <Card className={styles.showcase}>
          <div className={styles.iconGrid}>
            {iconNames.map((name) => (
              <div key={name} className={styles.iconItem}>
                <Icon name={name} size={24} />
                <span className={styles.label}>{name}</span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Sizes</h2>
        <Card className={styles.showcase}>
          <div className={styles.row}>
            <div className={styles.item}>
              <Icon name="settings" size={16} />
              <span className={styles.label}>16px</span>
            </div>
            <div className={styles.item}>
              <Icon name="settings" size={20} />
              <span className={styles.label}>20px</span>
            </div>
            <div className={styles.item}>
              <Icon name="settings" size={24} />
              <span className={styles.label}>24px</span>
            </div>
            <div className={styles.item}>
              <Icon name="settings" size={32} />
              <span className={styles.label}>32px</span>
            </div>
            <div className={styles.item}>
              <Icon name="settings" size={48} />
              <span className={styles.label}>48px</span>
            </div>
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Usage</h2>
        <Card className={styles.showcase}>
          <div className={styles.examples}>
            <div className={styles.example}>
              <span className={styles.exampleLabel}>Basic:</span>
              <code>{'<Icon name="settings" />'}</code>
            </div>
            <div className={styles.example}>
              <span className={styles.exampleLabel}>With size:</span>
              <code>{'<Icon name="settings" size={24} />'}</code>
            </div>
            <div className={styles.example}>
              <span className={styles.exampleLabel}>Accessible:</span>
              <code>{'<Icon name="settings" aria-label="Settings" />'}</code>
            </div>
          </div>
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
                  <code>name</code>
                </td>
                <td>
                  <code>string</code>
                </td>
                <td>—</td>
                <td>Name of the icon to render (required)</td>
              </tr>
              <tr>
                <td>
                  <code>size</code>
                </td>
                <td>
                  <code>number</code>
                </td>
                <td>
                  <code>20</code>
                </td>
                <td>Width and height in pixels</td>
              </tr>
              <tr>
                <td>
                  <code>className</code>
                </td>
                <td>
                  <code>string</code>
                </td>
                <td>—</td>
                <td>Additional CSS class for styling</td>
              </tr>
              <tr>
                <td>
                  <code>aria-label</code>
                </td>
                <td>
                  <code>string</code>
                </td>
                <td>—</td>
                <td>Accessible label (makes icon visible to screen readers)</td>
              </tr>
            </tbody>
          </table>
        </Card>
      </section>
    </div>
  );
}
