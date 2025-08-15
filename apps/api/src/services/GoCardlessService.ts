import axios, { type AxiosInstance } from 'axios';
import type { 
  GoCardlessAccount, 
  GoCardlessRequisition, 
  CreateRequisitionRequest,
  BankTransaction
} from '@fintrak/types';

interface TokenResponse {
  access: string;
  access_expires: number;
  refresh: string;
  refresh_expires: number;
}

interface Institution {
  id: string;
  name: string;
  bic: string;
  transaction_total_days: string;
  countries: string[];
  logo: string;
  supported_payments: string[];
  supported_features: string[];
}

class GoCardlessService {
  private client: AxiosInstance;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiresAt: number | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: 'https://bankaccountdata.gocardless.com/api/v2',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    this.client.interceptors.request.use(async (config) => {
      await this.ensureValidToken();
      if (this.accessToken) {
        config.headers.Authorization = `Bearer ${this.accessToken}`;
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401 && this.refreshToken) {
          try {
            await this.refreshAccessToken();
            return this.client.request(error.config);
          } catch (refreshError) {
            console.error('Failed to refresh token:', refreshError);
            throw error;
          }
        }
        throw error;
      }
    );
  }

  private async authenticate(): Promise<void> {
    const secretId = process.env.GOCARDLESS_SECRET_ID;
    const secretKey = process.env.GOCARDLESS_SECRET_KEY;

    if (!secretId || !secretKey) {
      throw new Error('GoCardless credentials not configured');
    }

    try {
      const response = await axios.post<TokenResponse>(
        'https://bankaccountdata.gocardless.com/api/v2/token/new/',
        {
          secret_id: secretId,
          secret_key: secretKey
        }
      );

      this.accessToken = response.data.access;
      this.refreshToken = response.data.refresh;
      this.tokenExpiresAt = Date.now() + (response.data.access_expires * 1000);
    } catch (error) {
      console.error('GoCardless authentication failed:', error);
      throw new Error('Failed to authenticate with GoCardless');
    }
  }

  private async refreshAccessToken(): Promise<void> {
    if (!this.refreshToken) {
      await this.authenticate();
      return;
    }

    try {
      const response = await axios.post<TokenResponse>(
        'https://bankaccountdata.gocardless.com/api/v2/token/refresh/',
        {
          refresh: this.refreshToken
        }
      );

      this.accessToken = response.data.access;
      this.refreshToken = response.data.refresh;
      this.tokenExpiresAt = Date.now() + (response.data.access_expires * 1000);
    } catch (error) {
      console.error('Token refresh failed:', error);
      await this.authenticate();
    }
  }

  private async ensureValidToken(): Promise<void> {
    if (!this.accessToken || !this.tokenExpiresAt || Date.now() >= this.tokenExpiresAt - 60000) {
      if (this.refreshToken) {
        await this.refreshAccessToken();
      } else {
        await this.authenticate();
      }
    }
  }

  async getInstitutions(country: string = 'ES'): Promise<Institution[]> {
    try {
      const response = await this.client.get<Institution[]>(`/institutions/?country=${country}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch institutions:', error);
      throw new Error('Failed to fetch institutions');
    }
  }

  async createRequisition(data: CreateRequisitionRequest): Promise<GoCardlessRequisition> {
    try {
      const response = await this.client.post<GoCardlessRequisition>('/requisitions/', data);
      return response.data;
    } catch (error) {
      console.error('Failed to create requisition:', error);
      throw new Error('Failed to create requisition');
    }
  }

  async getRequisition(requisitionId: string): Promise<GoCardlessRequisition> {
    try {
      const response = await this.client.get<GoCardlessRequisition>(`/requisitions/${requisitionId}/`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch requisition:', error);
      throw new Error('Failed to fetch requisition');
    }
  }

  async getAccountDetails(accountId: string): Promise<GoCardlessAccount> {
    try {
      const response = await this.client.get<GoCardlessAccount>(`/accounts/${accountId}/details/`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch account details:', error);
      throw new Error('Failed to fetch account details');
    }
  }

  async getAccountTransactions(
    accountId: string,
    dateFrom?: string,
    dateTo?: string
  ): Promise<{ transactions: { booked: BankTransaction[]; pending: BankTransaction[] } }> {
    try {
      const params = new URLSearchParams();
      if (dateFrom) params.append('date_from', dateFrom);
      if (dateTo) params.append('date_to', dateTo);

      const queryString = params.toString();
      const url = `/accounts/${accountId}/transactions/${queryString ? `?${queryString}` : ''}`;
      
      const response = await this.client.get(url);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch account transactions:', error);
      throw new Error('Failed to fetch account transactions');
    }
  }

  async getAccountBalances(accountId: string): Promise<any> {
    try {
      const response = await this.client.get(`/accounts/${accountId}/balances/`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch account balances:', error);
      throw new Error('Failed to fetch account balances');
    }
  }
}

export default new GoCardlessService();