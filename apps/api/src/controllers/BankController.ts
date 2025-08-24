import type {
  CreateRequisitionRequest,
  BankTransaction as IBankTransaction,
  SyncTransactionsRequest,
} from '@fintrak/types';
import type { Request, Response } from 'express';
import BankTransaction from '../models/TransactionModel';
import GoCardlessService from '../services/GoCardlessService';

export const getInstitutions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const country = (req.query.country as string) || 'ES';
    const institutions = await GoCardlessService.getInstitutions(country);

    res.json(institutions);
  } catch (error) {
    console.error('Get institutions error:', error);
    res.status(500).json({
      error: 'Failed to fetch institutions',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const createRequisition = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { institutionId, redirect, reference } =
      req.body as CreateRequisitionRequest;

    if (!institutionId || !redirect) {
      res.status(400).json({
        error: 'Missing required fields',
        message: 'institutionId and redirect are required',
      });
      return;
    }

    const requisitionData: CreateRequisitionRequest = {
      institutionId,
      redirect,
      reference: reference || `user_${req.user?.id}_${Date.now()}`,
      userLanguage: 'es',
    };

    const requisition =
      await GoCardlessService.createRequisition(requisitionData);

    res.status(201).json(requisition);
  } catch (error) {
    console.error('Create requisition error:', error);
    res.status(500).json({
      error: 'Failed to create requisition',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getRequisition = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const requisition = await GoCardlessService.getRequisition(id);

    res.json(requisition);
  } catch (error) {
    console.error('Get requisition error:', error);
    res.status(500).json({
      error: 'Failed to fetch requisition',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getAccounts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const accounts = await BankTransaction.distinct('accountId', { userId });

    const accountsWithDetails = await Promise.allSettled(
      accounts.map(async (accountId) => {
        try {
          const details = await GoCardlessService.getAccountDetails(accountId);
          return details;
        } catch (error) {
          console.error(
            `Failed to get details for account ${accountId}:`,
            error
          );
          return null;
        }
      })
    );

    const validAccounts = accountsWithDetails
      .filter(
        (result): result is PromiseFulfilledResult<any> =>
          result.status === 'fulfilled' && result.value !== null
      )
      .map((result) => result.value);

    res.json(validAccounts);
  } catch (error) {
    console.error('Get accounts error:', error);
    res.status(500).json({
      error: 'Failed to fetch accounts',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getTransactions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { accountId } = req.params;
    const { dateFrom, dateTo, sync } = req.query;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    if (sync === 'true') {
      await syncAccountTransactions(
        accountId,
        userId,
        dateFrom as string,
        dateTo as string
      );
    }

    const filter: any = { accountId, userId };

    if (dateFrom || dateTo) {
      filter.bookingDate = {};
      if (dateFrom) filter.bookingDate.$gte = dateFrom;
      if (dateTo) filter.bookingDate.$lte = dateTo;
    }

    const transactions = await BankTransaction.find(filter)
      .sort({ bookingDate: -1 })
      .limit(1000);

    res.json(transactions);
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      error: 'Failed to fetch transactions',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const syncTransactions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { accountId } = req.params;
    const { dateFrom, dateTo } = req.body as SyncTransactionsRequest;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const result = await syncAccountTransactions(
      accountId,
      userId,
      dateFrom,
      dateTo
    );

    res.json(result);
  } catch (error) {
    console.error('Sync transactions error:', error);
    res.status(500).json({
      error: 'Failed to sync transactions',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getBalances = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { accountId } = req.params;
    const balances = await GoCardlessService.getAccountBalances(accountId);

    res.json(balances);
  } catch (error) {
    console.error('Get balances error:', error);
    res.status(500).json({
      error: 'Failed to fetch balances',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

async function syncAccountTransactions(
  accountId: string,
  userId: string,
  dateFrom?: string,
  dateTo?: string
): Promise<{ synced: number; newTransactions: number; errors: string[] }> {
  const errors: string[] = [];
  let synced = 0;
  let newTransactions = 0;

  try {
    const result = await GoCardlessService.getAccountTransactions(
      accountId,
      dateFrom,
      dateTo
    );
    const allTransactions = [
      ...result.transactions.booked,
      ...result.transactions.pending,
    ];

    for (const transaction of allTransactions) {
      try {
        const transactionData: Partial<IBankTransaction> = {
          transactionId:
            transaction.transactionId ||
            transaction.internalTransactionId ||
            `${accountId}_${Date.now()}`,
          bookingDate: transaction.bookingDate,
          valueDate: transaction.valueDate,
          transactionAmount: transaction.transactionAmount,
          creditorName: transaction.creditorName,
          debtorName: transaction.debtorName,
          remittanceInformationUnstructured:
            transaction.remittanceInformationUnstructured,
          bankTransactionCode: transaction.bankTransactionCode,
          proprietaryBankTransactionCode:
            transaction.proprietaryBankTransactionCode,
          internalTransactionId: transaction.internalTransactionId,
          entryReference: transaction.entryReference,
          mandateId: transaction.mandateId,
          checkId: transaction.checkId,
          creditorId: transaction.creditorId,
          bookingDateTime: transaction.bookingDateTime,
          valueDateTime: transaction.valueDateTime,
          additionalInformation: transaction.additionalInformation,
          additionalInformationStructured:
            transaction.additionalInformationStructured,
          balanceAfterTransaction: transaction.balanceAfterTransaction,
          accountId,
          userId,
        };

        const existingTransaction = await BankTransaction.findOne({
          transactionId: transactionData.transactionId,
        });

        if (!existingTransaction) {
          await BankTransaction.create(transactionData);
          newTransactions++;
        }

        synced++;
      } catch (transactionError) {
        const errorMessage = `Failed to process transaction: ${transactionError instanceof Error ? transactionError.message : 'Unknown error'}`;
        console.error(errorMessage, transaction);
        errors.push(errorMessage);
      }
    }
  } catch (syncError) {
    const errorMessage = `Failed to fetch transactions from GoCardless: ${syncError instanceof Error ? syncError.message : 'Unknown error'}`;
    console.error(errorMessage);
    errors.push(errorMessage);
  }

  return { synced, newTransactions, errors };
}
