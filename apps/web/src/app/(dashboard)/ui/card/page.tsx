'use client';

import Link from 'next/link';
import { Card, Icon } from '@/components/ui';
import styles from '../showroom.module.css';

export default function CardShowroomPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/ui" className={styles.backLink}>
          <Icon name="arrowLeft" size={16} />
          <span>Back to UI</span>
        </Link>
        <h1 className={styles.title}>Card</h1>
        <p className={styles.subtitle}>
          Cards are containers that group related content. They support multiple
          variants and padding options.
        </p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Variants</h2>
        <Card className={styles.showcase}>
          <div className={styles.row}>
            <div className={styles.item}>
              <Card variant="default" style={{ width: 200 }}>
                <p>Default card with shadow</p>
              </Card>
              <span className={styles.label}>default</span>
            </div>
            <div className={styles.item}>
              <Card variant="elevated" style={{ width: 200 }}>
                <p>Elevated card with larger shadow</p>
              </Card>
              <span className={styles.label}>elevated</span>
            </div>
            <div className={styles.item}>
              <Card variant="outlined" style={{ width: 200 }}>
                <p>Outlined card with border</p>
              </Card>
              <span className={styles.label}>outlined</span>
            </div>
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Padding</h2>
        <Card className={styles.showcase}>
          <div className={styles.row}>
            <div className={styles.item}>
              <Card padding="none" variant="outlined" style={{ width: 150 }}>
                <div style={{ background: 'var(--color-primary-100)' }}>
                  No padding
                </div>
              </Card>
              <span className={styles.label}>none</span>
            </div>
            <div className={styles.item}>
              <Card padding="sm" variant="outlined" style={{ width: 150 }}>
                <p>Small padding</p>
              </Card>
              <span className={styles.label}>sm</span>
            </div>
            <div className={styles.item}>
              <Card padding="md" variant="outlined" style={{ width: 150 }}>
                <p>Medium padding</p>
              </Card>
              <span className={styles.label}>md</span>
            </div>
            <div className={styles.item}>
              <Card padding="lg" variant="outlined" style={{ width: 150 }}>
                <p>Large padding</p>
              </Card>
              <span className={styles.label}>lg</span>
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
                  <code>variant</code>
                </td>
                <td>
                  <code>'default' | 'elevated' | 'outlined'</code>
                </td>
                <td>
                  <code>'default'</code>
                </td>
                <td>The visual style of the card</td>
              </tr>
              <tr>
                <td>
                  <code>padding</code>
                </td>
                <td>
                  <code>'none' | 'sm' | 'md' | 'lg'</code>
                </td>
                <td>
                  <code>'md'</code>
                </td>
                <td>The internal padding of the card</td>
              </tr>
              <tr>
                <td>
                  <code>children</code>
                </td>
                <td>
                  <code>ReactNode</code>
                </td>
                <td>—</td>
                <td>The content inside the card</td>
              </tr>
            </tbody>
          </table>
        </Card>
      </section>
    </div>
  );
}
