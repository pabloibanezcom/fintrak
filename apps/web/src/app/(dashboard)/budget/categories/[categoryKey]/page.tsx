'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CreateCategoryModal,
  Icon,
  isValidIconName,
} from '@/components/ui';
import {
  type Category,
  categoriesService,
  type UserTransaction,
  userTransactionsService,
} from '@/services';
import { formatCurrency, formatDate, toast } from '@/utils';
import styles from './page.module.css';

export default function CategoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const categoryKey = params.categoryKey as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [transactions, setTransactions] = useState<UserTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 50,
    offset: 0,
    hasMore: false,
  });

  const fetchCategory = useCallback(async () => {
    try {
      const data = await categoriesService.getCategory(categoryKey);
      setCategory(data);
    } catch (error) {
      console.error('Failed to fetch category:', error);
      toast.error('Failed to load category');
      router.push('/budget/categories');
    }
  }, [categoryKey, router]);

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await userTransactionsService.search({
        category: categoryKey,
        sortBy: 'date',
        sortOrder: 'desc',
        limit: pagination.limit,
        offset: pagination.offset,
      });
      setTransactions(response.transactions);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      toast.error('Failed to load transactions');
    } finally {
      setIsLoading(false);
    }
  }, [categoryKey, pagination.limit, pagination.offset]);

  useEffect(() => {
    fetchCategory();
    fetchTransactions();
  }, [fetchCategory, fetchTransactions]);

  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSuccess = () => {
    fetchCategory();
  };

  // Calculate statistics
  const stats = transactions.reduce(
    (acc, tx) => {
      if (tx.type === 'expense') {
        acc.totalExpenses += tx.amount;
        acc.expenseCount += 1;
      } else {
        acc.totalIncome += tx.amount;
        acc.incomeCount += 1;
      }
      return acc;
    },
    { totalExpenses: 0, expenseCount: 0, totalIncome: 0, incomeCount: 0 }
  );

  if (!category) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Link href="/budget/categories" className={styles.backLink}>
          <Icon name="arrowLeft" size={16} />
          <span>Back to Categories</span>
        </Link>

        <div className={styles.headerContent}>
          <div className={styles.categoryInfo}>
            <div
              className={styles.categoryIcon}
              style={{
                backgroundColor: category.color
                  ? `${category.color}15`
                  : undefined,
                color: category.color || undefined,
              }}
            >
              {category.icon && isValidIconName(category.icon) ? (
                <Icon name={category.icon} size={32} />
              ) : (
                <span className={styles.iconText}>
                  {category.name
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase()}
                </span>
              )}
            </div>
            <div className={styles.categoryDetails}>
              <h1 className={styles.title}>{category.name}</h1>
              <p className={styles.subtitle}>Category details and transactions</p>
            </div>
          </div>

          <div className={styles.actions}>
            <Button onClick={handleEditClick} variant="ghost" size="sm">
              <Icon name="settings" size={16} />
              <span>Edit</span>
            </Button>
          </div>
        </div>
      </div>

      <div className={styles.stats}>
        <Card className={styles.statCard}>
          <div className={styles.statLabel}>Total Expenses</div>
          <div className={styles.statValue}>
            {formatCurrency(stats.totalExpenses, 'EUR')}
          </div>
          <div className={styles.statCount}>{stats.expenseCount} transactions</div>
        </Card>

        <Card className={styles.statCard}>
          <div className={styles.statLabel}>Total Income</div>
          <div className={styles.statValue}>
            {formatCurrency(stats.totalIncome, 'EUR')}
          </div>
          <div className={styles.statCount}>{stats.incomeCount} transactions</div>
        </Card>

        <Card className={styles.statCard}>
          <div className={styles.statLabel}>Net</div>
          <div
            className={styles.statValue}
            style={{
              color:
                stats.totalIncome - stats.totalExpenses >= 0
                  ? 'var(--color-success)'
                  : 'var(--color-error)',
            }}
          >
            {formatCurrency(stats.totalIncome - stats.totalExpenses, 'EUR')}
          </div>
          <div className={styles.statCount}>
            {stats.expenseCount + stats.incomeCount} total
          </div>
        </Card>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Transactions</h2>

        {isLoading ? (
          <div className={styles.loading}>Loading transactions...</div>
        ) : transactions.length === 0 ? (
          <Card className={styles.empty}>
            <p>No transactions found for this category.</p>
          </Card>
        ) : (
          <div className={styles.transactions}>
            {transactions.map((tx) => (
              <Card key={tx._id} className={styles.transactionCard} padding="sm">
                <div className={styles.transactionMain}>
                  <div className={styles.transactionInfo}>
                    <div className={styles.transactionTitle}>{tx.title}</div>
                    {tx.description && (
                      <div className={styles.transactionDescription}>
                        {tx.description}
                      </div>
                    )}
                    <div className={styles.transactionMeta}>
                      <span>{formatDate(tx.date)}</span>
                      {tx.counterparty && (
                        <>
                          <span className={styles.separator}>•</span>
                          <span>{tx.counterparty.name}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div
                    className={styles.transactionAmount}
                    style={{
                      color:
                        tx.type === 'income'
                          ? 'var(--color-success)'
                          : 'var(--color-error)',
                    }}
                  >
                    {tx.type === 'income' ? '+' : '-'}
                    {formatCurrency(tx.amount, tx.currency)}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <CreateCategoryModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        category={category}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
