import { counterpartySchemaDefinition } from '../../models/schemas/counterpartySchema';
import { Schema } from 'mongoose';

describe('CounterpartyModel Schema', () => {
  describe('schema definition', () => {
    it('should include titleTemplate field in schema definition', () => {
      expect(counterpartySchemaDefinition).toHaveProperty('titleTemplate');
      expect(counterpartySchemaDefinition.titleTemplate).toEqual({
        type: String,
      });
    });

    it('should have all required counterparty fields', () => {
      const expectedFields = [
        'key',
        'name',
        'type',
        'logo',
        'email',
        'phone',
        'address',
        'notes',
        'titleTemplate',
        'defaultCategory',
      ];

      expectedFields.forEach((field) => {
        expect(counterpartySchemaDefinition).toHaveProperty(field);
      });
    });

    it('should have correct field types', () => {
      expect(counterpartySchemaDefinition.key).toEqual({
        type: String,
        required: true,
      });
      expect(counterpartySchemaDefinition.name).toEqual({
        type: String,
        required: true,
      });
      expect(counterpartySchemaDefinition.type).toEqual({
        type: String,
        enum: ['company', 'person', 'institution', 'other'],
        default: 'other',
      });
      expect(counterpartySchemaDefinition.titleTemplate).toEqual({
        type: String,
      });
      expect(counterpartySchemaDefinition.logo).toEqual({ type: String });
      expect(counterpartySchemaDefinition.email).toEqual({ type: String });
      expect(counterpartySchemaDefinition.phone).toEqual({ type: String });
      expect(counterpartySchemaDefinition.address).toEqual({ type: String });
      expect(counterpartySchemaDefinition.notes).toEqual({ type: String });
      expect(counterpartySchemaDefinition.defaultCategory).toEqual({
        type: Schema.Types.ObjectId,
        ref: 'Category',
      });
    });
  });

  describe('titleTemplate field validation', () => {
    it('should validate titleTemplate is optional string', () => {
      const titleTemplateField =
        counterpartySchemaDefinition.titleTemplate as any;
      expect(titleTemplateField.type).toBe(String);
      expect(titleTemplateField.required).toBeUndefined(); // Optional field
    });

    it('should support placeholder patterns', () => {
      const validTemplates = [
        'Compra en {name}',
        'Pago a {name}',
        'Suscripción {name}',
        'Factura {name}',
        'Transacción {name}',
        '{name} - Compra',
        'Gasto {name}',
      ];

      validTemplates.forEach((template) => {
        expect(template).toMatch(/\{name\}/);
        expect(typeof template).toBe('string');
      });
    });
  });
});
