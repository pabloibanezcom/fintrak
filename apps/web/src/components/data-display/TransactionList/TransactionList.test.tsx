import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TransactionList, type TransactionListItem } from './TransactionList';

vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => (
    <>
      {/* biome-ignore lint/performance/noImgElement: test mock for next/image */}
      {/* biome-ignore lint/a11y/useAltText: alt is passed by the component under test */}
      <img {...props} />
    </>
  ),
}));

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...props
  }: { href: string; children: ReactNode } & Record<string, unknown>) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

interface MockIntersectionObserverInstance {
  callback: IntersectionObserverCallback;
  observe: ReturnType<typeof vi.fn>;
  disconnect: ReturnType<typeof vi.fn>;
  unobserve: ReturnType<typeof vi.fn>;
}

const ioInstances: MockIntersectionObserverInstance[] = [];

class MockIntersectionObserver implements MockIntersectionObserverInstance {
  callback: IntersectionObserverCallback;
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    ioInstances.push(this);
  }
}

describe('TransactionList', () => {
  const transactions: TransactionListItem[] = [
    {
      id: 'tx-1',
      title: 'Salary',
      description: 'Monthly payroll',
      amount: 100,
      currency: 'USD',
      date: '2026-01-02T00:00:00.000Z',
      type: 'credit',
      bank: 'Acme Bank',
      account: 'Main',
      isLinked: true,
      linkedTransactionId: 'budget-11',
    },
    {
      id: 'tx-2',
      title: 'Coffee',
      amount: 25.5,
      currency: 'USD',
      date: '2026-01-03T00:00:00.000Z',
      type: 'debit',
      bank: 'Acme Bank',
      account: 'Main',
      isDismissed: true,
    },
  ];

  beforeEach(() => {
    ioInstances.length = 0;
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.stubGlobal(
      'IntersectionObserver',
      MockIntersectionObserver as unknown as typeof IntersectionObserver
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('renders loading state', () => {
    render(<TransactionList transactions={[]} isLoading />);

    expect(screen.getByText('Loading transactions...')).toBeTruthy();
  });

  it('renders empty state when there are no transactions', () => {
    render(
      <TransactionList transactions={[]} emptyMessage="No rows to show" />
    );

    expect(screen.getByText('No rows to show')).toBeTruthy();
  });

  it('renders rows, amounts, linked status, dismissed icon and handles row click', () => {
    const onTransactionClick = vi.fn();

    render(
      <TransactionList
        transactions={transactions}
        onTransactionClick={onTransactionClick}
      />
    );

    expect(screen.getByText('+$100.00')).toBeTruthy();
    expect(screen.getByText('-$25.50')).toBeTruthy();
    expect(screen.getByLabelText('Dismissed')).toBeTruthy();

    const linkedTransactionAnchor = screen.getByRole('link', {
      name: 'View linked transaction',
    });
    expect(linkedTransactionAnchor.getAttribute('href')).toBe(
      '/budget/transactions/budget-11'
    );

    fireEvent.click(screen.getByRole('button', { name: /Salary/i }));
    expect(onTransactionClick).toHaveBeenCalledWith(transactions[0]);
    expect(screen.getByText('No more transactions')).toBeTruthy();
  });

  it('calls onLoadMore when sentinel intersects and hasMore is true', async () => {
    const onLoadMore = vi.fn();

    render(
      <TransactionList
        transactions={transactions}
        hasMore
        onLoadMore={onLoadMore}
      />
    );

    await waitFor(() => {
      expect(ioInstances.length).toBeGreaterThan(0);
    });

    ioInstances[0].callback(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      ioInstances[0] as unknown as IntersectionObserver
    );

    expect(onLoadMore).toHaveBeenCalledTimes(1);
  });
});
