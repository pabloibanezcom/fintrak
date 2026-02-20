import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CreateCategoryModal } from './CreateCategoryModal';

const { createCategorySpy, updateCategorySpy, toastSuccessSpy } = vi.hoisted(
  () => ({
    createCategorySpy: vi.fn(),
    updateCategorySpy: vi.fn(),
    toastSuccessSpy: vi.fn(),
  })
);

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

vi.mock('@/components/forms', () => ({
  ColorPicker: ({
    value,
    onChange,
    label,
  }: {
    value: string;
    onChange: (color: string) => void;
    label?: string;
  }) => (
    <div>
      <span>{label}</span>
      <button type="button" onClick={() => onChange('#10B981')}>
        Pick color {value}
      </button>
    </div>
  ),
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
  isValidIconName: (name: string) => name !== 'invalid-icon',
}));

vi.mock('@/services', () => ({
  categoriesService: {
    create: createCategorySpy,
    update: updateCategorySpy,
  },
}));

vi.mock('@/utils', () => ({
  toast: {
    success: toastSuccessSpy,
  },
}));

describe('CreateCategoryModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('disables submit when required names are missing', () => {
    render(<CreateCategoryModal isOpen onClose={vi.fn()} />);

    expect(
      screen.getByRole('button', { name: 'Create Category' })
    ).toHaveProperty('disabled', true);

    expect(createCategorySpy).not.toHaveBeenCalled();
  });

  it('shows validation error when icon is invalid', async () => {
    render(<CreateCategoryModal isOpen onClose={vi.fn()} />);

    fireEvent.change(screen.getByLabelText('Name (English) *'), {
      target: { value: 'Home Bills' },
    });
    fireEvent.change(screen.getByLabelText('Name (Spanish) *'), {
      target: { value: 'Facturas de casa' },
    });
    fireEvent.change(screen.getByLabelText('Icon'), {
      target: { value: 'invalid-icon' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Create Category' }));

    await waitFor(() => {
      expect(screen.getByText('Invalid icon name')).toBeTruthy();
    });
  });

  it('creates category successfully with generated key', async () => {
    const onClose = vi.fn();
    const onSuccess = vi.fn();
    createCategorySpy.mockResolvedValueOnce({});

    render(
      <CreateCategoryModal isOpen onClose={onClose} onSuccess={onSuccess} />
    );

    fireEvent.change(screen.getByLabelText('Name (English) *'), {
      target: { value: 'Home Bills' },
    });
    fireEvent.change(screen.getByLabelText('Name (Spanish) *'), {
      target: { value: 'Facturas de casa' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Pick color/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Create Category' }));

    await waitFor(() => {
      expect(createCategorySpy).toHaveBeenCalledWith({
        key: 'home-bills',
        name: {
          en: 'Home Bills',
          es: 'Facturas de casa',
        },
        icon: undefined,
        color: '#10B981',
      });
    });

    expect(toastSuccessSpy).toHaveBeenCalledWith(
      'Category created successfully'
    );
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('updates category successfully in edit mode', async () => {
    const onClose = vi.fn();
    updateCategorySpy.mockResolvedValueOnce({});

    render(
      <CreateCategoryModal
        isOpen
        onClose={onClose}
        category={
          {
            key: 'utilities',
            name: { en: 'Utilities', es: 'Servicios' },
            icon: 'utilities',
            color: '#64748B',
          } as any
        }
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));

    await waitFor(() => {
      expect(updateCategorySpy).toHaveBeenCalledWith('utilities', {
        name: { en: 'Utilities', es: 'Servicios' },
        icon: 'utilities',
        color: '#64748B',
      });
    });

    expect(toastSuccessSpy).toHaveBeenCalledWith(
      'Category updated successfully'
    );
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
