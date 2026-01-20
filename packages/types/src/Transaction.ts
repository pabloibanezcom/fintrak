/**
 * Represents a bank transaction from external banking services.
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
 * Represents a bank account from TrueLayer Open Banking API.
 *
 * @group Financial Types
 */
export interface TrueLayerAccount {
  /** Unique account identifier */
  account_id: string;

  /** Account type */
  account_type: 'TRANSACTION' | 'SAVINGS' | 'BUSINESS' | 'OTHER';

  /** Account display name */
  display_name?: string;

  /** ISO currency code */
  currency: string;

  /** Account number details */
  account_number?: {
    /** International Bank Account Number */
    iban?: string;
    /** Basic Bank Account Number */
    bban?: string;
    /** SWIFT/BIC code */
    swift_bic?: string;
    /** Account number */
    number?: string;
    /** Sort code */
    sort_code?: string;
  };

  /** Provider details */
  provider?: {
    /** Provider display name */
    display_name?: string;
    /** Provider identifier */
    provider_id?: string;
    /** Provider logo URL */
    logo_uri?: string;
  };

  /** Last update timestamp */
  update_timestamp?: string;
}

/**
 * Represents account balance from TrueLayer API.
 *
 * @group Financial Types
 */
export interface TrueLayerBalance {
  /** ISO currency code */
  currency: string;

  /** Available balance */
  available: number;

  /** Current balance */
  current: number;

  /** Overdraft limit if applicable */
  overdraft?: number;

  /** Last update timestamp */
  update_timestamp?: string;
}

/**
 * Represents a transaction from TrueLayer API.
 *
 * @group Transaction Types
 */
export interface TrueLayerTransaction {
  /** Unique transaction identifier */
  transaction_id: string;

  /** Normalized timestamp */
  timestamp: string;

  /** Transaction description */
  description: string;

  /** Transaction type */
  transaction_type: 'DEBIT' | 'CREDIT';

  /** Transaction category */
  transaction_category:
    | 'PURCHASE'
    | 'ATM'
    | 'BILL_PAYMENT'
    | 'TRANSFER'
    | 'DIRECT_DEBIT'
    | 'STANDING_ORDER'
    | 'INTEREST'
    | 'DIVIDEND'
    | 'FEE'
    | 'REFUND'
    | 'OTHER';

  /** Transaction classification (more detailed) */
  transaction_classification?: string[];

  /** Merchant name if applicable */
  merchant_name?: string;

  /** Transaction amount (negative for debits) */
  amount: number;

  /** ISO currency code */
  currency: string;

  /** Metadata */
  meta?: {
    /** Bank transaction ID */
    bank_transaction_id?: string;
    /** Provider transaction category */
    provider_transaction_category?: string;
    /** Provider reference */
    provider_reference?: string;
    /** Provider merchant name */
    provider_merchant_name?: string;
  };

  /** Running balance after transaction */
  running_balance?: {
    /** ISO currency code */
    currency: string;
    /** Balance amount */
    amount: number;
  };
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
