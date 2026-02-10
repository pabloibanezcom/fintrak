'use client';

import Link from 'next/link';
import { Button, Card, Icon } from '@/components/primitives';
import styles from '../showroom.module.css';

export default function ButtonShowroomPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/ui" className={styles.backLink}>
          <Icon name="arrowLeft" size={16} />
          <span>Back to UI</span>
        </Link>
        <h1 className={styles.title}>Button</h1>
        <p className={styles.subtitle}>
          Buttons trigger actions or navigation. They come in multiple variants,
          sizes, and states.
        </p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Variants</h2>
        <Card className={styles.showcase}>
          <div className={styles.row}>
            <div className={styles.item}>
              <Button variant="primary">Primary</Button>
              <span className={styles.label}>primary</span>
            </div>
            <div className={styles.item}>
              <Button variant="secondary">Secondary</Button>
              <span className={styles.label}>secondary</span>
            </div>
            <div className={styles.item}>
              <Button variant="outline">Outline</Button>
              <span className={styles.label}>outline</span>
            </div>
            <div className={styles.item}>
              <Button variant="ghost">Ghost</Button>
              <span className={styles.label}>ghost</span>
            </div>
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Sizes</h2>
        <Card className={styles.showcase}>
          <div className={styles.row}>
            <div className={styles.item}>
              <Button size="sm">Small</Button>
              <span className={styles.label}>sm</span>
            </div>
            <div className={styles.item}>
              <Button size="md">Medium</Button>
              <span className={styles.label}>md</span>
            </div>
            <div className={styles.item}>
              <Button size="lg">Large</Button>
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
              <Button disabled>Disabled</Button>
              <span className={styles.label}>disabled</span>
            </div>
            <div className={styles.item}>
              <Button isLoading>Loading</Button>
              <span className={styles.label}>isLoading</span>
            </div>
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Full Width</h2>
        <Card className={styles.showcase}>
          <Button fullWidth>Full Width Button</Button>
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
                  <code>'primary' | 'secondary' | 'outline' | 'ghost'</code>
                </td>
                <td>
                  <code>'primary'</code>
                </td>
                <td>The visual style of the button</td>
              </tr>
              <tr>
                <td>
                  <code>size</code>
                </td>
                <td>
                  <code>'sm' | 'md' | 'lg'</code>
                </td>
                <td>
                  <code>'md'</code>
                </td>
                <td>The size of the button</td>
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
                <td>Shows a loading spinner and disables the button</td>
              </tr>
              <tr>
                <td>
                  <code>fullWidth</code>
                </td>
                <td>
                  <code>boolean</code>
                </td>
                <td>
                  <code>false</code>
                </td>
                <td>Makes the button take full width of its container</td>
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
                <td>Disables the button</td>
              </tr>
            </tbody>
          </table>
        </Card>
      </section>
    </div>
  );
}
