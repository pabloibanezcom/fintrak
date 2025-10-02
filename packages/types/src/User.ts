/**
 * Represents a user in the Fintrak system.
 *
 * @group Core Types
 */
export interface User {
  email: string;
  password?: string; // Optional for Google OAuth users
  name?: string;
  lastName?: string;
  googleId?: string; // Google OAuth ID
  profilePicture?: string; // Google profile picture URL
  authProvider: 'email' | 'google'; // Track how user authenticated
}
