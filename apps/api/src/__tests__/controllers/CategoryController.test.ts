import type { Request, Response } from 'express';
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from '../../controllers/CategoryController';
import CategoryModel from '../../models/CategoryModel';

jest.mock('../../models/CategoryModel');

const mockCategoryModel = CategoryModel as jest.Mocked<typeof CategoryModel>;

describe('CategoryController', () => {
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

  describe('getCategories', () => {
    it('should return categories for authenticated user', async () => {
      const mockCategories = [
        { id: 'cat1', name: 'Food', userId: 'userId123' },
        { id: 'cat2', name: 'Transport', userId: 'userId123' },
      ];
      mockCategoryModel.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockCategories),
      } as any);

      await getCategories(req as Request, res as Response);

      expect(mockCategoryModel.find).toHaveBeenCalledWith({
        userId: 'userId123',
      });
      expect(jsonMock).toHaveBeenCalledWith(mockCategories);
    });

    it('should return 401 if user not authenticated', async () => {
      req.user = undefined;

      await getCategories(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'User not authenticated',
      });
    });

    it('should return 500 on database error', async () => {
      mockCategoryModel.find.mockReturnValue({
        sort: jest.fn().mockRejectedValue(new Error('Database error')),
      } as any);

      await getCategories(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Failed to fetch categories',
      });
    });
  });

  describe('getCategoryById', () => {
    beforeEach(() => {
      req.params = { id: 'cat1' };
    });

    it('should return category by id for authenticated user', async () => {
      const mockCategory = { id: 'cat1', name: 'Food', userId: 'userId123' };
      mockCategoryModel.findOne.mockResolvedValue(mockCategory as any);

      await getCategoryById(req as Request, res as Response);

      expect(mockCategoryModel.findOne).toHaveBeenCalledWith({
        key: 'cat1',
        userId: 'userId123',
      });
      expect(jsonMock).toHaveBeenCalledWith(mockCategory);
    });

    it('should return 404 if category not found', async () => {
      mockCategoryModel.findOne.mockResolvedValue(null);

      await getCategoryById(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Category not found' });
    });
  });

  describe('createCategory', () => {
    beforeEach(() => {
      req.body = {
        key: 'cat1',
        name: 'Food',
        color: '#ff0000',
        icon: 'restaurant',
      };
    });

    it('should create category successfully', async () => {
      mockCategoryModel.findOne.mockResolvedValue(null);
      const mockSave = jest.fn().mockResolvedValue({
        key: 'cat1',
        name: 'Food',
        userId: 'userId123',
      });
      (mockCategoryModel as any).mockImplementation(() => ({ save: mockSave }));

      await createCategory(req as Request, res as Response);

      expect(mockCategoryModel.findOne).toHaveBeenCalledWith({
        key: 'cat1',
        userId: 'userId123',
      });
      expect(statusMock).toHaveBeenCalledWith(201);
    });

    it('should return 409 if category with same id already exists', async () => {
      mockCategoryModel.findOne.mockResolvedValue({ key: 'cat1' } as any);

      await createCategory(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(409);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Category with this ID already exists',
      });
    });

    it('should return 401 if user not authenticated', async () => {
      req.user = undefined;

      await createCategory(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'User not authenticated',
      });
    });
  });

  describe('updateCategory', () => {
    beforeEach(() => {
      req.params = { id: 'cat1' };
      req.body = { name: 'Updated Food' };
    });

    it('should update category successfully', async () => {
      const updatedCategory = {
        key: 'cat1',
        name: 'Updated Food',
        userId: 'userId123',
      };
      mockCategoryModel.findOneAndUpdate.mockResolvedValue(
        updatedCategory as any
      );

      await updateCategory(req as Request, res as Response);

      expect(mockCategoryModel.findOneAndUpdate).toHaveBeenCalledWith(
        { key: 'cat1', userId: 'userId123' },
        { name: 'Updated Food' },
        { new: true, runValidators: true }
      );
      expect(jsonMock).toHaveBeenCalledWith(updatedCategory);
    });

    it('should return 404 if category not found', async () => {
      mockCategoryModel.findOneAndUpdate.mockResolvedValue(null);

      await updateCategory(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Category not found' });
    });
  });

  describe('deleteCategory', () => {
    beforeEach(() => {
      req.params = { id: 'cat1' };
    });

    it('should delete category successfully', async () => {
      mockCategoryModel.findOneAndDelete.mockResolvedValue({
        key: 'cat1',
      } as any);

      await deleteCategory(req as Request, res as Response);

      expect(mockCategoryModel.findOneAndDelete).toHaveBeenCalledWith({
        key: 'cat1',
        userId: 'userId123',
      });
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Category deleted successfully',
      });
    });

    it('should return 404 if category not found', async () => {
      mockCategoryModel.findOneAndDelete.mockResolvedValue(null);

      await deleteCategory(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Category not found' });
    });
  });
});
