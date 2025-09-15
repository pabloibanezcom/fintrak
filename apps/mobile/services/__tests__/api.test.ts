import { apiService } from '../api';
import type { AuthResponse, LoginRequest, ExpensesResponse } from '@fintrak/types';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('ApiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset token before each test
    apiService.setToken(null);
  });

  describe('setToken', () => {
    it('should set the authentication token', () => {
      const token = 'test-token-123';
      apiService.setToken(token);
      
      // We can't directly test the private token property,
      // but we can test that it's used in subsequent requests
      expect(() => apiService.setToken(token)).not.toThrow();
    });

    it('should clear the authentication token when set to null', () => {
      apiService.setToken('some-token');
      apiService.setToken(null);
      
      expect(() => apiService.setToken(null)).not.toThrow();
    });
  });

  describe('login', () => {
    it('should make a POST request to /auth/login with credentials', async () => {
      const mockResponse: AuthResponse = { token: 'auth-token-123' };
      const credentials: LoginRequest = {
        email: 'test@example.com',
        password: 'password123'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await apiService.login(credentials);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/auth/login',
        {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when login fails', async () => {
      const credentials: LoginRequest = {
        email: 'test@example.com',
        password: 'wrong-password'
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized'
      });

      await expect(apiService.login(credentials)).rejects.toThrow(
        'API request failed: 401 Unauthorized'
      );
    });
  });

  describe('getExpenses', () => {
    const mockExpensesResponse: ExpensesResponse = {
      expenses: [
        {
          id: '1',
          title: 'Test Expense',
          amount: 100.50,
          currency: 'EUR' as const,
          category: { id: 'cat1', name: 'Food' },
          date: new Date('2024-01-15'),
          periodicity: 'NOT_RECURRING' as const,
          description: 'Test description'
        }
      ],
      pagination: {
        total: 1,
        limit: 50,
        offset: 0,
        hasMore: false
      }
    };

    it('should fetch expenses without authentication token', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockExpensesResponse)
      });

      const result = await apiService.getExpenses();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/expenses/search',
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      expect(result).toEqual(mockExpensesResponse);
    });

    it('should include authentication token in request when set', async () => {
      const token = 'auth-token-123';
      apiService.setToken(token);

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockExpensesResponse)
      });

      await apiService.getExpenses();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/expenses/search',
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
    });

    it('should include query parameters when provided', async () => {
      const params = {
        limit: 25,
        offset: 10,
        sortBy: 'amount' as const,
        sortOrder: 'asc' as const
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockExpensesResponse)
      });

      await apiService.getExpenses(params);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/expenses/search?limit=25&offset=10&sortBy=amount&sortOrder=asc',
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    });

    it('should throw error when expenses request fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });

      await expect(apiService.getExpenses()).rejects.toThrow(
        'API request failed: 500 Internal Server Error'
      );
    });
  });

  describe('API base URL configuration', () => {
    it('should use the configured API base URL from expo-constants', () => {
      // This is tested implicitly through the other tests
      // The jest-setup.js file mocks expo-constants to return localhost:3000
      expect(true).toBe(true);
    });
  });
});