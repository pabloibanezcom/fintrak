import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CreateFromTransactionModal } from './CreateFromTransactionModal';

const {
  getCategoriesSpy,
  searchCounterpartiesSpy,
  createTransactionSpy,
  dismissTransactionSpy,
  undismissTransactionSpy,
  toastSuccessSpy,
} = vi.hoisted(() => ({
  getCategoriesSpy: vi.fn(),
  searchCounterpartiesSpy: vi.fn(),
  createTransactionSpy: vi.fn(),
  dismissTransactionSpy: vi.fn(),
  undismissTransactionSpy: vi.fn(),
  toastSuccessSpy: vi.fn(),
}));

const transaction = {
  _id: 'tx-1',
  userId: 'user-1',
  accountId: 'acc-1',
  bankId: 'bank-1',
  transactionId: 'tr-1',
  timestamp: '2026-02-10T10:00:00.000Z',
  amount: -42.5,
  currency: 'EUR',
  type: 'DEBIT',
  description: 'Coffee shop',
  merchantName: 'Cafe Nero',
  status: 'settled',
  processed: false,
  notified: false,
  dismissed: false,
  createdAt: '2026-02-10T10:00:00.000Z',
  updatedAt: '2026-02-10T10:00:00.000Z',
} as const;

const creditTransaction = {
  ...transaction,
  _id: 'tx-2',
  transactionId: 'tr-2',
  type: 'CREDIT',
  amount: 1200,
  description: 'Salary deposit',
  merchantName: undefined,
} as const;

vi.mock('@/components/modals', () => ({
  Modal: ({
    isOpen,
    title,
    children,
  }: {
    isOpen: boolean;
    title?: string;
    children: React.ReactNode;
  }) =>
    isOpen ? (
      <div>
        {title && <h2>{title}</h2>}
        {children}
      </div>
    ) : null,
}));

vi.mock('@/components/primitives', () => ({
  Button: ({
    children,
    variant: _variant,
    isLoading: _isLoading,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: string;
    isLoading?: boolean;
  }) => (
    <button type="button" {...props}>
      {children}
    </button>
  ),
  Input: ({
    label,
    value,
    onChange,
    placeholder,
    disabled,
  }: {
    label?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    disabled?: boolean;
  }) => (
    <label>
      {label}
      <input
        aria-label={label}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
      />
    </label>
  ),
  Select: ({
    label,
    options,
    value,
    onChange,
    placeholder,
    disabled,
  }: {
    label?: string;
    options: { value: string; label: string }[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
  }) => (
    <label>
      {label}
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        {placeholder && !options.some((opt) => opt.value === '') && (
          <option value="">{placeholder}</option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  ),
  Toggle: ({
    label,
    checked,
    onChange,
    disabled,
  }: {
    label?: string;
    checked?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
  }) => (
    <label>
      {label}
      <input
        type="checkbox"
        role="switch"
        aria-label={label}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
    </label>
  ),
}));

vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => (
    <>
      {/* biome-ignore lint/performance/noImgElement: test mock for next/image */}
      {/* biome-ignore lint/a11y/useAltText: alt is passed by the component under test */}
      <img {...props} />
    </>
  ),
}));

vi.mock('@/services', () => ({
  categoriesService: {
    getCategories: getCategoriesSpy,
  },
  counterpartiesService: {
    search: searchCounterpartiesSpy,
  },
  bankTransactionsService: {
    createTransaction: createTransactionSpy,
    dismissTransaction: dismissTransactionSpy,
    undismissTransaction: undismissTransactionSpy,
  },
}));

vi.mock('@/utils', async () => {
  const actual = await vi.importActual<typeof import('@/utils')>('@/utils');
  return {
    ...actual,
    toast: {
      success: toastSuccessSpy,
    },
  };
});

describe('CreateFromTransactionModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getCategoriesSpy.mockResolvedValue([]);
    searchCounterpartiesSpy.mockResolvedValue({ counterparties: [] });
  });

  it('returns null when transaction is missing', () => {
    const { container } = render(
      <CreateFromTransactionModal isOpen onClose={vi.fn()} transaction={null} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('disables submit until category is selected', async () => {
    getCategoriesSpy.mockResolvedValueOnce([
      { key: 'food', name: 'Food', icon: 'grocery', color: '#f59e0b' },
    ]);

    render(
      <CreateFromTransactionModal
        isOpen
        onClose={vi.fn()}
        transaction={transaction as any}
      />
    );

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Create Expense' })
      ).toHaveProperty('disabled', true);
    });

    expect(createTransactionSpy).not.toHaveBeenCalled();
  });

  it('creates transaction from bank transaction', async () => {
    const onClose = vi.fn();
    const onSuccess = vi.fn();

    getCategoriesSpy.mockResolvedValueOnce([
      { key: 'food', name: 'Food', icon: 'grocery', color: '#f59e0b' },
    ]);
    searchCounterpartiesSpy.mockResolvedValueOnce({
      counterparties: [{ key: 'cafe', name: 'Cafe', parentKey: undefined }],
    });
    createTransactionSpy.mockResolvedValueOnce({});

    render(
      <CreateFromTransactionModal
        isOpen
        onClose={onClose}
        onSuccess={onSuccess}
        transaction={transaction as any}
      />
    );

    await screen.findByRole('option', { name: 'Food' });

    fireEvent.change(screen.getByLabelText('Category *'), {
      target: { value: 'food' },
    });
    fireEvent.change(screen.getByLabelText('Payee'), {
      target: { value: 'cafe' },
    });
    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'Morning coffee' },
    });
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'With client' },
    });

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Create Expense' })
      ).toHaveProperty('disabled', false);
    });

    fireEvent.click(screen.getByRole('button', { name: 'Create Expense' }));

    await waitFor(() => {
      expect(createTransactionSpy).toHaveBeenCalledWith('tx-1', {
        category: 'food',
        counterparty: 'cafe',
        title: 'Morning coffee',
        description: 'With client',
      });
    });

    expect(toastSuccessSpy).toHaveBeenCalledWith(
      'Expense created successfully'
    );
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('dismisses transaction from toggle and notifies parent', async () => {
    const onClose = vi.fn();
    const onDismissChange = vi.fn();

    getCategoriesSpy.mockResolvedValueOnce([]);
    searchCounterpartiesSpy.mockResolvedValueOnce({ counterparties: [] });
    dismissTransactionSpy.mockResolvedValueOnce({});

    render(
      <CreateFromTransactionModal
        isOpen
        onClose={onClose}
        onDismissChange={onDismissChange}
        transaction={transaction as any}
      />
    );

    expect(screen.queryByLabelText('Dismiss note (optional)')).toBeNull();
    fireEvent.click(screen.getByRole('switch', { name: 'Dismiss' }));

    await waitFor(() => {
      expect(dismissTransactionSpy).toHaveBeenCalledWith('tx-1');
    });

    expect(onDismissChange).toHaveBeenCalledWith('tx-1', true);
    expect(toastSuccessSpy).toHaveBeenCalledWith('Transaction dismissed');
    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByLabelText('Dismiss note (optional)')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Create Expense' })).toBeNull();
  });

  it('shows dismiss note input for dismissed transaction and saves it', async () => {
    const onClose = vi.fn();
    const onDismissChange = vi.fn();
    dismissTransactionSpy.mockResolvedValueOnce({});

    render(
      <CreateFromTransactionModal
        isOpen
        onClose={onClose}
        onDismissChange={onDismissChange}
        transaction={
          {
            ...transaction,
            dismissed: true,
            dismissNote: 'Reviewed and ignored',
          } as any
        }
      />
    );

    const dismissNoteInput = screen.getByLabelText('Dismiss note (optional)');
    expect(dismissNoteInput).toHaveProperty('value', 'Reviewed and ignored');
    expect(screen.queryByRole('button', { name: 'Create Expense' })).toBeNull();

    fireEvent.change(dismissNoteInput, {
      target: { value: 'Updated note' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save note' }));

    await waitFor(() => {
      expect(dismissTransactionSpy).toHaveBeenCalledWith(
        'tx-1',
        'Updated note'
      );
    });

    expect(onDismissChange).toHaveBeenCalledWith('tx-1', true, 'Updated note');
    expect(toastSuccessSpy).toHaveBeenCalledWith('Dismiss note saved');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('restores dismissed transaction', async () => {
    const onClose = vi.fn();
    const onDismissChange = vi.fn();
    undismissTransactionSpy.mockResolvedValueOnce({});

    render(
      <CreateFromTransactionModal
        isOpen
        onClose={onClose}
        onDismissChange={onDismissChange}
        transaction={
          {
            ...transaction,
            dismissed: true,
            dismissNote: 'Reviewed and ignored',
          } as any
        }
      />
    );

    expect(screen.getByLabelText('Dismiss note (optional)')).toHaveProperty(
      'value',
      'Reviewed and ignored'
    );
    expect(screen.queryByRole('button', { name: 'Create Expense' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Restore' }));

    await waitFor(() => {
      expect(undismissTransactionSpy).toHaveBeenCalledWith('tx-1');
    });

    expect(onDismissChange).toHaveBeenCalledWith('tx-1', false);
    expect(toastSuccessSpy).toHaveBeenCalledWith('Transaction restored');
    expect(onClose).not.toHaveBeenCalled();
  });

  it('creates an income transaction for credit bank entries', async () => {
    const onClose = vi.fn();
    const onSuccess = vi.fn();

    getCategoriesSpy.mockResolvedValueOnce([
      { key: 'salary', name: 'Salary', icon: 'payroll', color: '#10b981' },
    ]);
    searchCounterpartiesSpy.mockResolvedValueOnce({
      counterparties: [{ key: 'employer', name: 'Employer Inc' }],
    });
    createTransactionSpy.mockResolvedValueOnce({});

    render(
      <CreateFromTransactionModal
        isOpen
        onClose={onClose}
        onSuccess={onSuccess}
        transaction={creditTransaction as any}
      />
    );

    await screen.findByRole('option', { name: 'Salary' });
    expect(screen.getByRole('button', { name: 'Create Income' })).toBeTruthy();

    fireEvent.change(screen.getByLabelText('Category *'), {
      target: { value: 'salary' },
    });
    fireEvent.change(screen.getByLabelText('Source'), {
      target: { value: 'employer' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Create Income' }));

    await waitFor(() => {
      expect(createTransactionSpy).toHaveBeenCalledWith('tx-2', {
        category: 'salary',
        counterparty: 'employer',
        title: 'Salary deposit',
        description: undefined,
      });
    });

    expect(toastSuccessSpy).toHaveBeenCalledWith('Income created successfully');
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders parent-child and orphan counterparty labels', async () => {
    searchCounterpartiesSpy.mockResolvedValueOnce({
      counterparties: [
        { key: 'parent', name: 'Parent Vendor' },
        { key: 'child', name: 'Child Vendor', parentKey: 'parent' },
        { key: 'orphan', name: 'Orphan Vendor', parentKey: 'missing-parent' },
      ],
    });

    render(
      <CreateFromTransactionModal
        isOpen
        onClose={vi.fn()}
        transaction={transaction as any}
      />
    );

    expect(
      await screen.findByRole('option', {
        name: 'Parent Vendor - Child Vendor',
      })
    ).toBeTruthy();
    expect(screen.getByRole('option', { name: 'Orphan Vendor' })).toBeTruthy();
  });

  it('shows account row and hides dismiss toggle when transaction is linked', async () => {
    render(
      <CreateFromTransactionModal
        isOpen
        isLinked
        onClose={vi.fn()}
        transaction={transaction as any}
        bankLogo="/bank.svg"
        accountName="Main account"
      />
    );

    expect(await screen.findByAltText('Bank')).toBeTruthy();
    expect(screen.getByText('Main account')).toBeTruthy();
    expect(screen.queryByRole('switch', { name: 'Dismiss' })).toBeNull();
  });
});
