import type { Request } from 'express';
import type { Model } from 'mongoose';
import { prepareAggregationQuery } from '../utils/mongoUtils';
import {
  buildAmountRangeQuery,
  buildDateRangeQuery,
  buildSortObject,
  buildTagsQuery,
  buildTextSearchQuery,
  createPaginationResponse,
  parsePaginationParams,
  parseSortParams,
} from '../utils/queryUtils';

export interface TransactionSearchConfig {
  /** The Mongoose model to query */
  model: Model<any>;
  /** Name of the counterparty field ('payee' for expenses, 'source' for incomes) */
  counterpartyField: string;
  /** Name for the results array in response ('expenses' or 'incomes') */
  responseKey: string;
}

export interface TransactionSearchResult {
  [key: string]: any; // Dynamic key for 'expenses' or 'incomes'
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
  filters: {
    title?: string;
    dateFrom?: string;
    dateTo?: string;
    amountMin?: string;
    amountMax?: string;
    currency?: string;
    category?: string;
    [key: string]: any; // For counterparty field
    periodicity?: string;
    tags?: string | string[];
    description?: string;
  };
  sort: {
    sortBy: string;
    sortOrder: string;
  };
  totalAmount?: number;
}

/**
 * Generic service for searching transactions (expenses/incomes)
 * Handles query building, pagination, sorting, and aggregations
 */
export class TransactionSearchService {
  /**
   * Search for transactions with filters, pagination, and optional total
   * @param req - Express request with query parameters
   * @param userId - User ID to filter by
   * @param config - Configuration specifying model and field names
   * @returns Search results with transactions, pagination, and filters
   */
  static async search(
    req: Request,
    userId: string,
    config: TransactionSearchConfig
  ): Promise<TransactionSearchResult> {
    const {
      title,
      dateFrom,
      dateTo,
      amountMin,
      amountMax,
      currency,
      category,
      periodicity,
      tags,
      description,
      includeTotal = 'false',
    } = req.query;

    // Get counterparty value from dynamic field name
    const counterpartyValue = req.query[config.counterpartyField];

    // Build query object
    const query: any = { userId };

    // Text search filters
    const titleQuery = buildTextSearchQuery(title as string);
    if (titleQuery) query.title = titleQuery;

    const descQuery = buildTextSearchQuery(description as string);
    if (descQuery) query.description = descQuery;

    // Date and amount range filters
    const dateQuery = buildDateRangeQuery(dateFrom as string, dateTo as string);
    if (dateQuery) query.date = dateQuery;

    const amountQuery = buildAmountRangeQuery(
      amountMin as string,
      amountMax as string
    );
    if (amountQuery) query.amount = amountQuery;

    // Direct field filters
    if (currency) query.currency = currency;
    if (category) query.category = category;
    if (counterpartyValue) query[config.counterpartyField] = counterpartyValue;
    if (periodicity) query.periodicity = periodicity;

    // Tags filter
    const tagsQuery = buildTagsQuery(tags as string | string[]);
    if (tagsQuery) query['tags.key'] = tagsQuery;

    // Parse pagination and sorting
    const pagination = parsePaginationParams(req);
    const sortParams = parseSortParams(req, [
      'date',
      'amount',
      'title',
      'createdAt',
    ]);
    const sort = buildSortObject(sortParams);

    // Execute query with pagination
    const transactions = await config.model
      .find(query)
      .populate('category', 'key name color icon')
      .populate(config.counterpartyField, 'key name type')
      .sort(sort)
      .limit(pagination.limit)
      .skip(pagination.offset);

    // Get total count for pagination
    const totalCount = await config.model.countDocuments(query);

    // Calculate total amount if requested
    let totalAmount: number | null = null;
    if (includeTotal === 'true') {
      const aggregationQuery = prepareAggregationQuery(query, [
        'category',
        config.counterpartyField,
      ]);
      const aggregation = await config.model.aggregate([
        { $match: aggregationQuery },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]);
      totalAmount = aggregation.length > 0 ? aggregation[0].total : 0;
    }

    const response: TransactionSearchResult = {
      [config.responseKey]: transactions,
      pagination: createPaginationResponse(
        totalCount,
        pagination.limit,
        pagination.offset
      ),
      filters: {
        title: title as string | undefined,
        dateFrom: dateFrom as string | undefined,
        dateTo: dateTo as string | undefined,
        amountMin: amountMin as string | undefined,
        amountMax: amountMax as string | undefined,
        currency: currency as string | undefined,
        category: category as string | undefined,
        [config.counterpartyField]: counterpartyValue as string | undefined,
        periodicity: periodicity as string | undefined,
        tags: tags as string | string[] | undefined,
        description: description as string | undefined,
      },
      sort: {
        sortBy: sortParams.sortBy,
        sortOrder: sortParams.sortOrder,
      },
    };

    if (totalAmount !== null) {
      response.totalAmount = totalAmount;
    }

    return response;
  }
}
