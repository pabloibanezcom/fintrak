import type {
  CashAccount,
  Deposit,
  IndexedFund,
  InvestmentSummary,
  MICashAccount,
  MIDeposit,
  MIETC,
  MIIndexedFund,
} from '@fintrak/types';

// Generic mapping utility with property transformations
function mapArrayWithTransforms<TInput, TOutput>(
  items: TInput[],
  transforms?: Partial<
    Record<keyof TOutput, keyof TInput | ((item: TInput) => any)>
  >
): TOutput[] {
  if (!Array.isArray(items)) {
    return [];
  }

  return items.map((item) => {
    const result = {} as TOutput;

    // If no transforms provided, do a direct copy of all properties
    if (!transforms) {
      return { ...item } as unknown as TOutput;
    }

    // Apply transforms or direct property mapping
    for (const [outputKey, inputKeyOrTransform] of Object.entries(
      transforms
    ) as [keyof TOutput, keyof TInput | ((item: TInput) => any)][]) {
      if (typeof inputKeyOrTransform === 'function') {
        result[outputKey] = inputKeyOrTransform(item);
      } else {
        result[outputKey] = item[inputKeyOrTransform] as any;
      }
    }

    return result;
  });
}

export const MIDepositsToUserDeposits = (
  MIDeposits: MIDeposit[]
): Deposit[] => {
  return mapArrayWithTransforms<MIDeposit, Deposit>(MIDeposits);
};

export const MICashAccountsToUserCashAccounts = (
  MICashAccounts: MICashAccount[]
): CashAccount[] => {
  return mapArrayWithTransforms<MICashAccount, CashAccount>(MICashAccounts, {
    accountId: 'accountId',
    accountCode: 'accountCode',
    iban: 'iban',
    alias: 'alias',
    creationDate: 'creationDate',
    balance: 'enabledBalance', // Only property that needs mapping
    currency: 'currency',
  });
};

export const MIIndexedFundsToIndexedFunds = (
  MIIndexedFunds: MIIndexedFund[]
): IndexedFund[] => {
  return mapArrayWithTransforms<MIIndexedFund, IndexedFund>(MIIndexedFunds);
};

export const MIIndexedFundsToIndexedFundsSummary = (
  MIIndexedFunds: MIIndexedFund[]
): InvestmentSummary[] => {
  return mapArrayWithTransforms<MIIndexedFund, InvestmentSummary>(
    MIIndexedFunds,
    {
      isin: 'isin',
      investmentName: 'investmentName',
      initialInvestment: 'initialInvestment',
      marketValue: 'marketValue',
      profit: 'profit',
      totalReturn: 'totalReturn',
      averageCost: 'averageCost',
      liquidationValue: 'liquidationValue',
    }
  );
};

export const MIETCsToETCsSummary = (
  MIETCs: MIETC[]
): InvestmentSummary[] => {
  return mapArrayWithTransforms<MIETC, InvestmentSummary>(MIETCs, {
    isin: 'isin',
    investmentName: 'investmentName',
    initialInvestment: 'initialInvestment',
    marketValue: 'marketValue',
    profit: 'profit',
    totalReturn: 'totalReturn',
    averageCost: 'averageCost',
    liquidationValue: 'liquidationValue',
  });
};
