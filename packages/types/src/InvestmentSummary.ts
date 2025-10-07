/**
 * Simplified investment summary for API responses.
 * Contains only essential investment information.
 * Used for indexed funds, ETCs, and other investment products.
 *
 * @group Financial Types
 */
export interface InvestmentSummary {
  /** International Securities Identification Number */
  isin: string;

  /** Fund name */
  investmentName: string;

  /** Initial amount invested */
  initialInvestment: number;

  /** Current market value of the investment */
  marketValue: number;

  /** Current profit or loss */
  profit: number;

  /** Total return including dividends */
  totalReturn: number;

  /** Average cost per share */
  averageCost: number;

  /** Current liquidation value */
  liquidationValue: number;
}
