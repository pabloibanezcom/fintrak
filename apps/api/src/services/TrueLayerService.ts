import type {
  TrueLayerAccount,
  TrueLayerBalance,
  TrueLayerTransaction,
} from '@fintrak/types';
import axios, { type AxiosInstance } from 'axios';

interface TokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  refresh_token: string;
  scope: string;
}

interface TrueLayerApiResponse<T> {
  results: T[];
  status: string;
}

class TrueLayerService {
  private client: AxiosInstance;
  private readonly baseUrl: string;
  private readonly authUrl: string;

  constructor() {
    const isSandbox = process.env.TRUELAYER_SANDBOX !== 'false';
    this.baseUrl = isSandbox
      ? 'https://api.truelayer-sandbox.com'
      : 'https://api.truelayer.com';
    this.authUrl = isSandbox
      ? 'https://auth.truelayer-sandbox.com'
      : 'https://auth.truelayer.com';

    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
  }

  /**
   * Generate TrueLayer authorization URL for user bank connection
   */
  getAuthorizationUrl(redirectUri: string, state?: string): string {
    const clientId = process.env.TRUELAYER_CLIENT_ID;
    if (!clientId) {
      throw new Error('TRUELAYER_CLIENT_ID not configured');
    }

    const isSandbox = process.env.TRUELAYER_SANDBOX !== 'false';

    // Build URL manually to control encoding
    const baseUrl = this.authUrl;
    const scope =
      'info accounts balance cards transactions direct_debits standing_orders offline_access';

    // Build query string with proper encoding
    const queryParts: string[] = [
      `response_type=code`,
      `client_id=${encodeURIComponent(clientId)}`,
      `scope=${encodeURIComponent(scope)}`,
      `redirect_uri=${encodeURIComponent(redirectUri)}`,
    ];

    // Add providers based on environment
    if (isSandbox) {
      queryParts.push(
        `providers=${encodeURIComponent('uk-cs-mock uk-ob-all uk-oauth-all')}`
      );
    } else {
      // Spanish banks via XS2A
      queryParts.push(
        `providers=${encodeURIComponent('es-xs2a-santander es-xs2a-bbva')}`
      );
    }

    if (state) {
      queryParts.push(`state=${encodeURIComponent(state)}`);
    }

    return `${baseUrl}/?${queryParts.join('&')}`;
  }

  /**
   * Exchange authorization code for access and refresh tokens
   */
  async exchangeCode(
    code: string,
    redirectUri: string
  ): Promise<TokenResponse> {
    const clientId = process.env.TRUELAYER_CLIENT_ID;
    const clientSecret = process.env.TRUELAYER_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error(
        'TrueLayer credentials not configured. Set TRUELAYER_CLIENT_ID and TRUELAYER_CLIENT_SECRET'
      );
    }

    try {
      const response = await axios.post<TokenResponse>(
        `${this.authUrl}/connect/token`,
        new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          code,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('TrueLayer token exchange failed:', {
          status: error.response?.status,
          data: error.response?.data,
        });
      }
      throw new Error('Failed to exchange authorization code');
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
    const clientId = process.env.TRUELAYER_CLIENT_ID;
    const clientSecret = process.env.TRUELAYER_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error('TrueLayer credentials not configured');
    }

    try {
      const response = await axios.post<TokenResponse>(
        `${this.authUrl}/connect/token`,
        new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: clientId,
          client_secret: clientSecret,
          refresh_token: refreshToken,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('TrueLayer token refresh failed:', {
          status: error.response?.status,
          data: error.response?.data,
        });
      }
      throw new Error('Failed to refresh access token');
    }
  }

  /**
   * Get list of connected bank accounts
   */
  async getAccounts(accessToken: string): Promise<TrueLayerAccount[]> {
    try {
      const response = await this.client.get<
        TrueLayerApiResponse<TrueLayerAccount>
      >('/data/v1/accounts', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data.results;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Failed to fetch TrueLayer accounts:', {
          status: error.response?.status,
          data: error.response?.data,
        });
      }
      throw new Error('Failed to fetch accounts');
    }
  }

  /**
   * Get balance for a specific account
   */
  async getBalance(
    accessToken: string,
    accountId: string
  ): Promise<TrueLayerBalance> {
    try {
      const response = await this.client.get<
        TrueLayerApiResponse<TrueLayerBalance>
      >(`/data/v1/accounts/${accountId}/balance`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data.results[0];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Failed to fetch TrueLayer balance:', {
          status: error.response?.status,
          data: error.response?.data,
        });
      }
      throw new Error('Failed to fetch balance');
    }
  }

  /**
   * Get transactions for a specific account
   */
  async getTransactions(
    accessToken: string,
    accountId: string,
    from?: string,
    to?: string
  ): Promise<TrueLayerTransaction[]> {
    try {
      const params = new URLSearchParams();
      if (from) params.append('from', from);
      if (to) params.append('to', to);

      const queryString = params.toString();
      const url = `/data/v1/accounts/${accountId}/transactions${queryString ? `?${queryString}` : ''}`;

      const response = await this.client.get<
        TrueLayerApiResponse<TrueLayerTransaction>
      >(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data.results;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Failed to fetch TrueLayer transactions:', {
          status: error.response?.status,
          data: error.response?.data,
        });
      }
      throw new Error('Failed to fetch transactions');
    }
  }

  /**
   * Get list of supported banks (sandbox vs production)
   */
  getSupportedProviders(): {
    id: string;
    name: string;
    logo?: string;
    sandbox: boolean;
  }[] {
    const isSandbox = process.env.TRUELAYER_SANDBOX !== 'false';

    if (isSandbox) {
      return [
        {
          id: 'uk-cs-mock',
          name: 'Mock Bank (Sandbox)',
          sandbox: true,
        },
      ];
    }

    return [
      {
        id: 'es-xs2a-santander',
        name: 'Santander',
        logo: 'https://truelayer-provider-assets.s3.amazonaws.com/es/logos/santander.svg',
        sandbox: false,
      },
      {
        id: 'es-xs2a-bbva',
        name: 'BBVA',
        logo: 'https://truelayer-provider-assets.s3.amazonaws.com/es/logos/bbva.svg',
        sandbox: false,
      },
    ];
  }
}

export default new TrueLayerService();
