import type { CashAccount, Deposit, IndexedFund } from '@fintrak/types';

export const MIDepositsToUserDeposits = (MIDeposits: any[]): Deposit[] => {
  return Array.isArray(MIDeposits)
    ? MIDeposits.map((item) => ({
        accountId: item.accountId,
        iban: item.iban,
        alias: item.alias,
        creationDate: item.creationDate,
        expirationDate: item.expirationDate,
        amount: item.amount,
        grossInterest: item.grossInterest,
        netInterest: item.netInterest,
        retention: item.retention,
        currency: item.currency,
        tae: item.tae,
        numMonths: item.numMonths,
      }))
    : [];
};

export const MICashAccountsToUserCashAccounts = (
  MICashAccounts: any[]
): CashAccount[] => {
  return Array.isArray(MICashAccounts)
    ? MICashAccounts.map((item) => ({
        accountId: item.accountId,
        accountCode: item.accountCode,
        iban: item.iban,
        alias: item.alias,
        creationDate: item.creationDate,
        balance: item.enabledBalance,
        currency: item.currency,
      }))
    : [];
};

export const MIIndexedFundsToIndexedFunds = (
  MIIndexedFunds: any[]
): IndexedFund[] => {
  return Array.isArray(MIIndexedFunds)
    ? MIIndexedFunds.map((item) => ({
        accountId: item.accountId,
        name: item.name,
        productTypeCode: item.productTypeCode,
        marketCode: item.marketCode,
        isin: item.isin,
        initialInvestment: item.initialInvestment,
        initialInvestmentCurrency: item.initialInvestmentCurrency,
        marketValue: item.marketValue,
        profit: item.profit,
        totalReturn: item.totalReturn,
        shares: item.shares,
        availableShares: item.availableShares,
        averageCost: item.averageCost,
        liquidationValue: item.liquidationValue,
        liquidationValueDate: item.liquidationValueDate,
        originCurrencyLiquidationValue: item.originCurrencyLiquidationValue,
        liquidationValueCurrency: item.liquidationValueCurrency,
        ytdFundReturn: item.ytdFundReturn,
        firstYearFundReturn: item.firstYearFundReturn,
        thirdYearFundReturn: item.thirdYearFundReturn,
        fifthYearFundReturn: item.fifthYearFundReturn,
        infoFundUrl: item.infoFundUrl,
      }))
    : [];
};
