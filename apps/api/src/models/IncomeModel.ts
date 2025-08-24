import type { Category, Counterparty, Tag } from '@fintrak/types';
import mongoose, { type Document, Schema } from 'mongoose';
import { categorySchemaDefinition } from './schemas/categorySchema';
import { counterpartySchemaDefinition } from './schemas/counterpartySchema';
import { tagSchemaDefinition } from './schemas/tagSchema';

export interface IIncome extends Document {
  title: string;
  amount: number;
  category: Category;
  source?: Counterparty;
  date: Date;
  description?: string;
  tags?: Tag[];
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const IncomeSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    category: {
      type: categorySchemaDefinition,
      required: true,
    },
    source: {
      type: counterpartySchemaDefinition,
    },
    date: { type: Date, required: true },
    description: { type: String },
    tags: [{
      type: tagSchemaDefinition,
    }],
    userId: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

IncomeSchema.index({ userId: 1, date: -1 });

export default mongoose.model<IIncome>('Income', IncomeSchema);