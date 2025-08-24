/**
 * Deposit account data from MI (external banking service).
 * 
 * @group Financial Types
 */
export interface MIDeposit {
  /** Unique account identifier */
  accountId: string;
  
  /** International Bank Account Number */
  iban: string;
  
  /** User-friendly account alias */
  alias: string;
  
  /** Account creation date (ISO string) */
  creationDate: string;
  
  /** Deposit expiration date (ISO string) */
  expirationDate: string;
  
  /** Principal deposit amount */
  amount: number;
  
  /** Gross interest before taxes */
  grossInterest: number;
  
  /** Net interest after taxes */
  netInterest: number;
  
  /** Tax retention amount */
  retention: number;
  
  /** Account currency */
  currency: string;
  
  /** Annual Equivalent Rate */
  tae: number;
  
  /** Deposit term in months */
  numMonths: number;
}

/**
 * Cash account data from MI (external banking service).
 * 
 * @group Financial Types
 */
export interface MICashAccount {
  /** Unique account identifier */
  accountId: string;
  
  /** Bank-specific account code */
  accountCode: string;
  
  /** International Bank Account Number */
  iban: string;
  
  /** User-friendly account alias */
  alias: string;
  
  /** Account creation date (ISO string) */
  creationDate: string;
  
  /** Available account balance */
  enabledBalance: number;
  
  /** Account currency */
  currency: string;
}

/**
 * Indexed fund data from MI (external banking service).
 * 
 * @group Financial Types
 */
export interface MIIndexedFund {
  /** Unique account identifier */
  accountId: string;
  
  /** Fund name */
  name: string;
  
  /** Product type classification code */
  productTypeCode: string;
  
  /** Market code where fund is traded */
  marketCode: string;
  
  /** International Securities Identification Number */
  isin: string;
  
  /** Initial investment amount */
  initialInvestment: number;
  
  /** Currency code of initial investment */
  initialInvestmentCurrency: number;
  
  /** Current market value */
  marketValue: number;
  
  /** Current profit or loss */
  profit: number;
  
  /** Total return including distributions */
  totalReturn: number;
  
  /** Number of fund shares owned */
  shares: number;
  
  /** Shares available for trading */
  availableShares: number;
  
  /** Average cost per share */
  averageCost: number;
  
  /** Current liquidation value */
  liquidationValue: number;
  
  /** Date of liquidation value */
  liquidationValueDate: string;
  
  /** Liquidation value in original currency */
  originCurrencyLiquidationValue: number;
  
  /** Currency of liquidation value */
  liquidationValueCurrency: string;
  
  /** Year-to-date return percentage */
  ytdFundReturn: number;
  
  /** First year return percentage */
  firstYearFundReturn: number;
  
  /** Third year return percentage */
  thirdYearFundReturn: number;
  
  /** Fifth year return percentage */
  fifthYearFundReturn: number;
  
  /** URL to fund information */
  infoFundUrl: string;
}

/**
 * Exchange Traded Commodity data from MI (external banking service).
 * 
 * @group Financial Types
 */
export interface MIETC {
  /** Unique account identifier */
  accountId: string;
  
  /** ETC name */
  name: string;
  
  /** Product type classification code */
  productTypeCode: string;
  
  /** Market code where ETC is traded */
  marketCode: string;
  
  /** International Securities Identification Number */
  isin: string;
  
  /** Initial investment amount */
  initialInvestment: number;
  
  /** Currency code of initial investment */
  initialInvestmentCurrency: number;
  
  /** Current market value */
  marketValue: number;
  
  /** Current profit or loss */
  profit: number;
  
  /** Total return including distributions */
  totalReturn: number;
  
  /** Number of ETC shares owned */
  shares: number;
  
  /** Shares available for trading */
  availableShares: number;
  
  /** Average cost per share */
  averageCost: number;
  
  /** Current liquidation value */
  liquidationValue: number;
  
  /** Date of liquidation value */
  liquidationValueDate: string;
  
  /** Liquidation value in original currency */
  originCurrencyLiquidationValue: number;
  
  /** Currency of liquidation value */
  liquidationValueCurrency: string;
  
  /** Year-to-date return percentage */
  ytdFundReturn: number;
  
  /** First year return percentage */
  firstYearFundReturn: number;
  
  /** Third year return percentage */
  thirdYearFundReturn: number;
  
  /** Fifth year return percentage */
  fifthYearFundReturn: number;
  
  /** URL to fund information */
  infoFundUrl: string;
}

/**
 * Authentication token data for MI service access.
 * 
 * @group Core Types
 */
export interface TokenData {
  /** JWT access token */
  accessToken: string;
  
  /** JWT refresh token */
  refreshToken: string;
  
  /** Access token expiration timestamp */
  expiresAt: number;
  
  /** Refresh token expiration timestamp */
  refreshExpiresAt: number;
}

/**
 * Authentication response from MI login service.
 * 
 * @group Core Types
 */
export interface MILoginResponse {
  /** Response payload wrapper */
  payload: {
    /** Authentication data */
    data: {
      /** JWT access token */
      accessToken: string;
      
      /** JWT refresh token */
      refreshToken: string;
      
      /** Access token validity duration (seconds) */
      expiresIn: number;
      
      /** Refresh token validity duration (seconds) */
      refreshExpiresIn: number;
    };
  };
}

/**
 * Custom error class for MI service operations.
 * Extends the standard Error with additional MI-specific context.
 * 
 * @group Core Types
 */
export class MIServiceError extends Error {
  constructor(
    message: string,
    /** HTTP status code if available */
    public statusCode?: number,
    /** Original error that caused this MI error */
    public originalError?: Error
  ) {
    super(message);
    this.name = "MIServiceError";
  }
}
