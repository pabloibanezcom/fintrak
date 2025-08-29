/// <reference path="../index.d.ts" />

import type { CreateIncomeRequest, UpdateIncomeRequest } from '@fintrak/types';
import type { Request, Response } from 'express';
import IncomeModel from '../models/IncomeModel';
import { requireAuth } from '../utils/authUtils';
import { handleGenericError, handleNotFoundError } from '../utils/errorUtils';
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

export const getIncomeById = async (req: Request, res: Response) => {
  try {
    const userId = requireAuth(req, res);
    if (!userId) return;

    const { id } = req.params;
    const income = await IncomeModel.findOne({ _id: id, userId });
    if (!income) {
      return handleNotFoundError(res, 'Income');
    }

    res.json(income);
  } catch (error) {
    return handleGenericError(res, 'fetch income', error);
  }
};

export const createIncome = async (req: Request, res: Response) => {
  try {
    const userId = requireAuth(req, res);
    if (!userId) return;

    const incomeData: CreateIncomeRequest = req.body;
    const income = new IncomeModel({ ...incomeData, userId });
    const savedIncome = await income.save();

    res.status(201).json(savedIncome);
  } catch (error) {
    return handleGenericError(res, 'create income', error);
  }
};

export const updateIncome = async (req: Request, res: Response) => {
  try {
    const userId = requireAuth(req, res);
    if (!userId) return;

    const { id } = req.params;
    const updateData: UpdateIncomeRequest = req.body;
    const income = await IncomeModel.findOneAndUpdate(
      { _id: id, userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!income) {
      return handleNotFoundError(res, 'Income');
    }

    res.json(income);
  } catch (error) {
    return handleGenericError(res, 'update income', error);
  }
};

export const deleteIncome = async (req: Request, res: Response) => {
  try {
    const userId = requireAuth(req, res);
    if (!userId) return;

    const { id } = req.params;
    const income = await IncomeModel.findOneAndDelete({ _id: id, userId });
    if (!income) {
      return handleNotFoundError(res, 'Income');
    }

    res.json({ message: 'Income deleted successfully' });
  } catch (error) {
    return handleGenericError(res, 'delete income', error);
  }
};

export const searchIncomes = async (req: Request, res: Response) => {
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
      source,
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
    if (source) query.source = source;
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
    const incomes = await IncomeModel.find(query)
      .populate('category', 'key name color icon')
      .populate('source', 'key name type')
      .sort(sort)
      .limit(pagination.limit)
      .skip(pagination.offset);

    // Get total count for pagination
    const totalCount = await IncomeModel.countDocuments(query);

    // Calculate total amount if requested
    let totalAmount = null;
    if (includeTotal === 'true') {
      const aggregationQuery = prepareAggregationQuery(query, [
        'category',
        'source',
      ]);
      const aggregation = await IncomeModel.aggregate([
        { $match: aggregationQuery },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]);
      totalAmount = aggregation.length > 0 ? aggregation[0].total : 0;
    }

    const response: any = {
      incomes,
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
        source,
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
    return handleGenericError(res, 'search incomes', error);
  }
};
