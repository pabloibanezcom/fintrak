/**
 * Represents a unified bank account from any source.
 * Normalizes data from MyInvestor, TrueLayer, and other banking sources.
 *
 * @group Financial Types
 */
export interface BankAccount {
  /** Unique identifier for the account */
  accountId: string;

  /** Data source identifier */
  source: 'myinvestor' | 'truelayer';

  /** Bank/provider name (e.g., 'MyInvestor', 'Santander', 'BBVA') */
  bankName: string;

  /** Bank identifier (e.g., 'myinvestor', 'santander', 'bbva') */
  bankId: string;

  /** Optional bank logo URL */
  logo?: string;

  /** Account display name or alias */
  displayName: string;

  /** International Bank Account Number (if available) */
  iban?: string;

  /** Account type */
  accountType: 'TRANSACTION' | 'SAVINGS' | 'CASH' | 'OTHER';

  /** ISO currency code (e.g., 'EUR') */
  currency: string;

  /** Current balance */
  balance: number;

  /** Available balance (if different from current) */
  availableBalance?: number;
}

/**
 * Represents a persisted bank account connection record.
 *
 * @group Financial Types
 */
export interface StoredBankAccount {
  /** Record identifier */
  id?: string;

  /** Owner user ID */
  userId: string;

  /** Provider account identifier */
  accountId: string;

  /** Bank/provider identifier */
  bankId: string;

  /** Bank/provider display name */
  bankName: string;

  /** Account display name */
  name: string;

  /** Optional user-defined alias */
  alias?: string;

  /** International Bank Account Number */
  iban?: string;

  /** Provider account type */
  type: string;

  /** ISO currency code */
  currency: string;

  /** Creation timestamp */
  createdAt?: Date;

  /** Last update timestamp */
  updatedAt?: Date;
}
