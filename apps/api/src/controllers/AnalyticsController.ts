/// <reference path="../index.d.ts" />

import type { Request, Response } from 'express';
import UserTransactionModel from '../models/UserTransactionModel';
import { requireAuth } from '../utils/authUtils';
import { handleGenericError } from '../utils/errorUtils';
import { buildDateRangeQuery } from '../utils/queryUtils';

export const getPeriodSummary = async (req: Request, res: Response) => {
  try {
    const userId = requireAuth(req, res);
    if (!userId) return;

    const { dateFrom, dateTo, currency, latestCount = '5' } = req.query;

    if (!dateFrom || !dateTo) {
      return res.status(400).json({
        error: 'dateFrom and dateTo query parameters are required',
      });
    }

    // Build base query
    const baseQuery: any = { userId };
    const dateQuery = buildDateRangeQuery(dateFrom as string, dateTo as string);
    if (dateQuery) baseQuery.date = dateQuery;
    if (currency) baseQuery.currency = currency;

    // Get expenses with category totals
    const expenseAggregation = await UserTransactionModel.aggregate([
      { $match: { ...baseQuery, type: 'expense' } },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'category',
        },
      },
      { $unwind: '$category' },
      {
        $project: {
          _id: 0,
          categoryId: '$_id',
          categoryKey: '$category.key',
          categoryName: '$category.name',
          categoryColor: '$category.color',
          categoryIcon: '$category.icon',
          total: 1,
          count: 1,
        },
      },
      { $sort: { total: -1 } },
    ]);

    // Get incomes with category totals
    const incomeAggregation = await UserTransactionModel.aggregate([
      { $match: { ...baseQuery, type: 'income' } },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'category',
        },
      },
      { $unwind: '$category' },
      {
        $project: {
          _id: 0,
          categoryId: '$_id',
          categoryKey: '$category.key',
          categoryName: '$category.name',
          categoryColor: '$category.color',
          categoryIcon: '$category.icon',
          total: 1,
          count: 1,
        },
      },
      { $sort: { total: -1 } },
    ]);

    // Calculate totals
    const totalExpenses = expenseAggregation.reduce(
      (sum, item) => sum + item.total,
      0
    );
    const totalIncomes = incomeAggregation.reduce(
      (sum, item) => sum + item.total,
      0
    );

    // Get latest transactions (both expenses and incomes)
    const limit = Number.parseInt(latestCount as string, 10);
    const latestTransactions = await UserTransactionModel.find(baseQuery)
      .populate('category', 'key name color icon')
      .populate('counterparty', 'key name type logo')
      .sort({ date: -1 })
      .limit(limit)
      .lean();

    res.json({
      period: {
        from: dateFrom,
        to: dateTo,
        currency: currency || 'all',
      },
      expenses: {
        total: totalExpenses,
        byCategory: expenseAggregation,
      },
      incomes: {
        total: totalIncomes,
        byCategory: incomeAggregation,
      },
      balance: totalIncomes - totalExpenses,
      latestTransactions,
    });
  } catch (error) {
    return handleGenericError(res, 'fetch period summary', error);
  }
};
