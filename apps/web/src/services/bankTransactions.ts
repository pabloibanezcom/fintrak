import { apiClient } from './api';

export interface BankTransaction {
  _id: string;
  userId: string;
  accountId: string;
  bankId: string;
  transactionId: string;
  timestamp: string;
  amount: number;
  currency: string;
  type: 'CREDIT' | 'DEBIT';
  description: string;
  merchantName?: string;
  trueLayerCategory?: string;
  status: 'pending' | 'settled';
  processed: boolean;
  notified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BankTransactionsResponse {
  transactions: BankTransaction[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
}

export interface GetBankTransactionsParams {
  accountId?: string;
  bankId?: string;
  type?: 'CREDIT' | 'DEBIT';
  processed?: boolean;
  from?: string;
  to?: string;
  limit?: number;
  offset?: number;
  search?: string;
}

export const bankTransactionsService = {
  getTransactions: async (
    params: GetBankTransactionsParams = {}
  ): Promise<BankTransactionsResponse> => {
    const query = new URLSearchParams();

    if (params.accountId) query.set('accountId', params.accountId);
    if (params.bankId) query.set('bankId', params.bankId);
    if (params.type) query.set('type', params.type);
    if (params.processed !== undefined)
      query.set('processed', String(params.processed));
    if (params.from) query.set('from', params.from);
    if (params.to) query.set('to', params.to);
    if (params.limit) query.set('limit', String(params.limit));
    if (params.offset) query.set('offset', String(params.offset));
    if (params.search) query.set('search', params.search);

    const queryString = query.toString();
    const endpoint = queryString
      ? `/bank-transactions?${queryString}`
      : '/bank-transactions';

    return apiClient.get<BankTransactionsResponse>(endpoint);
  },

  getTransaction: async (id: string): Promise<BankTransaction> => {
    return apiClient.get<BankTransaction>(`/bank-transactions/${id}`);
  },
};
