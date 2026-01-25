import { apiClient } from './api';

export interface BankAccount {
  _id: string;
  userId: string;
  accountId: string;
  bankId: string;
  bankName: string;
  name: string;
  alias?: string;
  iban?: string;
  type: string;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetBankAccountsParams {
  bankId?: string;
}

export const bankAccountsService = {
  getAccounts: async (
    params: GetBankAccountsParams = {}
  ): Promise<BankAccount[]> => {
    const query = new URLSearchParams();

    if (params.bankId) query.set('bankId', params.bankId);

    const queryString = query.toString();
    const endpoint = queryString
      ? `/bank-accounts?${queryString}`
      : '/bank-accounts';

    return apiClient.get<BankAccount[]>(endpoint);
  },

  getAccount: async (accountId: string): Promise<BankAccount> => {
    return apiClient.get<BankAccount>(`/bank-accounts/${accountId}`);
  },

  updateAccount: async (
    accountId: string,
    data: { alias?: string }
  ): Promise<BankAccount> => {
    return apiClient.patch<BankAccount>(`/bank-accounts/${accountId}`, data);
  },
};
