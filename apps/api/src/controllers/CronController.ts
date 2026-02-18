import type { Request, Response } from 'express';
import { ProductSnapshot } from '../models/ProductSnapshotModel';
import User from '../models/UserModel';
import { saveDailySnapshot } from '../services/ProductSnapshot';
import TransactionSyncService from '../services/TransactionSyncService';
import { logError } from '../utils/logging';

/**
 * Cron job to create daily snapshots for all users
 * This endpoint should be called by AWS EventBridge or similar scheduler
 */
export const createDailySnapshotsForAllUsers = async (
  req: Request,
  res: Response
) => {
  try {
    // Verify the request is from authorized source (API key)
    const apiKey = req.headers['x-api-key'];
    if (apiKey !== process.env.CRON_API_KEY) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const users = await User.find({}, '_id');
    const results = {
      total: users.length,
      successful: 0,
      failed: 0,
      errors: [] as { userId: string; error: string }[],
    };

    for (const user of users) {
      try {
        const userId = String(user._id);
        await saveDailySnapshot(userId);
        results.successful++;
      } catch (error) {
        const userId = String(user._id);
        results.failed++;
        results.errors.push({
          userId,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
        logError(`Failed to create snapshot for user ${userId}:`, error);
      }
    }

    res.json({
      message: 'Daily snapshots creation completed',
      results,
    });
  } catch (error) {
    logError('Error in daily snapshot cron job:', error);
    res.status(500).json({ error: 'Failed to create daily snapshots' });
  }
};

/**
 * Cron job to sync bank transactions for all users
 * This endpoint should be called by AWS EventBridge every hour at :05
 */
export const syncTransactions = async (req: Request, res: Response) => {
  try {
    // Verify the request is from authorized source (API key)
    const apiKey = req.headers['x-api-key'];
    if (apiKey !== process.env.CRON_API_KEY) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const results = await TransactionSyncService.syncAllUsers();

    res.json({
      message: 'Transaction sync completed',
      results,
    });
  } catch (error) {
    logError('Error in transaction sync cron job:', error);
    res.status(500).json({ error: 'Failed to sync transactions' });
  }
};
