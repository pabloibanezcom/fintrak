/// <reference path="../index.d.ts" />

import type {
  CreateExpenseRequest,
  UpdateExpenseRequest,
} from '@fintrak/types';
import type { Request, Response } from 'express';
import ExpenseModel from '../models/ExpenseModel';
import { TransactionSearchService } from '../services/TransactionSearchService';
import { requireAuth } from '../utils/authUtils';
import {
  handleGenericError,
  handleNotFoundError,
  handleValidationError,
} from '../utils/errorUtils';

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

    const result = await TransactionSearchService.search(req, userId, {
      model: ExpenseModel,
      counterpartyField: 'payee',
      responseKey: 'expenses',
    });

    res.json(result);
  } catch (error) {
    return handleGenericError(res, 'search expenses', error);
  }
};
