import type { Category } from './Category';
import type { Tag } from './Tag';

export interface BaseTransaction {
  title: string;
  amount: number;
  category: Category;
  date: Date;
  description?: string;
  tags?: Tag[];
}