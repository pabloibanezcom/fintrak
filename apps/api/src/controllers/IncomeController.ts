/// <reference path="../index.d.ts" />

import type { CreateIncomeRequest, UpdateIncomeRequest } from '@fintrak/types';
import type { Request, Response } from 'express';
import IncomeModel from '../models/IncomeModel';

export const getIncomeById = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const { id } = req.params;

    const income = await IncomeModel.findOne({ _id: id, userId });
    if (!income) {
      return res.status(404).json({ error: 'Income not found' });
    }

    res.json(income);
  } catch (error) {
    console.error('Error fetching income:', error);
    res.status(500).json({ error: 'Failed to fetch income' });
  }
};

export const createIncome = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const incomeData: CreateIncomeRequest = req.body;

    const income = new IncomeModel({
      ...incomeData,
      userId,
    });

    const savedIncome = await income.save();
    res.status(201).json(savedIncome);
  } catch (error) {
    console.error('Error creating income:', error);
    res.status(500).json({ error: 'Failed to create income' });
  }
};

export const updateIncome = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const { id } = req.params;
    const updateData: UpdateIncomeRequest = req.body;

    const income = await IncomeModel.findOneAndUpdate(
      { _id: id, userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!income) {
      return res.status(404).json({ error: 'Income not found' });
    }

    res.json(income);
  } catch (error) {
    console.error('Error updating income:', error);
    res.status(500).json({ error: 'Failed to update income' });
  }
};

export const deleteIncome = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const { id } = req.params;

    const income = await IncomeModel.findOneAndDelete({ _id: id, userId });
    if (!income) {
      return res.status(404).json({ error: 'Income not found' });
    }

    res.json({ message: 'Income deleted successfully' });
  } catch (error) {
    console.error('Error deleting income:', error);
    res.status(500).json({ error: 'Failed to delete income' });
  }
};

export const searchIncomes = async (req: Request, res: Response) => {
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
      source,
      periodicity,
      tags,
      description,
      limit = 50,
      offset = 0,
      sortBy = 'date',
      sortOrder = 'desc',
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

    // Source filter
    if (source) {
      query.source = source;
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
    const incomes = await IncomeModel.find(query)
      .populate('category', 'key name color icon')
      .populate('source', 'key name type')
      .sort(sort)
      .limit(Number(limit))
      .skip(Number(offset));

    // Get total count for pagination
    const totalCount = await IncomeModel.countDocuments(query);

    res.json({
      incomes,
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
        source,
        periodicity,
        tags,
        description,
      },
      sort: {
        sortBy: sortField,
        sortOrder,
      },
    });
  } catch (error) {
    console.error('Error searching incomes:', error);
    res.status(500).json({ error: 'Failed to search incomes' });
  }
};
