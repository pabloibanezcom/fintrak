/**
 * Represents an indexed fund investment that tracks a market index.
 * Provides passive investment exposure to broad market segments.
 * 
 * @group Financial Types
 */
export interface IndexedFund {
  /** Unique account identifier */
  accountId: string;

  /** Fund name */
  investmentName: string;
  
  /** Bank-specific product type code */
  productTypeCode: string;
  
  /** Market where the fund is traded */
  marketCode: string;
  
  /** International Securities Identification Number */
  isin: string;
  
  /** Initial amount invested */
  initialInvestment: number;
  
  /** Currency of the initial investment (numeric code) */
  initialInvestmentCurrency: number;
  
  /** Current market value of the investment */
  marketValue: number;
  
  /** Current profit or loss */
  profit: number;
  
  /** Total return including dividends */
  totalReturn: number;
  
  /** Number of fund shares owned */
  shares: number;
  
  /** Number of shares available for trading */
  availableShares: number;
  
  /** Average cost per share */
  averageCost: number;
  
  /** Current liquidation value */
  liquidationValue: number;
  
  /** Date of liquidation value calculation */
  liquidationValueDate: string;
  
  /** Liquidation value in original currency */
  originCurrencyLiquidationValue: number;
  
  /** Currency of liquidation value */
  liquidationValueCurrency: string;
  
  /** Year-to-date fund return percentage */
  ytdFundReturn: number;
  
  /** First year fund return percentage */
  firstYearFundReturn: number;
  
  /** Third year fund return percentage */
  thirdYearFundReturn: number;
  
  /** Fifth year fund return percentage */
  fifthYearFundReturn: number;
  
  /** URL to fund information page */
  infoFundUrl: string;
}