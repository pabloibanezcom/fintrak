import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TransactionSummary } from './TransactionSummary';

describe('TransactionSummary', () => {
  it('renders aggregate totals and counts excluding dismissed transactions', () => {
    const transactions = [
      {
        _id: 'tx-1',
        amount: -10,
        currency: 'EUR',
        dismissed: false,
      },
      {
        _id: 'tx-2',
        amount: 25,
        currency: 'EUR',
        dismissed: true,
      },
      {
        _id: 'tx-3',
        amount: -5,
        currency: 'USD',
        dismissed: false,
      },
    ] as any;

    const linkedTransactionIds = new Map<string, string>([['tx-2', 'ut-2']]);

    render(
      <TransactionSummary
        transactions={transactions}
        linkedTransactionIds={linkedTransactionIds}
      />
    );

    const totalAmountMetric = screen.getByText('Total amount').parentElement;
    expect(totalAmountMetric?.textContent).toContain('EUR');
    expect(totalAmountMetric?.textContent).toContain('USD');
    expect(totalAmountMetric?.textContent).toContain('10');
    expect(totalAmountMetric?.textContent).toContain('$5');

    const transactionsMetric = screen.getByText('Transactions').parentElement;
    const linkedMetric = screen.getByText('Linked').parentElement;
    const unlinkedMetric = screen.getByText('Unlinked').parentElement;

    expect(transactionsMetric?.textContent).toContain('2');
    expect(screen.queryByText('Dismissed')).toBeNull();
    expect(linkedMetric?.textContent).toContain('0');
    expect(unlinkedMetric?.textContent).toContain('2');
  });

  it('renders empty summary state', () => {
    render(
      <TransactionSummary
        transactions={[] as any}
        linkedTransactionIds={new Map()}
      />
    );

    expect(screen.getByText('-')).toBeTruthy();
    expect(screen.getAllByText('0')).toHaveLength(3);
  });
});
