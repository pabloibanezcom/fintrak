import type { StoredBankAccount } from '@fintrak/types';
import mongoose, { type Document, Schema } from 'mongoose';

export interface IBankAccount extends Omit<StoredBankAccount, 'id'>, Document {
  createdAt: Date;
  updatedAt: Date;
}

const BankAccountSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    accountId: { type: String, required: true },
    bankId: { type: String, required: true },
    bankName: { type: String, required: true },
    name: { type: String, required: true },
    alias: { type: String },
    iban: { type: String },
    type: { type: String, required: true },
    currency: { type: String, required: true, default: 'EUR' },
  },
  {
    timestamps: true,
  }
);

// Unique index per user per account
BankAccountSchema.index({ userId: 1, accountId: 1 }, { unique: true });

// Index for querying by bank
BankAccountSchema.index({ userId: 1, bankId: 1 });

export default mongoose.model<IBankAccount>('BankAccount', BankAccountSchema);
