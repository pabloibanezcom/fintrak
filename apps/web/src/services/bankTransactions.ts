import { apiClient } from './api';
import type { LocalizedName } from './types';

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
  dismissed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BankTransactionsResponse {
  transactions: BankTransaction[];
  linkedTransactionIds: Record<string, string>;
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
}

export type ReviewStatus = 'unreviewed' | 'linked' | 'dismissed';

export interface GetBankTransactionsParams {
  accountId?: string;
  bankId?: string;
  type?: 'CREDIT' | 'DEBIT';
  processed?: boolean;
  reviewStatus?: ReviewStatus;
  from?: string;
  to?: string;
  limit?: number;
  offset?: number;
  search?: string;
}

export interface Category {
  _id: string;
  key: string;
  name: LocalizedName;
  icon?: string;
  color?: string;
}

export interface Counterparty {
  _id: string;
  key: string;
  name: string;
}

export interface UserTransaction {
  _id: string;
  id?: string; // API sometimes returns 'id' instead of '_id'
  type: 'expense' | 'income';
  title: string;
  amount: number;
  currency: string;
  category: Category;
  counterparty?: Counterparty;
  date: string;
  periodicity: string;
  description?: string;
  tags: object[];
  bankTransactionId?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface LinkedTransactionResponse {
  linked: boolean;
  transaction: UserTransaction | null;
}

export interface CreateTransactionFromBankRequest {
  category: string;
  counterparty?: string;
  title?: string;
  description?: string;
  tags?: object[];
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
    if (params.reviewStatus) query.set('reviewStatus', params.reviewStatus);

    const queryString = query.toString();
    const endpoint = queryString
      ? `/bank-transactions?${queryString}`
      : '/bank-transactions';

    return apiClient.get<BankTransactionsResponse>(endpoint);
  },

  getTransaction: async (id: string): Promise<BankTransaction> => {
    return apiClient.get<BankTransaction>(`/bank-transactions/${id}`);
  },

  getLinkedTransaction: async (
    id: string
  ): Promise<LinkedTransactionResponse> => {
    return apiClient.get<LinkedTransactionResponse>(
      `/bank-transactions/${id}/linked`
    );
  },

  createTransaction: async (
    id: string,
    data: CreateTransactionFromBankRequest
  ): Promise<UserTransaction> => {
    return apiClient.post<UserTransaction>(
      `/bank-transactions/${id}/create-transaction`,
      data
    );
  },

  dismissTransaction: async (id: string): Promise<BankTransaction> => {
    return apiClient.patch<BankTransaction>(`/bank-transactions/${id}`, {
      dismissed: true,
    });
  },

  undismissTransaction: async (id: string): Promise<BankTransaction> => {
    return apiClient.patch<BankTransaction>(`/bank-transactions/${id}`, {
      dismissed: false,
    });
  },
};
