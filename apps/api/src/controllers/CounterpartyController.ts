/// <reference path="../index.d.ts" />

import type { Counterparty } from '@fintrak/types';
import type { Request, Response } from 'express';
import CounterpartyModel, {
  type ICounterparty,
} from '../models/CounterpartyModel';
import { requireAuth } from '../utils/authUtils';
import { handleGenericError, handleNotFoundError } from '../utils/errorUtils';

/** Fields inherited from parent when not set on child */
const INHERITED_FIELDS: (keyof Counterparty)[] = [
  'logo',
  'type',
  'titleTemplate',
];

/**
 * Resolve inherited fields from parent into child counterparty.
 * Returns a plain object with parent fields merged where the child has none.
 */
function resolveWithParent(
  child: ICounterparty,
  parent: ICounterparty | null
): Record<string, unknown> {
  const resolved = child.toJSON();
  if (!parent) return resolved;

  const parentJson = parent.toJSON();
  for (const field of INHERITED_FIELDS) {
    if (resolved[field] === undefined || resolved[field] === null) {
      resolved[field] = parentJson[field];
    }
  }
  return resolved;
}

/**
 * Validate that a parentKey references a valid parent counterparty
 * (must exist and not be a child itself).
 */
async function validateParent(
  parentKey: string,
  userId: string,
  res: Response
): Promise<ICounterparty | null> {
  const parent = await CounterpartyModel.findOne({
    key: parentKey,
    userId,
  });

  if (!parent) {
    res.status(400).json({ error: 'Parent counterparty not found' });
    return null;
  }

  if (parent.parentKey) {
    res
      .status(400)
      .json({ error: 'Parent counterparty cannot itself be a child' });
    return null;
  }

  return parent;
}

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
      parentKey,
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

    // Parent filter
    if (parentKey) {
      query.parentKey = parentKey;
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

    // Resolve inherited fields for child counterparties
    const parentKeys = [
      ...new Set(
        counterparties
          .map((cp) => cp.parentKey)
          .filter((pk): pk is string => !!pk)
      ),
    ];

    let parentMap = new Map<string, ICounterparty>();
    if (parentKeys.length > 0) {
      const parents = await CounterpartyModel.find({
        userId,
        key: { $in: parentKeys },
      });
      parentMap = new Map(parents.map((p) => [p.key, p]));
    }

    const resolved = counterparties.map((cp) =>
      resolveWithParent(cp, parentMap.get(cp.parentKey || '') || null)
    );

    res.json({
      counterparties: resolved,
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
        parentKey,
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

    // Resolve parent fields if child
    let parent: ICounterparty | null = null;
    if (counterparty.parentKey) {
      parent = await CounterpartyModel.findOne({
        key: counterparty.parentKey,
        userId,
      });
    }

    res.json(resolveWithParent(counterparty, parent));
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

    // Validate parent if provided
    if (counterpartyData.parentKey) {
      const parent = await validateParent(
        counterpartyData.parentKey,
        userId,
        res
      );
      if (!parent) return;
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

    // Validate parent if being updated
    if (updateData.parentKey) {
      const parent = await validateParent(updateData.parentKey, userId, res);
      if (!parent) return;

      // Prevent setting parentKey on a counterparty that has children
      const childCount = await CounterpartyModel.countDocuments({
        userId,
        parentKey: id,
      });
      if (childCount > 0) {
        return res.status(400).json({
          error:
            'Cannot set parent on a counterparty that has children (max 2 levels)',
        });
      }
    }

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

    // Orphan any children that referenced this parent
    await CounterpartyModel.updateMany(
      { userId, parentKey: id },
      { $unset: { parentKey: '' } }
    );

    res.json({ message: 'Counterparty deleted successfully' });
  } catch (error) {
    return handleGenericError(res, 'delete counterparty', error);
  }
};
