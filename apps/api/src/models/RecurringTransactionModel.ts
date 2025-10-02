import type { BaseRecurringTransaction } from '@fintrak/types';
import mongoose, { type Document, Schema } from 'mongoose';

export interface IRecurringTransaction
  extends BaseRecurringTransaction,
    Document {
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const RecurringTransactionSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    currency: { type: String, required: true, enum: ['EUR', 'GBP', 'USD'] },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    transactionType: {
      type: String,
      required: true,
      enum: ['EXPENSE', 'INCOME'],
    },
    minAproxAmount: { type: Number, min: 0 },
    maxAproxAmount: { type: Number, min: 0 },
    periodicity: {
      type: String,
      required: true,
      enum: ['MONTHLY', 'QUARTERLY', 'YEARLY'],
    },
    userId: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        const { _id, __v, userId, ...rest } = ret;
        return { id: _id, ...rest };
      },
    },
  }
);

RecurringTransactionSchema.index({ userId: 1, transactionType: 1 });

export default mongoose.model<IRecurringTransaction>(
  'RecurringTransaction',
  RecurringTransactionSchema
);
