import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Investment, Portfolio } from '@fintrak/shared-types';

interface PortfolioState {
  portfolio: Portfolio;
  loading: boolean;
  error: string | null;
}

type PortfolioAction =
  | { type: 'ADD_INVESTMENT'; payload: Investment }
  | { type: 'UPDATE_INVESTMENT'; payload: Investment }
  | { type: 'REMOVE_INVESTMENT'; payload: string }
  | { type: 'UPDATE_PRICES'; payload: { id: string; currentPrice: number }[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: PortfolioState = {
  portfolio: {
    investments: [],
    totalValue: 0,
    totalGainLoss: 0,
    totalGainLossPercentage: 0,
  },
  loading: false,
  error: null,
};

function calculatePortfolioMetrics(investments: Investment[]): Portfolio {
  const totalValue = investments.reduce((sum, inv) => sum + (inv.currentPrice * inv.quantity), 0);
  const totalCost = investments.reduce((sum, inv) => sum + (inv.purchasePrice * inv.quantity), 0);
  const totalGainLoss = totalValue - totalCost;
  const totalGainLossPercentage = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;

  return {
    investments,
    totalValue,
    totalGainLoss,
    totalGainLossPercentage,
  };
}

function portfolioReducer(state: PortfolioState, action: PortfolioAction): PortfolioState {
  switch (action.type) {
    case 'ADD_INVESTMENT':
      const newInvestments = [...state.portfolio.investments, action.payload];
      return {
        ...state,
        portfolio: calculatePortfolioMetrics(newInvestments),
      };

    case 'UPDATE_INVESTMENT':
      const updatedInvestments = state.portfolio.investments.map(inv =>
        inv.id === action.payload.id ? action.payload : inv
      );
      return {
        ...state,
        portfolio: calculatePortfolioMetrics(updatedInvestments),
      };

    case 'REMOVE_INVESTMENT':
      const filteredInvestments = state.portfolio.investments.filter(inv => inv.id !== action.payload);
      return {
        ...state,
        portfolio: calculatePortfolioMetrics(filteredInvestments),
      };

    case 'UPDATE_PRICES':
      const priceUpdatedInvestments = state.portfolio.investments.map(inv => {
        const priceUpdate = action.payload.find(p => p.id === inv.id);
        return priceUpdate 
          ? { ...inv, currentPrice: priceUpdate.currentPrice, lastUpdated: new Date() }
          : inv;
      });
      return {
        ...state,
        portfolio: calculatePortfolioMetrics(priceUpdatedInvestments),
      };

    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    default:
      return state;
  }
}

interface PortfolioContextType {
  state: PortfolioState;
  addInvestment: (investment: Omit<Investment, 'id' | 'lastUpdated'>) => void;
  updateInvestment: (investment: Investment) => void;
  removeInvestment: (id: string) => void;
  updatePrices: (priceUpdates: { id: string; currentPrice: number }[]) => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(portfolioReducer, initialState);

  const addInvestment = (investment: Omit<Investment, 'id' | 'lastUpdated'>) => {
    const newInvestment: Investment = {
      ...investment,
      id: Date.now().toString(),
      lastUpdated: new Date(),
    };
    dispatch({ type: 'ADD_INVESTMENT', payload: newInvestment });
  };

  const updateInvestment = (investment: Investment) => {
    dispatch({ type: 'UPDATE_INVESTMENT', payload: investment });
  };

  const removeInvestment = (id: string) => {
    dispatch({ type: 'REMOVE_INVESTMENT', payload: id });
  };

  const updatePrices = (priceUpdates: { id: string; currentPrice: number }[]) => {
    dispatch({ type: 'UPDATE_PRICES', payload: priceUpdates });
  };

  return (
    <PortfolioContext.Provider value={{
      state,
      addInvestment,
      updateInvestment,
      removeInvestment,
      updatePrices,
    }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}