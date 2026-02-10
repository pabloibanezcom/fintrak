'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button, Card, Icon } from '@/components/primitives';
import styles from '../showroom.module.css';
import transitionStyles from './page.module.css';

const transitions = [
  {
    name: 'Fast',
    variable: '--transition-fast',
    value: '150ms ease',
    description: 'Micro-interactions, hover states, icon changes',
  },
  {
    name: 'Base',
    variable: '--transition-base',
    value: '200ms ease',
    description: 'Default for most transitions, button states',
  },
  {
    name: 'Slow',
    variable: '--transition-slow',
    value: '300ms ease',
    description: 'Larger animations, panel slides, modal entrances',
  },
];

export default function TransitionsShowroomPage() {
  const [animate, setAnimate] = useState(false);

  const triggerAnimation = () => {
    setAnimate(false);
    setTimeout(() => setAnimate(true), 10);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/ui" className={styles.backLink}>
          <Icon name="arrowLeft" size={16} />
          <span>Back to UI</span>
        </Link>
        <h1 className={styles.title}>Transitions</h1>
        <p className={styles.subtitle}>
          Consistent timing values for animations and transitions. Based on the
          ease timing function for natural motion.
        </p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Timing Scale</h2>
        <Card className={styles.propsCard}>
          <table className={styles.propsTable}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Variable</th>
                <th>Value</th>
                <th>Use Case</th>
              </tr>
            </thead>
            <tbody>
              {transitions.map((t) => (
                <tr key={t.name}>
                  <td>
                    <strong>{t.name}</strong>
                  </td>
                  <td>
                    <code>{t.variable}</code>
                  </td>
                  <td>{t.value}</td>
                  <td>{t.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Live Demo</h2>
        <Card className={styles.showcase}>
          <div className={transitionStyles.demo}>
            <Button onClick={triggerAnimation}>Trigger Animation</Button>
            <div className={transitionStyles.demoBoxes}>
              <div className={transitionStyles.demoItem}>
                <div
                  className={`${transitionStyles.demoBox} ${transitionStyles.fast} ${animate ? transitionStyles.active : ''}`}
                />
                <span className={transitionStyles.demoLabel}>Fast (150ms)</span>
              </div>
              <div className={transitionStyles.demoItem}>
                <div
                  className={`${transitionStyles.demoBox} ${transitionStyles.base} ${animate ? transitionStyles.active : ''}`}
                />
                <span className={transitionStyles.demoLabel}>Base (200ms)</span>
              </div>
              <div className={transitionStyles.demoItem}>
                <div
                  className={`${transitionStyles.demoBox} ${transitionStyles.slow} ${animate ? transitionStyles.active : ''}`}
                />
                <span className={transitionStyles.demoLabel}>Slow (300ms)</span>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Usage</h2>
        <Card className={styles.showcase}>
          <div className={styles.examples}>
            <div className={styles.example}>
              <span className={styles.exampleLabel}>All properties:</span>
              <code>transition: all var(--transition-base);</code>
            </div>
            <div className={styles.example}>
              <span className={styles.exampleLabel}>Specific property:</span>
              <code>transition: opacity var(--transition-fast);</code>
            </div>
            <div className={styles.example}>
              <span className={styles.exampleLabel}>Multiple:</span>
              <code>
                transition: transform var(--transition-base), opacity
                var(--transition-fast);
              </code>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
