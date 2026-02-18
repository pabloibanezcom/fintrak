import { ProductComparisonService } from '../../services/ProductComparisonService';

describe('ProductComparisonService', () => {
  const comparisonDate = new Date('2025-01-01T00:00:00.000Z');

  const currentData: any = {
    totalValue: 2000,
    items: {
      deposits: {
        value: 500,
        percentage: 25,
        items: [
          { depositId: 'dep-1', amount: 500, name: 'Primary Deposit' },
          { depositId: 'dep-new', amount: 100, name: 'New Deposit' },
        ],
      },
      bankAccounts: {
        value: 900,
        percentage: 45,
        items: [{ accountId: 'acc-1', balance: 900, displayName: 'Main' }],
      },
      funds: {
        value: 400,
        percentage: 20,
        items: [{ isin: 'FUND1', marketValue: 400, name: 'Fund A' }],
      },
      etcs: {
        value: 100,
        percentage: 5,
        items: [{ isin: 'ETC1', marketValue: 100, name: 'ETC A' }],
      },
      cryptoAssets: {
        value: 100,
        percentage: 5,
        items: [{ code: 'BTC', value: { EUR: 100 } }],
      },
    },
  };

  const previousSnapshot: any = {
    totalValue: 1000,
    items: {
      deposits: {
        value: 400,
        percentage: 40,
        items: [{ depositId: 'dep-1', amount: 400, name: 'Primary Deposit' }],
      },
      bankAccounts: {
        value: 300,
        percentage: 30,
        items: [{ accountId: 'acc-1', balance: 300, displayName: 'Main' }],
      },
      funds: {
        value: 200,
        percentage: 20,
        items: [{ isin: 'FUND1', marketValue: 200, name: 'Fund A' }],
      },
      etcs: {
        value: 100,
        percentage: 10,
        items: [{ isin: 'ETC1', marketValue: 100, name: 'ETC A' }],
      },
      cryptoAssets: {
        value: 0,
        percentage: 0,
        items: [{ code: 'BTC' }],
      },
    },
  };

  it('should calculate overall comparison and include metadata', () => {
    const result = ProductComparisonService.compareWithSnapshot(
      currentData,
      previousSnapshot,
      '1m',
      comparisonDate
    );

    expect(result.comparison).toEqual({
      period: '1m',
      available: true,
      previousValue: 1000,
      currentValue: 2000,
      valueDifference: 1000,
      percentageDifference: 100,
      comparisonDate,
    });
  });

  it('should add item-level comparisons for existing and new entries', () => {
    const result = ProductComparisonService.compareWithSnapshot(
      currentData,
      previousSnapshot,
      '1m',
      comparisonDate
    );

    const deposits = result.enrichedData.items.deposits.items as any[];
    expect(deposits[0].comparison).toEqual({
      previousValue: 400,
      valueDifference: 100,
      percentageDifference: 25,
    });
    expect(deposits[1].comparison).toEqual({
      previousValue: 0,
      valueDifference: 100,
      percentageDifference: 0,
    });
  });

  it('should calculate group comparisons and support nested crypto values', () => {
    const result = ProductComparisonService.compareWithSnapshot(
      currentData,
      previousSnapshot,
      '1m',
      comparisonDate
    );

    const bankAccounts = result.enrichedData.items.bankAccounts as any;
    const cryptoItems = result.enrichedData.items.cryptoAssets.items as any[];

    expect(bankAccounts.comparison).toEqual({
      valueDifference: 600,
      percentageDifference: 200,
    });

    expect(cryptoItems[0].comparison).toEqual({
      previousValue: 0,
      valueDifference: 100,
      percentageDifference: 0,
    });
  });
});
