import type { Request, Response } from 'express';
import { fetchUserProducts } from '../services/MI';
import {
  saveDailySnapshot,
  getSnapshots,
  getLatestSnapshot,
  getSnapshotByDate,
} from '../services/ProductSnapshot';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const userData = await fetchUserProducts(userId);
    res.json(userData);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
};

export const createSnapshot = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
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
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ error: 'startDate and endDate are required' });
    }

    const snapshots = await getSnapshots(
      userId,
      new Date(startDate as string),
      new Date(endDate as string),
    );
    res.json(snapshots);
  } catch (error) {
    console.error('Error fetching snapshots:', error);
    res.status(500).json({ error: 'Failed to fetch snapshots' });
  }
};

export const getRecentSnapshot = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
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
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
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
