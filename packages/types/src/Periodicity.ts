/**
 * Defines the recurring behavior of financial transactions.
 * Used to categorize transactions based on their repetition patterns.
 * 
 * @group Transaction Types
 */
export enum Periodicity {
  /** One-time transaction that does not repeat */
  NOT_RECURRING = 'NOT_RECURRING',
  /** Recurring transaction where the amount varies each time */
  RECURRING_VARIABLE_AMOUNT = 'RECURRING_VARIABLE_AMOUNT',
  /** Recurring transaction with a fixed amount each time */
  RECURRING_FIXED_AMOUNT = 'RECURRING_FIXED_AMOUNT',
}