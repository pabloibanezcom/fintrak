/// <reference path="../index.d.ts" />
import type { Request, Response } from 'express';
import BankTransaction from '../models/BankTransactionModel';
import CategoryModel from '../models/CategoryModel';
import CounterpartyModel from '../models/CounterpartyModel';
import UserTransactionModel from '../models/UserTransactionModel';

/**
 * Get all bank transactions for the authenticated user
 * GET /api/bank-transactions
 */
export const getAllTransactions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const {
      accountId,
      bankId,
      type,
      processed,
      from,
      to,
      search,
      limit = '50',
      offset = '0',
    } = req.query;

    const query: Record<string, unknown> = { userId };

    if (accountId) query.accountId = accountId;
    if (bankId) query.bankId = bankId;
    if (type) query.type = type;
    if (processed !== undefined) query.processed = processed === 'true';
    if (from || to) {
      query.timestamp = {};
      if (from)
        (query.timestamp as Record<string, Date>).$gte = new Date(
          from as string
        );
      if (to)
        (query.timestamp as Record<string, Date>).$lte = new Date(to as string);
    }
    if (search) {
      const searchRegex = new RegExp(search as string, 'i');
      query.$or = [{ description: searchRegex }, { merchantName: searchRegex }];
    }

    const transactions = await BankTransaction.find(query)
      .sort({ timestamp: -1 })
      .skip(Number(offset))
      .limit(Number(limit));

    const total = await BankTransaction.countDocuments(query);

    res.json({
      transactions,
      pagination: {
        total,
        limit: Number(limit),
        offset: Number(offset),
      },
    });
  } catch (error) {
    console.error('Error fetching bank transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

/**
 * Get a single bank transaction by ID
 * GET /api/bank-transactions/:id
 */
export const getTransactionById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;

    const transaction = await BankTransaction.findOne({ _id: id, userId });

    if (!transaction) {
      res.status(404).json({ error: 'Transaction not found' });
      return;
    }

    res.json(transaction);
  } catch (error) {
    console.error('Error fetching bank transaction:', error);
    res.status(500).json({ error: 'Failed to fetch transaction' });
  }
};

/**
 * Update a bank transaction (e.g., mark as processed)
 * PATCH /api/bank-transactions/:id
 */
export const updateTransaction = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const { processed, notified } = req.body;

    const updateFields: Record<string, boolean> = {};
    if (processed !== undefined) updateFields.processed = processed;
    if (notified !== undefined) updateFields.notified = notified;

    const transaction = await BankTransaction.findOneAndUpdate(
      { _id: id, userId },
      { $set: updateFields },
      { new: true }
    );

    if (!transaction) {
      res.status(404).json({ error: 'Transaction not found' });
      return;
    }

    res.json(transaction);
  } catch (error) {
    console.error('Error updating bank transaction:', error);
    res.status(500).json({ error: 'Failed to update transaction' });
  }
};

/**
 * Delete a bank transaction
 * DELETE /api/bank-transactions/:id
 */
export const deleteTransaction = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;

    const transaction = await BankTransaction.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!transaction) {
      res.status(404).json({ error: 'Transaction not found' });
      return;
    }

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Error deleting bank transaction:', error);
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
};

/**
 * Get transaction statistics
 * GET /api/bank-transactions/stats
 */
export const getTransactionStats = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { from, to, bankId, accountId } = req.query;

    const matchStage: Record<string, unknown> = { userId };
    if (bankId) matchStage.bankId = bankId;
    if (accountId) matchStage.accountId = accountId;
    if (from || to) {
      matchStage.timestamp = {};
      if (from)
        (matchStage.timestamp as Record<string, Date>).$gte = new Date(
          from as string
        );
      if (to)
        (matchStage.timestamp as Record<string, Date>).$lte = new Date(
          to as string
        );
    }

    const stats = await BankTransaction.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalTransactions: { $sum: 1 },
          totalCredits: {
            $sum: { $cond: [{ $eq: ['$type', 'CREDIT'] }, '$amount', 0] },
          },
          totalDebits: {
            $sum: {
              $cond: [{ $eq: ['$type', 'DEBIT'] }, { $abs: '$amount' }, 0],
            },
          },
          creditCount: {
            $sum: { $cond: [{ $eq: ['$type', 'CREDIT'] }, 1, 0] },
          },
          debitCount: {
            $sum: { $cond: [{ $eq: ['$type', 'DEBIT'] }, 1, 0] },
          },
          processedCount: {
            $sum: { $cond: ['$processed', 1, 0] },
          },
          unprocessedCount: {
            $sum: { $cond: ['$processed', 0, 1] },
          },
        },
      },
    ]);

    res.json(
      stats[0] || {
        totalTransactions: 0,
        totalCredits: 0,
        totalDebits: 0,
        creditCount: 0,
        debitCount: 0,
        processedCount: 0,
        unprocessedCount: 0,
      }
    );
  } catch (error) {
    console.error('Error fetching transaction stats:', error);
    res.status(500).json({ error: 'Failed to fetch transaction stats' });
  }
};

/**
 * Create a user transaction (expense/income) from a bank transaction
 * POST /api/bank-transactions/:id/create-transaction
 */
export const createTransactionFromBankTransaction = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const { category, counterparty, title, tags, description } = req.body;

    // 1. Find the bank transaction
    const bankTransaction = await BankTransaction.findOne({ _id: id, userId });
    if (!bankTransaction) {
      res.status(404).json({ error: 'Bank transaction not found' });
      return;
    }

    // 2. Check if already linked to a user transaction
    const existingTransaction = await UserTransactionModel.findOne({
      bankTransactionId: id,
      userId,
    });
    if (existingTransaction) {
      res.status(409).json({
        error: 'Bank transaction already linked to a transaction',
        transactionId: existingTransaction._id,
      });
      return;
    }

    // 3. Validate required fields
    if (!category) {
      res.status(400).json({ error: 'Category is required' });
      return;
    }

    // 4. Resolve category by key
    const categoryDoc = await CategoryModel.findOne({ key: category, userId });
    if (!categoryDoc) {
      res.status(400).json({ error: 'Invalid category' });
      return;
    }

    // 5. Resolve counterparty by key if provided
    let counterpartyId = null;
    if (counterparty) {
      const counterpartyDoc = await CounterpartyModel.findOne({
        key: counterparty,
        userId,
      });
      if (!counterpartyDoc) {
        res.status(400).json({ error: 'Invalid counterparty' });
        return;
      }
      counterpartyId = counterpartyDoc._id;
    }

    // 6. Determine type from bank transaction (DEBIT -> expense, CREDIT -> income)
    const type = bankTransaction.type === 'DEBIT' ? 'expense' : 'income';

    // 7. Create the user transaction
    const userTransaction = new UserTransactionModel({
      type,
      title:
        title || bankTransaction.merchantName || bankTransaction.description,
      amount: Math.abs(bankTransaction.amount),
      currency: bankTransaction.currency,
      category: categoryDoc._id,
      counterparty: counterpartyId,
      date: bankTransaction.timestamp,
      periodicity: 'NOT_RECURRING',
      description:
        description ||
        `From bank transaction: ${bankTransaction.merchantName || bankTransaction.description}`,
      tags: tags || [],
      bankTransactionId: bankTransaction._id,
      userId,
    });

    const savedTransaction = await userTransaction.save();

    // Populate before returning
    await savedTransaction.populate('category');
    await savedTransaction.populate('counterparty');

    res.status(201).json(savedTransaction);
  } catch (error) {
    console.error('Error creating transaction from bank transaction:', error);
    if ((error as { code?: number }).code === 11000) {
      res
        .status(409)
        .json({ error: 'Bank transaction already linked to a transaction' });
      return;
    }
    res.status(500).json({ error: 'Failed to create transaction' });
  }
};

/**
 * Get the linked user transaction for a bank transaction
 * GET /api/bank-transactions/:id/linked
 */
export const getLinkedTransaction = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;

    // Check bank transaction exists
    const bankTransaction = await BankTransaction.findOne({ _id: id, userId });
    if (!bankTransaction) {
      res.status(404).json({ error: 'Bank transaction not found' });
      return;
    }

    // Look for linked user transaction
    const userTransaction = await UserTransactionModel.findOne({
      bankTransactionId: id,
      userId,
    })
      .populate('category')
      .populate('counterparty');

    if (userTransaction) {
      res.json({
        linked: true,
        transaction: userTransaction,
      });
      return;
    }

    res.json({ linked: false, transaction: null });
  } catch (error) {
    console.error('Error fetching linked transaction:', error);
    res.status(500).json({ error: 'Failed to fetch linked transaction' });
  }
};

export default {
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getTransactionStats,
  createTransactionFromBankTransaction,
  getLinkedTransaction,
};
