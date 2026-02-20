'use client';

import type { InvestmentSummary } from '@fintrak/types';
import Link from 'next/link';
import { InvestmentCard } from '@/components/data-display';
import { Card, Icon } from '@/components/primitives';
import styles from '../showroom.module.css';

const sampleFunds: InvestmentSummary[] = [
  {
    isin: 'ES0152743003',
    investmentName: 'Caixabank Bolsa USA',
    initialInvestment: 5000,
    marketValue: 5850,
    profit: 850,
  } as InvestmentSummary,
  {
    isin: 'ES0113211835',
    investmentName: 'BBVA Megatendencia',
    initialInvestment: 3000,
    marketValue: 2780,
    profit: -220,
  } as InvestmentSummary,
];

const sampleEtcs: InvestmentSummary[] = [
  {
    isin: 'DE000A1E0HR8',
    investmentName: 'Xetra-Gold ETC',
    initialInvestment: 2000,
    marketValue: 2400,
    profit: 400,
  } as InvestmentSummary,
];

export default function InvestmentCardShowroomPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/ui" className={styles.backLink}>
          <Icon name="arrowLeft" size={16} />
          <span>Back to UI</span>
        </Link>
        <h1 className={styles.title}>InvestmentCard</h1>
        <p className={styles.subtitle}>
          Displays an investment portfolio overview grouped by type (Funds,
          ETCs, Crypto) with totals, profit/loss indicators, and a visibility
          toggle.
        </p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>With Funds and ETCs</h2>
        <Card className={styles.showcase}>
          <div style={{ maxWidth: 480 }}>
            <InvestmentCard funds={sampleFunds} etcs={sampleEtcs} />
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Loading State</h2>
        <Card className={styles.showcase}>
          <div style={{ maxWidth: 480 }}>
            <InvestmentCard isLoading />
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Empty State</h2>
        <Card className={styles.showcase}>
          <div style={{ maxWidth: 480 }}>
            <InvestmentCard emptyMessage="No investments yet. Start investing today!" />
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Features</h2>
        <Card className={styles.showcase}>
          <ul
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-2)',
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-secondary)',
              paddingLeft: 'var(--spacing-4)',
            }}
          >
            <li>Groups investments by type: Funds, ETCs, Crypto</li>
            <li>Shows total portfolio value and profit/loss</li>
            <li>Eye toggle to show/hide amounts (persisted in localStorage)</li>
            <li>Color-coded profit: green for gains, red for losses</li>
            <li>Loading skeleton state</li>
            <li>Customizable empty state message</li>
            <li>Optional click handler per item</li>
          </ul>
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
                  <code>funds</code>
                </td>
                <td>
                  <code>InvestmentSummary[]</code>
                </td>
                <td>
                  <code>[]</code>
                </td>
                <td>Array of fund investments</td>
              </tr>
              <tr>
                <td>
                  <code>etcs</code>
                </td>
                <td>
                  <code>InvestmentSummary[]</code>
                </td>
                <td>
                  <code>[]</code>
                </td>
                <td>Array of ETC investments</td>
              </tr>
              <tr>
                <td>
                  <code>cryptoAssets</code>
                </td>
                <td>
                  <code>CryptoAsset[]</code>
                </td>
                <td>
                  <code>[]</code>
                </td>
                <td>Array of cryptocurrency assets</td>
              </tr>
              <tr>
                <td>
                  <code>totalValue</code>
                </td>
                <td>
                  <code>number</code>
                </td>
                <td>auto-calculated</td>
                <td>Override total portfolio value</td>
              </tr>
              <tr>
                <td>
                  <code>isLoading</code>
                </td>
                <td>
                  <code>boolean</code>
                </td>
                <td>
                  <code>false</code>
                </td>
                <td>Shows loading skeleton</td>
              </tr>
              <tr>
                <td>
                  <code>emptyMessage</code>
                </td>
                <td>
                  <code>string</code>
                </td>
                <td>&quot;No investments found&quot;</td>
                <td>Message shown when no investments exist</td>
              </tr>
              <tr>
                <td>
                  <code>onItemClick</code>
                </td>
                <td>
                  <code>(item: InvestmentItem) =&gt; void</code>
                </td>
                <td>—</td>
                <td>Callback when an investment item is clicked</td>
              </tr>
              <tr>
                <td>
                  <code>defaultVisible</code>
                </td>
                <td>
                  <code>boolean</code>
                </td>
                <td>
                  <code>true</code>
                </td>
                <td>Initial visibility state for amounts</td>
              </tr>
            </tbody>
          </table>
        </Card>
      </section>
    </div>
  );
}
