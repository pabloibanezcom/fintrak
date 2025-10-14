import type { UserProducts } from '@fintrak/types';
import { ProductSnapshot } from '../models/ProductSnapshotModel';
import { fetchUserProducts } from './MI';

/**
 * Get the start of day (midnight UTC) for a given date
 */
const getStartOfDay = (date: Date = new Date()): Date => {
  const startOfDay = new Date(date);
  startOfDay.setUTCHours(0, 0, 0, 0);
  return startOfDay;
};

/**
 * Save a daily snapshot of user products
 * If a snapshot already exists for today, it will be updated
 */
export const saveDailySnapshot = async (
  userId: string
): Promise<UserProducts> => {
  const userProducts = await fetchUserProducts(userId);
  const today = getStartOfDay();

  await ProductSnapshot.findOneAndUpdate(
    { userId, date: today },
    {
      userId,
      date: today,
      snapshot: userProducts,
      createdAt: new Date(),
    },
    { upsert: true, new: true }
  );

  return userProducts;
};

/**
 * Get snapshots for a user within a date range
 */
export const getSnapshots = async (
  userId: string,
  startDate: Date,
  endDate: Date
) => {
  return ProductSnapshot.find({
    userId,
    date: {
      $gte: getStartOfDay(startDate),
      $lte: getStartOfDay(endDate),
    },
  }).sort({ date: -1 });
};

/**
 * Get the most recent snapshot for a user
 */
export const getLatestSnapshot = async (userId: string) => {
  return ProductSnapshot.findOne({ userId }).sort({ date: -1 });
};

/**
 * Get snapshot for a specific date
 */
export const getSnapshotByDate = async (userId: string, date: Date) => {
  return ProductSnapshot.findOne({
    userId,
    date: getStartOfDay(date),
  });
};

/**
 * Get snapshot for a specific date or the closest older snapshot
 * Falls back to the oldest available snapshot if the exact date doesn't exist
 */
export const getSnapshotByDateOrOldest = async (
  userId: string,
  targetDate: Date
) => {
  const normalizedDate = getStartOfDay(targetDate);

  // Try to get exact date first
  let snapshot = await ProductSnapshot.findOne({
    userId,
    date: normalizedDate,
  });

  // If not found, get the closest snapshot before or equal to target date
  if (!snapshot) {
    snapshot = await ProductSnapshot.findOne({
      userId,
      date: { $lte: normalizedDate },
    }).sort({ date: -1 });
  }

  // If still not found (target date is before all snapshots), get the oldest snapshot
  if (!snapshot) {
    snapshot = await ProductSnapshot.findOne({ userId }).sort({ date: 1 });
  }

  return snapshot;
};
