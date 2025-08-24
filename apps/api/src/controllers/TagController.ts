/// <reference path="../index.d.ts" />

import type { Tag } from '@fintrak/types';
import type { Request, Response } from 'express';
import TagModel from '../models/TagModel';

export const getTags = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const tags = await TagModel.find({ userId }).sort({ name: 1 });
    res.json(tags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
};

export const getTagById = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const { id } = req.params;

    const tag = await TagModel.findOne({ id, userId });
    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    res.json(tag);
  } catch (error) {
    console.error('Error fetching tag:', error);
    res.status(500).json({ error: 'Failed to fetch tag' });
  }
};

export const createTag = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const tagData: Tag = req.body;

    // Check if tag with same id already exists for this user
    const existingTag = await TagModel.findOne({
      id: tagData.id,
      userId,
    });

    if (existingTag) {
      return res.status(409).json({
        error: 'Tag with this ID already exists',
      });
    }

    const tag = new TagModel({
      ...tagData,
      userId,
    });

    const savedTag = await tag.save();
    res.status(201).json(savedTag);
  } catch (error) {
    console.error('Error creating tag:', error);
    res.status(500).json({ error: 'Failed to create tag' });
  }
};

export const updateTag = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const { id } = req.params;
    const updateData: Partial<Tag> = req.body;

    const tag = await TagModel.findOneAndUpdate({ id, userId }, updateData, {
      new: true,
      runValidators: true,
    });

    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    res.json(tag);
  } catch (error) {
    console.error('Error updating tag:', error);
    res.status(500).json({ error: 'Failed to update tag' });
  }
};

export const deleteTag = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const { id } = req.params;

    const tag = await TagModel.findOneAndDelete({ id, userId });
    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    res.json({ message: 'Tag deleted successfully' });
  } catch (error) {
    console.error('Error deleting tag:', error);
    res.status(500).json({ error: 'Failed to delete tag' });
  }
};
