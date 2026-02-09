/**
 * Migration script to:
 * 1. Remove 'keywords' field from all categories
 * 2. Convert 'name' from string to { en, es } object
 *
 * Run with: npx tsx scripts/migrate-categories.ts
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

async function migrateCategories() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not established');
    }

    const categoriesCollection = db.collection('categories');

    // Get all categories
    const categories = await categoriesCollection.find({}).toArray();
    console.log(`Found ${categories.length} categories to migrate`);

    let migratedCount = 0;
    let skippedCount = 0;

    for (const category of categories) {
      const updates: any = {};
      let needsUpdate = false;

      // Remove keywords field if it exists
      if ('keywords' in category) {
        updates.$unset = { keywords: '' };
        needsUpdate = true;
      }

      // Convert name from string to object if needed
      if (typeof category.name === 'string') {
        // Use the existing name as the Spanish version (since current categories are in Spanish)
        // and create an English translation (you may want to update these manually later)
        updates.$set = {
          name: {
            es: category.name,
            en: category.name, // Default to same value, update manually if needed
          },
        };
        needsUpdate = true;
      }

      if (needsUpdate) {
        await categoriesCollection.updateOne({ _id: category._id }, updates);
        console.log(`✓ Migrated category: ${category.key}`);
        migratedCount++;
      } else {
        console.log(`- Skipped category (already migrated): ${category.key}`);
        skippedCount++;
      }
    }

    console.log('\n=== Migration Complete ===');
    console.log(`Migrated: ${migratedCount} categories`);
    console.log(`Skipped: ${skippedCount} categories`);
    console.log('\nNote: English names are set to match Spanish names.');
    console.log('You may want to update them manually for proper translations.');

    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  } catch (error) {
    console.error('Migration failed:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Run migration
migrateCategories();
