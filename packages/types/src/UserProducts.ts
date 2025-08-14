import type { CashAccount } from "./CashAccount";
import type { Deposit } from "./Deposit";
import type { IndexedFund } from "./IndexedFund";

export interface UserProducts {
  cashAccounts: CashAccount[];
  deposits: Deposit[];
  indexedFunds: IndexedFund[];
}
