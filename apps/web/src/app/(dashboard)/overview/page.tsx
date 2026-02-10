'use client';

import { useTranslations } from 'next-intl';
import {
  BankAccountCard,
  type BankAccountItem,
  InvestmentCard,
  SpendingLimitBar,
  StatCard,
  TransactionList,
  type TransactionListItem,
} from '@/components/data-display';
import { PageContainer, PageHeader } from '@/components/layout';
import { Card } from '@/components/primitives';
import { useUser } from '@/context';
import {
  useBankAccounts,
  useInvestmentProducts,
  usePeriodSummary,
} from '@/hooks';
import { getGreetingPeriod } from '@/utils';

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
    <PageContainer>
      <PageHeader
        title={`${t(`greetings.${greetingPeriod}`)}, ${userName}`}
        subtitle={t('dashboard.subtitle')}
      />

      <div style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
        {/* Main Dashboard Grid */}
        <div className="grid-2col" style={{ alignItems: 'start' }}>
          {/* Left Column */}
          <div className="flex-col">
            <BankAccountCard
              accounts={bankAccounts}
              title="Bank Accounts"
              layout="grid"
              isLoading={isLoadingAccounts}
              emptyMessage="Connect a bank to see your accounts"
            />
            {/* Stats: Earnings & Spending */}
            <div className="grid-2col">
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
          <div className="flex-col">
            <InvestmentCard
              funds={investmentData?.funds}
              etcs={investmentData?.etcs}
              cryptoAssets={investmentData?.cryptoAssets}
              totalValue={investmentData?.totals.all}
              isLoading={isLoadingInvestments}
              emptyMessage="No investments found"
            />
            {/* Stats: Savings & Investments */}
            <div className="grid-2col">
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
        <div className="flex-col">
          <SpendingLimitBar spent={1400} limit={5500} currency="EUR" />

          <Card padding="md" className="card-container">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 'var(--spacing-md)',
              }}
            >
              <h3 style={{ fontSize: '1rem', fontWeight: '600', margin: 0 }}>
                My Cards
              </h3>
              <button
                type="button"
                style={{
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-primary-500)',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                }}
              >
                + Add new
              </button>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 'var(--spacing-xl)',
                gap: 'var(--spacing-sm)',
                color: 'var(--color-text-secondary)',
              }}
            >
              <span style={{ fontSize: '2rem' }}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-label="Credit card icon"
                >
                  <title>Credit card</title>
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
        <div className="flex-col">
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
    </PageContainer>
  );
}
