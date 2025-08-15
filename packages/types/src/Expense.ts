export type ExpenseCategory = 
  | 'food'
  | 'transport' 
  | 'entertainment'
  | 'utilities'
  | 'shopping'
  | 'healthcare'
  | 'other';

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: Date;
  description?: string;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateExpenseRequest {
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: Date;
  description?: string;
}

export interface UpdateExpenseRequest {
  title?: string;
  amount?: number;
  category?: ExpenseCategory;
  date?: Date;
  description?: string;
}