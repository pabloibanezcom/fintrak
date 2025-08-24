/// <reference path="../index.d.ts" />

import type { Counterparty } from '@fintrak/types';
import type { Request, Response } from 'express';
import CounterpartyModel from '../models/CounterpartyModel';

export const getCounterparties = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const counterparties = await CounterpartyModel.find({ userId }).sort({
      name: 1,
    });
    res.json(counterparties);
  } catch (error) {
    console.error('Error fetching counterparties:', error);
    res.status(500).json({ error: 'Failed to fetch counterparties' });
  }
};

export const getCounterpartyById = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const { id } = req.params;

    const counterparty = await CounterpartyModel.findOne({ id, userId });
    if (!counterparty) {
      return res.status(404).json({ error: 'Counterparty not found' });
    }

    res.json(counterparty);
  } catch (error) {
    console.error('Error fetching counterparty:', error);
    res.status(500).json({ error: 'Failed to fetch counterparty' });
  }
};

export const createCounterparty = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const counterpartyData: Counterparty = req.body;

    // Check if counterparty with same id already exists for this user
    const existingCounterparty = await CounterpartyModel.findOne({
      id: counterpartyData.id,
      userId,
    });

    if (existingCounterparty) {
      return res.status(409).json({
        error: 'Counterparty with this ID already exists',
      });
    }

    const counterparty = new CounterpartyModel({
      ...counterpartyData,
      userId,
    });

    const savedCounterparty = await counterparty.save();
    res.status(201).json(savedCounterparty);
  } catch (error) {
    console.error('Error creating counterparty:', error);
    res.status(500).json({ error: 'Failed to create counterparty' });
  }
};

export const updateCounterparty = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const { id } = req.params;
    const updateData: Partial<Counterparty> = req.body;

    const counterparty = await CounterpartyModel.findOneAndUpdate(
      { id, userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!counterparty) {
      return res.status(404).json({ error: 'Counterparty not found' });
    }

    res.json(counterparty);
  } catch (error) {
    console.error('Error updating counterparty:', error);
    res.status(500).json({ error: 'Failed to update counterparty' });
  }
};

export const deleteCounterparty = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const { id } = req.params;

    const counterparty = await CounterpartyModel.findOneAndDelete({
      id,
      userId,
    });
    if (!counterparty) {
      return res.status(404).json({ error: 'Counterparty not found' });
    }

    res.json({ message: 'Counterparty deleted successfully' });
  } catch (error) {
    console.error('Error deleting counterparty:', error);
    res.status(500).json({ error: 'Failed to delete counterparty' });
  }
};
