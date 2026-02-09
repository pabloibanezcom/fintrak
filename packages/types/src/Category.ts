/**
 * Categories help organize transactions for better financial tracking and analysis.
 *
 * @group Core Types
 */
export interface Category {
  /** Unique business key for the category */
  key: string;

  /** Multilingual display names */
  name: {
    /** English name */
    en: string;
    /** Spanish name */
    es: string;
  };

  /** Hex color code for UI representation (e.g., "#FF5733") */
  color: string;

  /** Icon identifier or emoji for visual representation */
  icon: string;
}