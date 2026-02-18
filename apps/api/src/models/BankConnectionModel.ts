import type { BankConnection, ConnectedAccount } from '@fintrak/types';
import mongoose, { type Document, Schema } from 'mongoose';

export interface IConnectedAccount extends ConnectedAccount {}

export interface IBankConnection extends Omit<BankConnection, 'id'>, Document {
  connectedAccounts: IConnectedAccount[];
  createdAt: Date;
  updatedAt: Date;
}

const ConnectedAccountSchema = new Schema(
  {
    accountId: { type: String, required: true },
    iban: { type: String },
    name: { type: String },
    type: { type: String, required: true },
    currency: { type: String },
  },
  { _id: false }
);

const BankConnectionSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    bankId: { type: String, required: true }, // 'santander', 'bbva', etc.
    bankName: { type: String, required: true }, // Display name
    alias: { type: String }, // Custom user alias
    logo: { type: String }, // S3 URL for bank logo
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    connectedAccounts: { type: [ConnectedAccountSchema], default: [] },
  },
  {
    timestamps: true,
  }
);

// One connection per user per bank
BankConnectionSchema.index({ userId: 1, bankId: 1 }, { unique: true });

export default mongoose.model<IBankConnection>(
  'BankConnection',
  BankConnectionSchema
);
