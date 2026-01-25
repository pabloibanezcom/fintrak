import { apiClient } from './api';

export interface ConnectedAccount {
  accountId: string;
  iban?: string;
  name?: string;
  type: string;
  currency?: string;
}

export interface BankConnection {
  _id: string;
  bankId: string;
  bankName: string;
  alias?: string;
  logo?: string;
  connectedAccounts: ConnectedAccount[];
  createdAt: string;
  updatedAt: string;
}

export const bankConnectionsService = {
  getConnections: async (): Promise<BankConnection[]> => {
    return apiClient.get<BankConnection[]>('/bank/connections');
  },

  updateConnection: async (
    bankId: string,
    data: { alias?: string }
  ): Promise<BankConnection> => {
    return apiClient.patch<BankConnection>(`/bank/connections/${bankId}`, data);
  },
};
