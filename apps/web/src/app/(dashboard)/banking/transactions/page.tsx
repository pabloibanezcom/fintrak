'use client';

import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

import {
  type FilterOption,
  TransactionFilters,
  type TransactionFiltersValue,
} from '@/components/dashboard';
import { TransactionList, type TransactionListItem } from '@/components/ui';
import { useBankAccounts } from '@/hooks/useBankAccounts';
import { useBankTransactions } from '@/hooks/useBankTransactions';
import { formatCurrency, formatDate } from '@/utils';
import styles from './page.module.css';

export default function BankTransactionsPage() {
  const t = useTranslations();
  const [filters, setFilters] = useState<TransactionFiltersValue>({
    search: '',
    dateFrom: '',
    dateTo: '',
    bankId: '',
    accountId: '',
  });

  const {
    accounts,
    connections,
    getBankDisplayName,
    getAccountDisplayName,
    getBankLogo,
  } = useBankAccounts();

  const { transactions, isLoading, isLoadingMore, hasMore, total, loadMore } =
    useBankTransactions({
      from: filters.dateFrom || undefined,
      to: filters.dateTo || undefined,
      search: filters.search || undefined,
      bankId: filters.bankId || undefined,
      accountId: filters.accountId || undefined,
    });

  const bankOptions: FilterOption[] = useMemo(
    () =>
      connections.map((conn) => ({
        value: conn.bankId,
        label: conn.alias || conn.bankName,
      })),
    [connections]
  );

  const accountOptions: FilterOption[] = useMemo(
    () =>
      accounts.map((acc) => ({
        value: acc.accountId,
        label: acc.alias || acc.name,
      })),
    [accounts]
  );

  // Filter accounts by selected bank for the dropdown
  const filteredAccountOptions: FilterOption[] = useMemo(() => {
    if (!filters.bankId) return accountOptions;
    return accounts
      .filter((acc) => acc.bankId === filters.bankId)
      .map((acc) => ({
        value: acc.accountId,
        label: acc.alias || acc.name,
      }));
  }, [accounts, accountOptions, filters.bankId]);

  const transactionListItems: TransactionListItem[] = useMemo(
    () =>
      transactions.map((tx) => ({
        id: tx._id,
        title: tx.merchantName || tx.description,
        description: tx.merchantName ? tx.description : undefined,
        amount: tx.amount,
        currency: tx.currency,
        date: tx.timestamp,
        type: tx.type === 'CREDIT' ? 'credit' : 'debit',
        bank: getBankDisplayName(tx.accountId),
        bankLogo: getBankLogo(tx.accountId),
        account: getAccountDisplayName(tx.accountId),
      })),
    [transactions, getBankDisplayName, getBankLogo, getAccountDisplayName]
  );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t('nav.banking')}</h1>
        <p className={styles.subtitle}>
          View and manage your bank transactions
        </p>
      </div>

      <TransactionFilters
        value={filters}
        onChange={setFilters}
        totalCount={total}
        banks={bankOptions}
        accounts={filteredAccountOptions}
      />

      <TransactionList
        transactions={transactionListItems}
        isLoading={isLoading}
        isLoadingMore={isLoadingMore}
        hasMore={hasMore}
        onLoadMore={loadMore}
        formatAmount={(amount, currency) => formatCurrency(amount, currency)}
        formatDate={(date) => formatDate(date)}
        emptyMessage="No transactions found"
      />
    </div>
  );
}
