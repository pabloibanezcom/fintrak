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
};

export const counterpartySchema = new Schema(counterpartySchemaDefinition);
