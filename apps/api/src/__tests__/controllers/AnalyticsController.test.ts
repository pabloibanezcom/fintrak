import type { Request, Response } from 'express';
import { getPeriodSummary } from '../../controllers/AnalyticsController';
import ExpenseModel from '../../models/ExpenseModel';
import IncomeModel from '../../models/IncomeModel';

jest.mock('../../models/ExpenseModel');
jest.mock('../../models/IncomeModel');

const mockExpenseModel = ExpenseModel as jest.Mocked<typeof ExpenseModel>;
const mockIncomeModel = IncomeModel as jest.Mocked<typeof IncomeModel>;

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

  const mockExpenses = [
    {
      _id: 'exp1',
      title: 'Grocery Shopping',
      amount: 85.5,
      date: new Date('2024-01-15'),
      category: {
        key: 'groceries',
        name: 'Groceries',
        color: '#4CAF50',
        icon: 'cart',
      },
      payee: {
        key: 'supermarket',
        name: 'Supermarket',
        type: 'merchant',
        logo: null,
      },
    },
    {
      _id: 'exp2',
      title: 'Gas Station',
      amount: 45.2,
      date: new Date('2024-01-14'),
      category: {
        key: 'transport',
        name: 'Transport',
        color: '#2196F3',
        icon: 'car',
      },
      payee: {
        key: 'gas-station',
        name: 'Gas Station',
        type: 'merchant',
        logo: null,
      },
    },
  ];

  const mockIncomes = [
    {
      _id: 'inc1',
      title: 'Monthly Salary',
      amount: 3000,
      date: new Date('2024-01-16'),
      category: {
        key: 'salary',
        name: 'Salary',
        color: '#FF9800',
        icon: 'money',
      },
      source: {
        key: 'employer',
        name: 'Company Ltd',
        type: 'employer',
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

    // Setup default mocks
    mockExpenseModel.aggregate = jest
      .fn()
      .mockResolvedValue(mockExpenseAggregation);
    mockIncomeModel.aggregate = jest
      .fn()
      .mockResolvedValue(mockIncomeAggregation);

    mockExpenseModel.find = jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue(mockExpenses),
    } as any);

    mockIncomeModel.find = jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue(mockIncomes),
    } as any);
  });

  describe('getPeriodSummary', () => {
    it('should return period summary with expenses, incomes, and latest transactions', async () => {
      req.query = {
        dateFrom: '2024-01-01',
        dateTo: '2024-01-31',
      };

      await getPeriodSummary(req as Request, res as Response);

      expect(mockExpenseModel.aggregate).toHaveBeenCalled();
      expect(mockIncomeModel.aggregate).toHaveBeenCalled();
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
        latestTransactions: expect.arrayContaining([
          expect.objectContaining({ type: 'income' }),
          expect.objectContaining({ type: 'expense' }),
        ]),
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

      expect(mockExpenseModel.aggregate).toHaveBeenCalledWith(
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

      const expenseFindChain = mockExpenseModel.find();
      const incomeFindChain = mockIncomeModel.find();

      expect(expenseFindChain.limit).toHaveBeenCalledWith(10);
      expect(incomeFindChain.limit).toHaveBeenCalledWith(10);
    });

    it('should default to 5 latest transactions when latestCount not provided', async () => {
      req.query = {
        dateFrom: '2024-01-01',
        dateTo: '2024-01-31',
      };

      await getPeriodSummary(req as Request, res as Response);

      const expenseFindChain = mockExpenseModel.find();
      const incomeFindChain = mockIncomeModel.find();

      expect(expenseFindChain.limit).toHaveBeenCalledWith(5);
      expect(incomeFindChain.limit).toHaveBeenCalledWith(5);
    });

    it('should handle zero expenses correctly', async () => {
      mockExpenseModel.aggregate = jest.fn().mockResolvedValue([]);
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
      mockIncomeModel.aggregate = jest.fn().mockResolvedValue([]);
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

    it('should combine and sort latest transactions by date', async () => {
      req.query = {
        dateFrom: '2024-01-01',
        dateTo: '2024-01-31',
        latestCount: '5',
      };

      await getPeriodSummary(req as Request, res as Response);

      const response = jsonMock.mock.calls[0][0];
      const transactions = response.latestTransactions;

      // Should be sorted by date descending (most recent first)
      expect(transactions[0].type).toBe('income'); // 2024-01-16
      expect(transactions[1].type).toBe('expense'); // 2024-01-15
      expect(transactions[2].type).toBe('expense'); // 2024-01-14
    });

    it('should handle errors gracefully', async () => {
      req.query = {
        dateFrom: '2024-01-01',
        dateTo: '2024-01-31',
      };
      mockExpenseModel.aggregate = jest
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
