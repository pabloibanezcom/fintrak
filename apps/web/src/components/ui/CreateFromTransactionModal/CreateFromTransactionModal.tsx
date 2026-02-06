'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  type BankTransaction,
  bankTransactionsService,
  type Category,
  type Counterparty,
  categoriesService,
  counterpartiesService,
} from '@/services';
import { formatCurrency, formatDate, toast } from '@/utils';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import { Modal } from '../Modal/Modal';
import { Select } from '../Select/Select';
import styles from './CreateFromTransactionModal.module.css';

export interface CreateFromTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: BankTransaction | null;
  onSuccess?: () => void;
}

export function CreateFromTransactionModal({
  isOpen,
  onClose,
  transaction,
  onSuccess,
}: CreateFromTransactionModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [counterparties, setCounterparties] = useState<Counterparty[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    category: '',
    counterparty: '',
    title: '',
    description: '',
  });

  const isExpense = transaction?.type === 'DEBIT';
  const modalTitle = isExpense ? 'Create Expense' : 'Create Income';
  const counterpartyLabel = isExpense ? 'Payee' : 'Source';

  const loadData = useCallback(async () => {
    setIsLoadingData(true);
    try {
      const [categoriesData, counterpartiesData] = await Promise.all([
        categoriesService.getCategories(),
        counterpartiesService.search({ limit: 100 }),
      ]);
      setCategories(categoriesData);
      setCounterparties(counterpartiesData.counterparties);
    } catch (err) {
      console.error('Failed to load form data:', err);
      setError('Failed to load categories and counterparties');
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadData();
      setFormData({
        category: '',
        counterparty: '',
        title: transaction?.merchantName || transaction?.description || '',
        description: '',
      });
      setError(null);
    }
  }, [isOpen, transaction, loadData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!transaction || !formData.category) {
      setError('Please select a category');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await bankTransactionsService.createTransaction(transaction._id, {
        category: formData.category,
        counterparty: formData.counterparty || undefined,
        title: formData.title || undefined,
        description: formData.description || undefined,
      });

      const transactionType = isExpense ? 'Expense' : 'Income';
      toast.success(`${transactionType} created successfully`);

      onSuccess?.();
      onClose();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to create record';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryOptions = categories.map((cat) => ({
    value: cat.key,
    label: cat.name,
  }));

  const counterpartyOptions = [
    { value: '', label: 'None' },
    ...counterparties.map((cp) => ({
      value: cp.key,
      label: cp.name,
    })),
  ];

  if (!transaction) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle} size="md">
      <div className={styles.container}>
        <div className={styles.transactionInfo}>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Amount</span>
            <span
              className={`${styles.infoValue} ${isExpense ? styles.debit : styles.credit}`}
            >
              {isExpense ? '-' : '+'}
              {formatCurrency(
                Math.abs(transaction.amount),
                transaction.currency
              )}
            </span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Date</span>
            <span className={styles.infoValue}>
              {formatDate(transaction.timestamp)}
            </span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Description</span>
            <span className={styles.infoValue}>{transaction.description}</span>
          </div>
          {transaction.merchantName && (
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Merchant</span>
              <span className={styles.infoValue}>
                {transaction.merchantName}
              </span>
            </div>
          )}
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <Select
            label="Category *"
            options={categoryOptions}
            value={formData.category}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, category: value }))
            }
            placeholder="Select a category..."
            disabled={isLoadingData}
          />

          <Select
            label={counterpartyLabel}
            options={counterpartyOptions}
            value={formData.counterparty}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, counterparty: value }))
            }
            placeholder={`Select ${counterpartyLabel.toLowerCase()}...`}
            disabled={isLoadingData}
          />

          <Input
            label="Title"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="Override default title..."
          />

          <Input
            label="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder="Add notes..."
          />

          <div className={styles.actions}>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              disabled={isLoadingData || !formData.category}
            >
              {isExpense ? 'Create Expense' : 'Create Income'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
