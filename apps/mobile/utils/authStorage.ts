import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_TOKEN_KEY = '@fintrak_auth_token';

/**
 * Authentication Storage Module
 *
 * Secure wrapper around React Native AsyncStorage for managing JWT authentication tokens.
 * Provides methods to store, retrieve, and clear authentication credentials.
 *
 * @example
 * // Store a token after login
 * await authStorage.setToken(jwtToken);
 *
 * // Retrieve stored token
 * const token = await authStorage.getToken();
 *
 * // Remove token on logout
 * await authStorage.removeToken();
 *
 * // Clear all storage
 * await authStorage.clearAll();
 */
export const authStorage = {
  /**
   * Retrieves the stored authentication token
   *
   * @returns Promise resolving to the token string, or null if not found or on error
   *
   * @example
   * const token = await authStorage.getToken();
   * if (token) {
   *   // User is authenticated
   * }
   */
  async getToken(): Promise<string | null> {
    try {
      const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      return token;
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  },

  /**
   * Stores an authentication token
   *
   * @param token - JWT token string to store
   * @throws {Error} If AsyncStorage fails to save the token
   *
   * @example
   * try {
   *   await authStorage.setToken('eyJhbGciOiJIUzI1NiIs...');
   * } catch (error) {
   *   console.error('Failed to save token');
   * }
   */
  async setToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
    } catch (error) {
      console.error('Error setting auth token:', error);
      throw error;
    }
  },

  /**
   * Removes the stored authentication token
   *
   * Use this method when logging out to clear authentication credentials.
   *
   * @throws {Error} If AsyncStorage fails to remove the token
   *
   * @example
   * try {
   *   await authStorage.removeToken();
   *   // User logged out successfully
   * } catch (error) {
   *   console.error('Failed to remove token');
   * }
   */
  async removeToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    } catch (error) {
      console.error('Error removing auth token:', error);
      throw error;
    }
  },

  /**
   * Clears all AsyncStorage data
   *
   * WARNING: This removes ALL data from AsyncStorage, not just the auth token.
   * Use with caution - prefer removeToken() for typical logout scenarios.
   *
   * @throws {Error} If AsyncStorage fails to clear
   *
   * @example
   * try {
   *   await authStorage.clearAll();
   *   // All app data cleared
   * } catch (error) {
   *   console.error('Failed to clear storage');
   * }
   */
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing all storage:', error);
      throw error;
    }
  },
};