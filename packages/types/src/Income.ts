import type { BaseTransaction } from './BaseTransaction';
import type { Counterparty } from './Counterparty';

export interface BaseIncome extends BaseTransaction {
  source?: Counterparty;
}

export interface Income extends BaseIncome {
  id: string;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateIncomeRequest extends BaseIncome {}

export interface UpdateIncomeRequest extends Partial<BaseIncome> {}