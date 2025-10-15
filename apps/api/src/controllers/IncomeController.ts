/// <reference path="../index.d.ts" />

import type { CreateIncomeRequest, UpdateIncomeRequest } from '@fintrak/types';
import type { Request, Response } from 'express';
import IncomeModel from '../models/IncomeModel';
import { TransactionSearchService } from '../services/TransactionSearchService';
import { requireAuth } from '../utils/authUtils';
import { handleGenericError, handleNotFoundError } from '../utils/errorUtils';

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

    const result = await TransactionSearchService.search(req, userId, {
      model: IncomeModel,
      counterpartyField: 'source',
      responseKey: 'incomes',
    });

    res.json(result);
  } catch (error) {
    return handleGenericError(res, 'search incomes', error);
  }
};
