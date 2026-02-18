'use client';

import Link from 'next/link';
import { Card } from '@/components/primitives';
import styles from './page.module.css';

interface ShowroomItem {
  name: string;
  href: string;
}

const foundations: ShowroomItem[] = [
  { name: 'Border Radius', href: '/ui/radius' },
  { name: 'Colors', href: '/ui/colors' },
  { name: 'Shadows', href: '/ui/shadows' },
  { name: 'Spacing', href: '/ui/spacing' },
  { name: 'Transitions', href: '/ui/transitions' },
  { name: 'Typography', href: '/ui/typography' },
];

const primitives: ShowroomItem[] = [
  { name: 'Avatar', href: '/ui/avatar' },
  { name: 'AuthDivider', href: '/ui/auth-divider' },
  { name: 'Badge', href: '/ui/badge' },
  { name: 'Button', href: '/ui/button' },
  { name: 'Card', href: '/ui/card' },
  { name: 'ErrorMessage', href: '/ui/error-message' },
  { name: 'Icon', href: '/ui/icon' },
  { name: 'Input', href: '/ui/input' },
  { name: 'ProgressBar', href: '/ui/progress-bar' },
  { name: 'Select', href: '/ui/select' },
  { name: 'Toggle', href: '/ui/toggle' },
];

const forms: ShowroomItem[] = [
  { name: 'ColorPicker', href: '/ui/color-picker' },
  { name: 'DateSelector', href: '/ui/date-selector' },
];

const dataDisplay: ShowroomItem[] = [
  { name: 'BankAccountCard', href: '/ui/bank-account-card' },
  { name: 'InvestmentCard', href: '/ui/investment-card' },
  { name: 'SpendingLimitBar', href: '/ui/spending-limit-bar' },
  { name: 'StatCard', href: '/ui/stat-card' },
  { name: 'TransactionList', href: '/ui/transaction-list' },
  { name: 'WalletCard', href: '/ui/wallet-card' },
];

const modals: ShowroomItem[] = [
  { name: 'Modal', href: '/ui/modal' },
  { name: 'CreateCategoryModal', href: '/ui/create-category-modal' },
  { name: 'CreateCounterpartyModal', href: '/ui/create-counterparty-modal' },
  { name: 'CreateFromTransactionModal', href: '/ui/create-from-transaction-modal' },
];

const features: ShowroomItem[] = [
  { name: 'ButtonGroup', href: '/ui/button-group' },
  { name: 'DropdownMenu', href: '/ui/dropdown-menu' },
  { name: 'Toaster', href: '/ui/toaster' },
  { name: 'TransactionFilters', href: '/ui/transaction-filters' },
  { name: 'TransactionSummary', href: '/ui/transaction-summary' },
];

const layout: ShowroomItem[] = [
  { name: 'AuthCard', href: '/ui/auth-card' },
  { name: 'AuthLayout', href: '/ui/auth-layout' },
  { name: 'DashboardLayout', href: '/ui/dashboard-layout' },
  { name: 'Footer', href: '/ui/footer' },
  { name: 'LanguageSwitcher', href: '/ui/language-switcher' },
  { name: 'PageContainer', href: '/ui/page-container' },
  { name: 'PageHeader', href: '/ui/page-header' },
  { name: 'SectionHeader', href: '/ui/section-header' },
  { name: 'Sidebar', href: '/ui/sidebar' },
  { name: 'SyncOverlay', href: '/ui/sync-overlay' },
  { name: 'TopNav', href: '/ui/top-nav' },
];

function ChipGroup({ items }: { items: ShowroomItem[] }) {
  return (
    <Card className={styles.chipCard}>
      <div className={styles.chipContainer}>
        {items.map((item) => (
          <Link key={item.name} href={item.href} className={styles.chip}>
            {item.name}
          </Link>
        ))}
      </div>
    </Card>
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
        <ChipGroup items={foundations} />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Primitives</h2>
        <ChipGroup items={primitives} />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Layout</h2>
        <ChipGroup items={layout} />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Features</h2>
        <ChipGroup items={features} />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Forms</h2>
        <ChipGroup items={forms} />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Modals</h2>
        <ChipGroup items={modals} />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Data Display</h2>
        <ChipGroup items={dataDisplay} />
      </section>
    </div>
  );
}
