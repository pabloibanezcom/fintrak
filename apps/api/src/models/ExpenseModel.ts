import type { ExpenseCategory } from '@fintrak/types';
import mongoose, { type Document, Schema } from 'mongoose';

export interface IExpense extends Document {
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: Date;
  description?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      required: true,
      enum: [
        'food',
        'transport',
        'entertainment',
        'utilities',
        'shopping',
        'healthcare',
        'other',
      ],
    },
    date: { type: Date, required: true },
    description: { type: String },
    userId: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

ExpenseSchema.index({ userId: 1, date: -1 });

export default mongoose.model<IExpense>('Expense', ExpenseSchema);
