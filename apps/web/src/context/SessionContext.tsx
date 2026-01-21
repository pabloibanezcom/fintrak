'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { apiClient } from '@/services/api';
import { useUser } from './UserContext';

interface SessionContextType {
  session: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (token: string) => Promise<void>;
  signOut: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { fetchUser, clearUser } = useUser();

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const storedToken = apiClient.getToken();
        if (storedToken) {
          setSession(storedToken);
          await fetchUser();
        }
      } catch (error) {
        console.error('Error restoring session:', error);
        apiClient.clearToken();
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    };
    bootstrap();
  }, [fetchUser]);

  const signIn = useCallback(
    async (token: string) => {
      apiClient.setToken(token);
      setSession(token);
      await fetchUser();
    },
    [fetchUser]
  );

  const signOut = useCallback(() => {
    apiClient.clearToken();
    clearUser();
    setSession(null);
  }, [clearUser]);

  return (
    <SessionContext.Provider
      value={{
        session,
        isLoading,
        isAuthenticated: !!session,
        signIn,
        signOut,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within SessionProvider');
  }
  return context;
}
