'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useCallback, useEffect, useState } from 'react';
import { PageContainer, SectionHeader } from '@/components/layout';
import { CreateCategoryModal } from '@/components/modals';
import { Button, Card, Icon, isValidIconName } from '@/components/primitives';
import {
  type Category,
  categoriesService,
  type UserTransaction,
  userTransactionsService,
} from '@/services';
import { formatCurrency, formatDate, toast } from '@/utils';

export default function CategoryDetailPage() {
  const locale = useLocale() as 'en' | 'es';
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
      <PageContainer>
        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Link
        href="/budget/categories"
        className="link-primary"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 'var(--spacing-xs)',
          marginBottom: 'var(--spacing-md)',
        }}
      >
        <Icon name="arrowLeft" size={16} />
        <span>Back to Categories</span>
      </Link>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--spacing-lg)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-md)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '64px',
              height: '64px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: category.color
                ? `${category.color}15`
                : undefined,
              color: category.color || undefined,
            }}
          >
            {category.icon && isValidIconName(category.icon) ? (
              <Icon name={category.icon} size={32} />
            ) : (
              <span style={{ fontSize: '1.5rem', fontWeight: '600' }}>
                {category.name[locale]
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '600', margin: 0 }}>
              {category.name[locale]}
            </h1>
            <p
              style={{
                color: 'var(--color-text-secondary)',
                margin: '0.25rem 0 0',
              }}
            >
              Category details and transactions
            </p>
          </div>
        </div>

        <Button onClick={handleEditClick} variant="ghost" size="sm">
          <Icon name="settings" size={16} />
          <span>Edit</span>
        </Button>
      </div>

      <div className="grid-3col">
        <Card className="card-container">
          <div
            style={{
              fontSize: '0.875rem',
              color: 'var(--color-text-secondary)',
              marginBottom: '0.5rem',
            }}
          >
            Total Expenses
          </div>
          <div
            style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              marginBottom: '0.25rem',
            }}
          >
            {formatCurrency(stats.totalExpenses, 'EUR')}
          </div>
          <div
            style={{
              fontSize: '0.875rem',
              color: 'var(--color-text-secondary)',
            }}
          >
            {stats.expenseCount} transactions
          </div>
        </Card>

        <Card className="card-container">
          <div
            style={{
              fontSize: '0.875rem',
              color: 'var(--color-text-secondary)',
              marginBottom: '0.5rem',
            }}
          >
            Total Income
          </div>
          <div
            style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              marginBottom: '0.25rem',
            }}
          >
            {formatCurrency(stats.totalIncome, 'EUR')}
          </div>
          <div
            style={{
              fontSize: '0.875rem',
              color: 'var(--color-text-secondary)',
            }}
          >
            {stats.incomeCount} transactions
          </div>
        </Card>

        <Card className="card-container">
          <div
            style={{
              fontSize: '0.875rem',
              color: 'var(--color-text-secondary)',
              marginBottom: '0.5rem',
            }}
          >
            Net
          </div>
          <div
            style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              marginBottom: '0.25rem',
              color:
                stats.totalIncome - stats.totalExpenses >= 0
                  ? 'var(--color-success)'
                  : 'var(--color-error)',
            }}
          >
            {formatCurrency(stats.totalIncome - stats.totalExpenses, 'EUR')}
          </div>
          <div
            style={{
              fontSize: '0.875rem',
              color: 'var(--color-text-secondary)',
            }}
          >
            {stats.expenseCount + stats.incomeCount} total
          </div>
        </Card>
      </div>

      <div className="flex-col">
        <SectionHeader title="Transactions" />

        {isLoading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            Loading transactions...
          </div>
        ) : transactions.length === 0 ? (
          <Card className="card-container">
            <p>No transactions found for this category.</p>
          </Card>
        ) : (
          <div className="flex-col">
            {transactions.map((tx) => (
              <Card key={tx._id} className="card-container" padding="sm">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 'var(--spacing-md)',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                      {tx.title}
                    </div>
                    {tx.description && (
                      <div
                        style={{
                          fontSize: '0.875rem',
                          color: 'var(--color-text-secondary)',
                          marginBottom: '0.25rem',
                        }}
                      >
                        {tx.description}
                      </div>
                    )}
                    <div
                      style={{
                        fontSize: '0.875rem',
                        color: 'var(--color-text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      <span>{formatDate(tx.date)}</span>
                      {tx.counterparty && (
                        <>
                          <span>•</span>
                          <span>{tx.counterparty.name}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div
                    style={{
                      fontWeight: '600',
                      whiteSpace: 'nowrap',
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
    </PageContainer>
  );
}
