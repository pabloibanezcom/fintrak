import type { Request, Response } from 'express';
import {
  createExpense,
  deleteExpense,
  getExpenseById,
  searchExpenses,
  updateExpense,
} from '../../controllers/ExpenseController';
import ExpenseModel from '../../models/ExpenseModel';

jest.mock('../../models/ExpenseModel');

const mockExpenseModel = ExpenseModel as jest.Mocked<typeof ExpenseModel>;

describe('ExpenseController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

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
    console.log = jest.fn(); // Mock console.log for tests
  });

  describe('searchExpenses', () => {
    const mockExpenses = [
      {
        _id: 'expense1',
        title: 'Grocery Shopping',
        amount: 85.5,
        currency: 'EUR',
        userId: 'userId123',
      },
      {
        _id: 'expense2',
        title: 'Gas Station',
        amount: 45.2,
        currency: 'EUR',
        userId: 'userId123',
      },
    ];

    beforeEach(() => {
      mockExpenseModel.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockResolvedValue(mockExpenses),
      } as any);

      mockExpenseModel.countDocuments.mockResolvedValue(2);
    });

    it('should return expenses without total amount by default', async () => {
      req.query = {};

      await searchExpenses(req as Request, res as Response);

      expect(jsonMock).toHaveBeenCalledWith({
        expenses: mockExpenses,
        pagination: {
          total: 2,
          limit: 50,
          offset: 0,
          hasMore: false,
        },
        filters: {
          title: undefined,
          dateFrom: undefined,
          dateTo: undefined,
          amountMin: undefined,
          amountMax: undefined,
          currency: undefined,
          category: undefined,
          payee: undefined,
          periodicity: undefined,
          tags: undefined,
          description: undefined,
        },
        sort: {
          sortBy: 'date',
          sortOrder: 'desc',
        },
      });
    });

    it('should return expenses without total amount when includeTotal is false', async () => {
      req.query = { includeTotal: 'false' };

      await searchExpenses(req as Request, res as Response);

      expect(jsonMock).toHaveBeenCalledWith(
        expect.not.objectContaining({
          totalAmount: expect.anything(),
        })
      );
    });

    it('should return expenses with total amount when includeTotal is true', async () => {
      req.query = { includeTotal: 'true' };

      const mockAggregationResult = [{ _id: null, total: 130.7 }];
      mockExpenseModel.aggregate.mockResolvedValue(mockAggregationResult);

      await searchExpenses(req as Request, res as Response);

      expect(mockExpenseModel.aggregate).toHaveBeenCalledWith([
        { $match: { userId: 'userId123' } },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' },
          },
        },
      ]);

      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          totalAmount: 130.7,
          expenses: mockExpenses,
          pagination: expect.any(Object),
          filters: expect.any(Object),
          sort: expect.any(Object),
        })
      );
    });

    it('should return total amount as 0 when no expenses match the query', async () => {
      req.query = { includeTotal: 'true' };

      const mockAggregationResult: any[] = []; // Empty result
      mockExpenseModel.aggregate.mockResolvedValue(mockAggregationResult);

      await searchExpenses(req as Request, res as Response);

      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          totalAmount: 0,
        })
      );
    });

    it('should apply filters and calculate total correctly', async () => {
      req.query = {
        includeTotal: 'true',
        title: 'grocery',
        amountMin: '50',
        currency: 'EUR',
      };

      const mockAggregationResult = [{ _id: null, total: 85.5 }];
      mockExpenseModel.aggregate.mockResolvedValue(mockAggregationResult);

      await searchExpenses(req as Request, res as Response);

      expect(mockExpenseModel.aggregate).toHaveBeenCalledWith([
        {
          $match: {
            userId: 'userId123',
            title: { $regex: 'grocery', $options: 'i' },
            amount: { $gte: 50 },
            currency: 'EUR',
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' },
          },
        },
      ]);

      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          totalAmount: 85.5,
          filters: expect.objectContaining({
            title: 'grocery',
            amountMin: '50',
            currency: 'EUR',
          }),
        })
      );
    });

    it('should handle ObjectId conversion for category filter with includeTotal', async () => {
      const mongoose = require('mongoose');
      req.query = {
        includeTotal: 'true',
        category: '507f1f77bcf86cd799439011', // Valid ObjectId string
      };

      const mockAggregationResult = [{ _id: null, total: 200.0 }];
      mockExpenseModel.aggregate.mockResolvedValue(mockAggregationResult);

      await searchExpenses(req as Request, res as Response);

      expect(mockExpenseModel.aggregate).toHaveBeenCalledWith([
        {
          $match: {
            userId: 'userId123',
            category: expect.any(mongoose.Types.ObjectId),
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' },
          },
        },
      ]);
    });

    it('should handle string category filter with includeTotal', async () => {
      req.query = {
        includeTotal: 'true',
        category: 'food', // String category (not ObjectId)
      };

      const mockAggregationResult = [{ _id: null, total: 150.0 }];
      mockExpenseModel.aggregate.mockResolvedValue(mockAggregationResult);

      await searchExpenses(req as Request, res as Response);

      expect(mockExpenseModel.aggregate).toHaveBeenCalledWith([
        {
          $match: {
            userId: 'userId123',
            category: 'food', // Should remain as string
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' },
          },
        },
      ]);
    });

    it('should handle date range filters with includeTotal', async () => {
      req.query = {
        includeTotal: 'true',
        dateFrom: '2024-01-01',
        dateTo: '2024-12-31',
      };

      const mockAggregationResult = [{ _id: null, total: 500.0 }];
      mockExpenseModel.aggregate.mockResolvedValue(mockAggregationResult);

      await searchExpenses(req as Request, res as Response);

      expect(mockExpenseModel.aggregate).toHaveBeenCalledWith([
        {
          $match: {
            userId: 'userId123',
            date: {
              $gte: new Date('2024-01-01'),
              $lte: new Date('2024-12-31'),
            },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' },
          },
        },
      ]);
    });

    it('should handle errors gracefully', async () => {
      req.query = { includeTotal: 'true' };

      mockExpenseModel.aggregate.mockRejectedValue(new Error('Database error'));

      await searchExpenses(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Failed to search expenses',
      });
    });
  });

  describe('getExpenseById', () => {
    it('should return expense by ID', async () => {
      const mockExpense = {
        _id: 'expense1',
        title: 'Test Expense',
        amount: 100,
        userId: 'userId123',
      };

      req.params = { id: 'expense1' };
      mockExpenseModel.findOne.mockResolvedValue(mockExpense);

      await getExpenseById(req as Request, res as Response);

      expect(mockExpenseModel.findOne).toHaveBeenCalledWith({
        _id: 'expense1',
        userId: 'userId123',
      });
      expect(jsonMock).toHaveBeenCalledWith(mockExpense);
    });

    it('should return 404 if expense not found', async () => {
      req.params = { id: 'nonexistent' };
      mockExpenseModel.findOne.mockResolvedValue(null);

      await getExpenseById(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Expense not found' });
    });
  });

  describe('createExpense', () => {
    it('should create a new expense', async () => {
      const expenseData = {
        title: 'New Expense',
        amount: 50,
        category: 'food',
        date: '2024-01-15',
      };

      req.body = expenseData;

      const mockExpenseInstance = {
        save: jest.fn().mockResolvedValue({
          ...expenseData,
          _id: 'newExpenseId',
          userId: 'userId123',
        }),
      };

      (ExpenseModel as any).mockImplementation(() => mockExpenseInstance);

      await createExpense(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({
        ...expenseData,
        _id: 'newExpenseId',
        userId: 'userId123',
      });
    });
  });

  describe('updateExpense', () => {
    it('should update an existing expense', async () => {
      const updateData = { title: 'Updated Expense', amount: 75 };
      const mockUpdatedExpense = {
        _id: 'expense1',
        ...updateData,
        userId: 'userId123',
      };

      req.params = { id: 'expense1' };
      req.body = updateData;
      mockExpenseModel.findOneAndUpdate.mockResolvedValue(mockUpdatedExpense);

      await updateExpense(req as Request, res as Response);

      expect(mockExpenseModel.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: 'expense1', userId: 'userId123' },
        updateData,
        { new: true, runValidators: true }
      );
      expect(jsonMock).toHaveBeenCalledWith(mockUpdatedExpense);
    });

    it('should return 404 if expense not found', async () => {
      req.params = { id: 'nonexistent' };
      req.body = { title: 'Updated' };
      mockExpenseModel.findOneAndUpdate.mockResolvedValue(null);

      await updateExpense(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Expense not found' });
    });
  });

  describe('deleteExpense', () => {
    it('should delete an existing expense', async () => {
      const mockDeletedExpense = {
        _id: 'expense1',
        title: 'Deleted Expense',
        userId: 'userId123',
      };

      req.params = { id: 'expense1' };
      mockExpenseModel.findOneAndDelete.mockResolvedValue(mockDeletedExpense);

      await deleteExpense(req as Request, res as Response);

      expect(mockExpenseModel.findOneAndDelete).toHaveBeenCalledWith({
        _id: 'expense1',
        userId: 'userId123',
      });
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Expense deleted successfully',
      });
    });

    it('should return 404 if expense not found', async () => {
      req.params = { id: 'nonexistent' };
      mockExpenseModel.findOneAndDelete.mockResolvedValue(null);

      await deleteExpense(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Expense not found' });
    });
  });
});
