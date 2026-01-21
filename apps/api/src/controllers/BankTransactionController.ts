/// <reference path="../index.d.ts" />
import type { Request, Response } from 'express';
import BankTransaction from '../models/BankTransactionModel';

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
      if (from) (query.timestamp as Record<string, Date>).$gte = new Date(from as string);
      if (to) (query.timestamp as Record<string, Date>).$lte = new Date(to as string);
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
      if (from) (matchStage.timestamp as Record<string, Date>).$gte = new Date(from as string);
      if (to) (matchStage.timestamp as Record<string, Date>).$lte = new Date(to as string);
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
            $sum: { $cond: [{ $eq: ['$type', 'DEBIT'] }, { $abs: '$amount' }, 0] },
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

export default {
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getTransactionStats,
};
