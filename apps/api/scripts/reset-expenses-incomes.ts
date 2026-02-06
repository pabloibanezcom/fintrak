/**
 * Migration script to reset expenses and incomes data.
 *
 * This script:
 * 1. Deletes all existing expenses
 * 2. Deletes all existing incomes
 *
 * Run with: npx ts-node scripts/reset-expenses-incomes.ts
 *
 * WARNING: This is a destructive operation. Make sure to backup your data first.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import models
import Expense from '../src/models/ExpenseModel';
import Income from '../src/models/IncomeModel';

async function migrate() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.error('MONGODB_URI environment variable is required');
    process.exit(1);
  }

  console.log('Connecting to MongoDB...');
  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB');

  try {
    // Confirm before proceeding
    console.log('\n⚠️  WARNING: This will delete ALL expenses and incomes.');
    console.log('This operation cannot be undone.\n');

    // Delete all expenses
    console.log('Deleting expenses...');
    const expenseResult = await Expense.deleteMany({});
    console.log(`✓ Deleted ${expenseResult.deletedCount} expenses`);

    // Delete all incomes
    console.log('Deleting incomes...');
    const incomeResult = await Income.deleteMany({});
    console.log(`✓ Deleted ${incomeResult.deletedCount} incomes`);

    console.log('\n✅ Migration complete!');
    console.log('\nExpenses and incomes have been cleared.');
    console.log('Bank transactions remain unchanged.');
    console.log('You can now create expenses/incomes from bank transactions using the new API.');

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

migrate().catch(console.error);
