import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Expense, CreateExpenseRequest, UpdateExpenseRequest } from '@fintrak/types';

interface ExpenseState {
  expenses: Expense[];
  loading: boolean;
  error: string | null;
}

type ExpenseAction =
  | { type: 'SET_EXPENSES'; payload: Expense[] }
  | { type: 'ADD_EXPENSE'; payload: Expense }
  | { type: 'UPDATE_EXPENSE'; payload: Expense }
  | { type: 'REMOVE_EXPENSE'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: ExpenseState = {
  expenses: [],
  loading: false,
  error: null,
};

function expenseReducer(state: ExpenseState, action: ExpenseAction): ExpenseState {
  switch (action.type) {
    case 'SET_EXPENSES':
      return {
        ...state,
        expenses: action.payload,
        loading: false,
        error: null,
      };

    case 'ADD_EXPENSE':
      return {
        ...state,
        expenses: [action.payload, ...state.expenses],
        loading: false,
        error: null,
      };

    case 'UPDATE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.map(expense =>
          expense.id === action.payload.id ? action.payload : expense
        ),
        loading: false,
        error: null,
      };

    case 'REMOVE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter(expense => expense.id !== action.payload),
        loading: false,
        error: null,
      };

    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };

    default:
      return state;
  }
}

interface ExpenseContextType {
  state: ExpenseState;
  fetchExpenses: () => Promise<void>;
  createExpense: (expense: CreateExpenseRequest) => Promise<void>;
  updateExpense: (id: string, expense: UpdateExpenseRequest) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

interface ExpenseProviderProps {
  children: ReactNode;
  apiBaseUrl?: string;
  getAuthToken?: () => string | null;
}

export function ExpenseProvider({ 
  children, 
  apiBaseUrl = 'http://localhost:3000',
  getAuthToken
}: ExpenseProviderProps) {
  const [state, dispatch] = useReducer(expenseReducer, initialState);

  const makeApiCall = async (url: string, options: RequestInit = {}) => {
    const token = getAuthToken?.();
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers as Record<string, string>),
    };

    const response = await fetch(`${apiBaseUrl}${url}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  };

  const fetchExpenses = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const expenses = await makeApiCall('/api/expenses');
      dispatch({ type: 'SET_EXPENSES', payload: expenses });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to fetch expenses' });
    }
  };

  const createExpense = async (expenseData: CreateExpenseRequest) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const newExpense = await makeApiCall('/api/expenses', {
        method: 'POST',
        body: JSON.stringify(expenseData),
      });
      dispatch({ type: 'ADD_EXPENSE', payload: newExpense });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to create expense' });
      throw error;
    }
  };

  const updateExpense = async (id: string, expenseData: UpdateExpenseRequest) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const updatedExpense = await makeApiCall(`/api/expenses/${id}`, {
        method: 'PUT',
        body: JSON.stringify(expenseData),
      });
      dispatch({ type: 'UPDATE_EXPENSE', payload: updatedExpense });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to update expense' });
      throw error;
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await makeApiCall(`/api/expenses/${id}`, {
        method: 'DELETE',
      });
      dispatch({ type: 'REMOVE_EXPENSE', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to delete expense' });
      throw error;
    }
  };

  return (
    <ExpenseContext.Provider value={{
      state,
      fetchExpenses,
      createExpense,
      updateExpense,
      deleteExpense,
    }}>
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenses() {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
}