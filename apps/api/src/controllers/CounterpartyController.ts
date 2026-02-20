/// <reference path="../index.d.ts" />

import type { Counterparty } from '@fintrak/types';
import type { Request, Response } from 'express';
import CategoryModel from '../models/CategoryModel';
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

/**
 * Resolve a category key/object into a Category ObjectId reference.
 * Accepts key string, { key }, null/empty (to clear), or undefined (no change).
 */
async function resolveDefaultCategoryRef(
  defaultCategoryInput: unknown,
  userId: string,
  res: Response
): Promise<string | null | undefined> {
  if (defaultCategoryInput === undefined) return undefined;
  if (defaultCategoryInput === null || defaultCategoryInput === '') return null;

  let categoryKey: string | null = null;
  if (typeof defaultCategoryInput === 'string') {
    categoryKey = defaultCategoryInput;
  } else if (
    typeof defaultCategoryInput === 'object' &&
    defaultCategoryInput !== null &&
    'key' in defaultCategoryInput &&
    typeof (defaultCategoryInput as { key?: unknown }).key === 'string'
  ) {
    categoryKey = (defaultCategoryInput as { key: string }).key;
  }

  if (!categoryKey) {
    res.status(400).json({ error: 'defaultCategory must be a category key' });
    return undefined;
  }

  const category = await CategoryModel.findOne({ key: categoryKey, userId });
  if (!category) {
    res.status(400).json({ error: 'Default category not found' });
    return undefined;
  }

  return String(category._id);
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
      .skip(Number(offset))
      .populate('defaultCategory', 'key name color icon');

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
      }).populate('defaultCategory', 'key name color icon');
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

    const counterparty = await CounterpartyModel.findOne({
      key: id,
      userId,
    }).populate('defaultCategory', 'key name color icon');
    if (!counterparty) {
      return handleNotFoundError(res, 'Counterparty');
    }

    // Resolve parent fields if child
    let parent: ICounterparty | null = null;
    if (counterparty.parentKey) {
      parent = await CounterpartyModel.findOne({
        key: counterparty.parentKey,
        userId,
      }).populate('defaultCategory', 'key name color icon');
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
    const counterpartyData = req.body as Counterparty & {
      defaultCategory?: unknown;
    };

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

    const defaultCategoryRef = await resolveDefaultCategoryRef(
      counterpartyData.defaultCategory,
      userId,
      res
    );
    if (
      defaultCategoryRef === undefined &&
      counterpartyData.defaultCategory !== undefined
    )
      return;

    const counterparty = new CounterpartyModel({
      ...counterpartyData,
      defaultCategory: defaultCategoryRef || undefined,
      userId,
    });

    const savedCounterparty = await (await counterparty.save()).populate(
      'defaultCategory',
      'key name color icon'
    );
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
    const updateData = req.body as Partial<Counterparty> & {
      defaultCategory?: unknown;
    };

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

    const updatePayload: Record<string, unknown> = { ...updateData };
    const unsetPayload: Record<string, ''> = {};

    const defaultCategoryRef = await resolveDefaultCategoryRef(
      updateData.defaultCategory,
      userId,
      res
    );
    if (
      defaultCategoryRef === undefined &&
      updateData.defaultCategory !== undefined
    )
      return;

    if (updateData.defaultCategory !== undefined) {
      if (defaultCategoryRef === null) {
        unsetPayload.defaultCategory = '';
        delete updatePayload.defaultCategory;
      } else {
        updatePayload.defaultCategory = defaultCategoryRef;
      }
    }

    const updateQuery: Record<string, Record<string, unknown>> = {
      $set: updatePayload,
    };
    if (Object.keys(unsetPayload).length > 0) {
      updateQuery.$unset = unsetPayload;
    }

    const counterparty = await CounterpartyModel.findOneAndUpdate(
      { key: id, userId },
      updateQuery,
      { new: true, runValidators: true }
    ).populate('defaultCategory', 'key name color icon');

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
