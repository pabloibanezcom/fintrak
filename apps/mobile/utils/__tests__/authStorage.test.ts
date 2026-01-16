import AsyncStorage from '@react-native-async-storage/async-storage';
import { authStorage } from '../authStorage';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

describe('AuthStorage', () => {
  const AUTH_TOKEN_KEY = '@fintrak_auth_token';
  const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.token';

  // Mock console.error to verify error logging
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Spy on console.error
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    // Restore console.error
    consoleErrorSpy.mockRestore();
  });

  describe('getToken()', () => {
    it('should successfully retrieve stored token', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(mockToken);

      const result = await authStorage.getToken();

      expect(AsyncStorage.getItem).toHaveBeenCalledWith(AUTH_TOKEN_KEY);
      expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1);
      expect(result).toBe(mockToken);
    });

    it('should return null when no token exists', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

      const result = await authStorage.getToken();

      expect(AsyncStorage.getItem).toHaveBeenCalledWith(AUTH_TOKEN_KEY);
      expect(result).toBeNull();
    });

    it('should return null and log error when AsyncStorage fails', async () => {
      const mockError = new Error('AsyncStorage get failed');
      (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(mockError);

      const result = await authStorage.getToken();

      expect(AsyncStorage.getItem).toHaveBeenCalledWith(AUTH_TOKEN_KEY);
      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error getting auth token:',
        mockError
      );
    });

    it('should handle AsyncStorage errors gracefully without throwing', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(
        new Error('Storage error')
      );

      await expect(authStorage.getToken()).resolves.toBeNull();
    });

    it('should return empty string if AsyncStorage returns empty string', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('');

      const result = await authStorage.getToken();

      expect(result).toBe('');
    });
  });

  describe('setToken()', () => {
    it('should successfully store a token', async () => {
      (AsyncStorage.setItem as jest.Mock).mockResolvedValueOnce(undefined);

      await authStorage.setToken(mockToken);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        AUTH_TOKEN_KEY,
        mockToken
      );
      expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
    });

    it('should call AsyncStorage.setItem with correct key and value', async () => {
      const customToken = 'custom.jwt.token';
      (AsyncStorage.setItem as jest.Mock).mockResolvedValueOnce(undefined);

      await authStorage.setToken(customToken);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        AUTH_TOKEN_KEY,
        customToken
      );
    });

    it('should throw error when AsyncStorage fails', async () => {
      const mockError = new Error('AsyncStorage set failed');
      (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(mockError);

      await expect(authStorage.setToken(mockToken)).rejects.toThrow(
        'AsyncStorage set failed'
      );
    });

    it('should log error before throwing', async () => {
      const mockError = new Error('Storage write error');
      (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(mockError);

      try {
        await authStorage.setToken(mockToken);
      } catch (error) {
        // Expected to throw
      }

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error setting auth token:',
        mockError
      );
    });

    it('should handle empty string token', async () => {
      (AsyncStorage.setItem as jest.Mock).mockResolvedValueOnce(undefined);

      await authStorage.setToken('');

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        AUTH_TOKEN_KEY,
        ''
      );
    });

    it('should handle very long token strings', async () => {
      const longToken = 'a'.repeat(10000);
      (AsyncStorage.setItem as jest.Mock).mockResolvedValueOnce(undefined);

      await authStorage.setToken(longToken);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        AUTH_TOKEN_KEY,
        longToken
      );
    });
  });

  describe('removeToken()', () => {
    it('should successfully remove token', async () => {
      (AsyncStorage.removeItem as jest.Mock).mockResolvedValueOnce(undefined);

      await authStorage.removeToken();

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(AUTH_TOKEN_KEY);
      expect(AsyncStorage.removeItem).toHaveBeenCalledTimes(1);
    });

    it('should call AsyncStorage.removeItem with correct key', async () => {
      (AsyncStorage.removeItem as jest.Mock).mockResolvedValueOnce(undefined);

      await authStorage.removeToken();

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(AUTH_TOKEN_KEY);
    });

    it('should throw error when AsyncStorage fails', async () => {
      const mockError = new Error('AsyncStorage remove failed');
      (AsyncStorage.removeItem as jest.Mock).mockRejectedValueOnce(mockError);

      await expect(authStorage.removeToken()).rejects.toThrow(
        'AsyncStorage remove failed'
      );
    });

    it('should log error before throwing', async () => {
      const mockError = new Error('Remove operation failed');
      (AsyncStorage.removeItem as jest.Mock).mockRejectedValueOnce(mockError);

      try {
        await authStorage.removeToken();
      } catch (error) {
        // Expected to throw
      }

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error removing auth token:',
        mockError
      );
    });
  });

  describe('clearAll()', () => {
    it('should successfully clear all storage', async () => {
      (AsyncStorage.clear as jest.Mock).mockResolvedValueOnce(undefined);

      await authStorage.clearAll();

      expect(AsyncStorage.clear).toHaveBeenCalledTimes(1);
      expect(AsyncStorage.clear).toHaveBeenCalledWith();
    });

    it('should call AsyncStorage.clear', async () => {
      (AsyncStorage.clear as jest.Mock).mockResolvedValueOnce(undefined);

      await authStorage.clearAll();

      expect(AsyncStorage.clear).toHaveBeenCalled();
    });

    it('should throw error when AsyncStorage fails', async () => {
      const mockError = new Error('AsyncStorage clear failed');
      (AsyncStorage.clear as jest.Mock).mockRejectedValueOnce(mockError);

      await expect(authStorage.clearAll()).rejects.toThrow(
        'AsyncStorage clear failed'
      );
    });

    it('should log error before throwing', async () => {
      const mockError = new Error('Clear operation failed');
      (AsyncStorage.clear as jest.Mock).mockRejectedValueOnce(mockError);

      try {
        await authStorage.clearAll();
      } catch (error) {
        // Expected to throw
      }

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error clearing all storage:',
        mockError
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle multiple consecutive getToken operations', async () => {
      (AsyncStorage.getItem as jest.Mock)
        .mockResolvedValueOnce(mockToken)
        .mockResolvedValueOnce(mockToken)
        .mockResolvedValueOnce(mockToken);

      const result1 = await authStorage.getToken();
      const result2 = await authStorage.getToken();
      const result3 = await authStorage.getToken();

      expect(result1).toBe(mockToken);
      expect(result2).toBe(mockToken);
      expect(result3).toBe(mockToken);
      expect(AsyncStorage.getItem).toHaveBeenCalledTimes(3);
    });

    it('should handle set followed by get operation', async () => {
      (AsyncStorage.setItem as jest.Mock).mockResolvedValueOnce(undefined);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(mockToken);

      await authStorage.setToken(mockToken);
      const result = await authStorage.getToken();

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        AUTH_TOKEN_KEY,
        mockToken
      );
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(AUTH_TOKEN_KEY);
      expect(result).toBe(mockToken);
    });

    it('should handle remove followed by get operation', async () => {
      (AsyncStorage.removeItem as jest.Mock).mockResolvedValueOnce(undefined);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

      await authStorage.removeToken();
      const result = await authStorage.getToken();

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(AUTH_TOKEN_KEY);
      expect(result).toBeNull();
    });

    it('should handle clearAll followed by get operation', async () => {
      (AsyncStorage.clear as jest.Mock).mockResolvedValueOnce(undefined);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

      await authStorage.clearAll();
      const result = await authStorage.getToken();

      expect(AsyncStorage.clear).toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should handle concurrent operations', async () => {
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(mockToken);

      const promises = [
        authStorage.setToken(mockToken),
        authStorage.getToken(),
        authStorage.setToken('another-token'),
        authStorage.getToken(),
      ];

      await Promise.all(promises);

      expect(AsyncStorage.setItem).toHaveBeenCalledTimes(2);
      expect(AsyncStorage.getItem).toHaveBeenCalledTimes(2);
    });

    it('should handle token with special characters', async () => {
      const specialToken = 'token!@#$%^&*()_+-=[]{}|;:,.<>?';
      (AsyncStorage.setItem as jest.Mock).mockResolvedValueOnce(undefined);

      await authStorage.setToken(specialToken);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        AUTH_TOKEN_KEY,
        specialToken
      );
    });

    it('should handle token with unicode characters', async () => {
      const unicodeToken = 'token-with-emoji-🔐-and-unicode-字符';
      (AsyncStorage.setItem as jest.Mock).mockResolvedValueOnce(undefined);

      await authStorage.setToken(unicodeToken);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        AUTH_TOKEN_KEY,
        unicodeToken
      );
    });
  });

  describe('Error Handling Consistency', () => {
    it('should ensure getToken returns null on error (not throw)', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(
        new Error('Error')
      );

      const result = await authStorage.getToken();

      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should ensure setToken throws on error', async () => {
      (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(
        new Error('Error')
      );

      await expect(authStorage.setToken(mockToken)).rejects.toThrow();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should ensure removeToken throws on error', async () => {
      (AsyncStorage.removeItem as jest.Mock).mockRejectedValueOnce(
        new Error('Error')
      );

      await expect(authStorage.removeToken()).rejects.toThrow();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should ensure clearAll throws on error', async () => {
      (AsyncStorage.clear as jest.Mock).mockRejectedValueOnce(
        new Error('Error')
      );

      await expect(authStorage.clearAll()).rejects.toThrow();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should log all errors to console.error', async () => {
      const getError = new Error('Get error');
      const setError = new Error('Set error');
      const removeError = new Error('Remove error');
      const clearError = new Error('Clear error');

      (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(getError);
      (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(setError);
      (AsyncStorage.removeItem as jest.Mock).mockRejectedValueOnce(removeError);
      (AsyncStorage.clear as jest.Mock).mockRejectedValueOnce(clearError);

      await authStorage.getToken();
      await authStorage.setToken(mockToken).catch(() => {});
      await authStorage.removeToken().catch(() => {});
      await authStorage.clearAll().catch(() => {});

      expect(consoleErrorSpy).toHaveBeenCalledTimes(4);
      expect(consoleErrorSpy).toHaveBeenNthCalledWith(
        1,
        'Error getting auth token:',
        getError
      );
      expect(consoleErrorSpy).toHaveBeenNthCalledWith(
        2,
        'Error setting auth token:',
        setError
      );
      expect(consoleErrorSpy).toHaveBeenNthCalledWith(
        3,
        'Error removing auth token:',
        removeError
      );
      expect(consoleErrorSpy).toHaveBeenNthCalledWith(
        4,
        'Error clearing all storage:',
        clearError
      );
    });
  });
});
