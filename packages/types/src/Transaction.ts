/**
 * Represents a bank transaction from external banking services (e.g., GoCardless).
 * Contains detailed transaction information including amounts, parties, and metadata.
 * 
 * @group Transaction Types
 */
export interface BankTransaction {
  /** Unique identifier for the transaction */
  id: string;
  
  /** Bank-provided transaction identifier */
  transactionId: string;
  
  /** Date when the transaction was booked */
  bookingDate: string;
  
  /** Date when the transaction value was applied */
  valueDate?: string;
  
  /** Transaction amount and currency */
  transactionAmount: {
    /** Amount as string to preserve precision */
    amount: string;
    /** ISO currency code */
    currency: string;
  };
  
  /** Name of the party receiving money */
  creditorName?: string;
  
  /** Name of the party sending money */
  debtorName?: string;
  
  /** Unstructured payment information */
  remittanceInformationUnstructured?: string;
  
  /** Standardized bank transaction code */
  bankTransactionCode?: string;
  
  /** Bank-specific transaction code */
  proprietaryBankTransactionCode?: string;
  
  /** Internal bank transaction identifier */
  internalTransactionId?: string;
  
  /** Bank entry reference */
  entryReference?: string;
  
  /** SEPA direct debit mandate ID */
  mandateId?: string;
  
  /** Check number if applicable */
  checkId?: string;
  
  /** SEPA creditor identifier */
  creditorId?: string;
  
  /** Booking date and time with timezone */
  bookingDateTime?: string;
  
  /** Value date and time with timezone */
  valueDateTime?: string;
  
  /** Additional transaction information */
  additionalInformation?: string;
  
  /** Structured additional information */
  additionalInformationStructured?: string;
  
  /** Account balance after this transaction */
  balanceAfterTransaction?: {
    /** Balance amount and currency */
    balanceAmount: {
      /** Balance amount as string */
      amount: string;
      /** ISO currency code */
      currency: string;
    };
    /** Type of balance (e.g., "closingBooked") */
    balanceType: string;
    /** Reference date for the balance */
    referenceDate: string;
  };
  
  /** Associated cash account ID */
  accountId: string;
  
  /** Owner user ID */
  userId: string;
  
  /** When the record was created */
  createdAt?: Date;
  
  /** When the record was last updated */
  updatedAt?: Date;
}

/**
 * Represents a bank account from GoCardless Open Banking API.
 * 
 * @group Financial Types
 */
export interface GoCardlessAccount {
  /** Unique account identifier */
  id: string;
  
  /** International Bank Account Number */
  iban: string;
  
  /** Bank institution identifier */
  institutionId: string;
  
  /** Current account status */
  status: 'READY' | 'PROCESSING' | 'ERROR' | 'EXPIRED' | 'SUSPENDED';
  
  /** Account owner name */
  ownerName?: string;
  
  /** Account display name */
  name?: string;
  
  /** Bank product type */
  product?: string;
  
  /** Bank-specific resource identifier */
  resourceId?: string;
  
  /** Bank Identifier Code */
  bic?: string;
  
  /** Account currency */
  currency: string;
  
  /** Type of cash account */
  cashAccountType?: string;
}

/**
 * Represents a GoCardless requisition for accessing bank account data.
 * 
 * @group Core Types
 */
export interface GoCardlessRequisition {
  /** Unique requisition identifier */
  id: string;
  
  /** When the requisition was created */
  created: string;
  
  /** Redirect URL after authorization */
  redirect: string;
  
  /** Current requisition status */
  status: 'CR' | 'GC' | 'UA' | 'RJ' | 'SA' | 'GA' | 'EX';
  
  /** Target bank institution ID */
  institutionId: string;
  
  /** End user agreement ID */
  agreement?: string;
  
  /** Reference for tracking */
  reference: string;
  
  /** List of connected account IDs */
  accounts: string[];
  
  /** User's preferred language */
  userLanguage?: string;
  
  /** Authorization link for end user */
  link: string;
  
  /** Social Security Number (if required) */
  ssn?: string;
  
  /** Whether user can select accounts */
  accountSelection?: boolean;
  
  /** Whether to redirect immediately */
  redirectImmediate?: boolean;
}

/**
 * Request payload for creating a new GoCardless requisition.
 * 
 * @group Core Types
 */
export interface CreateRequisitionRequest {
  /** Redirect URL after authorization */
  redirect: string;
  
  /** Target bank institution ID */
  institutionId: string;
  
  /** Optional reference for tracking */
  reference?: string;
  
  /** Optional end user agreement ID */
  agreement?: string;
  
  /** Optional user language preference */
  userLanguage?: string;
  
  /** Optional Social Security Number */
  ssn?: string;
  
  /** Optional account selection capability */
  accountSelection?: boolean;
  
  /** Optional immediate redirect setting */
  redirectImmediate?: boolean;
}

/**
 * Request payload for synchronizing bank transactions.
 * 
 * @group Transaction Types
 */
export interface SyncTransactionsRequest {
  /** Target account ID to sync */
  accountId: string;
  
  /** Optional start date for sync (ISO string) */
  dateFrom?: string;
  
  /** Optional end date for sync (ISO string) */
  dateTo?: string;
}

/**
 * Response payload from transaction synchronization operation.
 * 
 * @group Transaction Types
 */
export interface SyncTransactionsResponse {
  /** Total number of transactions processed */
  synced: number;
  
  /** Number of new transactions added */
  newTransactions: number;
  
  /** List of any errors that occurred */
  errors: string[];
}