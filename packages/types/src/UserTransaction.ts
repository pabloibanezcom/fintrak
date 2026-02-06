import type { BaseTransaction } from './BaseTransaction';
import type { Counterparty } from './Counterparty';

/**
 * Type of user transaction - expense (money out) or income (money in).
 *
 * @group Transaction Types
 */
export type UserTransactionType = 'expense' | 'income';

/**
 * Base user transaction that unifies expenses and incomes.
 * The `type` field determines if money is going out (expense) or in (income).
 *
 * @group Transaction Types
 */
export interface BaseUserTransaction extends BaseTransaction {
  /** Transaction type - expense (debit) or income (credit) */
  type: UserTransactionType;

  /** The other party in the transaction (payee for expenses, source for income) */
  counterparty?: Counterparty;

  /** Optional reference to the linked bank transaction */
  bankTransactionId?: string;
}

/**
 * Complete user transaction record with database metadata.
 *
 * @group Transaction Types
 */
export interface UserTransaction extends BaseUserTransaction {
  /** Unique transaction identifier */
  id: string;

  /** ID of the user who owns this transaction */
  userId?: string;

  /** When the transaction record was created */
  createdAt?: Date;

  /** When the transaction record was last updated */
  updatedAt?: Date;
}

/**
 * Request payload for creating a new user transaction.
 *
 * @group Transaction Types
 */
export interface CreateUserTransactionRequest
  extends Omit<BaseUserTransaction, 'category' | 'counterparty'> {
  /** Category key */
  category: string;

  /** Counterparty key (optional) */
  counterparty?: string;
}

/**
 * Request payload for updating an existing user transaction.
 * All fields are optional for partial updates.
 *
 * @group Transaction Types
 */
export interface UpdateUserTransactionRequest
  extends Partial<Omit<BaseUserTransaction, 'category' | 'counterparty'>> {
  /** Category key */
  category?: string;

  /** Counterparty key (optional) */
  counterparty?: string;
}

/**
 * Request payload for creating a transaction from a bank transaction.
 *
 * @group Transaction Types
 */
export interface CreateFromBankTransactionRequest {
  /** Category key (required) */
  category: string;

  /** Counterparty key (optional) */
  counterparty?: string;

  /** Override the default title */
  title?: string;

  /** Optional description */
  description?: string;

  /** Optional tags */
  tags?: string[];
}
