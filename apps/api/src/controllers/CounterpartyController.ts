/// <reference path="../index.d.ts" />

import type { Counterparty } from '@fintrak/types';
import type { Request, Response } from 'express';
import CounterpartyModel from '../models/CounterpartyModel';
import { requireAuth } from '../utils/authUtils';
import { handleGenericError, handleNotFoundError } from '../utils/errorUtils';

export const searchCounterparties = async (req: Request, res: Response) => {
  try {
    const userId = requireAuth(req, res);
    if (!userId) return;

    const {
      name,
      type,
      email,
      phone,
      address,
      notes,
      titleTemplate,
      limit = 50,
      offset = 0,
      sortBy = 'name',
      sortOrder = 'asc',
    } = req.query;

    // Build query object
    const query: any = { userId };

    // Text search filters
    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }
    if (email) {
      query.email = { $regex: email, $options: 'i' };
    }
    if (phone) {
      query.phone = { $regex: phone, $options: 'i' };
    }
    if (address) {
      query.address = { $regex: address, $options: 'i' };
    }
    if (notes) {
      query.notes = { $regex: notes, $options: 'i' };
    }
    if (titleTemplate) {
      query.titleTemplate = { $regex: titleTemplate, $options: 'i' };
    }

    // Type filter
    if (type) {
      query.type = type;
    }

    // Build sort object
    const sort: any = {};
    const validSortFields = ['name', 'type', 'key', 'createdAt', 'updatedAt'];
    const sortField = validSortFields.includes(sortBy as string)
      ? (sortBy as string)
      : 'name';
    sort[sortField] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const counterparties = await CounterpartyModel.find(query)
      .sort(sort)
      .limit(Number(limit))
      .skip(Number(offset));

    // Get total count for pagination
    const totalCount = await CounterpartyModel.countDocuments(query);

    res.json({
      counterparties,
      pagination: {
        total: totalCount,
        limit: Number(limit),
        offset: Number(offset),
        hasMore: Number(offset) + Number(limit) < totalCount,
      },
      filters: {
        name,
        type,
        email,
        phone,
        address,
        notes,
        titleTemplate,
      },
      sort: {
        sortBy: sortField,
        sortOrder,
      },
    });
  } catch (error) {
    return handleGenericError(res, 'search counterparties', error);
  }
};

export const getCounterpartyById = async (req: Request, res: Response) => {
  try {
    const userId = requireAuth(req, res);
    if (!userId) return;
    const { id } = req.params;

    const counterparty = await CounterpartyModel.findOne({ key: id, userId });
    if (!counterparty) {
      return handleNotFoundError(res, 'Counterparty');
    }

    res.json(counterparty);
  } catch (error) {
    return handleGenericError(res, 'fetch counterparty', error);
  }
};

export const createCounterparty = async (req: Request, res: Response) => {
  try {
    const userId = requireAuth(req, res);
    if (!userId) return;
    const counterpartyData: Counterparty = req.body;

    // Check if counterparty with same key already exists for this user
    const existingCounterparty = await CounterpartyModel.findOne({
      key: counterpartyData.key,
      userId,
    });

    if (existingCounterparty) {
      return res.status(409).json({
        error: 'Counterparty with this key already exists',
      });
    }

    const counterparty = new CounterpartyModel({
      ...counterpartyData,
      userId,
    });

    const savedCounterparty = await counterparty.save();
    res.status(201).json(savedCounterparty);
  } catch (error) {
    return handleGenericError(res, 'create counterparty', error);
  }
};

export const updateCounterparty = async (req: Request, res: Response) => {
  try {
    const userId = requireAuth(req, res);
    if (!userId) return;
    const { id } = req.params;
    const updateData: Partial<Counterparty> = req.body;

    const counterparty = await CounterpartyModel.findOneAndUpdate(
      { key: id, userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!counterparty) {
      return handleNotFoundError(res, 'Counterparty');
    }

    res.json(counterparty);
  } catch (error) {
    return handleGenericError(res, 'update counterparty', error);
  }
};

export const deleteCounterparty = async (req: Request, res: Response) => {
  try {
    const userId = requireAuth(req, res);
    if (!userId) return;
    const { id } = req.params;

    const counterparty = await CounterpartyModel.findOneAndDelete({
      key: id,
      userId,
    });
    if (!counterparty) {
      return handleNotFoundError(res, 'Counterparty');
    }

    res.json({ message: 'Counterparty deleted successfully' });
  } catch (error) {
    return handleGenericError(res, 'delete counterparty', error);
  }
};
