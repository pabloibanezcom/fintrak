/**
 * Generic product or transaction record with basic financial information.
 * 
 * @group Core Types
 */
export interface Product {
  /** Unique identifier for the product */
  id: string;
  
  /** Date associated with the product (ISO string) */
  date: string;
  
  /** Description of the product or transaction */
  description: string;
  
  /** Monetary amount */
  amount: number;
  
  /** Transaction type classification */
  type: "income" | "expense";
}
