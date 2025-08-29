/// <reference path="../index.d.ts" />

import type { Category } from '@fintrak/types';
import type { Request, Response } from 'express';
import CategoryModel from '../models/CategoryModel';
import { requireAuth } from '../utils/authUtils';
import { handleGenericError, handleNotFoundError } from '../utils/errorUtils';

export const getCategories = async (req: Request, res: Response) => {
  try {
    const userId = requireAuth(req, res);
    if (!userId) return;
    const categories = await CategoryModel.find({ userId }).sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    return handleGenericError(res, 'fetch categories', error);
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const userId = requireAuth(req, res);
    if (!userId) return;
    const { id } = req.params;

    const category = await CategoryModel.findOne({ key: id, userId });
    if (!category) {
      return handleNotFoundError(res, 'Category');
    }

    res.json(category);
  } catch (error) {
    return handleGenericError(res, 'fetch category', error);
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const userId = requireAuth(req, res);
    if (!userId) return;
    const categoryData: Category = req.body;

    // Check if category with same id already exists for this user
    const existingCategory = await CategoryModel.findOne({
      key: categoryData.key,
      userId,
    });

    if (existingCategory) {
      return res.status(409).json({
        error: 'Category with this ID already exists',
      });
    }

    const category = new CategoryModel({
      ...categoryData,
      userId,
    });

    const savedCategory = await category.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    return handleGenericError(res, 'create category', error);
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const userId = requireAuth(req, res);
    if (!userId) return;
    const { id } = req.params;
    const updateData: Partial<Category> = req.body;

    const category = await CategoryModel.findOneAndUpdate(
      { key: id, userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!category) {
      return handleNotFoundError(res, 'Category');
    }

    res.json(category);
  } catch (error) {
    return handleGenericError(res, 'update category', error);
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const userId = requireAuth(req, res);
    if (!userId) return;
    const { id } = req.params;

    const category = await CategoryModel.findOneAndDelete({ key: id, userId });
    if (!category) {
      return handleNotFoundError(res, 'Category');
    }

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    return handleGenericError(res, 'delete category', error);
  }
};
