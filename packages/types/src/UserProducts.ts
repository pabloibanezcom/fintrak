import type { CashAccount } from "./CashAccount";
import type { Deposit } from "./Deposit";
import type { ETC } from "./ETC";
import type { IndexedFund } from "./IndexedFund";

export interface UserProducts {
  cashAccounts: CashAccount[];
  deposits: Deposit[];
  indexedFunds: IndexedFund[];
  etcs: ETC[];
}
