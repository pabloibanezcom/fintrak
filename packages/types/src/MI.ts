export interface MIDeposit {
  accountId: string;
  iban: string;
  alias: string;
  creationDate: string;
  expirationDate: string;
  amount: number;
  grossInterest: number;
  netInterest: number;
  retention: number;
  currency: string;
  tae: number;
  numMonths: number;
}

export interface MICashAccount {
  accountId: string;
  accountCode: string;
  iban: string;
  alias: string;
  creationDate: string;
  enabledBalance: number;
  currency: string;
}

export interface MIIndexedFund {
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

export interface MIETC {
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

export interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  refreshExpiresAt: number;
}

export interface MILoginResponse {
  payload: {
    data: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
      refreshExpiresIn: number;
    };
  };
}

export class MIServiceError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: Error
  ) {
    super(message);
    this.name = "MIServiceError";
  }
}
