import type { Counterparty } from '@fintrak/types';
import mongoose, { type Document, Schema } from 'mongoose';
import { counterpartySchemaDefinition } from './schemas/counterpartySchema';

export interface ICounterparty extends Counterparty, Document {
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
    toJSON: {
      transform: (_doc, ret) => {
        const { _id, __v, userId, ...rest } = ret;
        return rest;
      },
    },
  }
);

CounterpartySchema.index({ userId: 1, key: 1 }, { unique: true });
CounterpartySchema.index({ userId: 1, name: 1 });
CounterpartySchema.index({ userId: 1, parentKey: 1 });

export default mongoose.model<ICounterparty>(
  'Counterparty',
  CounterpartySchema
);
