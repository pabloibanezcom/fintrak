import type { AuthResponse, LoginRequest, RegisterRequest } from '@fintrak/types';
import { apiClient } from './api';

export interface User {
  id: string;
  email: string;
  name?: string;
  lastName?: string;
  profilePicture?: string;
  authProvider?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const authService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      '/auth/login',
      credentials
    );
    if (response.token) {
      apiClient.setToken(response.token);
    }
    return response;
  },

  register: async (
    data: RegisterRequest
  ): Promise<{ id: string; email: string }> => {
    return apiClient.post<{ id: string; email: string }>(
      '/auth/register',
      data
    );
  },

  getCurrentUser: async (): Promise<User> => {
    return apiClient.get<User>('/auth/me');
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    return apiClient.put<User>('/auth/me', data);
  },

  googleTokenAuth: async (idToken: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/google/token', {
      idToken,
    });
    if (response.token) {
      apiClient.setToken(response.token);
    }
    return response;
  },

  logout: (): void => {
    apiClient.clearToken();
  },
};
