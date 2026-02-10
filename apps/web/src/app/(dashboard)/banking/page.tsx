'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useCallback, useState } from 'react';

import {
  BankAccountCard,
  type BankAccountItem,
  TransactionList,
  type TransactionListItem,
} from '@/components/data-display';
import { PageContainer, PageHeader, SectionHeader } from '@/components/layout';
import { CreateFromTransactionModal } from '@/components/modals';
import { useBankAccounts } from '@/hooks/useBankAccounts';
import { useBankTransactions } from '@/hooks/useBankTransactions';
import type { BankTransaction } from '@/services';
import { formatCurrency, formatDate } from '@/utils';

export default function BankingPage() {
  const t = useTranslations();
  const [selectedTransaction, setSelectedTransaction] =
    useState<BankTransaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    accounts,
    connections,
    getAccountBalance,
    getBankDisplayName,
    getAccountDisplayName,
    getBankLogo,
    isLoading: isLoadingAccounts,
  } = useBankAccounts();

  const {
    transactions,
    linkedTransactionIds,
    isLoading: isLoadingTransactions,
    refetch,
    updateTransaction,
  } = useBankTransactions({ limit: 10 });

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

  const transactionListItems: TransactionListItem[] = transactions.map(
    (tx) => ({
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
      isLinked: linkedTransactionIds.has(tx._id),
      isDismissed: tx.dismissed,
      linkedTransactionId: linkedTransactionIds.get(tx._id),
    })
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

  const handleDismissChange = useCallback(
    (transactionId: string, dismissed: boolean) => {
      updateTransaction(transactionId, { dismissed });
    },
    [updateTransaction]
  );

  return (
    <PageContainer>
      <PageHeader
        title={t('nav.banking')}
        subtitle="Manage your bank accounts and transactions"
      />

      <BankAccountCard
        accounts={bankAccounts}
        title="Bank Accounts"
        layout="grid"
        isLoading={isLoadingAccounts}
        emptyMessage="Connect a bank to see your accounts"
      />

      <div className="flex-col">
        <SectionHeader
          title="Recent Transactions"
          action={
            <Link href="/banking/transactions" className="link-primary">
              View all
            </Link>
          }
        />
        <TransactionList
          transactions={transactionListItems}
          isLoading={isLoadingTransactions}
          onTransactionClick={handleTransactionClick}
          formatAmount={(amount, currency) => formatCurrency(amount, currency)}
          formatDate={(date) => formatDate(date)}
          emptyMessage="No recent transactions"
        />
      </div>

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
        onSuccess={refetch}
        onDismissChange={handleDismissChange}
      />
    </PageContainer>
  );
}
