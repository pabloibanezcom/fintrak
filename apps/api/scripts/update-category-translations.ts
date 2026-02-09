/**
 * Script to update English translations for categories
 *
 * Run with: npx tsx scripts/update-category-translations.ts
 */

import * as dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI environment variable is not set');
  process.exit(1);
}

// Spanish to English translations
const translations: Record<string, { en: string; es: string }> = {
  supermercado: { en: 'Grocery', es: 'Supermercado' },
  transporte: { en: 'Transport', es: 'Transporte' },
  entretenimiento: { en: 'Entertainment', es: 'Entretenimiento' },
  compras: { en: 'Shopping', es: 'Compras' },
  salud: { en: 'Health', es: 'Salud' },
  suministros: { en: 'Utilities', es: 'Suministros' },
  hipoteca: { en: 'Mortgage', es: 'Hipoteca' },
  seguros: { en: 'Insurance', es: 'Seguros' },
  nomina: { en: 'Payroll', es: 'Nomina' },
  impuestos: { en: 'Tax', es: 'Impuestos' },
  otros: { en: 'Other', es: 'Otros' },
};

async function updateTranslations() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not established');
    }

    const categoriesCollection = db.collection('categories');

    let updatedCount = 0;

    for (const [key, names] of Object.entries(translations)) {
      const result = await categoriesCollection.updateOne(
        { key },
        { $set: { name: names } }
      );

      if (result.modifiedCount > 0) {
        console.log(`✓ Updated translations for: ${key} (${names.en} / ${names.es})`);
        updatedCount++;
      } else {
        console.log(`- No update needed for: ${key}`);
      }
    }

    console.log('\n=== Translation Update Complete ===');
    console.log(`Updated: ${updatedCount} categories`);

    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  } catch (error) {
    console.error('Translation update failed:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Run update
updateTranslations();
