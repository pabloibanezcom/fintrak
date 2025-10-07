import type { CashAccount } from "./CashAccount";
import type { CryptoAsset } from "./CryptoAsset";
import type { Deposit } from "./Deposit";
import type { InvestmentSummary } from "./InvestmentSummary";

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
}

/**
 * All product groups organized by type.
 *
 * @group Financial Types
 */
export interface ProductItems {
  /** Bank cash accounts with current balances */
  cashAccounts: ProductGroup<CashAccount>;

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
