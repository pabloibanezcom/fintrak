import { CashAccount } from './CashAccount';
import { Deposit } from './Deposit';
import { IndexedFund } from './IndexedFund';

export interface UserProducts {
  cashAccounts: CashAccount[];
  deposits: Deposit[];
  indexedFunds: IndexedFund[];
}