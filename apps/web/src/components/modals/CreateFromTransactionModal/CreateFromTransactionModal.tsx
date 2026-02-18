'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { Modal } from '@/components/modals';
import { Button, Input, Select, Toggle } from '@/components/primitives';
import {
  type BankTransaction,
  bankTransactionsService,
  type Category,
  type Counterparty,
  categoriesService,
  counterpartiesService,
} from '@/services';
import { formatCurrency, formatDate, getLocalizedText, toast } from '@/utils';
import styles from './CreateFromTransactionModal.module.css';

export interface CreateFromTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: BankTransaction | null;
  isLinked?: boolean;
  bankLogo?: string;
  bankName?: string;
  accountName?: string;
  onSuccess?: () => void;
  onDismissChange?: (
    transactionId: string,
    dismissed: boolean,
    dismissNote?: string
  ) => void;
}

export function CreateFromTransactionModal({
  isOpen,
  onClose,
  transaction,
  isLinked = false,
  bankLogo,
  bankName,
  accountName,
  onSuccess,
  onDismissChange,
}: CreateFromTransactionModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [counterparties, setCounterparties] = useState<Counterparty[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDismissing, setIsDismissing] = useState(false);
  const [isSavingDismissNote, setIsSavingDismissNote] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [dismissNote, setDismissNote] = useState('');
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
      setIsDismissed(transaction?.dismissed ?? false);
      setDismissNote(transaction?.dismissNote || '');
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

  const handleDismissToggle = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!transaction) return;

    const shouldDismiss = e.target.checked;
    setIsDismissed(shouldDismiss);
    setIsDismissing(true);
    setError(null);

    try {
      if (shouldDismiss) {
        await bankTransactionsService.dismissTransaction(transaction._id);
        toast.success('Transaction dismissed');
      } else {
        await bankTransactionsService.undismissTransaction(transaction._id);
        toast.success('Transaction restored');
      }
      onDismissChange?.(transaction._id, shouldDismiss);
    } catch (err) {
      setIsDismissed(!shouldDismiss);
      const message =
        err instanceof Error ? err.message : 'Failed to update transaction';
      setError(message);
    } finally {
      setIsDismissing(false);
    }
  };

  const handleDismissNoteSave = async () => {
    if (!transaction || !isDismissed) return;

    setIsSavingDismissNote(true);
    setError(null);
    const note = dismissNote.trim();

    try {
      await bankTransactionsService.dismissTransaction(
        transaction._id,
        note || undefined
      );
      onDismissChange?.(transaction._id, true, note || undefined);
      toast.success('Dismiss note saved');
      onClose();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to save dismiss note';
      setError(message);
    } finally {
      setIsSavingDismissNote(false);
    }
  };

  const handleRestoreDismissed = async () => {
    if (!transaction) return;

    setIsDismissing(true);
    setError(null);

    try {
      await bankTransactionsService.undismissTransaction(transaction._id);
      setIsDismissed(false);
      setDismissNote('');
      onDismissChange?.(transaction._id, false);
      toast.success('Transaction restored');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to update transaction';
      setError(message);
    } finally {
      setIsDismissing(false);
    }
  };

  const categoryOptions = categories.map((cat) => ({
    value: cat.key,
    label: getLocalizedText(cat.name) || cat.key,
  }));

  const counterpartyOptions = (() => {
    // Build a map of parent names for "Parent - Child" labelling
    const parentNameMap = new Map<string, string>();
    for (const cp of counterparties) {
      if (!cp.parentKey) {
        parentNameMap.set(cp.key, cp.name);
      }
    }

    // Separate parents and children, sort alphabetically
    const parents = counterparties
      .filter((cp) => !cp.parentKey)
      .sort((a, b) => a.name.localeCompare(b.name));
    const children = counterparties
      .filter((cp) => cp.parentKey)
      .sort((a, b) => {
        // Group by parent, then alphabetically
        const parentCmp = (a.parentKey || '').localeCompare(b.parentKey || '');
        return parentCmp !== 0 ? parentCmp : a.name.localeCompare(b.name);
      });

    // Build flat list: parents first, then children grouped under parent
    const sorted: Counterparty[] = [];
    for (const parent of parents) {
      sorted.push(parent);
      for (const child of children) {
        if (child.parentKey === parent.key) {
          sorted.push(child);
        }
      }
    }
    // Add orphan children (parent not in list)
    for (const child of children) {
      if (child.parentKey && !parentNameMap.has(child.parentKey)) {
        sorted.push(child);
      }
    }

    return [
      { value: '', label: 'None' },
      ...sorted.map((cp) => ({
        value: cp.key,
        label:
          cp.parentKey && parentNameMap.has(cp.parentKey)
            ? `${parentNameMap.get(cp.parentKey)} - ${cp.name}`
            : cp.name,
      })),
    ];
  })();

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
          {(bankLogo || accountName) && (
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Account</span>
              <span className={`${styles.infoValue} ${styles.accountValue}`}>
                {bankLogo && (
                  <Image
                    src={bankLogo}
                    alt={bankName || 'Bank'}
                    width={18}
                    height={18}
                    className={styles.bankLogo}
                  />
                )}
                {accountName}
              </span>
            </div>
          )}
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {isDismissed ? (
          <div className={styles.form}>
            <Input
              label="Dismiss note (optional)"
              value={dismissNote}
              onChange={(e) => setDismissNote(e.target.value)}
              placeholder="Reason for dismissing this transaction"
              disabled={isDismissing || isSavingDismissNote}
            />

            <div className={styles.actions}>
              <div />
              <div className={styles.actionsRight}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isDismissing}
                >
                  Close
                </Button>
                {!isLinked && (
                  <Button
                    type="button"
                    variant="outline"
                    isLoading={isDismissing}
                    onClick={handleRestoreDismissed}
                  >
                    Restore
                  </Button>
                )}
                <Button
                  type="button"
                  variant="primary"
                  isLoading={isSavingDismissNote}
                  onClick={handleDismissNoteSave}
                  disabled={isDismissing}
                >
                  Save note
                </Button>
              </div>
            </div>
          </div>
        ) : (
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
              {!isLinked && (
                <Toggle
                  label="Dismiss"
                  size="sm"
                  checked={isDismissed}
                  onChange={handleDismissToggle}
                  disabled={isSubmitting || isDismissing}
                />
              )}
              <div className={styles.actionsRight}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting || isDismissing}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isSubmitting}
                  disabled={isLoadingData || !formData.category || isDismissing}
                >
                  {isExpense ? 'Create Expense' : 'Create Income'}
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}
