import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authStorage } from '../utils/authStorage';
import { apiService } from '../services/api';
import { useUser } from './UserContext';

interface SessionContextType {
  session: string | null;
  isLoading: boolean;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { fetchUser, clearUser } = useUser();

  useEffect(() => {
    bootstrapAsync();
  }, []);

  const bootstrapAsync = async () => {
    try {
      const storedToken = await authStorage.getToken();
      if (storedToken) {
        apiService.setToken(storedToken);
        setSession(storedToken);
        await fetchUser();
      }
    } catch (error) {
      console.error('Error restoring session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (token: string) => {
    try {
      await authStorage.setToken(token);
      apiService.setToken(token);
      setSession(token);
      await fetchUser();
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await authStorage.removeToken();
      apiService.setToken(null);
      clearUser();
      setSession(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return (
    <SessionContext.Provider value={{ session, isLoading, signIn, signOut }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
