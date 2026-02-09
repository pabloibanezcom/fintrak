import { Schema } from 'mongoose';

export const categorySchemaDefinition = {
  key: { type: String, required: true },
  name: {
    type: {
      en: { type: String, required: true },
      es: { type: String, required: true },
    },
    required: true,
  },
  color: { type: String, required: true },
  icon: { type: String, required: false },
};

export const categorySchema = new Schema(categorySchemaDefinition);
