import type { Request } from 'express';

export interface PaginationParams {
  limit: number;
  offset: number;
}

export interface SortParams {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface PaginationResponse {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export const parsePaginationParams = (req: Request): PaginationParams => {
  const { limit = 50, offset = 0 } = req.query;
  return {
    limit: Number(limit),
    offset: Number(offset),
  };
};

export const parseSortParams = (
  req: Request,
  validSortFields: string[],
  defaultSortBy = 'date'
): SortParams => {
  const { sortBy = defaultSortBy, sortOrder = 'desc' } = req.query;
  const sortField = validSortFields.includes(sortBy as string)
    ? (sortBy as string)
    : defaultSortBy;
  return {
    sortBy: sortField,
    sortOrder: sortOrder === 'asc' ? 'asc' : 'desc',
  };
};

export const buildSortObject = (
  sortParams: SortParams
): Record<string, 1 | -1> => {
  return {
    [sortParams.sortBy]: sortParams.sortOrder === 'asc' ? 1 : -1,
  };
};

export const createPaginationResponse = (
  total: number,
  limit: number,
  offset: number
): PaginationResponse => {
  return {
    total,
    limit,
    offset,
    hasMore: offset + limit < total,
  };
};

export const buildDateRangeQuery = (
  dateFrom?: string,
  dateTo?: string
): Record<string, any> | undefined => {
  if (!dateFrom && !dateTo) return undefined;

  const query: Record<string, any> = {};
  if (dateFrom) {
    query.$gte = new Date(dateFrom);
  }
  if (dateTo) {
    query.$lte = new Date(dateTo);
  }
  return query;
};

export const buildAmountRangeQuery = (
  amountMin?: string,
  amountMax?: string
): Record<string, any> | undefined => {
  if (amountMin === undefined && amountMax === undefined) return undefined;

  const query: Record<string, any> = {};
  if (amountMin !== undefined) {
    query.$gte = Number(amountMin);
  }
  if (amountMax !== undefined) {
    query.$lte = Number(amountMax);
  }
  return query;
};

export const buildTextSearchQuery = (
  searchText?: string
): Record<string, any> | undefined => {
  if (!searchText) return undefined;
  return { $regex: searchText, $options: 'i' };
};

export const buildTagsQuery = (
  tags?: string | string[]
): Record<string, any> | undefined => {
  if (!tags) return undefined;
  const tagArray = Array.isArray(tags) ? tags : [tags];
  return { $in: tagArray };
};
