'use client';

import Link from 'next/link';
import { Card, Icon } from '@/components/primitives';
import styles from '../showroom.module.css';

export default function CreateCounterpartyModalShowroomPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/ui" className={styles.backLink}>
          <Icon name="arrowLeft" size={16} />
          <span>Back to UI</span>
        </Link>
        <h1 className={styles.title}>CreateCounterpartyModal</h1>
        <p className={styles.subtitle}>
          A modal form for creating or editing counterparties (payees/sources).
          Includes fields for contact info, type selection, and default category
          assignment.
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
            connectivity to manage counterparties. It is used in the Budget
            section.
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
            <li>Create new or edit existing counterparties</li>
            <li>Type selector: Company, Person, Institution, Other</li>
            <li>Contact fields: email, phone, address</li>
            <li>Default category assignment from loaded categories</li>
            <li>Notes field for additional info</li>
            <li>Form validation and error handling</li>
            <li>Loading state during submission</li>
            <li>Toast notifications on success</li>
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
                  <code>counterparty</code>
                </td>
                <td>
                  <code>Counterparty | null</code>
                </td>
                <td>—</td>
                <td>Existing counterparty to edit (null for create mode)</td>
              </tr>
              <tr>
                <td>
                  <code>onSuccess</code>
                </td>
                <td>
                  <code>() =&gt; void</code>
                </td>
                <td>—</td>
                <td>Callback after successful create/update</td>
              </tr>
            </tbody>
          </table>
        </Card>
      </section>
    </div>
  );
}
