'use client';

import Link from 'next/link';
import {
  BankAccountCard,
  type BankAccountItem,
} from '@/components/data-display';
import { Card, Icon } from '@/components/primitives';
import styles from '../showroom.module.css';

const sampleAccounts: BankAccountItem[] = [
  {
    id: '1',
    bankName: 'Santander',
    bankLogo: '/images/banks/santander.png',
    accountName: 'Main Account',
    balance: 12450.75,
    currency: 'EUR',
    iban: 'ES9121000418450200051332',
  },
  {
    id: '2',
    bankName: 'BBVA',
    bankLogo: '/images/banks/bbva.png',
    accountName: 'Savings Account',
    balance: 8320.0,
    currency: 'EUR',
    iban: 'ES7921000813610123456789',
  },
  {
    id: '3',
    bankName: 'CaixaBank',
    bankLogo: '/images/banks/caixabank.png',
    accountName: 'Business Account',
    balance: 25680.5,
    currency: 'EUR',
  },
];

const singleAccount: BankAccountItem[] = [
  {
    id: '1',
    bankName: 'ING Direct',
    accountName: 'Orange Account',
    balance: 5420.25,
    currency: 'EUR',
    iban: 'ES8000490001512110000001',
  },
];

export default function BankAccountCardShowroomPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/ui" className={styles.backLink}>
          <Icon name="arrowLeft" size={16} />
          <span>Back to UI</span>
        </Link>
        <h1 className={styles.title}>BankAccountCard</h1>
        <p className={styles.subtitle}>
          Displays a list of bank accounts with balances, logos, and account
          details.
        </p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Vertical Layout (Default)</h2>
        <Card className={styles.showcase}>
          <div style={{ maxWidth: '480px' }}>
            <BankAccountCard accounts={sampleAccounts} />
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Horizontal Layout</h2>
        <Card className={styles.showcase}>
          <div style={{ maxWidth: '600px' }}>
            <BankAccountCard
              accounts={sampleAccounts}
              layout="horizontal"
              title="My Accounts"
            />
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Horizontal Compact</h2>
        <Card className={styles.showcase}>
          <div style={{ maxWidth: '600px' }}>
            <BankAccountCard accounts={sampleAccounts} layout="horizontal" />
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Single Account (No Logo)</h2>
        <Card className={styles.showcase}>
          <div style={{ maxWidth: '480px' }}>
            <BankAccountCard accounts={singleAccount} title="My Bank Account" />
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Loading State</h2>
        <Card className={styles.showcase}>
          <div style={{ maxWidth: '480px' }}>
            <BankAccountCard accounts={[]} isLoading={true} />
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Empty State</h2>
        <Card className={styles.showcase}>
          <div style={{ maxWidth: '480px' }}>
            <BankAccountCard
              accounts={[]}
              emptyMessage="Connect a bank to see your accounts here"
            />
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>With Click Handler</h2>
        <Card className={styles.showcase}>
          <div style={{ maxWidth: '480px' }}>
            <BankAccountCard
              accounts={sampleAccounts}
              onAccountClick={(account) =>
                alert(`Clicked on ${account.accountName}`)
              }
            />
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
            <li>Displays bank logo with fallback to first letter</li>
            <li>Shows total balance across all accounts</li>
            <li>Supports optional IBAN display with formatting</li>
            <li>Vertical or horizontal layout options</li>
            <li>Optional header with title and total balance</li>
            <li>Loading state with skeleton animation</li>
            <li>Empty state with customizable message</li>
            <li>Optional click handler for account selection</li>
            <li>Responsive layout for mobile devices</li>
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
                  <code>accounts</code>
                </td>
                <td>
                  <code>BankAccountItem[]</code>
                </td>
                <td>—</td>
                <td>Array of bank account objects to display</td>
              </tr>
              <tr>
                <td>
                  <code>title</code>
                </td>
                <td>
                  <code>string</code>
                </td>
                <td>&quot;Bank Accounts&quot;</td>
                <td>Header title</td>
              </tr>
              <tr>
                <td>
                  <code>isLoading</code>
                </td>
                <td>
                  <code>boolean</code>
                </td>
                <td>false</td>
                <td>Shows loading skeleton when true</td>
              </tr>
              <tr>
                <td>
                  <code>emptyMessage</code>
                </td>
                <td>
                  <code>string</code>
                </td>
                <td>&quot;No bank accounts connected&quot;</td>
                <td>Message shown when accounts array is empty</td>
              </tr>
              <tr>
                <td>
                  <code>onAccountClick</code>
                </td>
                <td>
                  <code>(account: BankAccountItem) =&gt; void</code>
                </td>
                <td>—</td>
                <td>Callback when an account is clicked</td>
              </tr>
              <tr>
                <td>
                  <code>layout</code>
                </td>
                <td>
                  <code>
                    &quot;vertical&quot; | &quot;horizontal&quot; |
                    &quot;grid&quot;
                  </code>
                </td>
                <td>&quot;vertical&quot;</td>
                <td>Layout direction for account cards</td>
              </tr>
            </tbody>
          </table>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>BankAccountItem Interface</h2>
        <Card className={styles.propsCard}>
          <table className={styles.propsTable}>
            <thead>
              <tr>
                <th>Property</th>
                <th>Type</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>id</code>
                </td>
                <td>
                  <code>string</code>
                </td>
                <td>Unique identifier for the account</td>
              </tr>
              <tr>
                <td>
                  <code>bankName</code>
                </td>
                <td>
                  <code>string</code>
                </td>
                <td>Name of the bank</td>
              </tr>
              <tr>
                <td>
                  <code>bankLogo</code>
                </td>
                <td>
                  <code>string?</code>
                </td>
                <td>URL to the bank&apos;s logo image</td>
              </tr>
              <tr>
                <td>
                  <code>accountName</code>
                </td>
                <td>
                  <code>string</code>
                </td>
                <td>Display name for the account</td>
              </tr>
              <tr>
                <td>
                  <code>balance</code>
                </td>
                <td>
                  <code>number</code>
                </td>
                <td>Current account balance</td>
              </tr>
              <tr>
                <td>
                  <code>currency</code>
                </td>
                <td>
                  <code>string</code>
                </td>
                <td>Currency code (e.g., EUR, USD)</td>
              </tr>
              <tr>
                <td>
                  <code>iban</code>
                </td>
                <td>
                  <code>string?</code>
                </td>
                <td>IBAN number (displayed formatted)</td>
              </tr>
            </tbody>
          </table>
        </Card>
      </section>
    </div>
  );
}
