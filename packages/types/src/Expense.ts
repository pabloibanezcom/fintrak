import type { BaseTransaction } from './BaseTransaction';
import type { Counterparty } from './Counterparty';

/**
 * Base expense transaction with optional payee information.
 * 
 * @group Transaction Types
 */
export interface BaseExpense extends BaseTransaction {
  /** Optional information about who received the payment */
  payee?: Counterparty;
}

/**
 * Complete expense record with database metadata.
 * 
 * @group Transaction Types
 */
export interface Expense extends BaseExpense {
  /** Unique expense identifier */
  id: string;
  
  /** ID of the user who owns this expense */
  userId?: string;
  
  /** When the expense record was created */
  createdAt?: Date;
  
  /** When the expense record was last updated */
  updatedAt?: Date;
}

/**
 * Request payload for creating a new expense.
 * 
 * @group Transaction Types
 */
export interface CreateExpenseRequest extends BaseExpense {}

/**
 * Request payload for updating an existing expense.
 * All fields are optional for partial updates.
 * 
 * @group Transaction Types
 */
export interface UpdateExpenseRequest extends Partial<BaseExpense> {}