import type { Category } from './Category';
import type { Currency } from './Currency';
import type { Periodicity } from './Periodicity';
import type { RecurringTransaction } from './RecurringTransaction';
import type { Tag } from './Tag';

/**
 * Base interface for all financial transactions in the Fintrak system.
 * Provides common fields shared between expenses and income transactions.
 * 
 * @group Transaction Types
 */
export interface BaseTransaction {
  /** Brief description or title of the transaction */
  title: string;
  
  /** Transaction amount (always positive, direction determined by transaction type) */
  amount: number;
  
  /** Currency of the transaction */
  currency: Currency;
  
  /** Category for organizing and filtering transactions */
  category: Category;
  
  /** Date when the transaction occurred */
  date: Date;
  
  /** Defines if and how this transaction repeats */
  periodicity: Periodicity;
  
  /** Optional detailed description or notes */
  description?: string;
  
  /** Optional tags for additional categorization */
  tags?: Tag[];
  
  /** Optional reference to a recurring transaction template that generated this transaction */
  recurringTransaction?: RecurringTransaction;
}