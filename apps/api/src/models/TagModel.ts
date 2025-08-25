import mongoose, { type Document, Schema } from 'mongoose';
import { tagSchemaDefinition } from './schemas/tagSchema';

export interface ITag extends Document {
  key: string;
  name: string;
  color: string;
  icon: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const TagSchema: Schema = new Schema(
  {
    ...tagSchemaDefinition,
    userId: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

TagSchema.index({ userId: 1, key: 1 }, { unique: true });

export default mongoose.model<ITag>('Tag', TagSchema);
