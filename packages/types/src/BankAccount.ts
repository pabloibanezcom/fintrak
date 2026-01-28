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
