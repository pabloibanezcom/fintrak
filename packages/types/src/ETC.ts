export interface ETC {
  accountId: string;
  name: string;
  productTypeCode: string;
  marketCode: string;
  isin: string;
  initialInvestment: number;
  initialInvestmentCurrency: number;
  marketValue: number;
  profit: number;
  totalReturn: number;
  shares: number;
  availableShares: number;
  averageCost: number;
  liquidationValue: number;
  liquidationValueDate: string;
  originCurrencyLiquidationValue: number;
  liquidationValueCurrency: string;
  ytdFundReturn: number;
  firstYearFundReturn: number;
  thirdYearFundReturn: number;
  fifthYearFundReturn: number;
  infoFundUrl: string;
}
