import type { Request, Response } from 'express';
import {
  createCounterparty,
  deleteCounterparty,
  getCounterpartyById,
  searchCounterparties,
  updateCounterparty,
} from '../../controllers/CounterpartyController';
import CounterpartyModel from '../../models/CounterpartyModel';

jest.mock('../../models/CounterpartyModel');

const mockCounterpartyModel = CounterpartyModel as jest.Mocked<
  typeof CounterpartyModel
>;

describe('CounterpartyController', () => {
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

  describe('searchCounterparties', () => {
    beforeEach(() => {
      req.query = {};
      mockCounterpartyModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            skip: jest.fn().mockResolvedValue([]),
          }),
        }),
      } as any);
      mockCounterpartyModel.countDocuments.mockResolvedValue(0);
    });

    it('should return counterparties with search results and pagination', async () => {
      const mockCounterparties = [
        {
          key: 'mercadona',
          name: 'Mercadona',
          type: 'company',
          titleTemplate: 'Compra en {name}',
          userId: 'userId123',
        },
        {
          key: 'netflix',
          name: 'Netflix',
          type: 'company',
          titleTemplate: 'Suscripción {name}',
          userId: 'userId123',
        },
      ];

      req.query = { limit: '10', offset: '0' };

      mockCounterpartyModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            skip: jest.fn().mockResolvedValue(mockCounterparties),
          }),
        }),
      } as any);
      mockCounterpartyModel.countDocuments.mockResolvedValue(2);

      await searchCounterparties(req as Request, res as Response);

      expect(mockCounterpartyModel.find).toHaveBeenCalledWith({
        userId: 'userId123',
      });
      expect(jsonMock).toHaveBeenCalledWith({
        counterparties: mockCounterparties,
        pagination: {
          total: 2,
          limit: 10,
          offset: 0,
          hasMore: false,
        },
        filters: {
          name: undefined,
          type: undefined,
          email: undefined,
          phone: undefined,
          address: undefined,
          notes: undefined,
          titleTemplate: undefined,
        },
        sort: {
          sortBy: 'name',
          sortOrder: 'asc',
        },
      });
    });

    it('should apply name and type filters correctly', async () => {
      req.query = {
        name: 'mercadona',
        type: 'company',
        limit: '50',
        offset: '0',
      };

      await searchCounterparties(req as Request, res as Response);

      expect(mockCounterpartyModel.find).toHaveBeenCalledWith({
        userId: 'userId123',
        name: { $regex: 'mercadona', $options: 'i' },
        type: 'company',
      });
    });

    it('should apply email filter correctly', async () => {
      req.query = {
        email: 'support@amazon',
        limit: '50',
        offset: '0',
      };

      await searchCounterparties(req as Request, res as Response);

      expect(mockCounterpartyModel.find).toHaveBeenCalledWith({
        userId: 'userId123',
        email: { $regex: 'support@amazon', $options: 'i' },
      });
    });

    it('should apply phone filter correctly', async () => {
      req.query = {
        phone: '+34',
        limit: '50',
        offset: '0',
      };

      await searchCounterparties(req as Request, res as Response);

      expect(mockCounterpartyModel.find).toHaveBeenCalledWith({
        userId: 'userId123',
        phone: { $regex: '+34', $options: 'i' },
      });
    });

    it('should apply address filter correctly', async () => {
      req.query = {
        address: 'madrid',
        limit: '50',
        offset: '0',
      };

      await searchCounterparties(req as Request, res as Response);

      expect(mockCounterpartyModel.find).toHaveBeenCalledWith({
        userId: 'userId123',
        address: { $regex: 'madrid', $options: 'i' },
      });
    });

    it('should apply notes filter correctly', async () => {
      req.query = {
        notes: 'shopping',
        limit: '50',
        offset: '0',
      };

      await searchCounterparties(req as Request, res as Response);

      expect(mockCounterpartyModel.find).toHaveBeenCalledWith({
        userId: 'userId123',
        notes: { $regex: 'shopping', $options: 'i' },
      });
    });

    it('should apply titleTemplate filter correctly', async () => {
      req.query = {
        titleTemplate: 'compra',
        limit: '50',
        offset: '0',
      };

      await searchCounterparties(req as Request, res as Response);

      expect(mockCounterpartyModel.find).toHaveBeenCalledWith({
        userId: 'userId123',
        titleTemplate: { $regex: 'compra', $options: 'i' },
      });
    });

    it('should apply multiple filters simultaneously', async () => {
      req.query = {
        name: 'amazon',
        type: 'company',
        email: 'support',
        notes: 'online',
        limit: '20',
        offset: '10',
      };

      await searchCounterparties(req as Request, res as Response);

      expect(mockCounterpartyModel.find).toHaveBeenCalledWith({
        userId: 'userId123',
        name: { $regex: 'amazon', $options: 'i' },
        type: 'company',
        email: { $regex: 'support', $options: 'i' },
        notes: { $regex: 'online', $options: 'i' },
      });
    });

    it('should handle custom sorting by different fields', async () => {
      req.query = {
        sortBy: 'type',
        sortOrder: 'desc',
        limit: '50',
        offset: '0',
      };

      await searchCounterparties(req as Request, res as Response);

      expect(mockCounterpartyModel.find().sort).toHaveBeenCalledWith({
        type: -1,
      });
    });

    it('should default to name sorting ascending for invalid sortBy', async () => {
      req.query = {
        sortBy: 'invalidField',
        sortOrder: 'asc',
        limit: '50',
        offset: '0',
      };

      await searchCounterparties(req as Request, res as Response);

      expect(mockCounterpartyModel.find().sort).toHaveBeenCalledWith({
        name: 1,
      });
    });

    it('should handle pagination correctly with hasMore true', async () => {
      const mockCounterparties = Array(10)
        .fill(null)
        .map((_, i) => ({
          key: `counterparty_${i}`,
          name: `Counterparty ${i}`,
          type: 'company',
          userId: 'userId123',
        }));

      req.query = { limit: '10', offset: '20' };

      mockCounterpartyModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            skip: jest.fn().mockResolvedValue(mockCounterparties),
          }),
        }),
      } as any);
      mockCounterpartyModel.countDocuments.mockResolvedValue(50);

      await searchCounterparties(req as Request, res as Response);

      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          counterparties: mockCounterparties,
          pagination: {
            total: 50,
            limit: 10,
            offset: 20,
            hasMore: true,
          },
        })
      );
    });

    it('should handle empty search results', async () => {
      req.query = { name: 'nonexistent', limit: '50', offset: '0' };

      mockCounterpartyModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            skip: jest.fn().mockResolvedValue([]),
          }),
        }),
      } as any);
      mockCounterpartyModel.countDocuments.mockResolvedValue(0);

      await searchCounterparties(req as Request, res as Response);

      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          counterparties: [],
          pagination: {
            total: 0,
            limit: 50,
            offset: 0,
            hasMore: false,
          },
        })
      );
    });

    it('should handle database errors gracefully', async () => {
      const dbError = new Error('Database connection failed');
      mockCounterpartyModel.find.mockImplementation(() => {
        throw dbError;
      });

      await searchCounterparties(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Failed to search counterparties',
      });
    });

    it('should return 401 if user not authenticated', async () => {
      req.user = undefined;

      await searchCounterparties(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'User not authenticated',
      });
    });
  });

  describe('createCounterparty', () => {
    beforeEach(() => {
      req.body = {
        key: 'amazon',
        name: 'Amazon',
        type: 'company',
        titleTemplate: 'Compra en {name}',
        email: 'support@amazon.com',
      };
    });

    it('should create counterparty with titleTemplate successfully', async () => {
      mockCounterpartyModel.findOne.mockResolvedValue(null);
      const mockSave = jest.fn().mockResolvedValue({
        key: 'amazon',
        name: 'Amazon',
        type: 'company',
        titleTemplate: 'Compra en {name}',
        userId: 'userId123',
      });
      (mockCounterpartyModel as any).mockImplementation(() => ({
        save: mockSave,
      }));

      await createCounterparty(req as Request, res as Response);

      expect(mockCounterpartyModel.findOne).toHaveBeenCalledWith({
        key: 'amazon',
        userId: 'userId123',
      });
      expect(statusMock).toHaveBeenCalledWith(201);
    });

    it('should create counterparty without titleTemplate', async () => {
      req.body = {
        key: 'local_shop',
        name: 'Local Shop',
        type: 'company',
        // No titleTemplate provided
      };

      mockCounterpartyModel.findOne.mockResolvedValue(null);
      const mockSave = jest.fn().mockResolvedValue({
        key: 'local_shop',
        name: 'Local Shop',
        type: 'company',
        userId: 'userId123',
      });
      (mockCounterpartyModel as any).mockImplementation(() => ({
        save: mockSave,
      }));

      await createCounterparty(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(201);
    });

    it('should return 409 if counterparty with same key already exists', async () => {
      mockCounterpartyModel.findOne.mockResolvedValue({ key: 'amazon' } as any);

      await createCounterparty(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(409);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Counterparty with this key already exists',
      });
    });

    it('should return 401 if user not authenticated', async () => {
      req.user = undefined;

      await createCounterparty(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'User not authenticated',
      });
    });
  });

  describe('updateCounterparty', () => {
    beforeEach(() => {
      req.params = { id: 'amazon' };
      req.body = {
        name: 'Amazon España',
        titleTemplate: 'Pedido {name}', // Updated template
      };
    });

    it('should update counterparty with new titleTemplate successfully', async () => {
      const updatedCounterparty = {
        key: 'amazon',
        name: 'Amazon España',
        type: 'company',
        titleTemplate: 'Pedido {name}',
        userId: 'userId123',
      };
      mockCounterpartyModel.findOneAndUpdate.mockResolvedValue(
        updatedCounterparty as any
      );

      await updateCounterparty(req as Request, res as Response);

      expect(mockCounterpartyModel.findOneAndUpdate).toHaveBeenCalledWith(
        { key: 'amazon', userId: 'userId123' },
        {
          name: 'Amazon España',
          titleTemplate: 'Pedido {name}',
        },
        { new: true, runValidators: true }
      );
      expect(jsonMock).toHaveBeenCalledWith(updatedCounterparty);
    });

    it('should update counterparty by removing titleTemplate', async () => {
      req.body = {
        name: 'Amazon',
        titleTemplate: null, // Explicitly remove template
      };

      const updatedCounterparty = {
        key: 'amazon',
        name: 'Amazon',
        type: 'company',
        userId: 'userId123',
      };
      mockCounterpartyModel.findOneAndUpdate.mockResolvedValue(
        updatedCounterparty as any
      );

      await updateCounterparty(req as Request, res as Response);

      expect(mockCounterpartyModel.findOneAndUpdate).toHaveBeenCalledWith(
        { key: 'amazon', userId: 'userId123' },
        {
          name: 'Amazon',
          titleTemplate: null,
        },
        { new: true, runValidators: true }
      );
    });

    it('should return 404 if counterparty not found', async () => {
      mockCounterpartyModel.findOneAndUpdate.mockResolvedValue(null);

      await updateCounterparty(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Counterparty not found',
      });
    });
  });

  describe('getCounterpartyById', () => {
    beforeEach(() => {
      req.params = { id: 'mercadona' };
    });

    it('should return counterparty by key with titleTemplate', async () => {
      const mockCounterparty = {
        key: 'mercadona',
        name: 'Mercadona',
        type: 'company',
        titleTemplate: 'Compra en {name}',
        userId: 'userId123',
      };
      mockCounterpartyModel.findOne.mockResolvedValue(mockCounterparty as any);

      await getCounterpartyById(req as Request, res as Response);

      expect(mockCounterpartyModel.findOne).toHaveBeenCalledWith({
        key: 'mercadona',
        userId: 'userId123',
      });
      expect(jsonMock).toHaveBeenCalledWith(mockCounterparty);
    });

    it('should return 404 if counterparty not found', async () => {
      mockCounterpartyModel.findOne.mockResolvedValue(null);

      await getCounterpartyById(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Counterparty not found',
      });
    });
  });

  describe('deleteCounterparty', () => {
    beforeEach(() => {
      req.params = { id: 'old_shop' };
    });

    it('should delete counterparty successfully', async () => {
      mockCounterpartyModel.findOneAndDelete.mockResolvedValue({
        key: 'old_shop',
        name: 'Old Shop',
        titleTemplate: 'Compra {name}',
      } as any);

      await deleteCounterparty(req as Request, res as Response);

      expect(mockCounterpartyModel.findOneAndDelete).toHaveBeenCalledWith({
        key: 'old_shop',
        userId: 'userId123',
      });
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Counterparty deleted successfully',
      });
    });

    it('should return 404 if counterparty not found', async () => {
      mockCounterpartyModel.findOneAndDelete.mockResolvedValue(null);

      await deleteCounterparty(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Counterparty not found',
      });
    });
  });
});
