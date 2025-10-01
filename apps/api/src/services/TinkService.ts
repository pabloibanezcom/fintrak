import type { BankTransaction } from '@fintrak/types';
import axios, { type AxiosInstance } from 'axios';

interface TinkTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  refresh_token?: string;
  scope?: string;
}

interface TinkProvider {
  name: string;
  displayName: string;
  type: string;
  status: string;
  credentialsType: string;
  helpText?: string;
  isPopular: boolean;
  fields: TinkField[];
  groupDisplayName?: string;
  image?: string;
  displayDescription?: string;
  marketCode: string;
  accessType: string;
  transactional: boolean;
  capabilities: string[];
}

interface TinkField {
  description: string;
  hint?: string;
  maxLength?: number;
  minLength?: number;
  name: string;
  numeric?: boolean;
  optional?: boolean;
  pattern?: string;
  patternError?: string;
  sensitive?: boolean;
  immutable?: boolean;
  additionalInfo?: string;
  helpText?: string;
}

interface TinkAccount {
  id: string;
  name: string;
  type: string;
  identifiers?: {
    iban?: {
      iban: string;
      bban: string;
    };
    sortCode?: {
      accountNumber: string;
      sortCode: string;
    };
  };
  balances?: {
    booked?: {
      amount: {
        value: number;
        scale: number;
        unscaledValue: number;
      };
      currencyCode: string;
    };
    available?: {
      amount: {
        value: number;
        scale: number;
        unscaledValue: number;
      };
      currencyCode: string;
    };
  };
  financialInstitutionId: string;
}

interface TinkTransaction {
  id: string;
  accountId: string;
  amount: {
    value: number;
    currencyCode: string;
  };
  descriptions: {
    original: string;
    display: string;
  };
  dates: {
    booked: string;
    value?: string;
  };
  types: {
    type: string;
    financialInstitutionType?: string;
  };
  status: string;
  identifiers?: {
    providerTransactionId?: string;
  };
  merchantInformation?: {
    merchantName?: string;
    merchantCategoryCode?: string;
  };
}

class TinkService {
  private client: AxiosInstance;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiresAt: number | null = null;
  private readonly baseURL = 'https://api.tink.com';

  constructor() {
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use(async (config) => {
      // Only add token if we have one (some endpoints don't need it)
      if (this.accessToken) {
        config.headers.Authorization = `Bearer ${this.accessToken}`;
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          try {
            // Try to refresh token
            if (this.refreshToken) {
              await this.refreshAccessToken();
              return this.client.request(error.config);
            }
          } catch (refreshError) {
            console.error('Failed to refresh token:', refreshError);
            throw error;
          }
        }
        throw error;
      }
    );
  }

  /**
   * Get client credentials token (for server-to-server API calls)
   */
  private async authenticateClientCredentials(): Promise<void> {
    const clientId = process.env.TINK_CLIENT_ID;
    const clientSecret = process.env.TINK_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error(
        'Tink credentials not configured. Set TINK_CLIENT_ID and TINK_CLIENT_SECRET'
      );
    }

    try {
      console.log('Authenticating with Tink API using client credentials...');

      const params = new URLSearchParams();
      params.append('client_id', clientId);
      params.append('client_secret', clientSecret);
      params.append('grant_type', 'client_credentials');
      params.append('scope', 'providers:read');

      const response = await axios.post<TinkTokenResponse>(
        `${this.baseURL}/api/v1/oauth/token`,
        params,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiresAt = Date.now() + response.data.expires_in * 1000;
      console.log('Tink authentication successful');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Tink authentication failed:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message,
        });
      } else {
        console.error('Tink authentication failed:', error);
      }
      throw new Error(
        'Failed to authenticate with Tink. Please check your TINK_CLIENT_ID and TINK_CLIENT_SECRET'
      );
    }
  }

  /**
   * Exchange authorization code for access token (user flow)
   */
  async exchangeAuthorizationCode(code: string): Promise<TinkTokenResponse> {
    const clientId = process.env.TINK_CLIENT_ID;
    const clientSecret = process.env.TINK_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error('Tink credentials not configured');
    }

    try {
      const params = new URLSearchParams();
      params.append('code', code);
      params.append('client_id', clientId);
      params.append('client_secret', clientSecret);
      params.append('grant_type', 'authorization_code');

      const response = await axios.post<TinkTokenResponse>(
        `${this.baseURL}/api/v1/oauth/token`,
        params,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      this.accessToken = response.data.access_token;
      this.refreshToken = response.data.refresh_token || null;
      this.tokenExpiresAt = Date.now() + response.data.expires_in * 1000;

      return response.data;
    } catch (error) {
      console.error('Failed to exchange authorization code:', error);
      throw new Error('Failed to exchange authorization code');
    }
  }

  /**
   * Refresh access token using refresh token
   */
  private async refreshAccessToken(): Promise<void> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    const clientId = process.env.TINK_CLIENT_ID;
    const clientSecret = process.env.TINK_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error('Tink credentials not configured');
    }

    try {
      const params = new URLSearchParams();
      params.append('refresh_token', this.refreshToken);
      params.append('client_id', clientId);
      params.append('client_secret', clientSecret);
      params.append('grant_type', 'refresh_token');

      const response = await axios.post<TinkTokenResponse>(
        `${this.baseURL}/api/v1/oauth/token`,
        params,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      this.accessToken = response.data.access_token;
      this.refreshToken = response.data.refresh_token || this.refreshToken;
      this.tokenExpiresAt = Date.now() + response.data.expires_in * 1000;
    } catch (error) {
      console.error('Token refresh failed:', error);
      throw error;
    }
  }

  /**
   * Ensure we have a valid token (client credentials)
   */
  private async ensureValidToken(): Promise<void> {
    if (
      !this.accessToken ||
      !this.tokenExpiresAt ||
      Date.now() >= this.tokenExpiresAt - 60000
    ) {
      await this.authenticateClientCredentials();
    }
  }

  /**
   * Set user access token (after user authorization)
   */
  setUserToken(accessToken: string, refreshToken?: string, expiresIn?: number): void {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken || null;
    this.tokenExpiresAt = expiresIn ? Date.now() + expiresIn * 1000 : null;
  }

  /**
   * Get authorization URL for user to connect their bank
   */
  getAuthorizationUrl(redirectUri: string, state?: string): string {
    const clientId = process.env.TINK_CLIENT_ID;
    if (!clientId) {
      throw new Error('TINK_CLIENT_ID not configured');
    }

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'authorization:grant,credentials:read,credentials:write,providers:read,user:read,accounts:read,transactions:read,balances:read',
      market: 'ES',
      locale: 'es_ES',
      ...(state && { state }),
    });

    return `https://link.tink.com/1.0/authorize/?${params.toString()}`;
  }

  /**
   * Get list of available banks/providers for a market
   * Note: This endpoint requires user-level authentication in Tink API
   */
  async getProviders(market: string = 'ES'): Promise<TinkProvider[]> {
    try {
      console.log(`Fetching providers for market: ${market}`);

      // Try without authentication first (public endpoint)
      try {
        const response = await axios.get<TinkProvider[]>(
          `${this.baseURL}/api/v1/providers?market=${market}`
        );
        console.log(`Fetched ${response.data.length} providers`);
        return response.data;
      } catch (publicError) {
        // If public access fails, try with user token if available
        if (this.accessToken) {
          console.log('Public access failed, trying with user token...');
          const response = await this.client.get<TinkProvider[]>(
            `/api/v1/providers?market=${market}`
          );
          console.log(`Fetched ${response.data.length} providers`);
          return response.data;
        }
        throw publicError;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Failed to fetch providers:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message,
        });
      } else {
        console.error('Failed to fetch providers:', error);
      }
      throw new Error('Failed to fetch providers. This endpoint may require user authentication.');
    }
  }

  /**
   * Get user's connected accounts (requires user token)
   */
  async getAccounts(): Promise<TinkAccount[]> {
    try {
      if (!this.accessToken) {
        throw new Error('User not authenticated. Please provide user access token.');
      }

      const response = await this.client.get<{ accounts: TinkAccount[] }>(
        '/data/v2/accounts'
      );

      return response.data.accounts;
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
      throw new Error('Failed to fetch accounts');
    }
  }

  /**
   * Get transactions for an account (requires user token)
   */
  async getTransactions(accountId: string): Promise<TinkTransaction[]> {
    try {
      if (!this.accessToken) {
        throw new Error('User not authenticated. Please provide user access token.');
      }

      const response = await this.client.get<{ transactions: TinkTransaction[] }>(
        `/data/v2/accounts/${accountId}/transactions`
      );

      return response.data.transactions;
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      throw new Error('Failed to fetch transactions');
    }
  }

  /**
   * Get all transactions (requires user token)
   */
  async getAllTransactions(): Promise<TinkTransaction[]> {
    try {
      if (!this.accessToken) {
        throw new Error('User not authenticated. Please provide user access token.');
      }

      const response = await this.client.get<{ transactions: TinkTransaction[] }>(
        '/data/v2/transactions'
      );

      return response.data.transactions;
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      throw new Error('Failed to fetch transactions');
    }
  }
}

export default new TinkService();
