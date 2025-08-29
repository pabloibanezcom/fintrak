/// <reference path="../index.d.ts" />

import type {
  CreateExpenseRequest,
  UpdateExpenseRequest,
} from '@fintrak/types';
import type { Request, Response } from 'express';
import ExpenseModel from '../models/ExpenseModel';
import { requireAuth } from '../utils/authUtils';
import {
  handleGenericError,
  handleNotFoundError,
  handleValidationError,
} from '../utils/errorUtils';
import { prepareAggregationQuery } from '../utils/mongoUtils';
import {
  buildAmountRangeQuery,
  buildDateRangeQuery,
  buildSortObject,
  buildTagsQuery,
  buildTextSearchQuery,
  createPaginationResponse,
  parsePaginationParams,
  parseSortParams,
} from '../utils/queryUtils';

export const getExpenseById = async (req: Request, res: Response) => {
  try {
    const userId = requireAuth(req, res);
    if (!userId) return;

    const { id } = req.params;
    const expense = await ExpenseModel.findOne({ _id: id, userId });
    if (!expense) {
      return handleNotFoundError(res, 'Expense');
    }

    res.json(expense);
  } catch (error) {
    return handleGenericError(res, 'fetch expense', error);
  }
};

export const createExpense = async (req: Request, res: Response) => {
  try {
    const userId = requireAuth(req, res);
    if (!userId) return;

    const expenseData: CreateExpenseRequest = req.body;
    const expense = new ExpenseModel({ ...expenseData, userId });
    const savedExpense = await expense.save();

    res.status(201).json(savedExpense);
  } catch (error) {
    return handleValidationError(res, error, 'expense');
  }
};

export const updateExpense = async (req: Request, res: Response) => {
  try {
    const userId = requireAuth(req, res);
    if (!userId) return;

    const { id } = req.params;
    const updateData: UpdateExpenseRequest = req.body;
    const expense = await ExpenseModel.findOneAndUpdate(
      { _id: id, userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!expense) {
      return handleNotFoundError(res, 'Expense');
    }

    res.json(expense);
  } catch (error) {
    return handleGenericError(res, 'update expense', error);
  }
};

export const deleteExpense = async (req: Request, res: Response) => {
  try {
    const userId = requireAuth(req, res);
    if (!userId) return;

    const { id } = req.params;
    const expense = await ExpenseModel.findOneAndDelete({ _id: id, userId });
    if (!expense) {
      return handleNotFoundError(res, 'Expense');
    }

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    return handleGenericError(res, 'delete expense', error);
  }
};

export const searchExpenses = async (req: Request, res: Response) => {
  try {
    const userId = requireAuth(req, res);
    if (!userId) return;

    const {
      title,
      dateFrom,
      dateTo,
      amountMin,
      amountMax,
      currency,
      category,
      payee,
      periodicity,
      tags,
      description,
      includeTotal = 'false',
    } = req.query;

    // Build query object
    const query: any = { userId };

    // Text search filters
    const titleQuery = buildTextSearchQuery(title as string);
    if (titleQuery) query.title = titleQuery;

    const descQuery = buildTextSearchQuery(description as string);
    if (descQuery) query.description = descQuery;

    // Date and amount range filters
    const dateQuery = buildDateRangeQuery(dateFrom as string, dateTo as string);
    if (dateQuery) query.date = dateQuery;

    const amountQuery = buildAmountRangeQuery(
      amountMin as string,
      amountMax as string
    );
    if (amountQuery) query.amount = amountQuery;

    // Direct field filters
    if (currency) query.currency = currency;
    if (category) query.category = category;
    if (payee) query.payee = payee;
    if (periodicity) query.periodicity = periodicity;

    // Tags filter
    const tagsQuery = buildTagsQuery(tags as string | string[]);
    if (tagsQuery) query['tags.key'] = tagsQuery;

    // Parse pagination and sorting
    const pagination = parsePaginationParams(req);
    const sortParams = parseSortParams(req, [
      'date',
      'amount',
      'title',
      'createdAt',
    ]);
    const sort = buildSortObject(sortParams);

    // Execute query with pagination
    const expenses = await ExpenseModel.find(query)
      .populate('category', 'key name color icon')
      .populate('payee', 'key name type')
      .sort(sort)
      .limit(pagination.limit)
      .skip(pagination.offset);

    // Get total count for pagination
    const totalCount = await ExpenseModel.countDocuments(query);

    // Calculate total amount if requested
    let totalAmount = null;
    if (includeTotal === 'true') {
      const aggregationQuery = prepareAggregationQuery(query, [
        'category',
        'payee',
      ]);
      const aggregation = await ExpenseModel.aggregate([
        { $match: aggregationQuery },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]);
      totalAmount = aggregation.length > 0 ? aggregation[0].total : 0;
    }

    const response: any = {
      expenses,
      pagination: createPaginationResponse(
        totalCount,
        pagination.limit,
        pagination.offset
      ),
      filters: {
        title,
        dateFrom,
        dateTo,
        amountMin,
        amountMax,
        currency,
        category,
        payee,
        periodicity,
        tags,
        description,
      },
      sort: {
        sortBy: sortParams.sortBy,
        sortOrder: sortParams.sortOrder,
      },
    };

    if (totalAmount !== null) {
      response.totalAmount = totalAmount;
    }

    res.json(response);
  } catch (error) {
    return handleGenericError(res, 'search expenses', error);
  }
};
