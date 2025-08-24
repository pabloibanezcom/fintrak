/**
 * Represents an individual investment holding with price tracking.
 * 
 * @group Financial Types
 */
export interface Investment {
  /** Unique identifier for the investment */
  id: string;
  
  /** Stock or fund symbol (e.g., "AAPL", "VWRL") */
  symbol: string;
  
  /** Full name of the investment */
  name: string;
  
  /** Number of shares or units owned */
  quantity: number;
  
  /** Price per unit when purchased */
  purchasePrice: number;
  
  /** Current market price per unit */
  currentPrice: number;
  
  /** When the price was last updated */
  lastUpdated: Date;
}

/**
 * Collection of investments with calculated totals and performance metrics.
 * 
 * @group Financial Types
 */
export interface Portfolio {
  /** List of all investment holdings */
  investments: Investment[];
  
  /** Total current value of all investments */
  totalValue: number;
  
  /** Total gain or loss amount */
  totalGainLoss: number;
  
  /** Total gain or loss as a percentage */
  totalGainLossPercentage: number;
}