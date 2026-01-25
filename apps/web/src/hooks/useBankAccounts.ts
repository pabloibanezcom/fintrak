'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { type BankAccount, bankAccountsService } from '@/services/bankAccounts';
import {
  type BankConnection,
  bankConnectionsService,
} from '@/services/bankConnections';

interface UseBankAccountsReturn {
  accounts: BankAccount[];
  connections: BankConnection[];
  accountsMap: Map<string, BankAccount>;
  connectionsMap: Map<string, BankConnection>;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  getBankDisplayName: (accountId: string) => string;
  getAccountDisplayName: (accountId: string) => string;
  getBankLogo: (accountId: string) => string | undefined;
}

export function useBankAccounts(): UseBankAccountsReturn {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [connections, setConnections] = useState<BankConnection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [accountsRes, connectionsRes] = await Promise.all([
        bankAccountsService.getAccounts(),
        bankConnectionsService.getConnections(),
      ]);
      setAccounts(accountsRes);
      setConnections(connectionsRes);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to fetch accounts')
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const accountsMap = useMemo(
    () => new Map(accounts.map((acc) => [acc.accountId, acc])),
    [accounts]
  );

  const connectionsMap = useMemo(
    () => new Map(connections.map((conn) => [conn.bankId, conn])),
    [connections]
  );

  const getBankDisplayName = useCallback(
    (accountId: string): string => {
      const account = accountsMap.get(accountId);
      if (!account) return '-';

      const connection = connectionsMap.get(account.bankId);
      return connection?.alias || account.bankName;
    },
    [accountsMap, connectionsMap]
  );

  const getAccountDisplayName = useCallback(
    (accountId: string): string => {
      const account = accountsMap.get(accountId);
      if (!account) return '-';

      return account.alias || account.name;
    },
    [accountsMap]
  );

  const getBankLogo = useCallback(
    (accountId: string): string | undefined => {
      const account = accountsMap.get(accountId);
      if (!account) return undefined;

      const connection = connectionsMap.get(account.bankId);
      return connection?.logo;
    },
    [accountsMap, connectionsMap]
  );

  return {
    accounts,
    connections,
    accountsMap,
    connectionsMap,
    isLoading,
    error,
    refetch: fetchData,
    getBankDisplayName,
    getAccountDisplayName,
    getBankLogo,
  };
}
