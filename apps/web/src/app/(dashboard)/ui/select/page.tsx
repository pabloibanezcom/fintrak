'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Card, Icon, Select } from '@/components/primitives';
import styles from '../showroom.module.css';

const fruitOptions = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'mango', label: 'Mango' },
];

const currencyOptions = [
  { value: 'EUR', label: 'Euro (EUR)' },
  { value: 'USD', label: 'US Dollar (USD)' },
  { value: 'GBP', label: 'British Pound (GBP)' },
];

export default function SelectShowroomPage() {
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('banana');
  const [value3, setValue3] = useState('');

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/ui" className={styles.backLink}>
          <Icon name="arrowLeft" size={16} />
          <span>Back to UI</span>
        </Link>
        <h1 className={styles.title}>Select</h1>
        <p className={styles.subtitle}>
          A custom dropdown select component with keyboard navigation, search,
          and accessible markup. Replaces the native select element.
        </p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Default</h2>
        <Card className={styles.showcase}>
          <div style={{ maxWidth: 300 }}>
            <Select
              options={fruitOptions}
              value={value1}
              onChange={setValue1}
              placeholder="Pick a fruit..."
            />
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>With Label</h2>
        <Card className={styles.showcase}>
          <div style={{ maxWidth: 300 }}>
            <Select
              label="Currency"
              options={currencyOptions}
              value={value3}
              onChange={setValue3}
              placeholder="Select currency..."
            />
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Pre-selected Value</h2>
        <Card className={styles.showcase}>
          <div style={{ maxWidth: 300 }}>
            <Select
              label="Favorite Fruit"
              options={fruitOptions}
              value={value2}
              onChange={setValue2}
            />
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Disabled</h2>
        <Card className={styles.showcase}>
          <div style={{ maxWidth: 300 }}>
            <Select
              label="Disabled Select"
              options={fruitOptions}
              value="apple"
              onChange={() => {}}
              disabled
            />
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
                  <code>options</code>
                </td>
                <td>
                  <code>SelectOption[]</code>
                </td>
                <td>—</td>
                <td>Array of options with value and label</td>
              </tr>
              <tr>
                <td>
                  <code>value</code>
                </td>
                <td>
                  <code>string</code>
                </td>
                <td>—</td>
                <td>The currently selected value</td>
              </tr>
              <tr>
                <td>
                  <code>onChange</code>
                </td>
                <td>
                  <code>(value: string) =&gt; void</code>
                </td>
                <td>—</td>
                <td>Callback when a new option is selected</td>
              </tr>
              <tr>
                <td>
                  <code>placeholder</code>
                </td>
                <td>
                  <code>string</code>
                </td>
                <td>
                  <code>'Select...'</code>
                </td>
                <td>Placeholder text when no value is selected</td>
              </tr>
              <tr>
                <td>
                  <code>label</code>
                </td>
                <td>
                  <code>string</code>
                </td>
                <td>—</td>
                <td>Label displayed above the select</td>
              </tr>
              <tr>
                <td>
                  <code>disabled</code>
                </td>
                <td>
                  <code>boolean</code>
                </td>
                <td>
                  <code>false</code>
                </td>
                <td>Disables the select</td>
              </tr>
            </tbody>
          </table>
        </Card>
      </section>
    </div>
  );
}
