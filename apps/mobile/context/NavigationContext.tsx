import React, { createContext, useContext, useState, ReactNode } from 'react';
import { TabScreen } from '@fintrak/shared-types';

interface NavigationContextType {
  activeTab: TabScreen;
  setActiveTab: (tab: TabScreen) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<TabScreen>('investments');

  return (
    <NavigationContext.Provider value={{
      activeTab,
      setActiveTab,
    }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}