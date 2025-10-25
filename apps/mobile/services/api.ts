import Constants from 'expo-constants';
import { Platform } from 'react-native';
import type {
  ExpensesResponse,
  AuthResponse,
  LoginRequest,
  UserProducts,
} from '@fintrak/types';

export interface PeriodSummaryResponse {
  period: {
    from: string;
    to: string;
    currency: string;
  };
  expenses: {
    total: number;
    byCategory: Array<{
      categoryId: string;
      categoryKey: string;
      categoryName: string;
      categoryColor: string;
      categoryIcon: string;
      total: number;
      count: number;
    }>;
  };
  incomes: {
    total: number;
    byCategory: Array<{
      categoryId: string;
      categoryKey: string;
      categoryName: string;
      categoryColor: string;
      categoryIcon: string;
      total: number;
      count: number;
    }>;
  };
  balance: number;
  latestTransactions: Array<any>;
}

// Get the appropriate API URL based on platform and configuration
const getApiBaseUrl = (): string => {
  // If explicitly configured in app.json, use that
  const configuredUrl = Constants.expoConfig?.extra?.apiBaseUrl;
  if (configuredUrl) {
    return configuredUrl;
  }

  // Otherwise, use platform-specific localhost URLs
  if (Platform.OS === 'android') {
    // Android emulator uses 10.0.2.2 to access host machine's localhost
    return 'http://10.0.2.2:3000/api';
  }

  // iOS simulator and web can use localhost
  return 'http://localhost:3000/api';
};

const API_BASE_URL = getApiBaseUrl();

class ApiService {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }
    
    const response = await fetch(url, {
      headers,
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getExpenses(params: {
    limit?: number;
    offset?: number;
    sortBy?: 'date' | 'amount' | 'title' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
  } = {}): Promise<ExpensesResponse> {
    const queryParams = new URLSearchParams();

    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.offset) queryParams.append('offset', params.offset.toString());
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const endpoint = `/expenses/search${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request<ExpensesResponse>(endpoint);
  }

  async getPeriodSummary(params: {
    dateFrom: string;
    dateTo: string;
    currency?: string;
    latestCount?: number;
  }): Promise<PeriodSummaryResponse> {
    const queryParams = new URLSearchParams();

    queryParams.append('dateFrom', params.dateFrom);
    queryParams.append('dateTo', params.dateTo);
    if (params.currency) queryParams.append('currency', params.currency);
    if (params.latestCount) queryParams.append('latestCount', params.latestCount.toString());

    const endpoint = `/analytics/period-summary?${queryParams.toString()}`;
    return this.request<PeriodSummaryResponse>(endpoint);
  }

  async getCurrentUser(): Promise<{
    id: string;
    email: string;
    name?: string;
    lastName?: string;
    profilePicture?: string;
    authProvider: 'email' | 'google';
    createdAt: string;
    updatedAt: string;
  }> {
    return this.request('/auth/me');
  }

  async updateUserProfile(data: {
    name: string;
    lastName: string;
    email: string;
  }): Promise<{
    id: string;
    email: string;
    name?: string;
    lastName?: string;
    profilePicture?: string;
    authProvider: 'email' | 'google';
    createdAt: string;
    updatedAt: string;
  }> {
    return this.request('/auth/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async updateProfilePicture(profilePicture: string): Promise<{
    id: string;
    email: string;
    name?: string;
    lastName?: string;
    profilePicture?: string;
    authProvider: 'email' | 'google';
    createdAt: string;
    updatedAt: string;
  }> {
    return this.request('/auth/me/picture', {
      method: 'PUT',
      body: JSON.stringify({ profilePicture }),
    });
  }

  async getUserProducts(compare?: '1d' | '7d' | '1m' | '3m' | '1y'): Promise<UserProducts> {
    const endpoint = compare ? `/products?compare=${compare}` : '/products';
    return this.request<UserProducts>(endpoint);
  }
}

export const apiService = new ApiService();