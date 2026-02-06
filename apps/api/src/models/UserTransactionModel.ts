import type { BaseUserTransaction } from '@fintrak/types';
import mongoose, { type Document, Schema } from 'mongoose';
import { tagSchemaDefinition } from './schemas/tagSchema';

export interface IUserTransaction extends BaseUserTransaction, Document {
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserTransactionSchema: Schema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['expense', 'income'],
    },
    title: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, enum: ['EUR', 'GBP', 'USD'] },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    counterparty: {
      type: Schema.Types.ObjectId,
      ref: 'Counterparty',
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
      default: 'NOT_RECURRING',
    },
    description: { type: String },
    tags: [
      {
        type: tagSchemaDefinition,
      },
    ],
    recurringTransaction: {
      type: Schema.Types.ObjectId,
      ref: 'RecurringTransaction',
    },
    bankTransactionId: {
      type: Schema.Types.ObjectId,
      ref: 'BankTransaction',
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

// Index for querying user transactions by date
UserTransactionSchema.index({ userId: 1, date: -1 });

// Index for querying by type
UserTransactionSchema.index({ userId: 1, type: 1, date: -1 });

// Ensure each bank transaction can only be linked to one user transaction
UserTransactionSchema.index(
  { bankTransactionId: 1 },
  { unique: true, sparse: true }
);

export default mongoose.model<IUserTransaction>(
  'UserTransaction',
  UserTransactionSchema
);
