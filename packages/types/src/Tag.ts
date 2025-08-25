/**
 * Tags provide additional labeling and filtering capabilities for transactions.
 * Unlike categories, transactions can have multiple tags.
 * 
 * @group Core Types
 */
export interface Tag {
  /** Unique business key for the tag */
  key: string;
  
  /** Display name of the tag */
  name: string;
  
  /** Hex color code for UI representation */
  color: string;
  
  /** Icon identifier or emoji for visual representation */
  icon: string;
}