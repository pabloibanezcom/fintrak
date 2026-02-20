'use client';

import { useTranslations } from 'next-intl';
import { useCallback, useMemo, useState } from 'react';

import {
  TransactionList,
  type TransactionListItem,
} from '@/components/data-display';
import {
  type FilterOption,
  TransactionFilters,
  type TransactionFiltersValue,
  TransactionSummary,
} from '@/components/features';
import { PageContainer, PageHeader } from '@/components/layout';
import { CreateFromTransactionModal } from '@/components/modals';
import { useBankAccounts } from '@/hooks/useBankAccounts';
import { useBankTransactions } from '@/hooks/useBankTransactions';
import type { BankTransaction, ReviewStatus } from '@/services';
import { formatCurrency, formatDate } from '@/utils';

export default function BankTransactionsPage() {
  const t = useTranslations();
  const [filters, setFilters] = useState<TransactionFiltersValue>({
    search: '',
    dateFrom: '',
    dateTo: '',
    bankId: '',
    accountId: '',
    reviewStatus: '',
  });
  const [selectedTransaction, setSelectedTransaction] =
    useState<BankTransaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    accounts,
    connections,
    getBankDisplayName,
    getAccountDisplayName,
    getBankLogo,
  } = useBankAccounts();

  const {
    transactions,
    linkedTransactionIds,
    linkedTransactions,
    isLoading,
    isLoadingMore,
    hasMore,
    total,
    loadMore,
    refetch,
    updateTransaction,
  } = useBankTransactions({
    from: filters.dateFrom || undefined,
    to: filters.dateTo || undefined,
    search: filters.search || undefined,
    bankId: filters.bankId || undefined,
    accountId: filters.accountId || undefined,
    reviewStatus: (filters.reviewStatus as ReviewStatus) || undefined,
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
        label: acc.displayName,
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
        label: acc.displayName,
      }));
  }, [accounts, accountOptions, filters.bankId]);

  const transactionListItems: TransactionListItem[] = useMemo(
    () =>
      transactions.map((tx) => {
        const linkedTransaction = linkedTransactions.get(tx._id);
        const title =
          tx.merchantName?.trim() ||
          tx.description?.trim() ||
          'Bank transaction';
        const bankDescription =
          tx.description && tx.description !== title
            ? tx.description
            : undefined;
        const dismissNote = tx.dismissNote?.trim() || undefined;

        return {
          id: tx._id,
          title,
          description: bankDescription,
          dismissNote,
          linkedTitle: linkedTransaction?.title,
          amount: tx.amount,
          currency: tx.currency,
          date: tx.timestamp,
          type: tx.type === 'CREDIT' ? 'credit' : 'debit',
          bank: getBankDisplayName(tx.accountId),
          bankLogo: getBankLogo(tx.accountId),
          account: getAccountDisplayName(tx.accountId),
          isLinked: linkedTransactionIds.has(tx._id),
          isDismissed: tx.dismissed,
          linkedTransactionId: linkedTransactionIds.get(tx._id),
        };
      }),
    [
      transactions,
      linkedTransactionIds,
      linkedTransactions,
      getBankDisplayName,
      getBankLogo,
      getAccountDisplayName,
    ]
  );

  const handleTransactionClick = useCallback(
    (item: TransactionListItem) => {
      const transaction = transactions.find((tx) => tx._id === item.id);
      if (transaction) {
        setSelectedTransaction(transaction);
        setIsModalOpen(true);
      }
    },
    [transactions]
  );

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  }, []);

  const handleModalSuccess = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleDismissChange = useCallback(
    (transactionId: string, dismissed: boolean, dismissNote?: string) => {
      updateTransaction(transactionId, {
        dismissed,
        dismissNote: dismissed ? dismissNote : undefined,
      });
    },
    [updateTransaction]
  );

  return (
    <PageContainer>
      <PageHeader
        title={t('nav.banking')}
        subtitle="View and manage your bank transactions"
      />

      <TransactionFilters
        value={filters}
        onChange={setFilters}
        totalCount={total}
        banks={bankOptions}
        accounts={filteredAccountOptions}
      />

      <TransactionSummary
        transactions={transactions}
        linkedTransactionIds={linkedTransactionIds}
      />

      <TransactionList
        transactions={transactionListItems}
        isLoading={isLoading}
        isLoadingMore={isLoadingMore}
        hasMore={hasMore}
        onLoadMore={loadMore}
        onTransactionClick={handleTransactionClick}
        formatAmount={(amount, currency) => formatCurrency(amount, currency)}
        formatDate={(date) => formatDate(date)}
        emptyMessage="No transactions found"
      />

      <CreateFromTransactionModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        transaction={selectedTransaction}
        isLinked={
          selectedTransaction
            ? linkedTransactionIds.has(selectedTransaction._id)
            : false
        }
        bankLogo={
          selectedTransaction
            ? getBankLogo(selectedTransaction.accountId)
            : undefined
        }
        bankName={
          selectedTransaction
            ? getBankDisplayName(selectedTransaction.accountId)
            : undefined
        }
        accountName={
          selectedTransaction
            ? getAccountDisplayName(selectedTransaction.accountId)
            : undefined
        }
        onSuccess={handleModalSuccess}
        onDismissChange={handleDismissChange}
      />
    </PageContainer>
  );
}
