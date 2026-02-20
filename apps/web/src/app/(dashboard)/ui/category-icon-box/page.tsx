'use client';

import Link from 'next/link';
import { CategoryIconBox } from '@/components/data-display';
import { Card, Icon } from '@/components/primitives';
import type { Category } from '@/services';
import styles from '../showroom.module.css';

const groceryCategory: Category = {
  key: 'grocery',
  name: { en: 'Grocery', es: 'Supermercado' },
  color: '#22c55e',
  icon: 'grocery',
};

const transportCategory: Category = {
  key: 'transport',
  name: { en: 'Transport', es: 'Transporte' },
  color: '#3b82f6',
  icon: 'transport',
};

const fallbackCategory: Category = {
  key: 'misc',
  name: { en: 'Miscellaneous', es: 'Varios' },
  color: '#64748b',
  icon: 'not-an-icon',
};

export default function CategoryIconBoxShowroomPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/ui" className={styles.backLink}>
          <Icon name="arrowLeft" size={16} />
          <span>Back to UI</span>
        </Link>
        <h1 className={styles.title}>CategoryIconBox</h1>
        <p className={styles.subtitle}>
          Reusable colored icon container for category visuals, with automatic
          initials fallback when the icon is unavailable.
        </p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Sizes</h2>
        <Card className={styles.showcase}>
          <div className={styles.row}>
            <div className={styles.item}>
              <CategoryIconBox
                category={groceryCategory}
                locale="en"
                size={32}
              />
              <span className={styles.label}>32</span>
            </div>
            <div className={styles.item}>
              <CategoryIconBox
                category={groceryCategory}
                locale="en"
                size={40}
              />
              <span className={styles.label}>40</span>
            </div>
            <div className={styles.item}>
              <CategoryIconBox
                category={groceryCategory}
                locale="en"
                size={64}
              />
              <span className={styles.label}>64</span>
            </div>
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Variants</h2>
        <Card className={styles.showcase}>
          <div className={styles.row}>
            <div className={styles.item}>
              <CategoryIconBox
                category={groceryCategory}
                locale="en"
                size={48}
              />
              <span className={styles.label}>Icon category</span>
            </div>
            <div className={styles.item}>
              <CategoryIconBox
                category={transportCategory}
                locale="en"
                size={48}
              />
              <span className={styles.label}>Different color</span>
            </div>
            <div className={styles.item}>
              <CategoryIconBox
                category={fallbackCategory}
                locale="en"
                size={48}
              />
              <span className={styles.label}>Initials fallback</span>
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
                  <code>category</code>
                </td>
                <td>
                  <code>Pick&lt;Category, 'name' | 'color' | 'icon'&gt;</code>
                </td>
                <td>—</td>
                <td>Category visual metadata for icon/fallback rendering</td>
              </tr>
              <tr>
                <td>
                  <code>locale</code>
                </td>
                <td>
                  <code>'en' | 'es'</code>
                </td>
                <td>—</td>
                <td>Language used when generating initials fallback</td>
              </tr>
              <tr>
                <td>
                  <code>size</code>
                </td>
                <td>
                  <code>number</code>
                </td>
                <td>
                  <code>40</code>
                </td>
                <td>Square size in pixels for the icon box</td>
              </tr>
              <tr>
                <td>
                  <code>className</code>
                </td>
                <td>
                  <code>string</code>
                </td>
                <td>—</td>
                <td>Optional custom class for additional styling</td>
              </tr>
            </tbody>
          </table>
        </Card>
      </section>
    </div>
  );
}
