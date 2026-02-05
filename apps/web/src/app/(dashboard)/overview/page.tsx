'use client';

import { useTranslations } from 'next-intl';

import { SpendingLimitBar, StatCard } from '@/components/dashboard';
import {
  BankAccountCard,
  type BankAccountItem,
  Card,
  InvestmentCard,
  TransactionList,
  type TransactionListItem,
} from '@/components/ui';
import { useUser } from '@/context';
import {
  useBankAccounts,
  useInvestmentProducts,
  usePeriodSummary,
} from '@/hooks';
import { getGreetingPeriod } from '@/utils';
import styles from './page.module.css';

export default function OverviewPage() {
  const t = useTranslations();
  const { data } = usePeriodSummary({ latestCount: 5 });
  const { user } = useUser();
  const {
    accounts,
    connections,
    getAccountBalance,
    isLoading: isLoadingAccounts,
  } = useBankAccounts();
  const { data: investmentData, isLoading: isLoadingInvestments } =
    useInvestmentProducts();
  const greetingPeriod = getGreetingPeriod();
  const userName = user?.name || user?.email?.split('@')[0] || 'User';

  const totalExpenses = data?.expenses.total || 0;
  const totalIncomes = data?.incomes.total || 0;

  // Map bank accounts to BankAccountItem format
  const bankAccounts: BankAccountItem[] = accounts.map((account) => {
    const connection = connections.find((c) => c.bankId === account.bankId);
    return {
      id: account.accountId,
      bankName: connection?.alias || account.bankName,
      bankLogo: account.logo || connection?.logo,
      accountName: account.displayName,
      balance: getAccountBalance(account.accountId),
      currency: account.currency,
      iban: account.iban,
    };
  });

  return (
    <div className={styles.page}>
      <div className={styles.greeting}>
        <h1 className={styles.greetingTitle}>
          {t(`greetings.${greetingPeriod}`)}, {userName}
        </h1>
        <p className={styles.greetingSubtitle}>{t('dashboard.subtitle')}</p>
      </div>

      <div className={styles.grid}>
        {/* Main Dashboard Grid */}
        <div className={styles.dashboardGrid}>
          {/* Left Column */}
          <div className={styles.column}>
            <BankAccountCard
              accounts={bankAccounts}
              title="Bank Accounts"
              layout="grid"
              isLoading={isLoadingAccounts}
              emptyMessage="Connect a bank to see your accounts"
            />
            {/* Stats: Earnings & Spending */}
            <div className={styles.biStatRow}>
              <StatCard
                label="Total Earnings"
                value={totalIncomes}
                currency="EUR"
                variant="primary"
              />
              <StatCard
                label="Total Spending"
                value={totalExpenses}
                currency="EUR"
                variant="default"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className={styles.column}>
            <InvestmentCard
              funds={investmentData?.funds}
              etcs={investmentData?.etcs}
              cryptoAssets={investmentData?.cryptoAssets}
              totalValue={investmentData?.totals.all}
              isLoading={isLoadingInvestments}
              emptyMessage="No investments found"
            />
            {/* Stats: Savings & Investments */}
            <div className={styles.biStatRow}>
              <StatCard
                label="Monthly Savings"
                value={totalIncomes - totalExpenses}
                currency="EUR"
                variant={
                  totalIncomes - totalExpenses >= 0 ? 'primary' : 'default'
                }
              />
              <StatCard
                label="Investments"
                value={investmentData?.totals.all || 0}
                currency="EUR"
                variant="default"
              />
            </div>
          </div>
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

        {/* Recent Transactions */}
        <div className={styles.activitiesSection}>
          <TransactionList
            transactions={
              data?.latestTransactions.map(
                (tx): TransactionListItem => ({
                  id: tx.id,
                  title: tx.title,
                  amount: tx.amount,
                  currency: tx.currency,
                  date: tx.date,
                  type: tx.type === 'income' ? 'credit' : 'debit',
                })
              ) || []
            }
            showBankInfo={false}
          />
        </div>
      </div>
    </div>
  );
}
