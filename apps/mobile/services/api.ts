import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import type {
  ExpensesResponse,
  AuthResponse,
  LoginRequest,
  UserProducts,
  Counterparty,
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

// Get the appropriate API URL based on platform and device type
const getApiBaseUrl = (): string => {
  const configuredUrl = Constants.expoConfig?.extra?.apiBaseUrl;

  // Physical device: use the configured IP from app.json
  if (Device.isDevice) {
    if (configuredUrl) {
      return configuredUrl;
    }
    // Fallback warning - physical device needs a configured URL
    console.warn('No apiBaseUrl configured for physical device in app.json');
    return 'http://localhost:3000/api';
  }

  // Simulator/Emulator: use platform-specific localhost
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

  /**
   * Fetches full counterparty details by ID
   *
   * @param id - Counterparty unique key
   * @returns Promise resolving to complete Counterparty object
   * @throws {Error} API request failed with status code
   *
   * @example
   * const counterparty = await apiService.getCounterparty('amazon');
   */
  async getCounterparty(id: string): Promise<Counterparty> {
    return this.request<Counterparty>(`/counterparties/${id}`);
  }

  /**
   * Updates counterparty information
   *
   * Supports partial updates - only provided fields will be updated.
   *
   * @param id - Counterparty unique key
   * @param data - Partial counterparty data to update
   * @returns Promise resolving to updated Counterparty object
   * @throws {Error} API request failed or counterparty not found
   *
   * @example
   * const updated = await apiService.updateCounterparty('amazon', {
   *   email: 'newemail@amazon.com',
   *   phone: '+1-800-123-4567'
   * });
   */
  async updateCounterparty(id: string, data: Partial<Counterparty>): Promise<Counterparty> {
    return this.request<Counterparty>(`/counterparties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Uploads media file to S3 storage via API
   *
   * Uploads images or PDFs to organized S3 bucket structure.
   * Files are organized as: users/{userId}/{mediaType}/{filename}
   *
   * @param formData - FormData containing:
   *   - file: Image or PDF file (max 10MB)
   *   - type: One of 'counterparty-logo', 'profile-picture', 'receipt', 'document', 'other'
   * @returns Promise resolving to upload result with S3 URL
   * @throws {Error} Upload failed or file validation error
   *
   * @example
   * const formData = new FormData();
   * formData.append('file', {
   *   uri: imageUri,
   *   name: 'logo.jpg',
   *   type: 'image/jpeg'
   * });
   * formData.append('type', 'counterparty-logo');
   * const result = await apiService.uploadMedia(formData);
   * console.log(result.url); // S3 public URL
   */
  async uploadMedia(formData: FormData): Promise<{ url: string; type: string; userId: string }> {
    const url = `${API_BASE_URL}/upload/media`;

    const headers: Record<string, string> = {};

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }
}

export const apiService = new ApiService();

// Export helper functions for convenience
export const uploadMedia = (formData: FormData) => apiService.uploadMedia(formData);
export const updateCounterparty = (id: string, data: Partial<Counterparty>) =>
  apiService.updateCounterparty(id, data);
export const getCounterparty = (id: string) => apiService.getCounterparty(id);