import type { BankAccount, UserProducts } from '@fintrak/types';
import { apiClient } from './api';

export const productsService = {
  getProducts: async (): Promise<UserProducts> => {
    return apiClient.get<UserProducts>('/products');
  },

  getBankAccounts: async (): Promise<BankAccount[]> => {
    const products = await productsService.getProducts();
    return products.items.bankAccounts.items;
  },
};
