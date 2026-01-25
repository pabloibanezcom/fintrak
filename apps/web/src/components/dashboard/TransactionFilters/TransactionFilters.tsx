'use client';

import { useCallback, useState } from 'react';
import { Button, Card, Icon, Input } from '@/components/ui';
import styles from './TransactionFilters.module.css';

export interface TransactionFiltersValue {
  search: string;
  dateFrom: string;
  dateTo: string;
  bankId: string;
  accountId: string;
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

  const handleDateFromChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ ...value, dateFrom: e.target.value });
    },
    [onChange, value]
  );

  const handleDateToChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ ...value, dateTo: e.target.value });
    },
    [onChange, value]
  );

  const handleBankChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange({ ...value, bankId: e.target.value, accountId: '' });
    },
    [onChange, value]
  );

  const handleAccountChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange({ ...value, accountId: e.target.value });
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
    });
  }, [onChange]);

  const hasActiveFilters =
    value.search ||
    value.dateFrom ||
    value.dateTo ||
    value.bankId ||
    value.accountId;

  // Filter accounts based on selected bank
  const filteredAccounts = value.bankId
    ? accounts.filter((acc) => acc.value.startsWith(value.bankId))
    : accounts;

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
          <div className={styles.filterGroup}>
            <label htmlFor="bank-filter" className={styles.filterLabel}>
              Bank
            </label>
            <select
              id="bank-filter"
              value={value.bankId}
              onChange={handleBankChange}
              className={styles.select}
            >
              <option value="">All banks</option>
              {banks.map((bank) => (
                <option key={bank.value} value={bank.value}>
                  {bank.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="account-filter" className={styles.filterLabel}>
              Account
            </label>
            <select
              id="account-filter"
              value={value.accountId}
              onChange={handleAccountChange}
              className={styles.select}
            >
              <option value="">All accounts</option>
              {filteredAccounts.map((account) => (
                <option key={account.value} value={account.value}>
                  {account.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.dateFilters}>
            <Input
              type="date"
              label="From"
              value={value.dateFrom}
              onChange={handleDateFromChange}
            />
            <Input
              type="date"
              label="To"
              value={value.dateTo}
              onChange={handleDateToChange}
            />
          </div>

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
