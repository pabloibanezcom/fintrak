/// <reference path="../index.d.ts" />

import type { Tag } from '@fintrak/types';
import type { Request, Response } from 'express';
import TagModel from '../models/TagModel';
import { requireAuth } from '../utils/authUtils';
import { logError } from '../utils/logging';

export const getTags = async (req: Request, res: Response) => {
  try {
    const userId = requireAuth(req, res);
    if (!userId) return;

    const tags = await TagModel.find({ userId }).sort({ name: 1 });
    res.json(tags);
  } catch (error) {
    logError('Error fetching tags:', error);
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
};

export const getTagById = async (req: Request, res: Response) => {
  try {
    const userId = requireAuth(req, res);
    if (!userId) return;

    const { id } = req.params;

    const tag = await TagModel.findOne({ key: id, userId });
    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    res.json(tag);
  } catch (error) {
    logError('Error fetching tag:', error);
    res.status(500).json({ error: 'Failed to fetch tag' });
  }
};

export const createTag = async (req: Request, res: Response) => {
  try {
    const userId = requireAuth(req, res);
    if (!userId) return;

    const tagData: Tag = req.body;

    // Check if tag with same key already exists for this user
    const existingTag = await TagModel.findOne({
      key: tagData.key,
      userId,
    });

    if (existingTag) {
      return res.status(409).json({
        error: 'Tag with this key already exists',
      });
    }

    const tag = new TagModel({
      ...tagData,
      userId,
    });

    const savedTag = await tag.save();
    res.status(201).json(savedTag);
  } catch (error) {
    logError('Error creating tag:', error);
    res.status(500).json({ error: 'Failed to create tag' });
  }
};

export const updateTag = async (req: Request, res: Response) => {
  try {
    const userId = requireAuth(req, res);
    if (!userId) return;

    const { id } = req.params;
    const updateData: Partial<Tag> = req.body;

    const tag = await TagModel.findOneAndUpdate(
      { key: id, userId },
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    res.json(tag);
  } catch (error) {
    logError('Error updating tag:', error);
    res.status(500).json({ error: 'Failed to update tag' });
  }
};

export const deleteTag = async (req: Request, res: Response) => {
  try {
    const userId = requireAuth(req, res);
    if (!userId) return;

    const { id } = req.params;

    const tag = await TagModel.findOneAndDelete({ key: id, userId });
    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    res.json({ message: 'Tag deleted successfully' });
  } catch (error) {
    logError('Error deleting tag:', error);
    res.status(500).json({ error: 'Failed to delete tag' });
  }
};
