import type {
  Category,
  Counterparty,
  Currency,
  Periodicity,
  Tag,
} from '@fintrak/types';
import mongoose, { type Document, Schema } from 'mongoose';
import { categorySchemaDefinition } from './schemas/categorySchema';
import { counterpartySchemaDefinition } from './schemas/counterpartySchema';
import { tagSchemaDefinition } from './schemas/tagSchema';

export interface IExpense extends Document {
  title: string;
  amount: number;
  currency: Currency;
  category: Category;
  payee?: Counterparty;
  date: Date;
  periodicity: Periodicity;
  description?: string;
  tags?: Tag[];
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, enum: ['EUR', 'GBP', 'USD'] },
    category: {
      type: categorySchemaDefinition,
      required: true,
    },
    payee: {
      type: counterpartySchemaDefinition,
    },
    date: { type: Date, required: true },
    periodicity: {
      type: String,
      required: true,
      enum: [
        'NOT_RECURRING',
        'RECURRING_VARIABLE_AMOUNT',
        'RECURRING_FIXED_AMOUNT',
      ],
    },
    description: { type: String },
    tags: [
      {
        type: tagSchemaDefinition,
      },
    ],
    userId: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

ExpenseSchema.index({ userId: 1, date: -1 });

export default mongoose.model<IExpense>('Expense', ExpenseSchema);
