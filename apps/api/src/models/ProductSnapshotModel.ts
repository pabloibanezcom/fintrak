import type { ProductSnapshot as ProductSnapshotData } from '@fintrak/types';
import mongoose, { Schema } from 'mongoose';

export interface IProductSnapshot
  extends Omit<ProductSnapshotData, 'id' | 'userId'> {
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const ProductSnapshotSchema = new Schema<IProductSnapshot>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  snapshot: {
    type: Schema.Types.Mixed,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for efficient queries
ProductSnapshotSchema.index({ userId: 1, date: -1 });

// Ensure one snapshot per user per day
ProductSnapshotSchema.index({ userId: 1, date: 1 }, { unique: true });

export const ProductSnapshot = mongoose.model<IProductSnapshot>(
  'ProductSnapshot',
  ProductSnapshotSchema
);
