import type { BankTransaction } from '@fintrak/types';
import mongoose, { type Document, Schema } from 'mongoose';

export interface IBankTransaction
  extends Omit<BankTransaction, 'id' | 'createdAt' | 'updatedAt'>,
    Document {
  createdAt: Date;
  updatedAt: Date;
}

const TransactionAmountSchema = new Schema(
  {
    amount: { type: String, required: true },
    currency: { type: String, required: true },
  },
  { _id: false }
);

const BalanceAfterTransactionSchema = new Schema(
  {
    balanceAmount: {
      amount: { type: String, required: true },
      currency: { type: String, required: true },
    },
    balanceType: { type: String, required: true },
    referenceDate: { type: String, required: true },
  },
  { _id: false }
);

const BankTransactionSchema: Schema = new Schema(
  {
    transactionId: { type: String, required: true, unique: true },
    bookingDate: { type: String, required: true },
    valueDate: { type: String },
    transactionAmount: { type: TransactionAmountSchema, required: true },
    creditorName: { type: String },
    debtorName: { type: String },
    remittanceInformationUnstructured: { type: String },
    bankTransactionCode: { type: String },
    proprietaryBankTransactionCode: { type: String },
    internalTransactionId: { type: String },
    entryReference: { type: String },
    mandateId: { type: String },
    checkId: { type: String },
    creditorId: { type: String },
    bookingDateTime: { type: String },
    valueDateTime: { type: String },
    additionalInformation: { type: String },
    additionalInformationStructured: { type: String },
    balanceAfterTransaction: { type: BalanceAfterTransactionSchema },
    accountId: { type: String, required: true },
    userId: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

BankTransactionSchema.index({ userId: 1, bookingDate: -1 });
BankTransactionSchema.index({ transactionId: 1 }, { unique: true });
BankTransactionSchema.index({ accountId: 1, bookingDate: -1 });

export default mongoose.model<IBankTransaction>(
  'BankTransaction',
  BankTransactionSchema
);
