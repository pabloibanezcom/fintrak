'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  analyticsService,
  type PeriodSummaryResponse,
} from '@/services/analytics';
import { getEndOfMonth, getStartOfMonth, toISODateString } from '@/utils';

interface UsePeriodSummaryOptions {
  dateFrom?: string;
  dateTo?: string;
  currency?: string;
  latestCount?: number;
}

export function usePeriodSummary(options?: UsePeriodSummaryOptions) {
  const [data, setData] = useState<PeriodSummaryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const {
    dateFrom = toISODateString(getStartOfMonth()),
    dateTo = toISODateString(getEndOfMonth()),
    currency,
    latestCount = 5,
  } = options || {};

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await analyticsService.getPeriodSummary({
        dateFrom,
        dateTo,
        currency,
        latestCount,
      });
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch data'));
    } finally {
      setIsLoading(false);
    }
  }, [dateFrom, dateTo, currency, latestCount]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}
