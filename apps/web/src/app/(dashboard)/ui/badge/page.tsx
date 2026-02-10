'use client';

import Link from 'next/link';
import { Badge, Card, Icon } from '@/components/primitives';
import styles from '../showroom.module.css';

export default function BadgeShowroomPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/ui" className={styles.backLink}>
          <Icon name="arrowLeft" size={16} />
          <span>Back to UI</span>
        </Link>
        <h1 className={styles.title}>Badge</h1>
        <p className={styles.subtitle}>
          Badges are used to highlight status, categories, or labels. They come
          in multiple variants and sizes.
        </p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Variants</h2>
        <Card className={styles.showcase}>
          <div className={styles.row}>
            <div className={styles.item}>
              <Badge variant="default">Default</Badge>
              <span className={styles.label}>default</span>
            </div>
            <div className={styles.item}>
              <Badge variant="primary">Primary</Badge>
              <span className={styles.label}>primary</span>
            </div>
            <div className={styles.item}>
              <Badge variant="success">Success</Badge>
              <span className={styles.label}>success</span>
            </div>
            <div className={styles.item}>
              <Badge variant="warning">Warning</Badge>
              <span className={styles.label}>warning</span>
            </div>
            <div className={styles.item}>
              <Badge variant="error">Error</Badge>
              <span className={styles.label}>error</span>
            </div>
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Sizes</h2>
        <Card className={styles.showcase}>
          <div className={styles.row}>
            <div className={styles.item}>
              <Badge size="sm">Small</Badge>
              <span className={styles.label}>sm</span>
            </div>
            <div className={styles.item}>
              <Badge size="md">Medium</Badge>
              <span className={styles.label}>md</span>
            </div>
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Usage Examples</h2>
        <Card className={styles.showcase}>
          <div className={styles.examples}>
            <div className={styles.example}>
              <span className={styles.exampleLabel}>Status indicator:</span>
              <Badge variant="success">Active</Badge>
              <Badge variant="error">Inactive</Badge>
              <Badge variant="warning">Pending</Badge>
            </div>
            <div className={styles.example}>
              <span className={styles.exampleLabel}>Categories:</span>
              <Badge variant="primary">Finance</Badge>
              <Badge variant="default">Personal</Badge>
              <Badge variant="default">Work</Badge>
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
                  <code>
                    'default' | 'success' | 'warning' | 'error' | 'primary'
                  </code>
                </td>
                <td>
                  <code>'default'</code>
                </td>
                <td>The visual style of the badge</td>
              </tr>
              <tr>
                <td>
                  <code>size</code>
                </td>
                <td>
                  <code>'sm' | 'md'</code>
                </td>
                <td>
                  <code>'sm'</code>
                </td>
                <td>The size of the badge</td>
              </tr>
              <tr>
                <td>
                  <code>children</code>
                </td>
                <td>
                  <code>ReactNode</code>
                </td>
                <td>—</td>
                <td>The content to display inside the badge</td>
              </tr>
            </tbody>
          </table>
        </Card>
      </section>
    </div>
  );
}
