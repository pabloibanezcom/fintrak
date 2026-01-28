"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { BankAccount } from "@fintrak/types";
import { productsService } from "@/services/products";
import {
  type BankConnection,
  bankConnectionsService,
} from "@/services/bankConnections";

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
  getAccountBalance: (accountId: string) => number;
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
      // Fetch bank accounts from unified /api/products endpoint
      // and connections for TrueLayer bank metadata (alias, logo)
      const [accountsRes, connectionsRes] = await Promise.all([
        productsService.getBankAccounts(),
        bankConnectionsService.getConnections(),
      ]);
      setAccounts(accountsRes);
      setConnections(connectionsRes);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch accounts"),
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
    [accounts],
  );

  const connectionsMap = useMemo(
    () => new Map(connections.map((conn) => [conn.bankId, conn])),
    [connections],
  );

  const getBankDisplayName = useCallback(
    (accountId: string): string => {
      const account = accountsMap.get(accountId);
      if (!account) return "-";

      // For TrueLayer accounts, check if there's a custom alias in connections
      const connection = connectionsMap.get(account.bankId);
      return connection?.alias || account.bankName;
    },
    [accountsMap, connectionsMap],
  );

  const getAccountDisplayName = useCallback(
    (accountId: string): string => {
      const account = accountsMap.get(accountId);
      if (!account) return "-";

      return account.displayName;
    },
    [accountsMap],
  );

  const getBankLogo = useCallback(
    (accountId: string): string | undefined => {
      const account = accountsMap.get(accountId);
      if (!account) return undefined;

      // First check account's logo (set by aggregator), then connection's logo
      if (account.logo) return account.logo;

      const connection = connectionsMap.get(account.bankId);
      return connection?.logo;
    },
    [accountsMap, connectionsMap],
  );

  const getAccountBalance = useCallback(
    (accountId: string): number => {
      const account = accountsMap.get(accountId);
      if (!account) return 0;

      // Balance is already included in the unified BankAccount type
      // For TrueLayer accounts, prefer availableBalance if set
      if (account.availableBalance !== undefined) {
        // Use balance if available is 0 but balance is negative (overdrawn)
        if (account.availableBalance === 0 && account.balance < 0) {
          return account.balance;
        }
        return account.availableBalance;
      }
      return account.balance;
    },
    [accountsMap],
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
    getAccountBalance,
  };
}
