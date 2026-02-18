import { apiClient } from './api';
import type { LocalizedName } from './types';

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
  tags: string[];
  bankTransactionId?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserTransactionsResponse {
  transactions: UserTransaction[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export interface SearchTransactionsParams {
  type?: 'expense' | 'income';
  category?: string;
  counterparty?: string;
  from?: string;
  to?: string;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'date' | 'amount' | 'title' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export const userTransactionsService = {
  getById: async (id: string): Promise<UserTransaction> => {
    return apiClient.get<UserTransaction>(`/transactions/${id}`);
  },

  search: async (
    params: SearchTransactionsParams = {}
  ): Promise<UserTransactionsResponse> => {
    const query = new URLSearchParams();

    if (params.type) query.set('type', params.type);
    if (params.category) query.set('category', params.category);
    if (params.counterparty) query.set('counterparty', params.counterparty);
    if (params.from) query.set('from', params.from);
    if (params.to) query.set('to', params.to);
    if (params.minAmount !== undefined)
      query.set('minAmount', String(params.minAmount));
    if (params.maxAmount !== undefined)
      query.set('maxAmount', String(params.maxAmount));
    if (params.search) query.set('search', params.search);
    if (params.limit) query.set('limit', String(params.limit));
    if (params.offset) query.set('offset', String(params.offset));
    if (params.sortBy) query.set('sortBy', params.sortBy);
    if (params.sortOrder) query.set('sortOrder', params.sortOrder);

    const queryString = query.toString();
    const endpoint = queryString
      ? `/transactions/search?${queryString}`
      : '/transactions/search';

    return apiClient.get<UserTransactionsResponse>(endpoint);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/transactions/${id}`);
  },
};
