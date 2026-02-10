'use client';

import Link from 'next/link';
import { WalletCard } from '@/components/data-display';
import { Card, Icon } from '@/components/primitives';
import styles from '../showroom.module.css';

export default function WalletCardShowroomPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/ui" className={styles.backLink}>
          <Icon name="arrowLeft" size={16} />
          <span>Back to UI</span>
        </Link>
        <h1 className={styles.title}>WalletCard</h1>
        <p className={styles.subtitle}>
          Displays a currency wallet with a flag icon, balance, and optional
          label. Supports an active state indicator.
        </p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Currencies</h2>
        <Card className={styles.showcase}>
          <div className={styles.row}>
            <div className={styles.item}>
              <WalletCard currency="EUR" balance={12450.75} label="Primary" />
              <span className={styles.label}>EUR</span>
            </div>
            <div className={styles.item}>
              <WalletCard currency="USD" balance={5200.0} label="Travel" />
              <span className={styles.label}>USD</span>
            </div>
            <div className={styles.item}>
              <WalletCard currency="GBP" balance={3100.5} />
              <span className={styles.label}>GBP</span>
            </div>
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Active State</h2>
        <Card className={styles.showcase}>
          <div className={styles.row}>
            <div className={styles.item}>
              <WalletCard
                currency="EUR"
                balance={12450.75}
                label="Main Wallet"
                isActive
              />
              <span className={styles.label}>active</span>
            </div>
            <div className={styles.item}>
              <WalletCard currency="USD" balance={5200.0} />
              <span className={styles.label}>inactive</span>
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
                  <code>currency</code>
                </td>
                <td>
                  <code>string</code>
                </td>
                <td>—</td>
                <td>Currency code (EUR, USD, GBP)</td>
              </tr>
              <tr>
                <td>
                  <code>balance</code>
                </td>
                <td>
                  <code>number</code>
                </td>
                <td>—</td>
                <td>Wallet balance</td>
              </tr>
              <tr>
                <td>
                  <code>label</code>
                </td>
                <td>
                  <code>string</code>
                </td>
                <td>—</td>
                <td>Optional label below the balance</td>
              </tr>
              <tr>
                <td>
                  <code>isActive</code>
                </td>
                <td>
                  <code>boolean</code>
                </td>
                <td>
                  <code>false</code>
                </td>
                <td>Shows an &quot;Active&quot; badge</td>
              </tr>
            </tbody>
          </table>
        </Card>
      </section>
    </div>
  );
}
