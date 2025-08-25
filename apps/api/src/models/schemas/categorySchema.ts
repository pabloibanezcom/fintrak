import { Schema } from 'mongoose';

export const categorySchemaDefinition = {
  key: { type: String, required: true },
  name: { type: String, required: true },
  color: { type: String, required: true },
  icon: { type: String, required: true },
  keywords: [{ type: String }],
};

export const categorySchema = new Schema(categorySchemaDefinition);
