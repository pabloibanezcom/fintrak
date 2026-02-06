/// <reference path="../index.d.ts" />

import type {
  CreateUserTransactionRequest,
  UpdateUserTransactionRequest,
} from '@fintrak/types';
import type { Request, Response } from 'express';
import CategoryModel from '../models/CategoryModel';
import CounterpartyModel from '../models/CounterpartyModel';
import UserTransactionModel from '../models/UserTransactionModel';
import { requireAuth } from '../utils/authUtils';
import {
  handleGenericError,
  handleNotFoundError,
  handleValidationError,
} from '../utils/errorUtils';

/**
 * Get a user transaction by ID
 */
export const getTransactionById = async (req: Request, res: Response) => {
  try {
    const userId = requireAuth(req, res);
    if (!userId) return;

    const { id } = req.params;
    const transaction = await UserTransactionModel.findOne({ _id: id, userId })
      .populate('category')
      .populate('counterparty');

    if (!transaction) {
      return handleNotFoundError(res, 'Transaction');
    }

    res.json(transaction);
  } catch (error) {
    return handleGenericError(res, 'fetch transaction', error);
  }
};

/**
 * Create a new user transaction
 */
export const createTransaction = async (req: Request, res: Response) => {
  try {
    const userId = requireAuth(req, res);
    if (!userId) return;

    const data: CreateUserTransactionRequest = req.body;

    // Validate and resolve category
    const category = await CategoryModel.findOne({
      key: data.category,
      userId,
    });
    if (!category) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    // Validate and resolve counterparty if provided
    let counterpartyId = null;
    if (data.counterparty) {
      const counterparty = await CounterpartyModel.findOne({
        key: data.counterparty,
        userId,
      });
      if (!counterparty) {
        return res.status(400).json({ error: 'Invalid counterparty' });
      }
      counterpartyId = counterparty._id;
    }

    const transaction = new UserTransactionModel({
      ...data,
      category: category._id,
      counterparty: counterpartyId,
      userId,
    });
    const savedTransaction = await transaction.save();

    // Populate before returning
    await savedTransaction.populate('category');
    await savedTransaction.populate('counterparty');

    res.status(201).json(savedTransaction);
  } catch (error) {
    return handleValidationError(res, error, 'transaction');
  }
};

/**
 * Update a user transaction
 */
export const updateTransaction = async (req: Request, res: Response) => {
  try {
    const userId = requireAuth(req, res);
    if (!userId) return;

    const { id } = req.params;
    const data: UpdateUserTransactionRequest = req.body;

    // Build update object, resolving category and counterparty if provided
    const updateData: Record<string, unknown> = { ...data };

    if (data.category) {
      const category = await CategoryModel.findOne({
        key: data.category,
        userId,
      });
      if (!category) {
        return res.status(400).json({ error: 'Invalid category' });
      }
      updateData.category = category._id;
    }

    if (data.counterparty !== undefined) {
      if (data.counterparty) {
        const counterparty = await CounterpartyModel.findOne({
          key: data.counterparty,
          userId,
        });
        if (!counterparty) {
          return res.status(400).json({ error: 'Invalid counterparty' });
        }
        updateData.counterparty = counterparty._id;
      } else {
        updateData.counterparty = null;
      }
    }

    const transaction = await UserTransactionModel.findOneAndUpdate(
      { _id: id, userId },
      updateData,
      { new: true, runValidators: true }
    )
      .populate('category')
      .populate('counterparty');

    if (!transaction) {
      return handleNotFoundError(res, 'Transaction');
    }

    res.json(transaction);
  } catch (error) {
    return handleGenericError(res, 'update transaction', error);
  }
};

/**
 * Delete a user transaction
 */
export const deleteTransaction = async (req: Request, res: Response) => {
  try {
    const userId = requireAuth(req, res);
    if (!userId) return;

    const { id } = req.params;
    const transaction = await UserTransactionModel.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!transaction) {
      return handleNotFoundError(res, 'Transaction');
    }

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    return handleGenericError(res, 'delete transaction', error);
  }
};

/**
 * Search/list user transactions with filters
 */
export const searchTransactions = async (req: Request, res: Response) => {
  try {
    const userId = requireAuth(req, res);
    if (!userId) return;

    const {
      type,
      category,
      counterparty,
      from,
      to,
      minAmount,
      maxAmount,
      search,
      limit = '50',
      offset = '0',
      sortBy = 'date',
      sortOrder = 'desc',
    } = req.query;

    // Build query
    const query: Record<string, unknown> = { userId };

    if (type && (type === 'expense' || type === 'income')) {
      query.type = type;
    }

    if (category) {
      const cat = await CategoryModel.findOne({
        key: category as string,
        userId,
      });
      if (cat) {
        query.category = cat._id;
      }
    }

    if (counterparty) {
      const cp = await CounterpartyModel.findOne({
        key: counterparty as string,
        userId,
      });
      if (cp) {
        query.counterparty = cp._id;
      }
    }

    if (from || to) {
      query.date = {};
      if (from)
        (query.date as Record<string, Date>).$gte = new Date(from as string);
      if (to)
        (query.date as Record<string, Date>).$lte = new Date(to as string);
    }

    if (minAmount || maxAmount) {
      query.amount = {};
      if (minAmount)
        (query.amount as Record<string, number>).$gte = Number(minAmount);
      if (maxAmount)
        (query.amount as Record<string, number>).$lte = Number(maxAmount);
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Build sort
    const validSortFields = ['date', 'amount', 'title', 'createdAt'];
    const sortField = validSortFields.includes(sortBy as string)
      ? sortBy
      : 'date';
    const sort: Record<string, 1 | -1> = {
      [sortField as string]: sortOrder === 'asc' ? 1 : -1,
    };

    // Execute query
    const [transactions, total] = await Promise.all([
      UserTransactionModel.find(query)
        .sort(sort)
        .skip(Number(offset))
        .limit(Number(limit))
        .populate('category')
        .populate('counterparty'),
      UserTransactionModel.countDocuments(query),
    ]);

    res.json({
      transactions,
      pagination: {
        total,
        limit: Number(limit),
        offset: Number(offset),
        hasMore: Number(offset) + transactions.length < total,
      },
    });
  } catch (error) {
    return handleGenericError(res, 'search transactions', error);
  }
};

/**
 * Get transaction linked to a bank transaction
 */
export const getLinkedTransaction = async (req: Request, res: Response) => {
  try {
    const userId = requireAuth(req, res);
    if (!userId) return;

    const { bankTransactionId } = req.params;
    const transaction = await UserTransactionModel.findOne({
      bankTransactionId,
      userId,
    })
      .populate('category')
      .populate('counterparty');

    res.json({
      linked: !!transaction,
      transaction: transaction || null,
    });
  } catch (error) {
    return handleGenericError(res, 'fetch linked transaction', error);
  }
};
