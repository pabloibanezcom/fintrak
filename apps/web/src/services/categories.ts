import { apiClient } from './api';

export interface Category {
  key: string;
  name: string;
  color: string;
  icon: string;
}

export const categoriesService = {
  getCategories: async (): Promise<Category[]> => {
    return apiClient.get<Category[]>('/categories');
  },

  getCategory: async (id: string): Promise<Category> => {
    return apiClient.get<Category>(`/categories/${id}`);
  },

  create: async (data: Partial<Category>): Promise<Category> => {
    return apiClient.post<Category>('/categories', data);
  },

  update: async (id: string, data: Partial<Category>): Promise<Category> => {
    return apiClient.put<Category>(`/categories/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/categories/${id}`);
  },
};
