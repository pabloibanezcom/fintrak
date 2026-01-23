'use client';

import {
  RecentActivities,
  SpendingLimitBar,
  StatCard,
  TotalBalanceCard,
  WalletCard,
} from '@/components/dashboard';
import { Card } from '@/components/ui';
import { useUser } from '@/context';
import { usePeriodSummary } from '@/hooks';
import { getGreeting } from '@/utils';
import styles from './page.module.css';

export default function OverviewPage() {
  const { data, isLoading } = usePeriodSummary({ latestCount: 5 });
  const { user } = useUser();
  const greeting = getGreeting();
  const userName = user?.name || user?.email?.split('@')[0] || 'User';

  const totalExpenses = data?.expenses.total || 0;
  const totalIncomes = data?.incomes.total || 0;
  const balance = data?.balance || 0;

  return (
    <div className={styles.page}>
      <div className={styles.greeting}>
        <h1 className={styles.greetingTitle}>
          {greeting}, {userName}
        </h1>
        <p className={styles.greetingSubtitle}>
          Stay on top of your tasks, monitor progress, and track status.
        </p>
      </div>

      <div className={styles.grid}>
        {/* Main Balance Section */}
        <div className={styles.balanceSection}>
          <TotalBalanceCard balance={balance} currency="EUR" change={5} />

          <Card padding="md" className={styles.walletsCard}>
            <div className={styles.walletsHeader}>
              <span className={styles.walletsLabel}>Wallets</span>
              <span className={styles.walletsCount}>| Total 6 wallets</span>
            </div>
            <div className={styles.walletsList}>
              <WalletCard
                currency="USD"
                balance={22878.0}
                label="Last 4 884 a month"
                isActive={false}
              />
              <WalletCard
                currency="EUR"
                balance={18345.0}
                label="Last 4 884 a month"
                isActive={true}
              />
              <WalletCard
                currency="GBP"
                balance={15000.0}
                label="Last 6.17 a month"
                isActive={false}
              />
            </div>
          </Card>
        </div>

        {/* Stats Cards Row */}
        <div className={styles.statsRow}>
          <StatCard
            label="Total Earnings"
            value={totalIncomes || 950}
            currency="EUR"
            change={7}
            variant="primary"
          />
          <StatCard
            label="Total Spending"
            value={totalExpenses || 700}
            currency="EUR"
            change={-5}
            variant="default"
          />
          <StatCard
            label="Total Income"
            value={1050}
            currency="EUR"
            change={8}
            variant="default"
          />
          <StatCard
            label="Total Revenue"
            value={850}
            currency="EUR"
            change={4}
            variant="default"
          />
        </div>

        {/* Bottom Section */}
        <div className={styles.bottomSection}>
          <SpendingLimitBar spent={1400} limit={5500} currency="EUR" />

          <Card padding="md" className={styles.cardsSection}>
            <div className={styles.cardsSectionHeader}>
              <h3 className={styles.cardsSectionTitle}>My Cards</h3>
              <button className={styles.addButton}>+ Add new</button>
            </div>
            <div className={styles.cardPlaceholder}>
              <span className={styles.cardIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect
                    x="2"
                    y="5"
                    width="20"
                    height="14"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path d="M2 10h20" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </span>
              <span>No cards added yet</span>
            </div>
          </Card>
        </div>

        {/* Recent Activities */}
        <div className={styles.activitiesSection}>
          <RecentActivities
            transactions={data?.latestTransactions || []}
            currency="EUR"
          />
        </div>
      </div>
    </div>
  );
}
