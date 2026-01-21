import mongoose, { type Document, Schema } from 'mongoose';

export interface IDeviceToken extends Document {
  userId: string;
  token: string;
  platform: 'ios' | 'android';
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DeviceTokenSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    token: { type: String, required: true },
    platform: {
      type: String,
      required: true,
      enum: ['ios', 'android'],
    },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// Index for fast lookup by userId
DeviceTokenSchema.index({ userId: 1 });

// Unique index to prevent duplicate tokens per user
DeviceTokenSchema.index({ userId: 1, token: 1 }, { unique: true });

// Index for querying active tokens
DeviceTokenSchema.index({ userId: 1, active: 1 });

export default mongoose.model<IDeviceToken>('DeviceToken', DeviceTokenSchema);
