import mongoose, { type Document, Schema } from 'mongoose';

export interface IBankTransaction extends Document {
  userId: string;
  accountId: string;
  bankId: string;
  transactionId: string;
  timestamp: Date;
  amount: number;
  currency: string;
  type: 'CREDIT' | 'DEBIT';
  description: string;
  merchantName?: string;
  trueLayerCategory?: string;
  status: 'pending' | 'settled';
  processed: boolean;
  notified: boolean;
  raw: object;
  createdAt: Date;
  updatedAt: Date;
}

const BankTransactionSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    accountId: { type: String, required: true },
    bankId: { type: String, required: true },
    transactionId: { type: String, required: true },
    timestamp: { type: Date, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ['CREDIT', 'DEBIT'],
    },
    description: { type: String, required: true },
    merchantName: { type: String },
    trueLayerCategory: { type: String },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'settled'],
      default: 'settled',
    },
    processed: { type: Boolean, default: false },
    notified: { type: Boolean, default: false },
    raw: { type: Schema.Types.Mixed },
  },
  {
    timestamps: true,
  }
);

// Unique index to prevent duplicate transactions
BankTransactionSchema.index({ userId: 1, transactionId: 1 }, { unique: true });

// Index for querying unprocessed/unnotified transactions
BankTransactionSchema.index({ userId: 1, processed: 1 });
BankTransactionSchema.index({ userId: 1, notified: 1 });

// Index for querying by account
BankTransactionSchema.index({ userId: 1, accountId: 1, timestamp: -1 });

export default mongoose.model<IBankTransaction>(
  'BankTransaction',
  BankTransactionSchema
);
