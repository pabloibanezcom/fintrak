import { Schema } from 'mongoose';

export const counterpartySchemaDefinition = {
  id: { type: String, required: true },
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ['person', 'company', 'government', 'other'],
  },
  logo: { type: String },
  email: { type: String },
  phone: { type: String },
  address: { type: String },
  notes: { type: String },
};

export const counterpartySchema = new Schema(counterpartySchemaDefinition);
