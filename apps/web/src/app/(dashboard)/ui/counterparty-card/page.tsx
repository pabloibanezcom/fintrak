'use client';

import Link from 'next/link';
import { CounterpartyCard } from '@/components/data-display';
import { Card, Icon } from '@/components/primitives';
import type { Category, Counterparty } from '@/services';
import styles from '../showroom.module.css';

const shoppingCategory: Category = {
  key: 'shopping',
  name: { en: 'Shopping', es: 'Compras' },
  color: '#f97316',
  icon: 'shopping',
};

const sampleCounterparties: Counterparty[] = [
  {
    key: 'amazon',
    name: 'Amazon',
    type: 'company',
    logo: '',
    defaultCategory: shoppingCategory,
  },
  {
    key: 'landlord-jane',
    name: 'Jane Doe',
    type: 'person',
  },
  {
    key: 'water-utility',
    name: 'City Water Utility',
    type: 'institution',
  },
];

export default function CounterpartyCardShowroomPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/ui" className={styles.backLink}>
          <Icon name="arrowLeft" size={16} />
          <span>Back to UI</span>
        </Link>
        <h1 className={styles.title}>CounterpartyCard</h1>
        <p className={styles.subtitle}>
          Compact counterparty card with avatar, optional default category, and
          navigation to counterparty details.
        </p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Default</h2>
        <Card className={styles.showcase}>
          <div className="grid-auto">
            <CounterpartyCard counterparty={sampleCounterparties[0]} />
            <CounterpartyCard counterparty={sampleCounterparties[1]} />
            <CounterpartyCard counterparty={sampleCounterparties[2]} />
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
                  <code>counterparty</code>
                </td>
                <td>
                  <code>Counterparty</code>
                </td>
                <td>—</td>
                <td>Counterparty data (name, logo, type, etc.)</td>
              </tr>
              <tr>
                <td>
                  <code>href</code>
                </td>
                <td>
                  <code>string</code>
                </td>
                <td>
                  <code>/budget/counterparties/{'{counterparty.key}'}</code>
                </td>
                <td>Navigation target when clicking the card content</td>
              </tr>
              <tr>
                <td>
                  <code>locale</code>
                </td>
                <td>
                  <code>'en' | 'es'</code>
                </td>
                <td>
                  <code>'en'</code>
                </td>
                <td>Locale for category label display</td>
              </tr>
              <tr>
                <td>
                  <code>defaultCategory</code>
                </td>
                <td>
                  <code>Category</code>
                </td>
                <td>—</td>
                <td>
                  Optional category reference rendered as colored dot + category
                  name
                </td>
              </tr>
            </tbody>
          </table>
        </Card>
      </section>
    </div>
  );
}
