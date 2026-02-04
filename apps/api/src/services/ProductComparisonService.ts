import type { UserProducts } from '@fintrak/types';

/**
 * Result of comparing two numeric values
 */
interface ComparisonMetrics {
  valueDifference: number;
  percentageDifference: number;
}

/**
 * Comparison data for an individual item
 */
interface ItemComparison extends ComparisonMetrics {
  previousValue: number;
}

/**
 * Configuration for comparing product groups
 */
interface ProductGroupConfig {
  identifierKey: string;
  valueKey: string;
}

/**
 * Snapshot data structure
 */
interface ProductSnapshot {
  totalValue: number;
  items: UserProducts['items'];
}

/**
 * Complete comparison result with enriched user data
 */
export interface ProductComparisonResult {
  enrichedData: UserProducts;
  comparison: {
    period: string;
    available: boolean;
    previousValue: number;
    currentValue: number;
    valueDifference: number;
    percentageDifference: number;
    comparisonDate: Date;
  };
}

/**
 * Service for comparing current product data with historical snapshots.
 * Handles calculation of value differences, percentage changes, and enrichment
 * of product data with comparison metadata.
 */
export class ProductComparisonService {
  /**
   * Calculate comparison metrics between two values
   */
  private static calculateComparison(
    current: number,
    previous: number
  ): ComparisonMetrics {
    const valueDifference = current - previous;
    const percentageDifference =
      previous === 0
        ? 0
        : Number(((valueDifference / previous) * 100).toFixed(2));
    return { valueDifference, percentageDifference };
  }

  /**
   * Get nested value from object using dot notation
   * Example: getNestedValue(obj, 'value.EUR') returns obj.value.EUR
   */
  private static getNestedValue(obj: any, path: string): number {
    return path.split('.').reduce((acc, part) => acc?.[part], obj) || 0;
  }

  /**
   * Add comparison data to individual items in a product group
   */
  private static addItemComparisons(
    currentItems: any[],
    previousItems: any[],
    identifierKey: string,
    valueKey: string
  ): any[] {
    return currentItems.map((currentItem) => {
      const previousItem = previousItems.find(
        (prev: any) => prev[identifierKey] === currentItem[identifierKey]
      );

      const currentValue = ProductComparisonService.getNestedValue(
        currentItem,
        valueKey
      );

      if (previousItem) {
        const previousValue = ProductComparisonService.getNestedValue(
          previousItem,
          valueKey
        );
        const comparison = ProductComparisonService.calculateComparison(
          currentValue,
          previousValue
        );
        return {
          ...currentItem,
          comparison: {
            previousValue,
            ...comparison,
          },
        };
      }

      // No previous data for this item (new item)
      return {
        ...currentItem,
        comparison: {
          previousValue: 0,
          valueDifference: currentValue,
          percentageDifference: 0,
        },
      };
    });
  }

  /**
   * Configuration for each product group type
   */
  private static readonly PRODUCT_GROUP_CONFIGS: Record<
    keyof UserProducts['items'],
    ProductGroupConfig
  > = {
    deposits: { identifierKey: 'depositId', valueKey: 'amount' },
    bankAccounts: { identifierKey: 'accountId', valueKey: 'balance' },
    funds: { identifierKey: 'isin', valueKey: 'marketValue' },
    etcs: { identifierKey: 'isin', valueKey: 'marketValue' },
    cryptoAssets: { identifierKey: 'code', valueKey: 'value.EUR' },
  };

  /**
   * Compare current product data with a previous snapshot and enrich
   * the data with comparison metrics for all product groups and items
   */
  static compareWithSnapshot(
    currentData: UserProducts,
    previousSnapshot: ProductSnapshot,
    period: string,
    comparisonDate: Date
  ): ProductComparisonResult {
    // Calculate overall comparison
    const currentValue = currentData.totalValue;
    const previousValue = previousSnapshot.totalValue;
    const totalComparison = ProductComparisonService.calculateComparison(
      currentValue,
      previousValue
    );

    // Enrich each product group with comparisons
    const enrichedItems: any = {};

    for (const [groupKey, config] of Object.entries(
      ProductComparisonService.PRODUCT_GROUP_CONFIGS
    )) {
      const typedGroupKey = groupKey as keyof UserProducts['items'];
      const currentGroup = currentData.items[typedGroupKey];
      const previousGroup = previousSnapshot.items[typedGroupKey];

      enrichedItems[groupKey] = {
        ...currentGroup,
        items: ProductComparisonService.addItemComparisons(
          currentGroup.items,
          previousGroup.items,
          config.identifierKey,
          config.valueKey
        ),
        comparison: ProductComparisonService.calculateComparison(
          currentGroup.value,
          previousGroup.value
        ),
      };
    }

    const enrichedData: UserProducts = {
      ...currentData,
      items: enrichedItems,
    };

    return {
      enrichedData,
      comparison: {
        period,
        available: true,
        previousValue,
        currentValue,
        valueDifference: totalComparison.valueDifference,
        percentageDifference: totalComparison.percentageDifference,
        comparisonDate,
      },
    };
  }
}
