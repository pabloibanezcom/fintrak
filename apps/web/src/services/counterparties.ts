import { apiClient } from './api';

export interface Counterparty {
  key: string;
  name: string;
  type?: 'company' | 'person' | 'institution' | 'other';
  logo?: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  titleTemplate?: string;
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
  type?: 'company' | 'person' | 'institution' | 'other';
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
};
