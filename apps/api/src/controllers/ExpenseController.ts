/// <reference path="../index.d.ts" />

import type {
  CreateExpenseRequest,
  UpdateExpenseRequest,
} from '@fintrak/types';
import type { Request, Response } from 'express';
import ExpenseModel from '../models/ExpenseModel';

export const getExpenseById = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const { id } = req.params;

    const expense = await ExpenseModel.findOne({ _id: id, userId });
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.json(expense);
  } catch (error) {
    console.error('Error fetching expense:', error);
    res.status(500).json({ error: 'Failed to fetch expense' });
  }
};

export const createExpense = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const expenseData: CreateExpenseRequest = req.body;

    const expense = new ExpenseModel({
      ...expenseData,
      userId,
    });

    const savedExpense = await expense.save();
    res.status(201).json(savedExpense);
  } catch (error) {
    console.error('Error creating expense:', error);
    if (
      error instanceof Error &&
      'name' in error &&
      error.name === 'ValidationError'
    ) {
      res
        .status(400)
        .json({ error: 'Validation failed', details: error.message });
    } else {
      res.status(500).json({ error: 'Failed to create expense' });
    }
  }
};

export const updateExpense = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const { id } = req.params;
    const updateData: UpdateExpenseRequest = req.body;

    const expense = await ExpenseModel.findOneAndUpdate(
      { _id: id, userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.json(expense);
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({ error: 'Failed to update expense' });
  }
};

export const deleteExpense = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const { id } = req.params;

    const expense = await ExpenseModel.findOneAndDelete({ _id: id, userId });
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
};

export const searchExpenses = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

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
      limit = 50,
      offset = 0,
      sortBy = 'date',
      sortOrder = 'desc',
      includeTotal = 'false',
    } = req.query;

    // Build query object
    const query: any = { userId };

    // Text search on title and description
    if (title) {
      query.title = { $regex: title, $options: 'i' };
    }
    if (description) {
      query.description = { $regex: description, $options: 'i' };
    }

    // Date range filter
    if (dateFrom || dateTo) {
      query.date = {};
      if (dateFrom) {
        query.date.$gte = new Date(dateFrom as string);
      }
      if (dateTo) {
        query.date.$lte = new Date(dateTo as string);
      }
    }

    // Amount range filter
    if (amountMin !== undefined || amountMax !== undefined) {
      query.amount = {};
      if (amountMin !== undefined) {
        query.amount.$gte = Number(amountMin);
      }
      if (amountMax !== undefined) {
        query.amount.$lte = Number(amountMax);
      }
    }

    // Currency filter
    if (currency) {
      query.currency = currency;
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Payee filter
    if (payee) {
      query.payee = payee;
    }

    // Periodicity filter
    if (periodicity) {
      query.periodicity = periodicity;
    }

    // Tags filter (match any of the provided tags)
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      query['tags.key'] = { $in: tagArray };
    }

    // Build sort object
    const sort: any = {};
    const validSortFields = ['date', 'amount', 'title', 'createdAt'];
    const sortField = validSortFields.includes(sortBy as string)
      ? (sortBy as string)
      : 'date';
    sort[sortField] = sortOrder === 'asc' ? 1 : -1;

    // Execute query with pagination
    const expenses = await ExpenseModel.find(query)
      .populate('category', 'key name color icon')
      .populate('payee', 'key name type')
      .sort(sort)
      .limit(Number(limit))
      .skip(Number(offset));

    // Get total count for pagination
    const totalCount = await ExpenseModel.countDocuments(query);

    // Calculate total amount if requested
    let totalAmount = null;
    if (includeTotal === 'true') {
      // Create a clean query object for aggregation (convert ObjectIds properly)
      const aggregationQuery = { ...query };
      
      // Convert category and payee to ObjectId if they're strings
      if (aggregationQuery.category && typeof aggregationQuery.category === 'string') {
        const mongoose = require('mongoose');
        if (mongoose.Types.ObjectId.isValid(aggregationQuery.category)) {
          aggregationQuery.category = new mongoose.Types.ObjectId(aggregationQuery.category);
        }
      }
      
      if (aggregationQuery.payee && typeof aggregationQuery.payee === 'string') {
        const mongoose = require('mongoose');
        if (mongoose.Types.ObjectId.isValid(aggregationQuery.payee)) {
          aggregationQuery.payee = new mongoose.Types.ObjectId(aggregationQuery.payee);
        }
      }
      
      const aggregation = await ExpenseModel.aggregate([
        { $match: aggregationQuery },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' },
          },
        },
      ]);
      totalAmount = aggregation.length > 0 ? aggregation[0].total : 0;
    }

    const response: any = {
      expenses,
      pagination: {
        total: totalCount,
        limit: Number(limit),
        offset: Number(offset),
        hasMore: Number(offset) + Number(limit) < totalCount,
      },
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
        sortBy: sortField,
        sortOrder,
      },
    };

    if (totalAmount !== null) {
      response.totalAmount = totalAmount;
    }

    res.json(response);
  } catch (error) {
    console.error('Error searching expenses:', error);
    res.status(500).json({ error: 'Failed to search expenses' });
  }
};
