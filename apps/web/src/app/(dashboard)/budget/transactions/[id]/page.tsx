'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { PageContainer } from '@/components/layout';
import { Button, Card, Icon } from '@/components/primitives';
import { type UserTransaction, userTransactionsService } from '@/services';
import { formatCurrency, formatDate, getLocalizedText } from '@/utils';

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
      <PageContainer>
        <Card
          padding="lg"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--spacing-md)',
          }}
        >
          <Icon name="Loader" />
          <span>Loading transaction...</span>
        </Card>
      </PageContainer>
    );
  }

  if (error || !transaction) {
    return (
      <PageContainer>
        <Card
          padding="lg"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--spacing-md)',
          }}
        >
          <span style={{ color: 'var(--color-error)' }}>
            {error || 'Transaction not found'}
          </span>
          <Button variant="outline" onClick={() => router.back()}>
            Go Back
          </Button>
        </Card>
      </PageContainer>
    );
  }

  const isExpense = transaction.type === 'expense';
  const categoryName =
    getLocalizedText(transaction.category?.name) || 'Uncategorized';
  const counterpartyName = getLocalizedText(transaction.counterparty?.name);

  return (
    <PageContainer>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-md)',
          marginBottom: 'var(--spacing-lg)',
        }}
      >
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Go back"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--color-background-secondary)',
            cursor: 'pointer',
            color: 'inherit',
          }}
        >
          <Icon name="ChevronLeft" />
        </button>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '600', margin: 0 }}>
            {transaction.title}
          </h1>
          <p
            style={{
              color: 'var(--color-text-secondary)',
              margin: '0.25rem 0 0',
            }}
          >
            {isExpense ? 'Expense' : 'Income'} • {formatDate(transaction.date)}
          </p>
        </div>
      </div>

      <div className="grid-2col" style={{ alignItems: 'start' }}>
        <Card padding="lg" className="card-container">
          <div
            style={{ textAlign: 'center', marginBottom: 'var(--spacing-lg)' }}
          >
            <span
              style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: isExpense
                  ? 'var(--color-error)'
                  : 'var(--color-success)',
              }}
            >
              {isExpense ? '-' : '+'}
              {formatCurrency(transaction.amount, transaction.currency)}
            </span>
            <span
              style={{
                display: 'inline-block',
                marginLeft: 'var(--spacing-sm)',
                padding: '0.25rem 0.5rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: isExpense
                  ? 'var(--color-error-bg)'
                  : 'var(--color-success-bg)',
                color: isExpense
                  ? 'var(--color-error)'
                  : 'var(--color-success)',
                fontSize: '0.875rem',
                fontWeight: '500',
                textTransform: 'capitalize',
              }}
            >
              {transaction.type}
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 'var(--spacing-md)',
            }}
          >
            <div>
              <span
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--color-text-secondary)',
                  display: 'block',
                  marginBottom: '0.25rem',
                }}
              >
                Category
              </span>
              <span style={{ fontWeight: '500' }}>
                {categoryName}
              </span>
            </div>
            <div>
              <span
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--color-text-secondary)',
                  display: 'block',
                  marginBottom: '0.25rem',
                }}
              >
                Date
              </span>
              <span style={{ fontWeight: '500' }}>
                {formatDate(transaction.date)}
              </span>
            </div>
            {transaction.counterparty && (
              <div>
                <span
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--color-text-secondary)',
                    display: 'block',
                    marginBottom: '0.25rem',
                  }}
                >
                  {isExpense ? 'Payee' : 'Source'}
                </span>
                <span style={{ fontWeight: '500' }}>
                  {counterpartyName}
                </span>
              </div>
            )}
            <div>
              <span
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--color-text-secondary)',
                  display: 'block',
                  marginBottom: '0.25rem',
                }}
              >
                Periodicity
              </span>
              <span style={{ fontWeight: '500' }}>
                {transaction.periodicity === 'NOT_RECURRING'
                  ? 'One-time'
                  : transaction.periodicity}
              </span>
            </div>
          </div>

          {transaction.description && (
            <div
              style={{
                marginTop: 'var(--spacing-lg)',
                paddingTop: 'var(--spacing-lg)',
                borderTop: '1px solid var(--color-border)',
              }}
            >
              <span
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--color-text-secondary)',
                  display: 'block',
                  marginBottom: '0.5rem',
                }}
              >
                Description
              </span>
              <p style={{ margin: 0, lineHeight: '1.5' }}>
                {transaction.description}
              </p>
            </div>
          )}
        </Card>

        <Card padding="md" className="card-container">
          <span
            style={{
              fontSize: '1rem',
              fontWeight: '600',
              display: 'block',
              marginBottom: 'var(--spacing-md)',
            }}
          >
            Details
          </span>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-sm)',
            }}
          >
            <div>
              <span
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--color-text-secondary)',
                  display: 'block',
                  marginBottom: '0.25rem',
                }}
              >
                Created
              </span>
              <span style={{ fontSize: '0.875rem' }}>
                {formatDate(transaction.createdAt)}
              </span>
            </div>

            <div>
              <span
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--color-text-secondary)',
                  display: 'block',
                  marginBottom: '0.25rem',
                }}
              >
                Last Updated
              </span>
              <span style={{ fontSize: '0.875rem' }}>
                {formatDate(transaction.updatedAt)}
              </span>
            </div>

            {transaction.bankTransactionId && (
              <Link
                href={`/banking/transactions`}
                className="link-primary"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: 'var(--spacing-sm)',
                  marginTop: 'var(--spacing-sm)',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-background-secondary)',
                  textDecoration: 'none',
                }}
              >
                <span
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--color-text-secondary)',
                    marginBottom: '0.25rem',
                  }}
                >
                  Linked to bank transaction
                </span>
                <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                  View →
                </span>
              </Link>
            )}
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
