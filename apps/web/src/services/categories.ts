import { apiClient } from './api';

export interface Category {
  key: string;
  name: string;
  color: string;
  icon: string;
  keywords?: string[];
}

export const categoriesService = {
  getCategories: async (): Promise<Category[]> => {
    return apiClient.get<Category[]>('/categories');
  },

  getCategory: async (id: string): Promise<Category> => {
    return apiClient.get<Category>(`/categories/${id}`);
  },
};
