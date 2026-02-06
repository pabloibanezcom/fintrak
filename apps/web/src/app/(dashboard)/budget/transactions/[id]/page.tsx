'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button, Card, Icon } from '@/components/ui';
import { type UserTransaction, userTransactionsService } from '@/services';
import { formatCurrency, formatDate } from '@/utils';
import styles from './page.module.css';

export default function TransactionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [transaction, setTransaction] = useState<UserTransaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTransaction() {
      try {
        setIsLoading(true);
        const data = await userTransactionsService.getById(id);
        setTransaction(data);
      } catch (err) {
        console.error('Failed to fetch transaction:', err);
        setError('Transaction not found');
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
      fetchTransaction();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className={styles.page}>
        <Card padding="lg" className={styles.loading}>
          <Icon name="Loader" />
          <span>Loading transaction...</span>
        </Card>
      </div>
    );
  }

  if (error || !transaction) {
    return (
      <div className={styles.page}>
        <Card padding="lg" className={styles.error}>
          <span className={styles.errorText}>
            {error || 'Transaction not found'}
          </span>
          <Button variant="outline" onClick={() => router.back()}>
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  const isExpense = transaction.type === 'expense';

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button
          type="button"
          className={styles.backButton}
          onClick={() => router.back()}
          aria-label="Go back"
        >
          <Icon name="ChevronLeft" />
        </button>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>{transaction.title}</h1>
          <p className={styles.subtitle}>
            {isExpense ? 'Expense' : 'Income'} • {formatDate(transaction.date)}
          </p>
        </div>
      </div>

      <div className={styles.content}>
        <Card padding="lg" className={styles.mainCard}>
          <div className={styles.amountSection}>
            <span
              className={`${styles.amount} ${isExpense ? styles.expense : styles.income}`}
            >
              {isExpense ? '-' : '+'}
              {formatCurrency(transaction.amount, transaction.currency)}
            </span>
            <span
              className={`${styles.typeBadge} ${isExpense ? styles.expense : styles.income}`}
            >
              {transaction.type}
            </span>
          </div>

          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Category</span>
              <span className={styles.detailValue}>
                {transaction.category.name}
              </span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Date</span>
              <span className={styles.detailValue}>
                {formatDate(transaction.date)}
              </span>
            </div>
            {transaction.counterparty && (
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>
                  {isExpense ? 'Payee' : 'Source'}
                </span>
                <span className={styles.detailValue}>
                  {transaction.counterparty.name}
                </span>
              </div>
            )}
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Periodicity</span>
              <span className={styles.detailValue}>
                {transaction.periodicity === 'NOT_RECURRING'
                  ? 'One-time'
                  : transaction.periodicity}
              </span>
            </div>
          </div>

          {transaction.description && (
            <div className={styles.description}>
              <span className={styles.detailLabel}>Description</span>
              <p className={styles.descriptionText}>
                {transaction.description}
              </p>
            </div>
          )}
        </Card>

        <Card padding="md" className={styles.sideCard}>
          <span className={styles.sideCardTitle}>Details</span>

          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Created</span>
            <span className={styles.metaValue}>
              {formatDate(transaction.createdAt)}
            </span>
          </div>

          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Last Updated</span>
            <span className={styles.metaValue}>
              {formatDate(transaction.updatedAt)}
            </span>
          </div>

          {transaction.bankTransactionId && (
            <Link
              href={`/banking/transactions`}
              className={styles.linkedBankTransaction}
            >
              <span className={styles.linkedLabel}>
                Linked to bank transaction
              </span>
              <span className={styles.linkedValue}>View →</span>
            </Link>
          )}
        </Card>
      </div>
    </div>
  );
}
