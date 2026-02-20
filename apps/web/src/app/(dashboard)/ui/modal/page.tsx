'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Modal } from '@/components/modals';
import { Button, Card, Icon } from '@/components/primitives';
import styles from '../showroom.module.css';

export default function ModalShowroomPage() {
  const [smallOpen, setSmallOpen] = useState(false);
  const [mediumOpen, setMediumOpen] = useState(false);
  const [largeOpen, setLargeOpen] = useState(false);
  const [noCloseOpen, setNoCloseOpen] = useState(false);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/ui" className={styles.backLink}>
          <Icon name="arrowLeft" size={16} />
          <span>Back to UI</span>
        </Link>
        <h1 className={styles.title}>Modal</h1>
        <p className={styles.subtitle}>
          A portal-based dialog component with overlay, focus trap, keyboard
          support (Escape to close), and multiple sizes.
        </p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Sizes</h2>
        <Card className={styles.showcase}>
          <div className={styles.row}>
            <div className={styles.item}>
              <Button onClick={() => setSmallOpen(true)}>Small Modal</Button>
            </div>
            <div className={styles.item}>
              <Button onClick={() => setMediumOpen(true)}>Medium Modal</Button>
            </div>
            <div className={styles.item}>
              <Button onClick={() => setLargeOpen(true)}>Large Modal</Button>
            </div>
          </div>
        </Card>

        <Modal
          isOpen={smallOpen}
          onClose={() => setSmallOpen(false)}
          title="Small Modal"
          size="sm"
        >
          <p>This is a small modal dialog for simple confirmations.</p>
        </Modal>

        <Modal
          isOpen={mediumOpen}
          onClose={() => setMediumOpen(false)}
          title="Medium Modal"
          size="md"
        >
          <p>
            This is a medium modal, the default size. It works well for forms
            and content that needs more space.
          </p>
        </Modal>

        <Modal
          isOpen={largeOpen}
          onClose={() => setLargeOpen(false)}
          title="Large Modal"
          size="lg"
        >
          <p>
            This is a large modal suitable for complex content like data tables
            or multi-step forms.
          </p>
        </Modal>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Without Close Button</h2>
        <Card className={styles.showcase}>
          <Button onClick={() => setNoCloseOpen(true)}>No Close Button</Button>
        </Card>

        <Modal
          isOpen={noCloseOpen}
          onClose={() => setNoCloseOpen(false)}
          title="Custom Modal"
          showCloseButton={false}
        >
          <p>This modal has no close button. Use Escape or click overlay.</p>
          <div style={{ marginTop: 'var(--spacing-4)' }}>
            <Button onClick={() => setNoCloseOpen(false)}>Close</Button>
          </div>
        </Modal>
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
                  <code>title</code>
                </td>
                <td>
                  <code>string</code>
                </td>
                <td>—</td>
                <td>Modal header title</td>
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
                <td>Width of the modal</td>
              </tr>
              <tr>
                <td>
                  <code>closeOnOverlayClick</code>
                </td>
                <td>
                  <code>boolean</code>
                </td>
                <td>
                  <code>true</code>
                </td>
                <td>Close when clicking the overlay</td>
              </tr>
              <tr>
                <td>
                  <code>closeOnEscape</code>
                </td>
                <td>
                  <code>boolean</code>
                </td>
                <td>
                  <code>true</code>
                </td>
                <td>Close when pressing Escape</td>
              </tr>
              <tr>
                <td>
                  <code>showCloseButton</code>
                </td>
                <td>
                  <code>boolean</code>
                </td>
                <td>
                  <code>true</code>
                </td>
                <td>Show the X close button in the header</td>
              </tr>
            </tbody>
          </table>
        </Card>
      </section>
    </div>
  );
}
