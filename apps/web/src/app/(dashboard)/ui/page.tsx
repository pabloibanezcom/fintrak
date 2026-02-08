'use client';

import Link from 'next/link';
import { Card } from '@/components/ui';
import styles from './page.module.css';

interface ShowroomItem {
  name: string;
  description: string;
  href: string;
}

const foundations: ShowroomItem[] = [
  {
    name: 'Border Radius',
    description: 'Rounded corner values from subtle to fully circular',
    href: '/ui/radius',
  },
  {
    name: 'Colors',
    description:
      'Color palette including primary, neutral, and semantic colors',
    href: '/ui/colors',
  },
  {
    name: 'Shadows',
    description: 'Elevation shadows for depth and visual hierarchy',
    href: '/ui/shadows',
  },
  {
    name: 'Spacing',
    description: 'Consistent spacing scale for margins, padding, and gaps',
    href: '/ui/spacing',
  },
  {
    name: 'Transitions',
    description: 'Animation timing values for smooth interactions',
    href: '/ui/transitions',
  },
  {
    name: 'Typography',
    description: 'Font families, sizes, weights, and text styles',
    href: '/ui/typography',
  },
];

const components: ShowroomItem[] = [
  {
    name: 'Avatar',
    description: 'User profile images with fallback support',
    href: '/ui/avatar',
  },
  {
    name: 'Badge',
    description: 'Status indicators and labels with multiple variants',
    href: '/ui/badge',
  },
  {
    name: 'BankAccountCard',
    description: 'Display bank accounts with balances and details',
    href: '/ui/bank-account-card',
  },
  {
    name: 'Button',
    description: 'Interactive buttons with various styles and states',
    href: '/ui/button',
  },
  {
    name: 'ButtonGroup',
    description: 'Grouped buttons for navigation and actions',
    href: '/ui/button-group',
  },
  {
    name: 'Card',
    description: 'Container component for grouping content',
    href: '/ui/card',
  },
  {
    name: 'ColorPicker',
    description: 'Color selection with preset swatches and custom input',
    href: '/ui/color-picker',
  },
  {
    name: 'DateSelector',
    description: 'Date range picker with presets and custom selection',
    href: '/ui/date-selector',
  },
  {
    name: 'DropdownMenu',
    description: 'Dropdown menus with various item types',
    href: '/ui/dropdown-menu',
  },
  {
    name: 'Icon',
    description: 'SVG icon system with consistent sizing',
    href: '/ui/icon',
  },
  {
    name: 'Input',
    description: 'Text input fields with labels and validation states',
    href: '/ui/input',
  },
  {
    name: 'ProgressBar',
    description: 'Visual progress indicators',
    href: '/ui/progress-bar',
  },
  {
    name: 'Toggle',
    description: 'Switch controls for binary on/off settings',
    href: '/ui/toggle',
  },
];

function ItemGrid({ items }: { items: ShowroomItem[] }) {
  return (
    <div className={styles.grid}>
      {items.map((item) => (
        <Link key={item.name} href={item.href} className={styles.cardLink}>
          <Card className={styles.card}>
            <h3 className={styles.itemName}>{item.name}</h3>
            <p className={styles.itemDescription}>{item.description}</p>
          </Card>
        </Link>
      ))}
    </div>
  );
}

export default function UIShowroomPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Design System</h1>
        <p className={styles.subtitle}>
          A showcase of all available foundations and components
        </p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Foundations</h2>
        <ItemGrid items={foundations} />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Components</h2>
        <ItemGrid items={components} />
      </section>
    </div>
  );
}
