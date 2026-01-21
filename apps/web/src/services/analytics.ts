import { apiClient } from './api';

export interface CategorySummary {
  categoryId: string;
  categoryKey: string;
  categoryName: string;
  categoryColor: string;
  categoryIcon: string;
  total: number;
  count: number;
}

export interface TransactionSummary {
  id: string;
  title: string;
  amount: number;
  currency: string;
  date: string;
  type: 'expense' | 'income';
  category?: {
    name: string;
    color: string;
    icon: string;
  };
}

export interface PeriodSummaryResponse {
  period: {
    from: string;
    to: string;
  };
  expenses: {
    total: number;
    byCategory: CategorySummary[];
  };
  incomes: {
    total: number;
    byCategory: CategorySummary[];
  };
  balance: number;
  latestTransactions: TransactionSummary[];
}

export interface PeriodSummaryParams {
  dateFrom: string;
  dateTo: string;
  currency?: string;
  latestCount?: number;
}

export const analyticsService = {
  getPeriodSummary: async (
    params: PeriodSummaryParams
  ): Promise<PeriodSummaryResponse> => {
    const query = new URLSearchParams();
    query.append('dateFrom', params.dateFrom);
    query.append('dateTo', params.dateTo);
    if (params.currency) query.append('currency', params.currency);
    if (params.latestCount)
      query.append('latestCount', params.latestCount.toString());

    return apiClient.get<PeriodSummaryResponse>(
      `/analytics/period-summary?${query.toString()}`
    );
  },
};
