import mongoose, { type Document, Schema } from 'mongoose';
import { categorySchemaDefinition } from './schemas/categorySchema';

export interface ICategory extends Document {
  id: string;
  name: string;
  color: string;
  icon: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema = new Schema(
  {
    ...categorySchemaDefinition,
    userId: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

CategorySchema.index({ userId: 1, id: 1 }, { unique: true });

export default mongoose.model<ICategory>('Category', CategorySchema);
