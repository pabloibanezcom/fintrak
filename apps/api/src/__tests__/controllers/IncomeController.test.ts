import type { Request, Response } from 'express';
import {
  createIncome,
  deleteIncome,
  getIncomeById,
  searchIncomes,
  updateIncome,
} from '../../controllers/IncomeController';
import IncomeModel from '../../models/IncomeModel';

jest.mock('../../models/IncomeModel');

const mockIncomeModel = IncomeModel as jest.Mocked<typeof IncomeModel>;

describe('IncomeController', () => {
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
  });

  describe('searchIncomes', () => {
    const mockIncomes = [
      {
        _id: 'income1',
        title: 'Freelance Project',
        amount: 1500.0,
        currency: 'EUR',
        userId: 'userId123',
      },
      {
        _id: 'income2',
        title: 'Salary',
        amount: 2500.0,
        currency: 'EUR',
        userId: 'userId123',
      },
    ];

    beforeEach(() => {
      mockIncomeModel.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockResolvedValue(mockIncomes),
      } as any);

      mockIncomeModel.countDocuments.mockResolvedValue(2);
    });

    it('should return incomes without total amount by default', async () => {
      req.query = {};

      await searchIncomes(req as Request, res as Response);

      expect(jsonMock).toHaveBeenCalledWith({
        incomes: mockIncomes,
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
          source: undefined,
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

    it('should return incomes without total amount when includeTotal is false', async () => {
      req.query = { includeTotal: 'false' };

      await searchIncomes(req as Request, res as Response);

      expect(jsonMock).toHaveBeenCalledWith(
        expect.not.objectContaining({
          totalAmount: expect.anything(),
        })
      );
    });

    it('should return incomes with total amount when includeTotal is true', async () => {
      req.query = { includeTotal: 'true' };

      const mockAggregationResult = [{ _id: null, total: 4000.0 }];
      mockIncomeModel.aggregate.mockResolvedValue(mockAggregationResult);

      await searchIncomes(req as Request, res as Response);

      expect(mockIncomeModel.aggregate).toHaveBeenCalledWith([
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
          totalAmount: 4000.0,
          incomes: mockIncomes,
          pagination: expect.any(Object),
          filters: expect.any(Object),
          sort: expect.any(Object),
        })
      );
    });

    it('should return total amount as 0 when no incomes match the query', async () => {
      req.query = { includeTotal: 'true' };

      const mockAggregationResult: any[] = []; // Empty result
      mockIncomeModel.aggregate.mockResolvedValue(mockAggregationResult);

      await searchIncomes(req as Request, res as Response);

      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          totalAmount: 0,
        })
      );
    });

    it('should apply filters and calculate total correctly', async () => {
      req.query = {
        includeTotal: 'true',
        title: 'freelance',
        amountMin: '1000',
        currency: 'EUR',
      };

      const mockAggregationResult = [{ _id: null, total: 1500.0 }];
      mockIncomeModel.aggregate.mockResolvedValue(mockAggregationResult);

      await searchIncomes(req as Request, res as Response);

      expect(mockIncomeModel.aggregate).toHaveBeenCalledWith([
        {
          $match: {
            userId: 'userId123',
            title: { $regex: 'freelance', $options: 'i' },
            amount: { $gte: 1000 },
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
          totalAmount: 1500.0,
          filters: expect.objectContaining({
            title: 'freelance',
            amountMin: '1000',
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

      const mockAggregationResult = [{ _id: null, total: 3000.0 }];
      mockIncomeModel.aggregate.mockResolvedValue(mockAggregationResult);

      await searchIncomes(req as Request, res as Response);

      expect(mockIncomeModel.aggregate).toHaveBeenCalledWith([
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

    it('should handle ObjectId conversion for source filter with includeTotal', async () => {
      const mongoose = require('mongoose');
      req.query = {
        includeTotal: 'true',
        source: '507f1f77bcf86cd799439012', // Valid ObjectId string
      };

      const mockAggregationResult = [{ _id: null, total: 2500.0 }];
      mockIncomeModel.aggregate.mockResolvedValue(mockAggregationResult);

      await searchIncomes(req as Request, res as Response);

      expect(mockIncomeModel.aggregate).toHaveBeenCalledWith([
        {
          $match: {
            userId: 'userId123',
            source: expect.any(mongoose.Types.ObjectId),
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

    it('should handle string source filter with includeTotal', async () => {
      req.query = {
        includeTotal: 'true',
        source: 'freelance_client', // String source (not ObjectId)
      };

      const mockAggregationResult = [{ _id: null, total: 1800.0 }];
      mockIncomeModel.aggregate.mockResolvedValue(mockAggregationResult);

      await searchIncomes(req as Request, res as Response);

      expect(mockIncomeModel.aggregate).toHaveBeenCalledWith([
        {
          $match: {
            userId: 'userId123',
            source: 'freelance_client', // Should remain as string
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

      const mockAggregationResult = [{ _id: null, total: 5000.0 }];
      mockIncomeModel.aggregate.mockResolvedValue(mockAggregationResult);

      await searchIncomes(req as Request, res as Response);

      expect(mockIncomeModel.aggregate).toHaveBeenCalledWith([
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

      mockIncomeModel.aggregate.mockRejectedValue(new Error('Database error'));

      await searchIncomes(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Failed to search incomes',
      });
    });
  });

  describe('getIncomeById', () => {
    it('should return income by ID', async () => {
      const mockIncome = {
        _id: 'income1',
        title: 'Test Income',
        amount: 1000,
        userId: 'userId123',
      };

      req.params = { id: 'income1' };
      mockIncomeModel.findOne.mockResolvedValue(mockIncome);

      await getIncomeById(req as Request, res as Response);

      expect(mockIncomeModel.findOne).toHaveBeenCalledWith({
        _id: 'income1',
        userId: 'userId123',
      });
      expect(jsonMock).toHaveBeenCalledWith(mockIncome);
    });

    it('should return 404 if income not found', async () => {
      req.params = { id: 'nonexistent' };
      mockIncomeModel.findOne.mockResolvedValue(null);

      await getIncomeById(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Income not found' });
    });
  });

  describe('createIncome', () => {
    it('should create a new income', async () => {
      const incomeData = {
        title: 'New Income',
        amount: 1200,
        category: 'freelance',
        date: '2024-01-15',
      };

      req.body = incomeData;

      const mockIncomeInstance = {
        save: jest.fn().mockResolvedValue({
          ...incomeData,
          _id: 'newIncomeId',
          userId: 'userId123',
        }),
      };

      (IncomeModel as any).mockImplementation(() => mockIncomeInstance);

      await createIncome(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({
        ...incomeData,
        _id: 'newIncomeId',
        userId: 'userId123',
      });
    });
  });

  describe('updateIncome', () => {
    it('should update an existing income', async () => {
      const updateData = { title: 'Updated Income', amount: 1350 };
      const mockUpdatedIncome = {
        _id: 'income1',
        ...updateData,
        userId: 'userId123',
      };

      req.params = { id: 'income1' };
      req.body = updateData;
      mockIncomeModel.findOneAndUpdate.mockResolvedValue(mockUpdatedIncome);

      await updateIncome(req as Request, res as Response);

      expect(mockIncomeModel.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: 'income1', userId: 'userId123' },
        updateData,
        { new: true, runValidators: true }
      );
      expect(jsonMock).toHaveBeenCalledWith(mockUpdatedIncome);
    });

    it('should return 404 if income not found', async () => {
      req.params = { id: 'nonexistent' };
      req.body = { title: 'Updated' };
      mockIncomeModel.findOneAndUpdate.mockResolvedValue(null);

      await updateIncome(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Income not found' });
    });
  });

  describe('deleteIncome', () => {
    it('should delete an existing income', async () => {
      const mockDeletedIncome = {
        _id: 'income1',
        title: 'Deleted Income',
        userId: 'userId123',
      };

      req.params = { id: 'income1' };
      mockIncomeModel.findOneAndDelete.mockResolvedValue(mockDeletedIncome);

      await deleteIncome(req as Request, res as Response);

      expect(mockIncomeModel.findOneAndDelete).toHaveBeenCalledWith({
        _id: 'income1',
        userId: 'userId123',
      });
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Income deleted successfully',
      });
    });

    it('should return 404 if income not found', async () => {
      req.params = { id: 'nonexistent' };
      mockIncomeModel.findOneAndDelete.mockResolvedValue(null);

      await deleteIncome(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Income not found' });
    });
  });
});
