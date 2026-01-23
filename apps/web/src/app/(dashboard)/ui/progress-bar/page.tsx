'use client';

import Link from 'next/link';
import { Card, Icon, ProgressBar } from '@/components/ui';
import styles from '../showroom.module.css';

export default function ProgressBarShowroomPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/ui" className={styles.backLink}>
          <Icon name="arrowLeft" size={16} />
          <span>Back to UI</span>
        </Link>
        <h1 className={styles.title}>ProgressBar</h1>
        <p className={styles.subtitle}>
          Progress bars display the completion status of a task or process. They
          support labels, values, and semantic variants.
        </p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Basic</h2>
        <Card className={styles.showcase}>
          <div className={styles.progressStack}>
            <ProgressBar value={25} />
            <ProgressBar value={50} />
            <ProgressBar value={75} />
            <ProgressBar value={100} />
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Variants</h2>
        <Card className={styles.showcase}>
          <div className={styles.progressStack}>
            <div className={styles.progressItem}>
              <ProgressBar value={60} variant="default" label="Default" />
            </div>
            <div className={styles.progressItem}>
              <ProgressBar value={80} variant="success" label="Success" />
            </div>
            <div className={styles.progressItem}>
              <ProgressBar value={50} variant="warning" label="Warning" />
            </div>
            <div className={styles.progressItem}>
              <ProgressBar value={30} variant="error" label="Error" />
            </div>
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>With Label and Value</h2>
        <Card className={styles.showcase}>
          <div className={styles.progressStack}>
            <ProgressBar
              value={750}
              max={1000}
              label="Storage Used"
              showValue
            />
            <ProgressBar
              value={45}
              max={100}
              label="Upload Progress"
              showValue
              variant="success"
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
                  <code>value</code>
                </td>
                <td>
                  <code>number</code>
                </td>
                <td>—</td>
                <td>Current progress value (required)</td>
              </tr>
              <tr>
                <td>
                  <code>max</code>
                </td>
                <td>
                  <code>number</code>
                </td>
                <td>
                  <code>100</code>
                </td>
                <td>Maximum value for the progress</td>
              </tr>
              <tr>
                <td>
                  <code>label</code>
                </td>
                <td>
                  <code>string</code>
                </td>
                <td>—</td>
                <td>Label displayed above the progress bar</td>
              </tr>
              <tr>
                <td>
                  <code>showValue</code>
                </td>
                <td>
                  <code>boolean</code>
                </td>
                <td>
                  <code>false</code>
                </td>
                <td>Shows the current/max value</td>
              </tr>
              <tr>
                <td>
                  <code>variant</code>
                </td>
                <td>
                  <code>'default' | 'success' | 'warning' | 'error'</code>
                </td>
                <td>
                  <code>'default'</code>
                </td>
                <td>The color variant of the progress bar</td>
              </tr>
            </tbody>
          </table>
        </Card>
      </section>
    </div>
  );
}
