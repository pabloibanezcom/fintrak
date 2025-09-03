import type { Request, Response } from 'express';
import {
  deleteRecurringTransaction,
  getRecurringTransactionById,
} from '../../controllers/RecurringTransactionController';
import RecurringTransactionModel from '../../models/RecurringTransactionModel';

jest.mock('../../models/RecurringTransactionModel');

const mockRecurringTransactionModel = RecurringTransactionModel as jest.Mocked<
  typeof RecurringTransactionModel
>;

describe('RecurringTransactionController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    statusMock = jest.fn().mockReturnThis();
    jsonMock = jest.fn().mockReturnThis();

    req = {
      user: { id: 'userId123' },
      params: { id: 'rt1' },
      body: {},
      query: {},
    };
    res = {
      status: statusMock,
      json: jsonMock,
    };

    jest.clearAllMocks();
  });

  describe('getRecurringTransactionById', () => {
    it('should return recurring transaction by id for authenticated user', async () => {
      const mockRecurringTransaction = {
        id: 'rt1',
        title: 'Mortgage',
        currency: 'EUR',
        category: 'housing',
        transactionType: 'EXPENSE',
        periodicity: 'MONTHLY',
        userId: 'userId123',
      };

      mockRecurringTransactionModel.findOne.mockResolvedValue(
        mockRecurringTransaction as any
      );

      await getRecurringTransactionById(req as Request, res as Response);

      expect(mockRecurringTransactionModel.findOne).toHaveBeenCalledWith({
        _id: 'rt1',
        userId: 'userId123',
      });
      expect(jsonMock).toHaveBeenCalledWith(mockRecurringTransaction);
    });

    it('should return 404 if recurring transaction not found', async () => {
      mockRecurringTransactionModel.findOne.mockResolvedValue(null);

      await getRecurringTransactionById(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'RecurringTransaction not found',
      });
    });

    it('should return 401 if user not authenticated', async () => {
      req.user = undefined;

      await getRecurringTransactionById(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'User not authenticated',
      });
    });
  });

  describe('deleteRecurringTransaction', () => {
    it('should delete recurring transaction successfully', async () => {
      mockRecurringTransactionModel.findOneAndDelete.mockResolvedValue({
        id: 'rt1',
      } as any);

      await deleteRecurringTransaction(req as Request, res as Response);

      expect(
        mockRecurringTransactionModel.findOneAndDelete
      ).toHaveBeenCalledWith({
        _id: 'rt1',
        userId: 'userId123',
      });
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Recurring transaction deleted successfully',
      });
    });

    it('should return 404 if recurring transaction not found', async () => {
      mockRecurringTransactionModel.findOneAndDelete.mockResolvedValue(null);

      await deleteRecurringTransaction(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'RecurringTransaction not found',
      });
    });

    it('should return 401 if user not authenticated', async () => {
      req.user = undefined;

      await deleteRecurringTransaction(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'User not authenticated',
      });
    });
  });
});
