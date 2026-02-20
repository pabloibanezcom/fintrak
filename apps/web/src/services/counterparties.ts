import { apiClient } from './api';
import type { Category } from './categories';

export type CounterpartyType = 'company' | 'person' | 'institution' | 'other';

export interface Counterparty {
  key: string;
  name: string;
  type?: CounterpartyType;
  logo?: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  titleTemplate?: string;
  parentKey?: string;
  defaultCategory?: Category;
}

export interface UpsertCounterpartyPayload {
  key?: string;
  name?: string;
  type?: CounterpartyType;
  logo?: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  titleTemplate?: string;
  parentKey?: string;
  defaultCategory?: string;
}

export interface CounterpartiesResponse {
  counterparties: Counterparty[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export interface SearchCounterpartiesParams {
  name?: string;
  type?: CounterpartyType;
  parentKey?: string;
  limit?: number;
  offset?: number;
}

export const counterpartiesService = {
  search: async (
    params: SearchCounterpartiesParams = {}
  ): Promise<CounterpartiesResponse> => {
    const query = new URLSearchParams();

    if (params.name) query.set('name', params.name);
    if (params.type) query.set('type', params.type);
    if (params.parentKey) query.set('parentKey', params.parentKey);
    if (params.limit) query.set('limit', String(params.limit));
    if (params.offset) query.set('offset', String(params.offset));

    const queryString = query.toString();
    const endpoint = queryString
      ? `/counterparties/search?${queryString}`
      : '/counterparties/search';

    return apiClient.get<CounterpartiesResponse>(endpoint);
  },

  getCounterparty: async (id: string): Promise<Counterparty> => {
    return apiClient.get<Counterparty>(`/counterparties/${id}`);
  },

  getById: async (id: string): Promise<Counterparty> => {
    return apiClient.get<Counterparty>(`/counterparties/${id}`);
  },

  create: async (data: UpsertCounterpartyPayload): Promise<Counterparty> => {
    return apiClient.post<Counterparty>('/counterparties', data);
  },

  update: async (
    id: string,
    data: UpsertCounterpartyPayload
  ): Promise<Counterparty> => {
    return apiClient.put<Counterparty>(`/counterparties/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/counterparties/${id}`);
  },
};
