/**
 * Categories help organize transactions for better financial tracking and analysis.
 * 
 * @group Core Types
 */
export interface Category {
  /** Unique identifier for the category */
  id: string;
  
  /** Display name of the category */
  name: string;
  
  /** Hex color code for UI representation (e.g., "#FF5733") */
  color: string;
  
  /** Icon identifier or emoji for visual representation */
  icon: string;
}