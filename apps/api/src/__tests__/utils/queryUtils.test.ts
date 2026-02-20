import type { Request } from 'express';
import {
  buildAmountRangeQuery,
  buildDateRangeQuery,
  buildSortObject,
  buildTagsQuery,
  buildTextSearchQuery,
  createPaginationResponse,
  parsePaginationParams,
  parseSortParams,
} from '../../utils/queryUtils';

describe('queryUtils', () => {
  it('parses pagination params with defaults and explicit values', () => {
    const defaultReq = { query: {} } as unknown as Request;
    expect(parsePaginationParams(defaultReq)).toEqual({ limit: 50, offset: 0 });

    const explicitReq = {
      query: { limit: '10', offset: '30' },
    } as unknown as Request;
    expect(parsePaginationParams(explicitReq)).toEqual({
      limit: 10,
      offset: 30,
    });
  });

  it('parses sort params with validation and defaults', () => {
    const reqValid = {
      query: { sortBy: 'amount', sortOrder: 'asc' },
    } as unknown as Request;
    expect(parseSortParams(reqValid, ['date', 'amount'], 'date')).toEqual({
      sortBy: 'amount',
      sortOrder: 'asc',
    });

    const reqInvalid = {
      query: { sortBy: 'unknown', sortOrder: 'invalid' },
    } as unknown as Request;
    expect(parseSortParams(reqInvalid, ['date', 'amount'], 'date')).toEqual({
      sortBy: 'date',
      sortOrder: 'desc',
    });
  });

  it('builds sort object for asc and desc', () => {
    expect(buildSortObject({ sortBy: 'date', sortOrder: 'desc' })).toEqual({
      date: -1,
    });
    expect(buildSortObject({ sortBy: 'amount', sortOrder: 'asc' })).toEqual({
      amount: 1,
    });
  });

  it('creates pagination response and hasMore boundary', () => {
    expect(createPaginationResponse(100, 20, 0)).toEqual({
      total: 100,
      limit: 20,
      offset: 0,
      hasMore: true,
    });

    expect(createPaginationResponse(20, 20, 0)).toEqual({
      total: 20,
      limit: 20,
      offset: 0,
      hasMore: false,
    });
  });

  it('builds date range query variants', () => {
    expect(buildDateRangeQuery()).toBeUndefined();

    expect(buildDateRangeQuery('2026-01-01')).toEqual({
      $gte: new Date('2026-01-01'),
    });

    expect(buildDateRangeQuery(undefined, '2026-01-31')).toEqual({
      $lte: new Date('2026-01-31'),
    });

    expect(buildDateRangeQuery('2026-01-01', '2026-01-31')).toEqual({
      $gte: new Date('2026-01-01'),
      $lte: new Date('2026-01-31'),
    });
  });

  it('builds amount range query variants', () => {
    expect(buildAmountRangeQuery()).toBeUndefined();

    expect(buildAmountRangeQuery('10')).toEqual({ $gte: 10 });
    expect(buildAmountRangeQuery(undefined, '99')).toEqual({ $lte: 99 });
    expect(buildAmountRangeQuery('10', '99')).toEqual({
      $gte: 10,
      $lte: 99,
    });
  });

  it('builds text and tags queries', () => {
    expect(buildTextSearchQuery()).toBeUndefined();
    expect(buildTextSearchQuery('rent')).toEqual({
      $regex: 'rent',
      $options: 'i',
    });

    expect(buildTagsQuery()).toBeUndefined();
    expect(buildTagsQuery('home')).toEqual({ $in: ['home'] });
    expect(buildTagsQuery(['home', 'work'])).toEqual({
      $in: ['home', 'work'],
    });
  });
});
