'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ButtonGroup } from '@/components/features';
import { Card, Icon } from '@/components/primitives';
import styles from '../showroom.module.css';

export default function ButtonGroupShowroomPage() {
  const [activeAction, setActiveAction] = useState('bold');

  const navItems = [
    { id: 'tab1', label: 'Overview', href: '#' },
    { id: 'tab2', label: 'Activity', href: '#' },
    { id: 'tab3', label: 'Settings', href: '#' },
  ];

  const actionItems = [
    {
      id: 'bold',
      label: 'B',
      title: 'Bold',
      onClick: () => setActiveAction('bold'),
    },
    {
      id: 'italic',
      label: 'I',
      title: 'Italic',
      onClick: () => setActiveAction('italic'),
    },
    {
      id: 'underline',
      label: 'U',
      title: 'Underline',
      onClick: () => setActiveAction('underline'),
    },
  ];

  const iconItems = [
    {
      id: 'overview',
      icon: <Icon name="overview" size={20} />,
      title: 'Overview',
    },
    {
      id: 'activity',
      icon: <Icon name="activity" size={20} />,
      title: 'Activity',
    },
    {
      id: 'settings',
      icon: <Icon name="settings" size={20} />,
      title: 'Settings',
    },
  ];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/ui" className={styles.backLink}>
          <Icon name="arrowLeft" size={16} />
          <span>Back to UI</span>
        </Link>
        <h1 className={styles.title}>ButtonGroup</h1>
        <p className={styles.subtitle}>
          Button groups combine related buttons or navigation items. They
          support horizontal and vertical orientations with animated indicators.
        </p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Horizontal Navigation</h2>
        <Card className={styles.showcase}>
          <ButtonGroup
            items={navItems}
            orientation="horizontal"
            display="text"
            variant="nav"
            activeId="tab1"
            animated
          />
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Vertical Navigation</h2>
        <Card className={styles.showcase}>
          <div style={{ width: 200 }}>
            <ButtonGroup
              items={navItems}
              orientation="vertical"
              display="text"
              variant="nav"
              activeId="tab1"
              animated
            />
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Icon Only with Tooltips</h2>
        <Card className={styles.showcase}>
          <ButtonGroup
            items={iconItems}
            orientation="horizontal"
            display="icon"
            variant="nav"
            activeId="overview"
            showTooltip
            animated
          />
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Action Buttons</h2>
        <Card className={styles.showcase}>
          <ButtonGroup
            items={actionItems}
            orientation="horizontal"
            display="text"
            variant="actions"
            activeId={activeAction}
          />
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
                  <code>items</code>
                </td>
                <td>
                  <code>ButtonGroupItem[]</code>
                </td>
                <td>—</td>
                <td>Array of button/link items to render</td>
              </tr>
              <tr>
                <td>
                  <code>orientation</code>
                </td>
                <td>
                  <code>'horizontal' | 'vertical'</code>
                </td>
                <td>
                  <code>'horizontal'</code>
                </td>
                <td>Layout direction of the group</td>
              </tr>
              <tr>
                <td>
                  <code>display</code>
                </td>
                <td>
                  <code>'icon' | 'text' | 'both'</code>
                </td>
                <td>
                  <code>'text'</code>
                </td>
                <td>What content to show in each item</td>
              </tr>
              <tr>
                <td>
                  <code>variant</code>
                </td>
                <td>
                  <code>'nav' | 'actions'</code>
                </td>
                <td>
                  <code>'nav'</code>
                </td>
                <td>Visual style of the group</td>
              </tr>
              <tr>
                <td>
                  <code>activeId</code>
                </td>
                <td>
                  <code>string</code>
                </td>
                <td>—</td>
                <td>ID of the currently active item</td>
              </tr>
              <tr>
                <td>
                  <code>animated</code>
                </td>
                <td>
                  <code>boolean</code>
                </td>
                <td>
                  <code>false</code>
                </td>
                <td>Enable animated indicator for active item</td>
              </tr>
              <tr>
                <td>
                  <code>showTooltip</code>
                </td>
                <td>
                  <code>boolean</code>
                </td>
                <td>
                  <code>false</code>
                </td>
                <td>Show native title tooltips on hover</td>
              </tr>
            </tbody>
          </table>
        </Card>
      </section>
    </div>
  );
}
