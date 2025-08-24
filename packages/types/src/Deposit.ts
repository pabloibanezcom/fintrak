/**
 * Represents a term deposit account with interest calculations and maturity information.
 * 
 * @group Financial Types
 */
export interface Deposit {
  /** Unique account identifier */
  accountId: string;
  
  /** International Bank Account Number */
  iban: string;
  
  /** User-friendly name for the deposit */
  alias: string;
  
  /** When the deposit was created (ISO string) */
  creationDate: string;
  
  /** When the deposit matures (ISO string) */
  expirationDate: string;
  
  /** Principal amount deposited */
  amount: number;
  
  /** Gross interest earned before taxes */
  grossInterest: number;
  
  /** Net interest earned after taxes */
  netInterest: number;
  
  /** Tax retention amount */
  retention: number;
  
  /** Deposit currency */
  currency: string;
  
  /** Annual Equivalent Rate (TAE) */
  tae: number;
  
  /** Duration of the deposit in months */
  numMonths: number;
}