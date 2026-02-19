import { Schema } from 'mongoose';

export const counterpartySchemaDefinition = {
  key: { type: String, required: true },
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ['company', 'person', 'institution', 'other'],
    default: 'other',
  },
  logo: { type: String },
  email: { type: String },
  phone: { type: String },
  address: { type: String },
  notes: { type: String },
  titleTemplate: { type: String },
  parentKey: { type: String },
  defaultCategory: { type: Schema.Types.ObjectId, ref: 'Category' },
};

export const counterpartySchema = new Schema(counterpartySchemaDefinition);
