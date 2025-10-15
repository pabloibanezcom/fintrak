import type { Request, Response } from 'express';
import { fetchUserProducts } from '../services/MI';
import { ProductComparisonService } from '../services/ProductComparisonService';
import {
  getLatestSnapshot,
  getSnapshotByDate,
  getSnapshotByDateOrOldest,
  getSnapshots,
  saveDailySnapshot,
} from '../services/ProductSnapshot';
import { requireAuth } from '../utils/authUtils';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const userId = requireAuth(req, res);
    if (!userId) return;

    const { compare } = req.query;

    const userData = await fetchUserProducts(userId);

    // If no comparison requested, return just the current data
    if (!compare) {
      return res.json(userData);
    }

    // Calculate comparison date based on period
    const period = compare as string;
    const now = new Date();
    now.setUTCHours(0, 0, 0, 0); // Normalize to midnight UTC
    const comparisonDate = new Date(now);

    switch (period) {
      case '1d':
        comparisonDate.setUTCDate(comparisonDate.getUTCDate() - 1);
        break;
      case '7d':
        comparisonDate.setUTCDate(comparisonDate.getUTCDate() - 7);
        break;
      case '1m':
        comparisonDate.setUTCMonth(comparisonDate.getUTCMonth() - 1);
        break;
      case '3m':
        comparisonDate.setUTCMonth(comparisonDate.getUTCMonth() - 3);
        break;
      case '1y':
        comparisonDate.setUTCFullYear(comparisonDate.getUTCFullYear() - 1);
        break;
      default:
        return res.status(400).json({
          error: 'Invalid comparison period. Use: 1d, 7d, 1m, 3m, or 1y',
        });
    }

    // Get the snapshot for the comparison date or closest older snapshot
    const previousSnapshot = await getSnapshotByDateOrOldest(
      userId!,
      comparisonDate
    );

    // If no previous snapshot exists at all, return current data without comparison
    if (!previousSnapshot) {
      return res.json({
        ...userData,
        comparison: {
          period,
          available: false,
          message: 'No snapshots available for comparison',
        },
      });
    }

    // Use ProductComparisonService to calculate comparisons
    const result = ProductComparisonService.compareWithSnapshot(
      userData,
      previousSnapshot.snapshot,
      period,
      previousSnapshot.date
    );

    res.json({
      ...result.enrichedData,
      comparison: result.comparison,
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
};

export const createSnapshot = async (req: Request, res: Response) => {
  try {
    const userId = requireAuth(req, res);
    if (!userId) return;

    const snapshot = await saveDailySnapshot(userId);
    res.json({
      message: 'Snapshot saved successfully',
      snapshot,
    });
  } catch (error) {
    console.error('Error creating snapshot:', error);
    res.status(500).json({ error: 'Failed to create snapshot' });
  }
};

export const getSnapshotHistory = async (req: Request, res: Response) => {
  try {
    const userId = requireAuth(req, res);
    if (!userId) return;

    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ error: 'startDate and endDate are required' });
    }

    const snapshots = await getSnapshots(
      userId,
      new Date(startDate as string),
      new Date(endDate as string)
    );
    res.json(snapshots);
  } catch (error) {
    console.error('Error fetching snapshots:', error);
    res.status(500).json({ error: 'Failed to fetch snapshots' });
  }
};

export const getRecentSnapshot = async (req: Request, res: Response) => {
  try {
    const userId = requireAuth(req, res);
    if (!userId) return;

    const snapshot = await getLatestSnapshot(userId);

    if (!snapshot) {
      return res.status(404).json({ error: 'No snapshots found' });
    }

    res.json(snapshot);
  } catch (error) {
    console.error('Error fetching latest snapshot:', error);
    res.status(500).json({ error: 'Failed to fetch latest snapshot' });
  }
};

export const getSnapshotForDate = async (req: Request, res: Response) => {
  try {
    const userId = requireAuth(req, res);
    if (!userId) return;

    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'date parameter is required' });
    }

    const snapshot = await getSnapshotByDate(userId, new Date(date as string));

    if (!snapshot) {
      return res
        .status(404)
        .json({ error: 'No snapshot found for the specified date' });
    }

    res.json(snapshot);
  } catch (error) {
    console.error('Error fetching snapshot by date:', error);
    res.status(500).json({ error: 'Failed to fetch snapshot' });
  }
};
