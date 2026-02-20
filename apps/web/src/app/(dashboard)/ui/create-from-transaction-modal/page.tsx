'use client';

import Link from 'next/link';
import { Card, Icon } from '@/components/primitives';
import styles from '../showroom.module.css';

export default function CreateFromTransactionModalShowroomPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/ui" className={styles.backLink}>
          <Icon name="arrowLeft" size={16} />
          <span>Back to UI</span>
        </Link>
        <h1 className={styles.title}>CreateFromTransactionModal</h1>
        <p className={styles.subtitle}>
          A modal for creating budget entries (expenses or income) from bank
          transactions. Displays transaction details and allows category/
          counterparty assignment.
        </p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Overview</h2>
        <Card className={styles.showcase}>
          <p
            style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.6,
            }}
          >
            This modal cannot be previewed in isolation as it requires API
            connectivity and a bank transaction context. It is used in the
            Banking section.
          </p>
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
            <li>
              Shows transaction details: amount, date, description, merchant
            </li>
            <li>Displays bank logo and account name when available</li>
            <li>Category selector (loaded from API)</li>
            <li>Counterparty selector with parent-child grouping</li>
            <li>Title override and description fields</li>
            <li>Dismiss toggle to skip transaction</li>
            <li>
              Adapts title to &quot;Create Expense&quot; or &quot;Create
              Income&quot;
            </li>
            <li>Form validation and error handling</li>
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
                  <code>isOpen</code>
                </td>
                <td>
                  <code>boolean</code>
                </td>
                <td>—</td>
                <td>Controls modal visibility</td>
              </tr>
              <tr>
                <td>
                  <code>onClose</code>
                </td>
                <td>
                  <code>() =&gt; void</code>
                </td>
                <td>—</td>
                <td>Callback when modal is closed</td>
              </tr>
              <tr>
                <td>
                  <code>transaction</code>
                </td>
                <td>
                  <code>BankTransaction | null</code>
                </td>
                <td>—</td>
                <td>The bank transaction to create from</td>
              </tr>
              <tr>
                <td>
                  <code>isLinked</code>
                </td>
                <td>
                  <code>boolean</code>
                </td>
                <td>
                  <code>false</code>
                </td>
                <td>Whether the transaction is already linked</td>
              </tr>
              <tr>
                <td>
                  <code>bankLogo</code>
                </td>
                <td>
                  <code>string</code>
                </td>
                <td>—</td>
                <td>Bank logo URL</td>
              </tr>
              <tr>
                <td>
                  <code>bankName</code>
                </td>
                <td>
                  <code>string</code>
                </td>
                <td>—</td>
                <td>Bank name</td>
              </tr>
              <tr>
                <td>
                  <code>accountName</code>
                </td>
                <td>
                  <code>string</code>
                </td>
                <td>—</td>
                <td>Account name</td>
              </tr>
              <tr>
                <td>
                  <code>onSuccess</code>
                </td>
                <td>
                  <code>() =&gt; void</code>
                </td>
                <td>—</td>
                <td>Callback after successful creation</td>
              </tr>
              <tr>
                <td>
                  <code>onDismissChange</code>
                </td>
                <td>
                  <code>(id: string, dismissed: boolean) =&gt; void</code>
                </td>
                <td>—</td>
                <td>Callback when dismiss state changes</td>
              </tr>
            </tbody>
          </table>
        </Card>
      </section>
    </div>
  );
}
