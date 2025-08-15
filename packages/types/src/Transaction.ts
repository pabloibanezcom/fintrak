export interface BankTransaction {
  id: string;
  transactionId: string;
  bookingDate: string;
  valueDate?: string;
  transactionAmount: {
    amount: string;
    currency: string;
  };
  creditorName?: string;
  debtorName?: string;
  remittanceInformationUnstructured?: string;
  bankTransactionCode?: string;
  proprietaryBankTransactionCode?: string;
  internalTransactionId?: string;
  entryReference?: string;
  mandateId?: string;
  checkId?: string;
  creditorId?: string;
  bookingDateTime?: string;
  valueDateTime?: string;
  additionalInformation?: string;
  additionalInformationStructured?: string;
  balanceAfterTransaction?: {
    balanceAmount: {
      amount: string;
      currency: string;
    };
    balanceType: string;
    referenceDate: string;
  };
  accountId: string;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface GoCardlessAccount {
  id: string;
  iban: string;
  institutionId: string;
  status: 'READY' | 'PROCESSING' | 'ERROR' | 'EXPIRED' | 'SUSPENDED';
  ownerName?: string;
  name?: string;
  product?: string;
  resourceId?: string;
  bic?: string;
  currency: string;
  cashAccountType?: string;
}

export interface GoCardlessRequisition {
  id: string;
  created: string;
  redirect: string;
  status: 'CR' | 'GC' | 'UA' | 'RJ' | 'SA' | 'GA' | 'EX';
  institutionId: string;
  agreement?: string;
  reference: string;
  accounts: string[];
  userLanguage?: string;
  link: string;
  ssn?: string;
  accountSelection?: boolean;
  redirectImmediate?: boolean;
}

export interface CreateRequisitionRequest {
  redirect: string;
  institutionId: string;
  reference?: string;
  agreement?: string;
  userLanguage?: string;
  ssn?: string;
  accountSelection?: boolean;
  redirectImmediate?: boolean;
}

export interface SyncTransactionsRequest {
  accountId: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface SyncTransactionsResponse {
  synced: number;
  newTransactions: number;
  errors: string[];
}