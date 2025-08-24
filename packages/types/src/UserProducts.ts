import type { CashAccount } from "./CashAccount";
import type { Deposit } from "./Deposit";
import type { ETC } from "./ETC";
import type { IndexedFund } from "./IndexedFund";

/**
 * Collection of all financial products owned by a user.
 * Provides a centralized view of the user's complete financial portfolio.
 * 
 * @group Financial Types
 */
export interface UserProducts {
  /** Bank cash accounts with current balances */
  cashAccounts: CashAccount[];
  
  /** Term deposits and savings accounts */
  deposits: Deposit[];
  
  /** Index fund investments */
  indexedFunds: IndexedFund[];
  
  /** Exchange Traded Commodities */
  etcs: ETC[];
}
