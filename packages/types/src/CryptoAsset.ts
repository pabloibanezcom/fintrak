/**
 * Represents a cryptocurrency asset holding.
 *
 * @group Financial Types
 */
export interface CryptoAsset {
  /** Unique identifier for the crypto asset */
  _id?: string;

  /** User ID who owns this asset */
  userId: string;

  /** Name of the cryptocurrency (e.g., Bitcoin, Ethereum) */
  name: string;

  /** Cryptocurrency code/symbol (e.g., BTC, ETH) */
  code: string;

  /** Amount of cryptocurrency held */
  amount: number;

  /** Current values in different currencies (calculated in real-time, not stored) */
  value?: {
    [currency: string]: number;
  };
}
