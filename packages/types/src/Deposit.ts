export interface Deposit {
  accountId: string;
  iban: string;
  alias: string;
  creationDate: string;
  expirationDate: string;
  amount: number;
  grossInterest: number;
  netInterest: number;
  retention: number;
  currency: string;
  tae: number;
  numMonths: number;
}