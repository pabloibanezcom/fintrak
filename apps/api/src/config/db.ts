import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || '');
    console.log('MongoDB connected');

    // Clean up old indexes that use 'id' instead of 'key'
    await cleanupOldIndexes();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const cleanupOldIndexes = async () => {
  try {
    const db = mongoose.connection.db;

    // Drop old counterparties index if it exists
    try {
      await db?.collection('counterparties').dropIndex('userId_1_id_1');
      console.log('Dropped old counterparties index userId_1_id_1');
    } catch (_err) {
      // Index might not exist, ignore error
    }

    // Drop old tags index if it exists
    try {
      await db?.collection('tags').dropIndex('userId_1_id_1');
      console.log('Dropped old tags index userId_1_id_1');
    } catch (_err) {
      // Index might not exist, ignore error
    }
  } catch (err) {
    console.error('Error cleaning up old indexes:', err);
  }
};

export default connectDB;
