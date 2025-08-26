import mongoose, { type Document, Schema } from 'mongoose';
import { counterpartySchemaDefinition } from './schemas/counterpartySchema';

export interface ICounterparty extends Document {
  key: string;
  name: string;
  type?: 'company' | 'person' | 'institution' | 'other';
  logo?: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  titleTemplate?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const CounterpartySchema: Schema = new Schema(
  {
    ...counterpartySchemaDefinition,
    userId: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

CounterpartySchema.index({ userId: 1, key: 1 }, { unique: true });
CounterpartySchema.index({ userId: 1, name: 1 });

export default mongoose.model<ICounterparty>(
  'Counterparty',
  CounterpartySchema
);
