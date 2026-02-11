import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  TransactionFilters,
  type TransactionFiltersValue,
} from './TransactionFilters';

vi.mock('@/components/forms', () => ({
  DateSelector: ({
    onChange,
  }: {
    onChange: (start: string, end: string) => void;
  }) => (
    <button type="button" onClick={() => onChange('2026-01-01', '2026-01-31')}>
      Pick date range
    </button>
  ),
}));

vi.mock('@/components/primitives', async () => {
  const actual = await vi.importActual<
    typeof import('@/components/primitives')
  >('@/components/primitives');

  return {
    ...actual,
    Icon: ({ name }: { name: string }) => <span data-testid={`icon-${name}`} />,
    Select: ({
      label,
      options,
      value,
      onChange,
    }: {
      label?: string;
      options: { value: string; label: string }[];
      value: string;
      onChange: (next: string) => void;
    }) => (
      <label>
        {label}
        <select value={value} onChange={(e) => onChange(e.target.value)}>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>
    ),
  };
});

describe('TransactionFilters', () => {
  const baseValue: TransactionFiltersValue = {
    search: '',
    dateFrom: '',
    dateTo: '',
    bankId: '',
    accountId: '',
    reviewStatus: '',
  };

  it('updates search input and shows total count', () => {
    const onChange = vi.fn();

    render(
      <TransactionFilters
        value={baseValue}
        onChange={onChange}
        totalCount={5}
      />
    );

    fireEvent.change(screen.getByPlaceholderText('Search transactions...'), {
      target: { value: 'rent' },
    });

    expect(onChange).toHaveBeenCalledWith({ ...baseValue, search: 'rent' });
    expect(screen.getByText('5 transactions found')).toBeTruthy();
  });

  it('expands filters, applies bank/date changes and clears active filters', () => {
    const onChange = vi.fn();

    render(
      <TransactionFilters
        value={{ ...baseValue, search: 'coffee' }}
        onChange={onChange}
        banks={[{ value: 'bank-a', label: 'Bank A' }]}
        accounts={[{ value: 'bank-a-account-1', label: 'Checking' }]}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Filters/i }));
    fireEvent.change(screen.getByLabelText('Bank'), {
      target: { value: 'bank-a' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Pick date range' }));
    fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }));

    expect(onChange).toHaveBeenCalledWith({
      ...baseValue,
      search: 'coffee',
      bankId: 'bank-a',
      accountId: '',
    });
    expect(onChange).toHaveBeenCalledWith({
      ...baseValue,
      search: 'coffee',
      dateFrom: '2026-01-01',
      dateTo: '2026-01-31',
    });
    expect(onChange).toHaveBeenCalledWith(baseValue);
  });
});
