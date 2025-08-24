import { Schema } from 'mongoose';

export const tagSchemaDefinition = {
  id: { type: String, required: true },
  name: { type: String, required: true },
  color: { type: String, required: true },
  icon: { type: String, required: true },
};

export const tagSchema = new Schema(tagSchemaDefinition);