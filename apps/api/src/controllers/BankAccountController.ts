/// <reference path="../index.d.ts" />
import type { Request, Response } from 'express';
import BankAccount from '../models/BankAccountModel';
import { logError } from '../utils/logging';

/**
 * Get all bank accounts for the authenticated user
 * GET /api/bank-accounts
 */
export const getAllAccounts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { bankId } = req.query;

    const query: Record<string, unknown> = { userId };
    if (bankId) query.bankId = bankId;

    const accounts = await BankAccount.find(query).sort({
      bankName: 1,
      name: 1,
    });

    res.json(accounts);
  } catch (error) {
    logError('Error fetching bank accounts:', error);
    res.status(500).json({ error: 'Failed to fetch bank accounts' });
  }
};

/**
 * Get a single bank account by ID
 * GET /api/bank-accounts/:accountId
 */
export const getAccountById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { accountId } = req.params;

    const account = await BankAccount.findOne({ userId, accountId });

    if (!account) {
      res.status(404).json({ error: 'Account not found' });
      return;
    }

    res.json(account);
  } catch (error) {
    logError('Error fetching bank account:', error);
    res.status(500).json({ error: 'Failed to fetch bank account' });
  }
};

/**
 * Update a bank account (e.g., set alias)
 * PATCH /api/bank-accounts/:accountId
 */
export const updateAccount = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { accountId } = req.params;
    const { alias } = req.body;

    const updateFields: Record<string, string | undefined> = {};
    if (alias !== undefined) updateFields.alias = alias;

    const account = await BankAccount.findOneAndUpdate(
      { userId, accountId },
      { $set: updateFields },
      { new: true }
    );

    if (!account) {
      res.status(404).json({ error: 'Account not found' });
      return;
    }

    res.json(account);
  } catch (error) {
    logError('Error updating bank account:', error);
    res.status(500).json({ error: 'Failed to update bank account' });
  }
};

/**
 * Delete a bank account
 * DELETE /api/bank-accounts/:accountId
 */
export const deleteAccount = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { accountId } = req.params;

    const account = await BankAccount.findOneAndDelete({ userId, accountId });

    if (!account) {
      res.status(404).json({ error: 'Account not found' });
      return;
    }

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    logError('Error deleting bank account:', error);
    res.status(500).json({ error: 'Failed to delete bank account' });
  }
};

export default {
  getAllAccounts,
  getAccountById,
  updateAccount,
  deleteAccount,
};
