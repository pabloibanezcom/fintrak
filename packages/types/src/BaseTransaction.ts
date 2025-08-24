import type { Category } from './Category';
import type { Currency } from './Currency';
import type { Periodicity } from './Periodicity';
import type { Tag } from './Tag';

export interface BaseTransaction {
  title: string;
  amount: number;
  currency: Currency;
  category: Category;
  date: Date;
  periodicity: Periodicity;
  description?: string;
  tags?: Tag[];
}