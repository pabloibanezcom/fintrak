'use client';

import Link from 'next/link';
import { Card } from '@/components/primitives';
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

const primitives: ShowroomItem[] = [
  {
    name: 'Avatar',
    description: 'User profile images with fallback support',
    href: '/ui/avatar',
  },
  {
    name: 'AuthDivider',
    description: 'Text divider for auth pages (e.g., "OR")',
    href: '/ui/auth-divider',
  },
  {
    name: 'Badge',
    description: 'Status indicators and labels with multiple variants',
    href: '/ui/badge',
  },
  {
    name: 'Button',
    description: 'Interactive buttons with various styles and states',
    href: '/ui/button',
  },
  {
    name: 'Card',
    description: 'Container component for grouping content',
    href: '/ui/card',
  },
  {
    name: 'ErrorMessage',
    description: 'Error alert box for displaying error messages',
    href: '/ui/error-message',
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
    name: 'Select',
    description: 'Dropdown select fields with options',
    href: '/ui/select',
  },
  {
    name: 'Toggle',
    description: 'Switch controls for binary on/off settings',
    href: '/ui/toggle',
  },
];

const forms: ShowroomItem[] = [
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
];

const dataDisplay: ShowroomItem[] = [
  {
    name: 'BankAccountCard',
    description: 'Display bank accounts with balances and details',
    href: '/ui/bank-account-card',
  },
  {
    name: 'InvestmentCard',
    description: 'Display investment portfolios and performance',
    href: '/ui/investment-card',
  },
  {
    name: 'SpendingLimitBar',
    description: 'Visual spending limit and progress indicator',
    href: '/ui/spending-limit-bar',
  },
  {
    name: 'StatCard',
    description: 'Statistical data cards with trends',
    href: '/ui/stat-card',
  },
  {
    name: 'TransactionList',
    description: 'List of financial transactions with details',
    href: '/ui/transaction-list',
  },
  {
    name: 'WalletCard',
    description: 'Display wallet balances and information',
    href: '/ui/wallet-card',
  },
];

const modals: ShowroomItem[] = [
  {
    name: 'Modal',
    description: 'Base modal dialog component',
    href: '/ui/modal',
  },
  {
    name: 'CreateCategoryModal',
    description: 'Modal for creating budget categories',
    href: '/ui/create-category-modal',
  },
  {
    name: 'CreateCounterpartyModal',
    description: 'Modal for adding counterparties',
    href: '/ui/create-counterparty-modal',
  },
  {
    name: 'CreateFromTransactionModal',
    description: 'Create budget entries from transactions',
    href: '/ui/create-from-transaction-modal',
  },
];

const features: ShowroomItem[] = [
  {
    name: 'ButtonGroup',
    description: 'Grouped buttons for navigation and filtering',
    href: '/ui/button-group',
  },
  {
    name: 'DropdownMenu',
    description: 'Dropdown menus with various item types',
    href: '/ui/dropdown-menu',
  },
  {
    name: 'Toaster',
    description: 'Toast notifications for user feedback',
    href: '/ui/toaster',
  },
  {
    name: 'TransactionFilters',
    description: 'Advanced filters for transaction lists',
    href: '/ui/transaction-filters',
  },
];

const layout: ShowroomItem[] = [
  {
    name: 'AuthCard',
    description: 'Card wrapper for authentication pages',
    href: '/ui/auth-card',
  },
  {
    name: 'AuthLayout',
    description: 'Centered layout for auth pages with logo',
    href: '/ui/auth-layout',
  },
  {
    name: 'DashboardLayout',
    description: 'Main app shell with sidebar and navigation',
    href: '/ui/dashboard-layout',
  },
  {
    name: 'Footer',
    description: 'Application footer component',
    href: '/ui/footer',
  },
  {
    name: 'LanguageSwitcher',
    description: 'Language selection dropdown',
    href: '/ui/language-switcher',
  },
  {
    name: 'PageContainer',
    description: 'Standard page wrapper component',
    href: '/ui/page-container',
  },
  {
    name: 'PageHeader',
    description: 'Page title, subtitle, and actions',
    href: '/ui/page-header',
  },
  {
    name: 'SectionHeader',
    description: 'Section title with optional actions',
    href: '/ui/section-header',
  },
  {
    name: 'Sidebar',
    description: 'Main navigation sidebar',
    href: '/ui/sidebar',
  },
  {
    name: 'SyncOverlay',
    description: 'Loading overlay during data sync',
    href: '/ui/sync-overlay',
  },
  {
    name: 'TopNav',
    description: 'Top navigation bar',
    href: '/ui/top-nav',
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
        <h2 className={styles.sectionTitle}>Primitives</h2>
        <p className={styles.sectionDescription}>
          Basic UI building blocks with no business logic
        </p>
        <ItemGrid items={primitives} />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Forms</h2>
        <p className={styles.sectionDescription}>
          Form-related input components
        </p>
        <ItemGrid items={forms} />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Data Display</h2>
        <p className={styles.sectionDescription}>
          Components for displaying data and information
        </p>
        <ItemGrid items={dataDisplay} />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Modals</h2>
        <p className={styles.sectionDescription}>
          Dialog and modal components
        </p>
        <ItemGrid items={modals} />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Features</h2>
        <p className={styles.sectionDescription}>
          Complex feature-specific components
        </p>
        <ItemGrid items={features} />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Layout</h2>
        <p className={styles.sectionDescription}>
          Layout and structural components
        </p>
        <ItemGrid items={layout} />
      </section>
    </div>
  );
}
