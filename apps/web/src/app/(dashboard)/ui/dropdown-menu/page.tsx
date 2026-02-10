'use client';

import Link from 'next/link';
import { DropdownMenu } from '@/components/features';
import { Button, Card, Icon } from '@/components/primitives';
import styles from '../showroom.module.css';

export default function DropdownMenuShowroomPage() {
  const basicItems = [
    { type: 'link' as const, label: 'Profile', href: '#' },
    { type: 'link' as const, label: 'Settings', href: '#' },
    { type: 'divider' as const },
    { type: 'button' as const, label: 'Sign Out', onClick: () => {} },
  ];

  const itemsWithIcons = [
    {
      type: 'link' as const,
      label: 'Settings',
      href: '#',
      icon: <Icon name="settings" size={16} />,
    },
    {
      type: 'link' as const,
      label: 'Activity',
      href: '#',
      icon: <Icon name="activity" size={16} />,
    },
    { type: 'divider' as const },
    {
      type: 'button' as const,
      label: 'Sign Out',
      onClick: () => {},
      icon: <Icon name="signOut" size={16} />,
    },
  ];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/ui" className={styles.backLink}>
          <Icon name="arrowLeft" size={16} />
          <span>Back to UI</span>
        </Link>
        <h1 className={styles.title}>DropdownMenu</h1>
        <p className={styles.subtitle}>
          Dropdown menus display a list of actions or links. They support
          different item types, dividers, and alignment options.
        </p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Basic Dropdown</h2>
        <Card className={styles.showcase}>
          <div className={styles.row}>
            <DropdownMenu
              trigger={<Button variant="outline">Open Menu</Button>}
              items={basicItems}
            />
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>With Icons</h2>
        <Card className={styles.showcase}>
          <div className={styles.row}>
            <DropdownMenu
              trigger={<Button variant="outline">Menu with Icons</Button>}
              items={itemsWithIcons}
            />
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Alignment</h2>
        <Card className={styles.showcase}>
          <div className={styles.row} style={{ gap: 'var(--spacing-8)' }}>
            <div className={styles.item}>
              <DropdownMenu
                trigger={<Button variant="outline">Left Aligned</Button>}
                items={basicItems}
                align="left"
              />
              <span className={styles.label}>align="left"</span>
            </div>
            <div className={styles.item}>
              <DropdownMenu
                trigger={<Button variant="outline">Right Aligned</Button>}
                items={basicItems}
                align="right"
              />
              <span className={styles.label}>align="right"</span>
            </div>
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Item Types</h2>
        <Card className={styles.showcase}>
          <div className={styles.examples}>
            <div className={styles.example}>
              <span className={styles.exampleLabel}>Link item:</span>
              <code>{'{ type: "link", label: "...", href: "..." }'}</code>
            </div>
            <div className={styles.example}>
              <span className={styles.exampleLabel}>Button item:</span>
              <code>
                {'{ type: "button", label: "...", onClick: () => {} }'}
              </code>
            </div>
            <div className={styles.example}>
              <span className={styles.exampleLabel}>Divider:</span>
              <code>{'{ type: "divider" }'}</code>
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
                  <code>trigger</code>
                </td>
                <td>
                  <code>ReactNode</code>
                </td>
                <td>—</td>
                <td>Element that triggers the dropdown (required)</td>
              </tr>
              <tr>
                <td>
                  <code>items</code>
                </td>
                <td>
                  <code>DropdownMenuItem[]</code>
                </td>
                <td>—</td>
                <td>Array of menu items to display (required)</td>
              </tr>
              <tr>
                <td>
                  <code>align</code>
                </td>
                <td>
                  <code>'left' | 'right'</code>
                </td>
                <td>
                  <code>'right'</code>
                </td>
                <td>Horizontal alignment of the menu</td>
              </tr>
            </tbody>
          </table>
        </Card>
      </section>
    </div>
  );
}
