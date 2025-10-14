import type { Request, Response } from 'express';
import {
  createCryptoAsset,
  deleteCryptoAsset,
  getAllCryptoAssets,
  getCryptoAssetById,
  updateCryptoAsset,
} from '../../controllers/CryptoAssetController';
import CryptoAssetModel from '../../models/CryptoAssetModel';

jest.mock('../../models/CryptoAssetModel');

const mockCryptoAssetModel = CryptoAssetModel as jest.Mocked<
  typeof CryptoAssetModel
>;

describe('CryptoAssetController', () => {
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
    };
    res = {
      status: statusMock,
      json: jsonMock,
    };

    jest.clearAllMocks();
  });

  describe('getAllCryptoAssets', () => {
    it('should return crypto assets for authenticated user', async () => {
      const mockCryptoAssets = [
        {
          _id: 'asset1',
          name: 'Bitcoin',
          code: 'BTC',
          amount: 0.5,
          userId: 'userId123',
        },
        {
          _id: 'asset2',
          name: 'Ethereum',
          code: 'ETH',
          amount: 2.5,
          userId: 'userId123',
        },
      ];
      mockCryptoAssetModel.find.mockResolvedValue(mockCryptoAssets as any);

      await getAllCryptoAssets(req as Request, res as Response);

      expect(mockCryptoAssetModel.find).toHaveBeenCalledWith({
        userId: 'userId123',
      });
      expect(jsonMock).toHaveBeenCalledWith(mockCryptoAssets);
    });

    it('should return 401 if user not authenticated', async () => {
      req.user = undefined;

      await getAllCryptoAssets(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'User not authenticated',
      });
    });

    it('should return 500 on database error', async () => {
      mockCryptoAssetModel.find.mockRejectedValue(new Error('Database error'));

      await getAllCryptoAssets(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Failed to fetch crypto assets',
      });
    });
  });

  describe('getCryptoAssetById', () => {
    it('should return crypto asset by id', async () => {
      req.params = { id: 'asset1' };
      const mockCryptoAsset = {
        _id: 'asset1',
        name: 'Bitcoin',
        code: 'BTC',
        amount: 0.5,
        userId: 'userId123',
      };
      mockCryptoAssetModel.findOne.mockResolvedValue(mockCryptoAsset as any);

      await getCryptoAssetById(req as Request, res as Response);

      expect(mockCryptoAssetModel.findOne).toHaveBeenCalledWith({
        _id: 'asset1',
        userId: 'userId123',
      });
      expect(jsonMock).toHaveBeenCalledWith(mockCryptoAsset);
    });

    it('should return 404 if crypto asset not found', async () => {
      req.params = { id: 'nonexistent' };
      mockCryptoAssetModel.findOne.mockResolvedValue(null);

      await getCryptoAssetById(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'CryptoAsset not found',
      });
    });

    it('should return 401 if user not authenticated', async () => {
      req.user = undefined;
      req.params = { id: 'asset1' };

      await getCryptoAssetById(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(401);
    });
  });

  describe('createCryptoAsset', () => {
    it('should create a new crypto asset', async () => {
      req.body = {
        name: 'Bitcoin',
        code: 'BTC',
        amount: 0.5,
      };
      const mockSavedAsset = {
        _id: 'newAsset',
        ...req.body,
        userId: 'userId123',
      };
      const saveMock = jest.fn().mockResolvedValue(mockSavedAsset);
      (mockCryptoAssetModel as any).mockImplementation(() => ({
        save: saveMock,
      }));

      await createCryptoAsset(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(mockSavedAsset);
    });

    it('should return 401 if user not authenticated', async () => {
      req.user = undefined;
      req.body = { name: 'Bitcoin', code: 'BTC', amount: 0.5 };

      await createCryptoAsset(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(401);
    });

    it('should return 400 on validation error', async () => {
      req.body = { name: 'Bitcoin', code: 'BTC', amount: 0.5 };
      const validationError = new Error('Validation failed');
      (validationError as any).name = 'ValidationError';
      const saveMock = jest.fn().mockRejectedValue(validationError);
      (mockCryptoAssetModel as any).mockImplementation(() => ({
        save: saveMock,
      }));

      await createCryptoAsset(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
    });
  });

  describe('updateCryptoAsset', () => {
    it('should update an existing crypto asset', async () => {
      req.params = { id: 'asset1' };
      req.body = { name: 'Bitcoin', code: 'BTC', amount: 1.0 };
      const mockUpdatedAsset = {
        _id: 'asset1',
        ...req.body,
        userId: 'userId123',
      };
      mockCryptoAssetModel.findOneAndUpdate.mockResolvedValue(
        mockUpdatedAsset as any
      );

      await updateCryptoAsset(req as Request, res as Response);

      expect(mockCryptoAssetModel.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: 'asset1', userId: 'userId123' },
        { name: 'Bitcoin', code: 'BTC', amount: 1.0 },
        { new: true, runValidators: true }
      );
      expect(jsonMock).toHaveBeenCalledWith(mockUpdatedAsset);
    });

    it('should return 404 if crypto asset not found', async () => {
      req.params = { id: 'nonexistent' };
      req.body = { name: 'Bitcoin', code: 'BTC', amount: 1.0 };
      mockCryptoAssetModel.findOneAndUpdate.mockResolvedValue(null);

      await updateCryptoAsset(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'CryptoAsset not found',
      });
    });

    it('should return 401 if user not authenticated', async () => {
      req.user = undefined;
      req.params = { id: 'asset1' };
      req.body = { name: 'Bitcoin', code: 'BTC', amount: 1.0 };

      await updateCryptoAsset(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(401);
    });
  });

  describe('deleteCryptoAsset', () => {
    it('should delete a crypto asset', async () => {
      req.params = { id: 'asset1' };
      const mockDeletedAsset = {
        _id: 'asset1',
        name: 'Bitcoin',
        code: 'BTC',
      };
      mockCryptoAssetModel.findOneAndDelete.mockResolvedValue(
        mockDeletedAsset as any
      );

      await deleteCryptoAsset(req as Request, res as Response);

      expect(mockCryptoAssetModel.findOneAndDelete).toHaveBeenCalledWith({
        _id: 'asset1',
        userId: 'userId123',
      });
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Crypto asset deleted successfully',
      });
    });

    it('should return 404 if crypto asset not found', async () => {
      req.params = { id: 'nonexistent' };
      mockCryptoAssetModel.findOneAndDelete.mockResolvedValue(null);

      await deleteCryptoAsset(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'CryptoAsset not found',
      });
    });

    it('should return 401 if user not authenticated', async () => {
      req.user = undefined;
      req.params = { id: 'asset1' };

      await deleteCryptoAsset(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(401);
    });
  });
});
