import type { Category } from './Category';
import type { Currency } from './Currency';

/**
 * Periodicity options for recurring transactions.
 * Defines how often the recurring transaction repeats.
 * 
 * @group Transaction Types
 */
export enum RecurringTransactionPeriodicity {
  /** Repeats monthly */
  MONTHLY = 'MONTHLY',
  /** Repeats quarterly (every 3 months) */
  QUARTERLY = 'QUARTERLY',
  /** Repeats yearly */
  YEARLY = 'YEARLY',
}

/**
 * Base recurring transaction with minimal information.
 * 
 * @group Transaction Types
 */
export interface BaseRecurringTransaction {
  /** Brief description or title of the transaction */
  title: string;
  
  /** Currency of the transaction */
  currency: Currency;
  
  /** Category for organizing and filtering transactions */
  category: Category;
  
  /** Type of transaction this recurring template creates */
  transactionType: 'EXPENSE' | 'INCOME';
  
  /** Minimum approximate amount for this recurring transaction */
  minAproxAmount?: number;
  
  /** Maximum approximate amount for this recurring transaction */
  maxAproxAmount?: number;
  
  /** How often this recurring transaction repeats */
  periodicity: RecurringTransactionPeriodicity;
}

/**
 * Complete recurring transaction record with database metadata.
 * 
 * @group Transaction Types
 */
export interface RecurringTransaction extends BaseRecurringTransaction {
  /** Unique recurring transaction identifier */
  id: string;
  
  /** ID of the user who owns this recurring transaction */
  userId?: string;
  
  /** When the recurring transaction record was created */
  createdAt?: Date;
  
  /** When the recurring transaction record was last updated */
  updatedAt?: Date;
}

/**
 * Request payload for creating a new recurring transaction.
 * 
 * @group Transaction Types
 */
export interface CreateRecurringTransactionRequest extends BaseRecurringTransaction {}

/**
 * Request payload for updating an existing recurring transaction.
 * All fields are optional for partial updates.
 * 
 * @group Transaction Types
 */
export interface UpdateRecurringTransactionRequest extends Partial<BaseRecurringTransaction> {}