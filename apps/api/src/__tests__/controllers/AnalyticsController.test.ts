import type { Request, Response } from 'express';
import { getPeriodSummary } from '../../controllers/AnalyticsController';
import UserTransactionModel from '../../models/UserTransactionModel';

jest.mock('../../models/UserTransactionModel');

const mockUserTransactionModel = UserTransactionModel as jest.Mocked<
  typeof UserTransactionModel
>;

describe('AnalyticsController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  const mockExpenseAggregation = [
    {
      categoryId: 'cat1',
      categoryKey: 'groceries',
      categoryName: 'Groceries',
      categoryColor: '#4CAF50',
      categoryIcon: 'cart',
      total: 450,
      count: 15,
    },
    {
      categoryId: 'cat2',
      categoryKey: 'transport',
      categoryName: 'Transport',
      categoryColor: '#2196F3',
      categoryIcon: 'car',
      total: 120,
      count: 8,
    },
  ];

  const mockIncomeAggregation = [
    {
      categoryId: 'cat3',
      categoryKey: 'salary',
      categoryName: 'Salary',
      categoryColor: '#FF9800',
      categoryIcon: 'money',
      total: 3000,
      count: 1,
    },
  ];

  const mockTransactions = [
    {
      _id: 'inc1',
      type: 'income',
      title: 'Monthly Salary',
      amount: 3000,
      date: new Date('2024-01-16'),
      category: {
        key: 'salary',
        name: 'Salary',
        color: '#FF9800',
        icon: 'money',
      },
      counterparty: {
        key: 'employer',
        name: 'Company Ltd',
        type: 'employer',
        logo: null,
      },
    },
    {
      _id: 'exp1',
      type: 'expense',
      title: 'Grocery Shopping',
      amount: 85.5,
      date: new Date('2024-01-15'),
      category: {
        key: 'groceries',
        name: 'Groceries',
        color: '#4CAF50',
        icon: 'cart',
      },
      counterparty: {
        key: 'supermarket',
        name: 'Supermarket',
        type: 'merchant',
        logo: null,
      },
    },
    {
      _id: 'exp2',
      type: 'expense',
      title: 'Gas Station',
      amount: 45.2,
      date: new Date('2024-01-14'),
      category: {
        key: 'transport',
        name: 'Transport',
        color: '#2196F3',
        icon: 'car',
      },
      counterparty: {
        key: 'gas-station',
        name: 'Gas Station',
        type: 'merchant',
        logo: null,
      },
    },
  ];

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

    // Setup default mocks - aggregate is called twice (expenses, then incomes)
    mockUserTransactionModel.aggregate = jest
      .fn()
      .mockResolvedValueOnce(mockExpenseAggregation)
      .mockResolvedValueOnce(mockIncomeAggregation);

    mockUserTransactionModel.find = jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue(mockTransactions),
    } as any);
  });

  describe('getPeriodSummary', () => {
    it('should return period summary with expenses, incomes, and latest transactions', async () => {
      req.query = {
        dateFrom: '2024-01-01',
        dateTo: '2024-01-31',
      };

      await getPeriodSummary(req as Request, res as Response);

      expect(mockUserTransactionModel.aggregate).toHaveBeenCalledTimes(2);
      expect(jsonMock).toHaveBeenCalledWith({
        period: {
          from: '2024-01-01',
          to: '2024-01-31',
          currency: 'all',
        },
        expenses: {
          total: 570, // 450 + 120
          byCategory: mockExpenseAggregation,
        },
        incomes: {
          total: 3000,
          byCategory: mockIncomeAggregation,
        },
        balance: 2430, // 3000 - 570
        latestTransactions: mockTransactions,
      });
    });

    it('should return 401 if user is not authenticated', async () => {
      req.user = undefined;
      req.query = {
        dateFrom: '2024-01-01',
        dateTo: '2024-01-31',
      };

      await getPeriodSummary(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'User not authenticated',
      });
    });

    it('should return 400 if dateFrom is missing', async () => {
      req.query = {
        dateTo: '2024-01-31',
      };

      await getPeriodSummary(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'dateFrom and dateTo query parameters are required',
      });
    });

    it('should return 400 if dateTo is missing', async () => {
      req.query = {
        dateFrom: '2024-01-01',
      };

      await getPeriodSummary(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'dateFrom and dateTo query parameters are required',
      });
    });

    it('should filter by currency when provided', async () => {
      req.query = {
        dateFrom: '2024-01-01',
        dateTo: '2024-01-31',
        currency: 'EUR',
      };

      await getPeriodSummary(req as Request, res as Response);

      expect(mockUserTransactionModel.aggregate).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            $match: expect.objectContaining({ currency: 'EUR' }),
          }),
        ])
      );
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          period: expect.objectContaining({
            currency: 'EUR',
          }),
        })
      );
    });

    it('should respect latestCount parameter', async () => {
      req.query = {
        dateFrom: '2024-01-01',
        dateTo: '2024-01-31',
        latestCount: '10',
      };

      await getPeriodSummary(req as Request, res as Response);

      const findChain = mockUserTransactionModel.find();
      expect(findChain.limit).toHaveBeenCalledWith(10);
    });

    it('should default to 5 latest transactions when latestCount not provided', async () => {
      req.query = {
        dateFrom: '2024-01-01',
        dateTo: '2024-01-31',
      };

      await getPeriodSummary(req as Request, res as Response);

      const findChain = mockUserTransactionModel.find();
      expect(findChain.limit).toHaveBeenCalledWith(5);
    });

    it('should handle zero expenses correctly', async () => {
      mockUserTransactionModel.aggregate = jest
        .fn()
        .mockResolvedValueOnce([]) // expenses
        .mockResolvedValueOnce(mockIncomeAggregation); // incomes

      req.query = {
        dateFrom: '2024-01-01',
        dateTo: '2024-01-31',
      };

      await getPeriodSummary(req as Request, res as Response);

      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          expenses: {
            total: 0,
            byCategory: [],
          },
          balance: 3000, // Only incomes
        })
      );
    });

    it('should handle zero incomes correctly', async () => {
      mockUserTransactionModel.aggregate = jest
        .fn()
        .mockResolvedValueOnce(mockExpenseAggregation) // expenses
        .mockResolvedValueOnce([]); // incomes

      req.query = {
        dateFrom: '2024-01-01',
        dateTo: '2024-01-31',
      };

      await getPeriodSummary(req as Request, res as Response);

      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          incomes: {
            total: 0,
            byCategory: [],
          },
          balance: -570, // Only expenses (negative balance)
        })
      );
    });

    it('should handle errors gracefully', async () => {
      req.query = {
        dateFrom: '2024-01-01',
        dateTo: '2024-01-31',
      };
      mockUserTransactionModel.aggregate = jest
        .fn()
        .mockRejectedValue(new Error('Database error'));

      await getPeriodSummary(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Failed to fetch period summary',
      });
    });
  });
});
