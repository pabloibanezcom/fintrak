import type { CryptoAsset } from '@fintrak/types';
import mongoose, { type Document, Schema } from 'mongoose';

export interface ICryptoAsset extends Omit<CryptoAsset, '_id'>, Document {
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const CryptoAssetSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
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

CryptoAssetSchema.index({ userId: 1 });

export default mongoose.model<ICryptoAsset>('CryptoAsset', CryptoAssetSchema);
