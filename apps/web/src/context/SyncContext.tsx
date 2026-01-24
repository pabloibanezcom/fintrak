'use client';

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { apiClient } from '@/services/api';
import { useSession } from './SessionContext';

const SYNC_STORAGE_KEY = 'fintrak_last_sync';
const SYNC_INTERVAL_MS = 60 * 60 * 1000; // 1 hour

interface SyncContextType {
  lastSyncTime: Date | null;
  isSyncing: boolean;
  syncTransactions: () => Promise<void>;
}

const SyncContext = createContext<SyncContextType | undefined>(undefined);

export function SyncProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useSession();
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const hasAutoSynced = useRef(false);

  // Load last sync time from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(SYNC_STORAGE_KEY);
      if (stored) {
        setLastSyncTime(new Date(stored));
      }
    }
  }, []);

  const syncTransactions = useCallback(async () => {
    if (isSyncing) return;

    setIsSyncing(true);
    try {
      await apiClient.post('/bank/sync');
      const now = new Date();
      setLastSyncTime(now);
      if (typeof window !== 'undefined') {
        localStorage.setItem(SYNC_STORAGE_KEY, now.toISOString());
      }
    } catch (error) {
      console.error('Failed to sync transactions:', error);
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing]);

  // Auto-sync when authenticated and last sync was more than 1 hour ago
  useEffect(() => {
    if (!isAuthenticated || hasAutoSynced.current) return;

    const shouldSync =
      !lastSyncTime ||
      Date.now() - lastSyncTime.getTime() > SYNC_INTERVAL_MS;

    if (shouldSync) {
      hasAutoSynced.current = true;
      syncTransactions();
    }
  }, [isAuthenticated, lastSyncTime, syncTransactions]);

  return (
    <SyncContext.Provider
      value={{
        lastSyncTime,
        isSyncing,
        syncTransactions,
      }}
    >
      {children}
    </SyncContext.Provider>
  );
}

export function useSync() {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error('useSync must be used within SyncProvider');
  }
  return context;
}
