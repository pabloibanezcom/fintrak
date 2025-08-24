/**
 * Represents a person, company, or organization involved in financial transactions.
 * Used to track who money was paid to (payee) or received from (source).
 * 
 * @group Core Types
 */
export interface Counterparty {
  /** Unique identifier for the counterparty */
  id: string;
  
  /** Display name of the counterparty */
  name: string;
  
  /** Type of counterparty entity */
  type?: 'person' | 'company' | 'government' | 'other';
  
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
}