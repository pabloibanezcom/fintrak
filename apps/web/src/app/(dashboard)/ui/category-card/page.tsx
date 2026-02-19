'use client';

import Link from 'next/link';
import { CategoryCard } from '@/components/data-display';
import { Card, Icon } from '@/components/primitives';
import type { Category } from '@/services';
import styles from '../showroom.module.css';

const sampleCategories: Category[] = [
  {
    key: 'grocery',
    name: { en: 'Grocery', es: 'Supermercado' },
    color: '#22c55e',
    icon: 'grocery',
  },
  {
    key: 'transport',
    name: { en: 'Transport', es: 'Transporte' },
    color: '#3b82f6',
    icon: 'transport',
  },
  {
    key: 'unknown',
    name: { en: 'Miscellaneous', es: 'Varios' },
    color: '#64748b',
    icon: 'not-an-icon',
  },
];

export default function CategoryCardShowroomPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/ui" className={styles.backLink}>
          <Icon name="arrowLeft" size={16} />
          <span>Back to UI</span>
        </Link>
        <h1 className={styles.title}>CategoryCard</h1>
        <p className={styles.subtitle}>
          Compact category row with icon, localized label, and link to category
          details.
        </p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Default</h2>
        <Card className={styles.showcase}>
          <div className="grid-auto">
            {sampleCategories.map((category) => (
              <CategoryCard key={category.key} category={category} locale="en" />
            ))}
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
                  <code>category</code>
                </td>
                <td>
                  <code>Category</code>
                </td>
                <td>—</td>
                <td>Category data (key, name, color, icon)</td>
              </tr>
              <tr>
                <td>
                  <code>locale</code>
                </td>
                <td>
                  <code>'en' | 'es'</code>
                </td>
                <td>—</td>
                <td>Language key used to resolve category name</td>
              </tr>
              <tr>
                <td>
                  <code>href</code>
                </td>
                <td>
                  <code>string</code>
                </td>
                <td>
                  <code>/budget/categories/{'{category.key}'}</code>
                </td>
                <td>Destination URL when clicking the card content</td>
              </tr>
            </tbody>
          </table>
        </Card>
      </section>
    </div>
  );
}
