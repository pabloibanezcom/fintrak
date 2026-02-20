import { apiClient } from './api';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

export interface LogoSearchResult {
  thumbnail: string;
  url: string;
  title: string;
}

export const logosService = {
  search: async (q: string): Promise<LogoSearchResult[]> => {
    const params = new URLSearchParams({ q });
    const data = await apiClient.get<{ results: LogoSearchResult[] }>(
      `/logos/search?${params}`
    );
    return data.results;
  },

  pick: async (url: string): Promise<string> => {
    const data = await apiClient.post<{ url: string }>('/logos/pick', { url });
    return data.url;
  },

  proxy: async (url: string): Promise<string> => {
    const params = new URLSearchParams({ url });
    const data = await apiClient.get<{ dataUrl: string }>(
      `/logos/proxy?${params}`
    );
    return data.dataUrl;
  },

  upload: async (blob: Blob): Promise<string> => {
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('auth_token')
        : null;
    const formData = new FormData();
    formData.append('file', blob, 'logo.png');
    formData.append('type', 'counterparty-logo');

    const response = await fetch(`${API_BASE_URL}/upload/media`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        (error as { error?: string }).error || 'Upload failed'
      );
    }

    const data = (await response.json()) as { url: string };
    return data.url;
  },
};
