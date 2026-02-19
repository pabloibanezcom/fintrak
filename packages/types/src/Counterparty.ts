import type { Category } from './Category';

/**
 * Represents a person, company, or organization involved in financial transactions.
 * Used to track who money was paid to (payee) or received from (source).
 * 
 * @group Core Types
 */
export interface Counterparty {
  /** Unique business key for the counterparty */
  key: string;
  
  /** Display name of the counterparty */
  name: string;
  
  /** Type of counterparty entity */
  type?: 'company' | 'person' | 'institution' | 'other';
  
  /** URL to logo or avatar image */
  logo?: string;
  
  /** Contact email address */
  email?: string;
  
  /** Contact phone number */
  phone?: string;
  
  /** Physical or mailing address */
  address?: string;
  
  /** Additional notes or information */
  notes?: string;
  
  /** Template for transaction titles (e.g., "Compra en {name}", "Pago a {name}") */
  titleTemplate?: string;

  /** Key of the parent counterparty (for child/location counterparties) */
  parentKey?: string;

  /** Default category reference for transactions with this counterparty */
  defaultCategory?: Category;
}
