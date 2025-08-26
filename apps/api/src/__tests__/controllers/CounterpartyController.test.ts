import type { Request, Response } from 'express';
import {
  createCounterparty,
  deleteCounterparty,
  getCounterparties,
  getCounterpartyById,
  updateCounterparty,
} from '../../controllers/CounterpartyController';
import CounterpartyModel from '../../models/CounterpartyModel';

jest.mock('../../models/CounterpartyModel');

const mockCounterpartyModel = CounterpartyModel as jest.Mocked<typeof CounterpartyModel>;

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

  describe('getCounterparties', () => {
    it('should return counterparties for authenticated user', async () => {
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
      mockCounterpartyModel.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockCounterparties),
      } as any);

      await getCounterparties(req as Request, res as Response);

      expect(mockCounterpartyModel.find).toHaveBeenCalledWith({
        userId: 'userId123',
      });
      expect(jsonMock).toHaveBeenCalledWith(mockCounterparties);
    });

    it('should return 401 if user not authenticated', async () => {
      req.user = undefined;

      await getCounterparties(req as Request, res as Response);

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
      (mockCounterpartyModel as any).mockImplementation(() => ({ save: mockSave }));

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
      (mockCounterpartyModel as any).mockImplementation(() => ({ save: mockSave }));

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
        titleTemplate: 'Pedido {name}' // Updated template
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
          titleTemplate: 'Pedido {name}'
        },
        { new: true, runValidators: true }
      );
      expect(jsonMock).toHaveBeenCalledWith(updatedCounterparty);
    });

    it('should update counterparty by removing titleTemplate', async () => {
      req.body = { 
        name: 'Amazon',
        titleTemplate: null // Explicitly remove template
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
          titleTemplate: null
        },
        { new: true, runValidators: true }
      );
    });

    it('should return 404 if counterparty not found', async () => {
      mockCounterpartyModel.findOneAndUpdate.mockResolvedValue(null);

      await updateCounterparty(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Counterparty not found' });
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
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Counterparty not found' });
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
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Counterparty not found' });
    });
  });
});