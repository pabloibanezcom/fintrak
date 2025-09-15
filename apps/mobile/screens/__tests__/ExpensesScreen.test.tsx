import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react-native';
import { Alert } from 'react-native';
import ExpensesScreen from '../ExpensesScreen';
import { apiService } from '../../services/api';
import type { Expense, ExpensesResponse } from '@fintrak/types';

// Mock the API service
jest.mock('../../services/api');
const mockApiService = apiService as jest.Mocked<typeof apiService>;

// Mock Alert
jest.spyOn(Alert, 'alert').mockImplementation(() => {});

describe('ExpensesScreen', () => {
  const mockExpenses: Expense[] = [
    {
      id: '1',
      title: 'Grocery Shopping',
      amount: 85.50,
      currency: 'EUR',
      category: { id: 'cat1', name: 'Food' },
      date: new Date('2024-01-15'),
      periodicity: 'NOT_RECURRING',
      description: 'Weekly groceries'
    },
    {
      id: '2',
      title: 'Coffee',
      amount: 4.20,
      currency: 'EUR',
      category: { id: 'cat2', name: 'Food' },
      date: new Date('2024-01-14'),
      periodicity: 'NOT_RECURRING'
    }
  ];

  const mockExpensesResponse: ExpensesResponse = {
    expenses: mockExpenses,
    pagination: {
      total: 2,
      limit: 50,
      offset: 0,
      hasMore: false
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state initially', () => {
    mockApiService.getExpenses.mockImplementation(() => new Promise(() => {}));
    
    render(<ExpensesScreen />);
    
    expect(screen.getByText('Loading expenses...')).toBeTruthy();
    expect(screen.getByTestId('activity-indicator')).toBeTruthy();
  });

  it('should render expenses list when data is loaded', async () => {
    mockApiService.getExpenses.mockResolvedValueOnce(mockExpensesResponse);
    
    render(<ExpensesScreen />);
    
    await waitFor(() => {
      expect(screen.getByText('Expenses')).toBeTruthy();
      expect(screen.getByText('Grocery Shopping')).toBeTruthy();
      expect(screen.getByText('Coffee')).toBeTruthy();
      expect(screen.getByText('85.50 EUR')).toBeTruthy();
      expect(screen.getByText('4.20 EUR')).toBeTruthy();
    });
  });

  it('should display expense details correctly', async () => {
    mockApiService.getExpenses.mockResolvedValueOnce(mockExpensesResponse);
    
    render(<ExpensesScreen />);
    
    await waitFor(() => {
      // Check titles
      expect(screen.getByText('Grocery Shopping')).toBeTruthy();
      expect(screen.getByText('Coffee')).toBeTruthy();
      
      // Check amounts with currency
      expect(screen.getByText('85.50 EUR')).toBeTruthy();
      expect(screen.getByText('4.20 EUR')).toBeTruthy();
      
      // Check categories
      expect(screen.getAllByText('• Food')).toHaveLength(2);
      
      // Check description (only first expense has one)
      expect(screen.getByText('Weekly groceries')).toBeTruthy();
      
      // Check dates are formatted
      expect(screen.getByText('1/15/2024')).toBeTruthy();
      expect(screen.getByText('1/14/2024')).toBeTruthy();
    });
  });

  it('should render empty state when no expenses are found', async () => {
    const emptyResponse: ExpensesResponse = {
      expenses: [],
      pagination: {
        total: 0,
        limit: 50,
        offset: 0,
        hasMore: false
      }
    };
    
    mockApiService.getExpenses.mockResolvedValueOnce(emptyResponse);
    
    render(<ExpensesScreen />);
    
    await waitFor(() => {
      expect(screen.getByText('No expenses found')).toBeTruthy();
    });
  });

  it('should handle API errors gracefully', async () => {
    const errorMessage = 'Network error';
    mockApiService.getExpenses.mockRejectedValueOnce(new Error(errorMessage));
    
    render(<ExpensesScreen />);
    
    await waitFor(() => {
      expect(screen.getByText(`Error: ${errorMessage}`)).toBeTruthy();
      expect(screen.getByText('Make sure the API server is running on localhost:3000')).toBeTruthy();
    });
    
    expect(Alert.alert).toHaveBeenCalledWith('Error', errorMessage);
  });

  it('should call API service with correct parameters', async () => {
    mockApiService.getExpenses.mockResolvedValueOnce(mockExpensesResponse);
    
    render(<ExpensesScreen />);
    
    await waitFor(() => {
      expect(mockApiService.getExpenses).toHaveBeenCalledWith({
        limit: 50,
        sortBy: 'date',
        sortOrder: 'desc'
      });
    });
  });

  it('should render logout button when onLogout prop is provided', async () => {
    const mockOnLogout = jest.fn();
    mockApiService.getExpenses.mockResolvedValueOnce(mockExpensesResponse);
    
    render(<ExpensesScreen onLogout={mockOnLogout} />);
    
    await waitFor(() => {
      expect(screen.getByText('Logout')).toBeTruthy();
    });
  });

  it('should call onLogout when logout button is pressed', async () => {
    const mockOnLogout = jest.fn();
    mockApiService.getExpenses.mockResolvedValueOnce(mockExpensesResponse);
    
    render(<ExpensesScreen onLogout={mockOnLogout} />);
    
    await waitFor(() => {
      fireEvent.press(screen.getByText('Logout'));
    });
    
    expect(mockOnLogout).toHaveBeenCalled();
  });

  it('should not render logout button when onLogout prop is not provided', async () => {
    mockApiService.getExpenses.mockResolvedValueOnce(mockExpensesResponse);
    
    render(<ExpensesScreen />);
    
    await waitFor(() => {
      expect(screen.queryByText('Logout')).toBeNull();
    });
  });

  it('should handle date formatting for both Date objects and strings', async () => {
    const expenseWithStringDate: Expense = {
      ...mockExpenses[0],
      date: '2024-01-16T10:30:00.000Z' as any // API might return string dates
    };
    
    const responseWithStringDate: ExpensesResponse = {
      expenses: [expenseWithStringDate],
      pagination: {
        total: 1,
        limit: 50,
        offset: 0,
        hasMore: false
      }
    };
    
    mockApiService.getExpenses.mockResolvedValueOnce(responseWithStringDate);
    
    render(<ExpensesScreen />);
    
    await waitFor(() => {
      // Should format string date correctly
      expect(screen.getByText('1/16/2024')).toBeTruthy();
    });
  });
});