import type { BaseTransaction } from './BaseTransaction';
import type { Counterparty } from './Counterparty';

/**
 * Base income transaction with optional source information.
 * 
 * @group Transaction Types
 */
export interface BaseIncome extends BaseTransaction {
  /** Optional information about who provided the payment */
  source?: Counterparty;
}

/**
 * Complete income record with database metadata.
 * 
 * @group Transaction Types
 */
export interface Income extends BaseIncome {
  /** Unique income identifier */
  id: string;
  
  /** ID of the user who owns this income */
  userId?: string;
  
  /** When the income record was created */
  createdAt?: Date;
  
  /** When the income record was last updated */
  updatedAt?: Date;
}

/**
 * Request payload for creating a new income.
 * 
 * @group Transaction Types
 */
export interface CreateIncomeRequest extends BaseIncome {}

/**
 * Request payload for updating an existing income.
 * All fields are optional for partial updates.
 * 
 * @group Transaction Types
 */
export interface UpdateIncomeRequest extends Partial<BaseIncome> {}