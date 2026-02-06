'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Card, Icon, Toggle } from '@/components/ui';
import styles from '../showroom.module.css';

export default function ToggleShowroomPage() {
  const [checked, setChecked] = useState(false);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/ui" className={styles.backLink}>
          <Icon name="arrowLeft" size={16} />
          <span>Back to UI</span>
        </Link>
        <h1 className={styles.title}>Toggle</h1>
        <p className={styles.subtitle}>
          Toggle switches allow users to turn a setting on or off. They provide
          immediate visual feedback and are ideal for binary choices.
        </p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Sizes</h2>
        <Card className={styles.showcase}>
          <div className={styles.row}>
            <div className={styles.item}>
              <Toggle size="sm" label="Small" />
              <span className={styles.label}>sm</span>
            </div>
            <div className={styles.item}>
              <Toggle size="md" label="Medium" />
              <span className={styles.label}>md</span>
            </div>
            <div className={styles.item}>
              <Toggle size="lg" label="Large" />
              <span className={styles.label}>lg</span>
            </div>
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>States</h2>
        <Card className={styles.showcase}>
          <div className={styles.row}>
            <div className={styles.item}>
              <Toggle label="Unchecked" />
              <span className={styles.label}>unchecked</span>
            </div>
            <div className={styles.item}>
              <Toggle label="Checked" defaultChecked />
              <span className={styles.label}>checked</span>
            </div>
            <div className={styles.item}>
              <Toggle label="Disabled" disabled />
              <span className={styles.label}>disabled</span>
            </div>
            <div className={styles.item}>
              <Toggle label="Disabled checked" disabled defaultChecked />
              <span className={styles.label}>disabled + checked</span>
            </div>
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Without Label</h2>
        <Card className={styles.showcase}>
          <div className={styles.row}>
            <div className={styles.item}>
              <Toggle size="sm" />
              <span className={styles.label}>sm</span>
            </div>
            <div className={styles.item}>
              <Toggle size="md" />
              <span className={styles.label}>md</span>
            </div>
            <div className={styles.item}>
              <Toggle size="lg" />
              <span className={styles.label}>lg</span>
            </div>
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Controlled</h2>
        <Card className={styles.showcase}>
          <div className={styles.row}>
            <div className={styles.item}>
              <Toggle
                label={checked ? 'On' : 'Off'}
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
              />
              <span className={styles.label}>
                controlled: {checked ? 'true' : 'false'}
              </span>
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
                  <code>label</code>
                </td>
                <td>
                  <code>string</code>
                </td>
                <td>—</td>
                <td>Text label displayed next to the toggle</td>
              </tr>
              <tr>
                <td>
                  <code>size</code>
                </td>
                <td>
                  <code>{"'sm' | 'md' | 'lg'"}</code>
                </td>
                <td>
                  <code>{"'md'"}</code>
                </td>
                <td>The size of the toggle switch</td>
              </tr>
              <tr>
                <td>
                  <code>checked</code>
                </td>
                <td>
                  <code>boolean</code>
                </td>
                <td>—</td>
                <td>Controlled checked state</td>
              </tr>
              <tr>
                <td>
                  <code>defaultChecked</code>
                </td>
                <td>
                  <code>boolean</code>
                </td>
                <td>
                  <code>false</code>
                </td>
                <td>Initial checked state for uncontrolled usage</td>
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
                <td>Whether the toggle is disabled</td>
              </tr>
              <tr>
                <td>
                  <code>onChange</code>
                </td>
                <td>
                  <code>{'ChangeEventHandler<HTMLInputElement>'}</code>
                </td>
                <td>—</td>
                <td>Callback when the toggle state changes</td>
              </tr>
            </tbody>
          </table>
        </Card>
      </section>
    </div>
  );
}
