import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CreateCounterpartyModal } from './CreateCounterpartyModal';

const {
  getCategoriesSpy,
  createCounterpartySpy,
  updateCounterpartySpy,
  toastSuccessSpy,
} = vi.hoisted(() => ({
  getCategoriesSpy: vi.fn(),
  createCounterpartySpy: vi.fn(),
  updateCounterpartySpy: vi.fn(),
  toastSuccessSpy: vi.fn(),
}));

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
    type = 'text',
  }: {
    label?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    disabled?: boolean;
    type?: string;
  }) => (
    <label>
      {label}
      <input
        type={type}
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
    disabled,
  }: {
    label?: string;
    options: { value: string; label: string }[];
    value: string;
    onChange: (value: string) => void;
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
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  ),
}));

vi.mock('@/services', () => ({
  categoriesService: {
    getCategories: getCategoriesSpy,
  },
  counterpartiesService: {
    create: createCounterpartySpy,
    update: updateCounterpartySpy,
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

describe('CreateCounterpartyModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getCategoriesSpy.mockResolvedValue([]);
  });

  it('disables submit when name is missing', async () => {
    render(<CreateCounterpartyModal isOpen onClose={vi.fn()} />);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Create Counterparty' })
      ).toHaveProperty('disabled', true);
    });

    expect(createCounterpartySpy).not.toHaveBeenCalled();
  });

  it('creates a counterparty and clears optional fields', async () => {
    const onClose = vi.fn();
    const onSuccess = vi.fn();
    getCategoriesSpy.mockResolvedValueOnce([
      { key: 'food', name: 'Food', color: '#f59e0b', icon: 'grocery' },
    ]);
    createCounterpartySpy.mockResolvedValueOnce({});

    render(
      <CreateCounterpartyModal isOpen onClose={onClose} onSuccess={onSuccess} />
    );

    fireEvent.change(screen.getByLabelText('Name *'), {
      target: { value: 'Acme Corp' },
    });
    fireEvent.change(screen.getByLabelText('Type'), {
      target: { value: 'company' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Create Counterparty' }));

    await waitFor(() => {
      expect(createCounterpartySpy).toHaveBeenCalledWith({
        name: 'Acme Corp',
        type: 'company',
        email: undefined,
        phone: undefined,
        address: undefined,
        notes: undefined,
        defaultCategory: undefined,
      });
    });

    expect(toastSuccessSpy).toHaveBeenCalledWith(
      'Counterparty created successfully'
    );
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('updates a counterparty in edit mode', async () => {
    getCategoriesSpy.mockResolvedValueOnce([]);
    updateCounterpartySpy.mockResolvedValueOnce({});

    render(
      <CreateCounterpartyModal
        isOpen
        onClose={vi.fn()}
        counterparty={
          {
            key: 'acme',
            name: 'Acme',
            type: 'company',
            email: 'hello@acme.com',
          } as any
        }
      />
    );

    fireEvent.change(screen.getByLabelText('Name *'), {
      target: { value: 'Acme Updated' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));

    await waitFor(() => {
      expect(updateCounterpartySpy).toHaveBeenCalledWith('acme', {
        name: 'Acme Updated',
        type: 'company',
        email: 'hello@acme.com',
        phone: undefined,
        address: undefined,
        notes: undefined,
        defaultCategory: undefined,
      });
    });

    expect(toastSuccessSpy).toHaveBeenCalledWith(
      'Counterparty updated successfully'
    );
  });
});
