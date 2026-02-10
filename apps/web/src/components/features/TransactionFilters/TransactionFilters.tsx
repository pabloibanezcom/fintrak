'use client';

import { useCallback, useMemo, useState } from 'react';
import { DateSelector } from '@/components/forms';
import {
  Button,
  Card,
  Icon,
  Select,
  type SelectOption,
} from '@/components/primitives';
import styles from './TransactionFilters.module.css';

export interface TransactionFiltersValue {
  search: string;
  dateFrom: string;
  dateTo: string;
  bankId: string;
  accountId: string;
  reviewStatus: string;
}

export interface FilterOption {
  value: string;
  label: string;
}

interface TransactionFiltersProps {
  value: TransactionFiltersValue;
  onChange: (filters: TransactionFiltersValue) => void;
  totalCount?: number;
  banks?: FilterOption[];
  accounts?: FilterOption[];
}

export function TransactionFilters({
  value,
  onChange,
  totalCount,
  banks = [],
  accounts = [],
}: TransactionFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ ...value, search: e.target.value });
    },
    [onChange, value]
  );

  const handleDateChange = useCallback(
    (start: string, end: string) => {
      onChange({
        ...value,
        dateFrom: start,
        dateTo: end,
      });
    },
    [onChange, value]
  );

  const handleBankChange = useCallback(
    (newBankId: string) => {
      onChange({ ...value, bankId: newBankId, accountId: '' });
    },
    [onChange, value]
  );

  const handleAccountChange = useCallback(
    (newAccountId: string) => {
      onChange({ ...value, accountId: newAccountId });
    },
    [onChange, value]
  );

  const handleReviewStatusChange = useCallback(
    (newStatus: string) => {
      onChange({ ...value, reviewStatus: newStatus });
    },
    [onChange, value]
  );

  const handleClearFilters = useCallback(() => {
    onChange({
      search: '',
      dateFrom: '',
      dateTo: '',
      bankId: '',
      accountId: '',
      reviewStatus: '',
    });
  }, [onChange]);

  const hasActiveFilters =
    value.search ||
    value.dateFrom ||
    value.dateTo ||
    value.bankId ||
    value.accountId ||
    value.reviewStatus;

  // Create options with "All" option prepended
  const bankSelectOptions: SelectOption[] = useMemo(
    () => [{ value: '', label: 'All banks' }, ...banks],
    [banks]
  );

  // Filter accounts based on selected bank
  const filteredAccounts = value.bankId
    ? accounts.filter((acc) => acc.value.startsWith(value.bankId))
    : accounts;

  const accountSelectOptions: SelectOption[] = useMemo(
    () => [{ value: '', label: 'All accounts' }, ...filteredAccounts],
    [filteredAccounts]
  );

  const reviewStatusOptions: SelectOption[] = [
    { value: '', label: 'All' },
    { value: 'unreviewed', label: 'Unreviewed' },
    { value: 'linked', label: 'Linked' },
    { value: 'dismissed', label: 'Dismissed' },
  ];

  return (
    <Card padding="md" className={styles.card}>
      <div className={styles.mainRow}>
        <div className={styles.searchWrapper}>
          <Icon name="Search" className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search transactions..."
            value={value.search}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
        </div>

        <button
          type="button"
          className={styles.filterToggle}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Icon name="Settings" />
          <span>Filters</span>
          <Icon
            name="ChevronDown"
            className={`${styles.chevron} ${isExpanded ? styles.expanded : ''}`}
          />
        </button>
      </div>

      {isExpanded && (
        <div className={styles.expandedFilters}>
          <Select
            label="Bank"
            options={bankSelectOptions}
            value={value.bankId}
            onChange={handleBankChange}
            placeholder="All banks"
            className={styles.select}
          />

          <Select
            label="Account"
            options={accountSelectOptions}
            value={value.accountId}
            onChange={handleAccountChange}
            placeholder="All accounts"
            className={styles.select}
          />

          <Select
            label="Status"
            options={reviewStatusOptions}
            value={value.reviewStatus}
            onChange={handleReviewStatusChange}
            placeholder="All"
            className={styles.select}
          />

          <DateSelector
            startDate={value.dateFrom}
            endDate={value.dateTo}
            onChange={handleDateChange}
          />

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={handleClearFilters}>
              Clear filters
            </Button>
          )}
        </div>
      )}

      {totalCount !== undefined && (
        <div className={styles.resultCount}>
          {totalCount} transaction{totalCount !== 1 ? 's' : ''} found
        </div>
      )}
    </Card>
  );
}
