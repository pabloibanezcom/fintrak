'use client';

import Link from 'next/link';
import { Button, Card, Icon } from '@/components/primitives';
import { toast } from '@/utils';
import styles from '../showroom.module.css';

export default function ToasterShowroomPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/ui" className={styles.backLink}>
          <Icon name="arrowLeft" size={16} />
          <span>Back to UI</span>
        </Link>
        <h1 className={styles.title}>Toaster</h1>
        <p className={styles.subtitle}>
          Toast notification system powered by Sonner. Displays temporary
          messages in the bottom-right corner with auto-dismiss and close
          button.
        </p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Toast Types</h2>
        <Card className={styles.showcase}>
          <div className={styles.row}>
            <div className={styles.item}>
              <Button onClick={() => toast.success('Operation completed!')}>
                Success
              </Button>
              <span className={styles.label}>success</span>
            </div>
            <div className={styles.item}>
              <Button
                variant="secondary"
                onClick={() => toast.error('Something went wrong')}
              >
                Error
              </Button>
              <span className={styles.label}>error</span>
            </div>
            <div className={styles.item}>
              <Button
                variant="outline"
                onClick={() => toast('A neutral notification')}
              >
                Default
              </Button>
              <span className={styles.label}>default</span>
            </div>
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Configuration</h2>
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
            <li>Position: bottom-right</li>
            <li>Duration: 4 seconds</li>
            <li>Rich colors enabled</li>
            <li>Close button visible</li>
            <li>Uses design system font and border radius</li>
          </ul>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Usage</h2>
        <Card className={styles.showcase}>
          <p
            style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.6,
            }}
          >
            The Toaster component is mounted once in the root layout. Use the{' '}
            <code>toast</code> utility from <code>@/utils</code> to trigger
            notifications anywhere in the app.
          </p>
        </Card>
      </section>
    </div>
  );
}
