import type { BankAccount } from './BankAccount';
import type { CryptoAsset } from './CryptoAsset';
import type { Deposit } from './Deposit';
import type { InvestmentSummary } from './InvestmentSummary';

/**
 * Generic product group with items and total value.
 *
 * @group Financial Types
 */
export interface ProductGroup<T> {
  /** Array of products in this group */
  items: T[];

  /** Total value of all products in this group */
  value: number;

  /** Percentage of total portfolio value */
  percentage: number;
}

/**
 * All product groups organized by type.
 *
 * @group Financial Types
 */
export interface ProductItems {
  /** Bank accounts from all sources (MyInvestor, TrueLayer) */
  bankAccounts: ProductGroup<BankAccount>;

  /** Term deposits and savings accounts */
  deposits: ProductGroup<Deposit>;

  /** Index fund investments */
  indexedFunds: ProductGroup<InvestmentSummary>;

  /** Exchange Traded Commodities */
  etcs: ProductGroup<InvestmentSummary>;

  /** Cryptocurrency assets */
  cryptoAssets: ProductGroup<CryptoAsset>;
}

/**
 * Collection of all financial products owned by a user.
 * Provides a centralized view of the user's complete financial portfolio.
 *
 * @group Financial Types
 */
export interface UserProducts {
  /** Total value of all products combined */
  totalValue: number;

  /** All product groups organized by type */
  items: ProductItems;
}
