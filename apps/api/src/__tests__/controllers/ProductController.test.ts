import type { Request, Response } from 'express';
import {
  createSnapshot,
  getProducts,
  getRecentSnapshot,
  getSnapshotForDate,
  getSnapshotHistory,
} from '../../controllers/ProductController';
import * as MIService from '../../services/MI';
import * as ProductSnapshotService from '../../services/ProductSnapshot';

jest.mock('../../services/MI');
jest.mock('../../services/ProductSnapshot');

const mockFetchUserProducts =
  MIService.fetchUserProducts as jest.MockedFunction<
    typeof MIService.fetchUserProducts
  >;
const mockSaveDailySnapshot =
  ProductSnapshotService.saveDailySnapshot as jest.MockedFunction<
    typeof ProductSnapshotService.saveDailySnapshot
  >;
const mockGetSnapshots =
  ProductSnapshotService.getSnapshots as jest.MockedFunction<
    typeof ProductSnapshotService.getSnapshots
  >;
const mockGetLatestSnapshot =
  ProductSnapshotService.getLatestSnapshot as jest.MockedFunction<
    typeof ProductSnapshotService.getLatestSnapshot
  >;
const mockGetSnapshotByDate =
  ProductSnapshotService.getSnapshotByDate as jest.MockedFunction<
    typeof ProductSnapshotService.getSnapshotByDate
  >;
const mockGetSnapshotByDateOrOldest =
  ProductSnapshotService.getSnapshotByDateOrOldest as jest.MockedFunction<
    typeof ProductSnapshotService.getSnapshotByDateOrOldest
  >;

describe('ProductController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  const mockUserData: any = {
    totalValue: 10000,
    items: {
      deposits: {
        value: 3000,
        percentage: 30,
        items: [
          {
            depositId: 'deposit1',
            amount: 3000,
            name: 'Savings Account',
          },
        ],
      },
      bankAccounts: {
        value: 2000,
        percentage: 20,
        items: [
          {
            accountId: 'account1',
            balance: 2000,
            name: 'Checking Account',
          },
        ],
      },
      funds: {
        value: 4000,
        percentage: 40,
        items: [
          {
            isin: 'ISIN123',
            marketValue: 4000,
            name: 'Global Index Fund',
          },
        ],
      },
      etcs: {
        value: 500,
        percentage: 5,
        items: [
          {
            isin: 'ETC123',
            marketValue: 500,
            name: 'Commodity ETC',
          },
        ],
      },
      cryptoAssets: {
        value: 500,
        percentage: 5,
        items: [
          {
            code: 'BTC',
            value: { EUR: 500 },
            name: 'Bitcoin',
          },
        ],
      },
    },
  };

  const mockSnapshot: any = {
    _id: 'snapshot1',
    userId: 'userId123',
    date: new Date('2024-01-01'),
    snapshot: {
      totalValue: 8000,
      items: {
        deposits: {
          value: 2500,
          percentage: 31.25,
          items: [
            {
              depositId: 'deposit1',
              amount: 2500,
              name: 'Savings Account',
            },
          ],
        },
        bankAccounts: {
          value: 1500,
          percentage: 18.75,
          items: [
            {
              accountId: 'account1',
              balance: 1500,
              name: 'Checking Account',
            },
          ],
        },
        funds: {
          value: 3500,
          percentage: 43.75,
          items: [
            {
              isin: 'ISIN123',
              marketValue: 3500,
              name: 'Global Index Fund',
            },
          ],
        },
        etcs: {
          value: 300,
          percentage: 3.75,
          items: [
            {
              isin: 'ETC123',
              marketValue: 300,
              name: 'Commodity ETC',
            },
          ],
        },
        cryptoAssets: {
          value: 200,
          percentage: 2.5,
          items: [
            {
              code: 'BTC',
              value: { EUR: 200 },
              name: 'Bitcoin',
            },
          ],
        },
      },
    },
  };

  beforeEach(() => {
    statusMock = jest.fn().mockReturnThis();
    jsonMock = jest.fn().mockReturnThis();

    req = {
      user: { id: 'userId123' },
      params: {},
      body: {},
      query: {},
    };
    res = {
      status: statusMock,
      json: jsonMock,
    };

    jest.clearAllMocks();
    console.error = jest.fn();
  });

  describe('getProducts', () => {
    it('should return products without comparison when compare param is not provided', async () => {
      mockFetchUserProducts.mockResolvedValue(mockUserData);

      await getProducts(req as Request, res as Response);

      expect(mockFetchUserProducts).toHaveBeenCalledWith('userId123');
      expect(jsonMock).toHaveBeenCalledWith(mockUserData);
    });

    it('should return 401 if user is not authenticated', async () => {
      req.user = undefined;

      await getProducts(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'User not authenticated',
      });
    });

    it('should return 400 for invalid comparison period', async () => {
      req.query = { compare: 'invalid' };
      mockFetchUserProducts.mockResolvedValue(mockUserData);

      await getProducts(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Invalid comparison period. Use: 1d, 7d, 1m, 3m, or 1y',
      });
    });

    it('should return products with comparison when snapshot is available', async () => {
      req.query = { compare: '1m' };
      mockFetchUserProducts.mockResolvedValue(mockUserData);
      mockGetSnapshotByDateOrOldest.mockResolvedValue(mockSnapshot as any);

      await getProducts(req as Request, res as Response);

      expect(mockFetchUserProducts).toHaveBeenCalledWith('userId123');
      expect(mockGetSnapshotByDateOrOldest).toHaveBeenCalled();
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          totalValue: 10000,
          comparison: expect.objectContaining({
            period: '1m',
            available: true,
            previousValue: 8000,
            currentValue: 10000,
            valueDifference: 2000,
            percentageDifference: 25,
          }),
        })
      );
    });

    it('should return products without comparison data when no snapshot is available', async () => {
      req.query = { compare: '1m' };
      mockFetchUserProducts.mockResolvedValue(mockUserData);
      mockGetSnapshotByDateOrOldest.mockResolvedValue(null);

      await getProducts(req as Request, res as Response);

      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          totalValue: 10000,
          comparison: {
            period: '1m',
            available: false,
            message: 'No snapshots available for comparison',
          },
        })
      );
    });

    it('should handle errors gracefully', async () => {
      mockFetchUserProducts.mockRejectedValue(new Error('Service error'));

      await getProducts(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Failed to fetch user data',
      });
    });
  });

  describe('createSnapshot', () => {
    it('should create snapshot successfully', async () => {
      const newSnapshot = { ...mockSnapshot, _id: 'snapshot2' };
      mockSaveDailySnapshot.mockResolvedValue(newSnapshot as any);

      await createSnapshot(req as Request, res as Response);

      expect(mockSaveDailySnapshot).toHaveBeenCalledWith('userId123');
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Snapshot saved successfully',
        snapshot: newSnapshot,
      });
    });

    it('should return 401 if user is not authenticated', async () => {
      req.user = undefined;

      await createSnapshot(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'User not authenticated',
      });
    });

    it('should handle errors gracefully', async () => {
      mockSaveDailySnapshot.mockRejectedValue(new Error('Database error'));

      await createSnapshot(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Failed to create snapshot',
      });
    });
  });

  describe('getSnapshotHistory', () => {
    it('should return snapshot history for date range', async () => {
      req.query = {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      };
      const mockSnapshots = [
        mockSnapshot,
        { ...mockSnapshot, _id: 'snapshot2' },
      ];
      mockGetSnapshots.mockResolvedValue(mockSnapshots as any);

      await getSnapshotHistory(req as Request, res as Response);

      expect(mockGetSnapshots).toHaveBeenCalledWith(
        'userId123',
        new Date('2024-01-01'),
        new Date('2024-01-31')
      );
      expect(jsonMock).toHaveBeenCalledWith(mockSnapshots);
    });

    it('should return 400 if startDate is missing', async () => {
      req.query = { endDate: '2024-01-31' };

      await getSnapshotHistory(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'startDate and endDate are required',
      });
    });

    it('should return 400 if endDate is missing', async () => {
      req.query = { startDate: '2024-01-01' };

      await getSnapshotHistory(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'startDate and endDate are required',
      });
    });

    it('should handle errors gracefully', async () => {
      req.query = {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      };
      mockGetSnapshots.mockRejectedValue(new Error('Database error'));

      await getSnapshotHistory(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Failed to fetch snapshots',
      });
    });
  });

  describe('getRecentSnapshot', () => {
    it('should return the most recent snapshot', async () => {
      mockGetLatestSnapshot.mockResolvedValue(mockSnapshot as any);

      await getRecentSnapshot(req as Request, res as Response);

      expect(mockGetLatestSnapshot).toHaveBeenCalledWith('userId123');
      expect(jsonMock).toHaveBeenCalledWith(mockSnapshot);
    });

    it('should return 404 if no snapshots exist', async () => {
      mockGetLatestSnapshot.mockResolvedValue(null);

      await getRecentSnapshot(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'No snapshots found' });
    });

    it('should handle errors gracefully', async () => {
      mockGetLatestSnapshot.mockRejectedValue(new Error('Database error'));

      await getRecentSnapshot(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Failed to fetch latest snapshot',
      });
    });
  });

  describe('getSnapshotForDate', () => {
    it('should return snapshot for specific date', async () => {
      req.query = { date: '2024-01-01' };
      mockGetSnapshotByDate.mockResolvedValue(mockSnapshot as any);

      await getSnapshotForDate(req as Request, res as Response);

      expect(mockGetSnapshotByDate).toHaveBeenCalledWith(
        'userId123',
        new Date('2024-01-01')
      );
      expect(jsonMock).toHaveBeenCalledWith(mockSnapshot);
    });

    it('should return 400 if date parameter is missing', async () => {
      req.query = {};

      await getSnapshotForDate(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'date parameter is required',
      });
    });

    it('should return 404 if no snapshot found for date', async () => {
      req.query = { date: '2024-01-01' };
      mockGetSnapshotByDate.mockResolvedValue(null);

      await getSnapshotForDate(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'No snapshot found for the specified date',
      });
    });

    it('should handle errors gracefully', async () => {
      req.query = { date: '2024-01-01' };
      mockGetSnapshotByDate.mockRejectedValue(new Error('Database error'));

      await getSnapshotForDate(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Failed to fetch snapshot',
      });
    });
  });
});
