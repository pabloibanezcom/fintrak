import mongoose, { type Document, Schema } from 'mongoose';

export interface IConnectedAccount {
  accountId: string;
  iban?: string;
  name?: string;
  type: string;
  currency?: string;
}

export interface IBankConnection extends Document {
  userId: string;
  bankId: string; // e.g., 'santander', 'bbva'
  bankName: string; // e.g., 'Santander', 'BBVA'
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
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
