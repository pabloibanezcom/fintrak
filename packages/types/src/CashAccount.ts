/**
 * Represents a bank cash account with balance and identification information.
 * Used for tracking liquid assets and connecting to external banking services.
 * 
 * @group Financial Types
 */
export interface CashAccount {
  /** Unique identifier for the account */
  accountId: string;
  
  /** International Bank Account Number */
  iban: string;
  
  /** Bank-specific account code or number */
  accountCode: string;
  
  /** User-friendly name for the account */
  alias: string;
  
  /** Date when the account was created (ISO string) */
  creationDate: string;
  
  /** Account currency code */
  currency: string;
  
  /** Current account balance */
  balance: number;
}