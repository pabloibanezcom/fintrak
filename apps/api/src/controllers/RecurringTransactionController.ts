/// <reference path="../index.d.ts" />

import type {
  CreateRecurringTransactionRequest,
  UpdateRecurringTransactionRequest,
} from '@fintrak/types';
import type { Request, Response } from 'express';
import RecurringTransactionModel from '../models/RecurringTransactionModel';
import { requireAuth } from '../utils/authUtils';
import {
  handleGenericError,
  handleNotFoundError,
  handleValidationError,
} from '../utils/errorUtils';
import {
  buildSortObject,
  buildTextSearchQuery,
  createPaginationResponse,
  parsePaginationParams,
  parseSortParams,
} from '../utils/queryUtils';

export const getRecurringTransactionById = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = requireAuth(req, res);
    if (!userId) return;

    const { id } = req.params;
    const recurringTransaction = await RecurringTransactionModel.findOne({
      _id: id,
      userId,
    });
    if (!recurringTransaction) {
      return handleNotFoundError(res, 'RecurringTransaction');
    }

    res.json(recurringTransaction);
  } catch (error) {
    return handleGenericError(res, 'fetch recurring transaction', error);
  }
};

export const createRecurringTransaction = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = requireAuth(req, res);
    if (!userId) return;

    const recurringTransactionData: CreateRecurringTransactionRequest =
      req.body;

    const recurringTransaction = new RecurringTransactionModel({
      ...recurringTransactionData,
      userId,
    });
    const savedRecurringTransaction = await recurringTransaction.save();

    res.status(201).json(savedRecurringTransaction);
  } catch (error) {
    return handleValidationError(res, error, 'recurring transaction');
  }
};

export const updateRecurringTransaction = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = requireAuth(req, res);
    if (!userId) return;

    const { id } = req.params;
    const updateData: UpdateRecurringTransactionRequest = req.body;
    const recurringTransaction =
      await RecurringTransactionModel.findOneAndUpdate(
        { _id: id, userId },
        updateData,
        { new: true, runValidators: true }
      );

    if (!recurringTransaction) {
      return handleNotFoundError(res, 'RecurringTransaction');
    }

    res.json(recurringTransaction);
  } catch (error) {
    return handleGenericError(res, 'update recurring transaction', error);
  }
};

export const deleteRecurringTransaction = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = requireAuth(req, res);
    if (!userId) return;

    const { id } = req.params;
    const recurringTransaction =
      await RecurringTransactionModel.findOneAndDelete({ _id: id, userId });
    if (!recurringTransaction) {
      return handleNotFoundError(res, 'RecurringTransaction');
    }

    res.json({ message: 'Recurring transaction deleted successfully' });
  } catch (error) {
    return handleGenericError(res, 'delete recurring transaction', error);
  }
};

export const searchRecurringTransactions = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = requireAuth(req, res);
    if (!userId) return;

    const { title, currency, category, transactionType } = req.query;

    // Build query object
    const query: any = { userId };

    // Text search filters
    const titleQuery = buildTextSearchQuery(title as string);
    if (titleQuery) query.title = titleQuery;

    // Direct field filters
    if (currency) query.currency = currency;
    if (category) query.category = category;
    if (transactionType) query.transactionType = transactionType;

    // Parse pagination and sorting
    const pagination = parsePaginationParams(req);
    const sortParams = parseSortParams(req, ['title', 'createdAt']);
    const sort = buildSortObject(sortParams);

    // Execute query with pagination
    const recurringTransactions = await RecurringTransactionModel.find(query)
      .populate('category', 'key name color icon')
      .sort(sort)
      .limit(pagination.limit)
      .skip(pagination.offset);

    // Get total count for pagination
    const totalCount = await RecurringTransactionModel.countDocuments(query);

    const response: any = {
      recurringTransactions,
      pagination: createPaginationResponse(
        totalCount,
        pagination.limit,
        pagination.offset
      ),
      filters: {
        title,
        currency,
        category,
        transactionType,
      },
      sort: {
        sortBy: sortParams.sortBy,
        sortOrder: sortParams.sortOrder,
      },
    };

    res.json(response);
  } catch (error) {
    return handleGenericError(res, 'search recurring transactions', error);
  }
};
