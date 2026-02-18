/**
 * Represents an account linked through an external banking provider.
 *
 * @group Financial Types
 */
export interface ConnectedAccount {
  /** Provider account identifier */
  accountId: string;

  /** International Bank Account Number (if available) */
  iban?: string;

  /** Provider-side display name */
  name?: string;

  /** Provider account type */
  type: string;

  /** ISO currency code */
  currency?: string;
}

/**
 * Represents a stored bank connection for a user.
 *
 * @group Financial Types
 */
export interface BankConnection {
  /** Connection identifier */
  id?: string;

  /** Owner user ID */
  userId: string;

  /** Bank/provider identifier */
  bankId: string;

  /** Display name for the bank/provider */
  bankName: string;

  /** Optional user-defined alias */
  alias?: string;

  /** Optional logo URL */
  logo?: string;

  /** OAuth access token */
  accessToken: string;

  /** OAuth refresh token */
  refreshToken: string;

  /** Access token expiration timestamp */
  expiresAt: Date;

  /** Accounts linked under this connection */
  connectedAccounts: ConnectedAccount[];

  /** Creation timestamp */
  createdAt?: Date;

  /** Last update timestamp */
  updatedAt?: Date;
}
