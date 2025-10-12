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
      case '1y':
        comparisonDate.setUTCFullYear(comparisonDate.getUTCFullYear() - 1);
        break;
      default:
        return res.status(400).json({
          error: 'Invalid comparison period. Use: 1d, 7d, 1m, or 1y'
        });
    }

    // Get the snapshot for the comparison date
    const previousSnapshot = await getSnapshotByDate(userId!, comparisonDate);

    // If no previous snapshot exists, return current data without comparison
    if (!previousSnapshot) {
      return res.json({
        ...userData,
        comparison: {
          period,
          available: false,
          message: `No snapshot available for ${period} ago`
        }
      });
    }

    // Helper function to calculate comparison metrics
    const calculateComparison = (current: number, previous: number) => {
      const valueDifference = current - previous;
      const percentageDifference = previous === 0
        ? 0
        : Number(((valueDifference / previous) * 100).toFixed(2));
      return { valueDifference, percentageDifference };
    };

    // Helper function to get nested value from object using dot notation
    const getNestedValue = (obj: any, path: string): number => {
      return path.split('.').reduce((acc, part) => acc?.[part], obj) || 0;
    };

    // Helper function to add comparison to individual items
    const addItemComparisons = (
      currentItems: any[],
      previousItems: any[],
      identifierKey: string,
      valueKey: string
    ) => {
      return currentItems.map((currentItem) => {
        const previousItem = previousItems.find(
          (prev: any) => prev[identifierKey] === currentItem[identifierKey]
        );

        const currentValue = getNestedValue(currentItem, valueKey);

        if (previousItem) {
          const previousValue = getNestedValue(previousItem, valueKey);
          const comparison = calculateComparison(currentValue, previousValue);
          return {
            ...currentItem,
            comparison: {
              previousValue,
              ...comparison
            }
          };
        }

        // No previous data for this item (new item)
        return {
          ...currentItem,
          comparison: {
            previousValue: 0,
            valueDifference: currentValue,
            percentageDifference: 0
          }
        };
      });
    };

    // Calculate overall differences
    const previousValue = previousSnapshot.snapshot.totalValue;
    const currentValue = userData.totalValue;
    const totalComparison = calculateComparison(currentValue, previousValue);

    // Add comparisons to each product category and individual items
    const enrichedData = {
      ...userData,
      items: {
        deposits: {
          ...userData.items.deposits,
          items: addItemComparisons(
            userData.items.deposits.items,
            previousSnapshot.snapshot.items.deposits.items,
            'depositId',
            'amount'
          ),
          comparison: calculateComparison(
            userData.items.deposits.value,
            previousSnapshot.snapshot.items.deposits.value
          )
        },
        cashAccounts: {
          ...userData.items.cashAccounts,
          items: addItemComparisons(
            userData.items.cashAccounts.items,
            previousSnapshot.snapshot.items.cashAccounts.items,
            'accountId',
            'balance'
          ),
          comparison: calculateComparison(
            userData.items.cashAccounts.value,
            previousSnapshot.snapshot.items.cashAccounts.value
          )
        },
        indexedFunds: {
          ...userData.items.indexedFunds,
          items: addItemComparisons(
            userData.items.indexedFunds.items,
            previousSnapshot.snapshot.items.indexedFunds.items,
            'isin',
            'marketValue'
          ),
          comparison: calculateComparison(
            userData.items.indexedFunds.value,
            previousSnapshot.snapshot.items.indexedFunds.value
          )
        },
        etcs: {
          ...userData.items.etcs,
          items: addItemComparisons(
            userData.items.etcs.items,
            previousSnapshot.snapshot.items.etcs.items,
            'isin',
            'marketValue'
          ),
          comparison: calculateComparison(
            userData.items.etcs.value,
            previousSnapshot.snapshot.items.etcs.value
          )
        },
        cryptoAssets: {
          ...userData.items.cryptoAssets,
          items: addItemComparisons(
            userData.items.cryptoAssets.items,
            previousSnapshot.snapshot.items.cryptoAssets.items,
            'code',
            'value.EUR'
          ),
          comparison: calculateComparison(
            userData.items.cryptoAssets.value,
            previousSnapshot.snapshot.items.cryptoAssets.value
          )
        }
      }
    };

    res.json({
      ...enrichedData,
      comparison: {
        period,
        available: true,
        previousValue,
        currentValue,
        valueDifference: totalComparison.valueDifference,
        percentageDifference: totalComparison.percentageDifference,
        comparisonDate: previousSnapshot.date
      }
    });
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
