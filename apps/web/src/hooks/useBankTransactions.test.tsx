import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type {
  BankTransaction,
  BankTransactionsResponse,
} from '@/services/bankTransactions';
import { useBankTransactions } from './useBankTransactions';

const { getTransactionsSpy } = vi.hoisted(() => ({
  getTransactionsSpy: vi.fn(),
}));

vi.mock('@/services/bankTransactions', () => ({
  bankTransactionsService: {
    getTransactions: getTransactionsSpy,
  },
}));

function createBankTransaction(
  id: string,
  overrides: Partial<BankTransaction> = {}
): BankTransaction {
  return {
    _id: id,
    userId: 'user-1',
    accountId: 'account-1',
    bankId: 'bank-1',
    transactionId: `provider-${id}`,
    timestamp: '2026-02-10T10:00:00.000Z',
    amount: 42.5,
    currency: 'EUR',
    type: 'DEBIT',
    description: `Transaction ${id}`,
    merchantName: `Merchant ${id}`,
    status: 'settled',
    processed: false,
    notified: false,
    dismissed: false,
    createdAt: '2026-02-10T10:00:00.000Z',
    updatedAt: '2026-02-10T10:00:00.000Z',
    ...overrides,
  };
}

function createResponse(
  transactions: BankTransaction[],
  overrides: Partial<BankTransactionsResponse> = {}
): BankTransactionsResponse {
  return {
    transactions,
    linkedTransactionIds: {},
    linkedTransactions: {},
    pagination: {
      total: transactions.length,
      limit: 20,
      offset: 0,
    },
    ...overrides,
  };
}

describe('useBankTransactions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('dedupes duplicate transaction ids in a single response', async () => {
    const first = createBankTransaction('tx-1', { merchantName: 'Original' });
    const duplicate = createBankTransaction('tx-1', { merchantName: 'Updated' });
    const second = createBankTransaction('tx-2');

    getTransactionsSpy.mockResolvedValueOnce(
      createResponse([first, duplicate, second], {
        pagination: { total: 3, limit: 20, offset: 0 },
      })
    );

    const { result } = renderHook(() => useBankTransactions());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.transactions.map((tx) => tx._id)).toEqual([
      'tx-1',
      'tx-2',
    ]);
    expect(result.current.transactions[0].merchantName).toBe('Updated');
  });

  it('dedupes overlapping pages while loading more', async () => {
    const tx1 = createBankTransaction('tx-1');
    const tx2FirstPage = createBankTransaction('tx-2', {
      merchantName: 'First page value',
    });
    const tx2SecondPage = createBankTransaction('tx-2', {
      merchantName: 'Second page value',
    });
    const tx3 = createBankTransaction('tx-3');

    getTransactionsSpy
      .mockResolvedValueOnce(
        createResponse([tx1, tx2FirstPage], {
          pagination: { total: 4, limit: 2, offset: 0 },
          linkedTransactionIds: { 'tx-1': 'linked-1' },
        })
      )
      .mockResolvedValueOnce(
        createResponse([tx2SecondPage, tx3], {
          pagination: { total: 4, limit: 2, offset: 2 },
          linkedTransactionIds: { 'tx-3': 'linked-3' },
        })
      );

    const { result } = renderHook(() => useBankTransactions({ limit: 2 }));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.loadMore();
    });

    await waitFor(() => {
      expect(result.current.isLoadingMore).toBe(false);
      expect(result.current.transactions).toHaveLength(3);
    });

    expect(result.current.transactions.map((tx) => tx._id)).toEqual([
      'tx-1',
      'tx-2',
      'tx-3',
    ]);
    expect(result.current.transactions[1].merchantName).toBe(
      'Second page value'
    );
    expect(result.current.linkedTransactionIds.get('tx-1')).toBe('linked-1');
    expect(result.current.linkedTransactionIds.get('tx-3')).toBe('linked-3');
  });
});
