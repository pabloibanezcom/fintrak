import type { BaseTransaction } from './BaseTransaction';
import type { Counterparty } from './Counterparty';

export interface BaseExpense extends BaseTransaction {
  payee?: Counterparty;
}

export interface Expense extends BaseExpense {
  id: string;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateExpenseRequest extends BaseExpense {}

export interface UpdateExpenseRequest extends Partial<BaseExpense> {}