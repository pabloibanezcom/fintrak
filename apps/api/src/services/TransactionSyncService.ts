import type { TrueLayerTransaction } from '@fintrak/types';
import BankConnection, {
  type IBankConnection,
} from '../models/BankConnectionModel';
import BankTransaction, {
  type IBankTransaction,
} from '../models/BankTransactionModel';
import * as PushNotificationService from './PushNotificationService';
import TrueLayerService from './TrueLayerService';

const SYNC_DAYS_BACK = 7;

/**
 * Get a valid access token, refreshing if necessary
 */
async function getValidAccessToken(
  connection: IBankConnection
): Promise<string> {
  // Check if token expires within 1 minute
  if (new Date() >= new Date(connection.expiresAt.getTime() - 60000)) {
    console.log(
      `Refreshing token for user ${connection.userId}, bank ${connection.bankId}`
    );

    const tokenResponse = await TrueLayerService.refreshAccessToken(
      connection.refreshToken
    );

    connection.accessToken = tokenResponse.access_token;
    connection.refreshToken = tokenResponse.refresh_token;
    connection.expiresAt = new Date(
      Date.now() + tokenResponse.expires_in * 1000
    );
    await connection.save();
  }

  return connection.accessToken;
}

/**
 * Send notification for a new bank transaction
 */
async function notifyNewTransaction(
  txn: IBankTransaction,
  accountName: string
): Promise<void> {
  if (txn.notified) return;

  try {
    await PushNotificationService.sendTransactionNotification(
      txn.userId,
      txn,
      accountName
    );
    txn.notified = true;
    await txn.save();
    console.log(`Sent notification for transaction ${txn.transactionId}`);
  } catch (error) {
    console.error(
      `Failed to send notification for transaction ${txn.transactionId}:`,
      error
    );
  }
}

/**
 * Convert TrueLayer transaction to BankTransaction document
 */
function mapTrueLayerTransaction(
  userId: string,
  accountId: string,
  bankId: string,
  txn: TrueLayerTransaction
): Partial<IBankTransaction> {
  return {
    userId,
    accountId,
    bankId,
    transactionId: txn.transaction_id,
    timestamp: new Date(txn.timestamp),
    amount: txn.amount,
    currency: txn.currency,
    type: txn.transaction_type as 'CREDIT' | 'DEBIT',
    description: txn.description || 'No description',
    merchantName: txn.merchant_name,
    trueLayerCategory: txn.transaction_category,
    status: 'settled',
    processed: false,
    notified: false,
    raw: txn,
  };
}

/**
 * Sync transactions for a single bank connection
 * Stores new transactions and sends notifications (no auto expense/income creation)
 */
async function syncBankConnection(
  connection: IBankConnection
): Promise<{ synced: number; errors: number }> {
  let synced = 0;
  let errors = 0;

  try {
    const accessToken = await getValidAccessToken(connection);

    // Calculate date range (last 7 days)
    const toDate = new Date();
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - SYNC_DAYS_BACK);

    for (const account of connection.connectedAccounts) {
      try {
        console.log(
          `Syncing account ${account.accountId} for user ${connection.userId}`
        );

        // Fetch transactions from TrueLayer
        const transactions = await TrueLayerService.getTransactions(
          accessToken,
          account.accountId,
          fromDate.toISOString(),
          toDate.toISOString()
        );

        console.log(
          `Fetched ${transactions.length} transactions from TrueLayer`
        );

        for (const txn of transactions) {
          try {
            // Check if transaction already exists
            const existing = await BankTransaction.findOne({
              userId: connection.userId,
              transactionId: txn.transaction_id,
            });

            if (existing) {
              // Transaction already exists, skip
              continue;
            }

            // Create new transaction
            const newTransaction = await BankTransaction.create(
              mapTrueLayerTransaction(
                connection.userId,
                account.accountId,
                connection.bankId,
                txn
              )
            );

            // Send notification for new transaction
            await notifyNewTransaction(
              newTransaction,
              account.name || 'Bank Account'
            );
            synced++;
          } catch (error) {
            console.error(
              `Error processing transaction ${txn.transaction_id}:`,
              error
            );
            errors++;
          }
        }
      } catch (error) {
        console.error(`Error syncing account ${account.accountId}:`, error);
        errors++;
      }
    }
  } catch (error) {
    console.error(
      `Error syncing bank connection for user ${connection.userId}:`,
      error
    );
    errors++;
  }

  return { synced, errors };
}

/**
 * Sync transactions for all users with bank connections
 */
export async function syncAllUsers(): Promise<{
  totalSynced: number;
  totalErrors: number;
  usersProcessed: number;
}> {
  console.log('Starting transaction sync for all users...');

  const connections = await BankConnection.find({});
  console.log(`Found ${connections.length} bank connections to sync`);

  let totalSynced = 0;
  let totalErrors = 0;

  for (const connection of connections) {
    const result = await syncBankConnection(connection);
    totalSynced += result.synced;
    totalErrors += result.errors;
  }

  console.log(
    `Sync complete. Synced: ${totalSynced}, Errors: ${totalErrors}, Connections: ${connections.length}`
  );

  return {
    totalSynced,
    totalErrors,
    usersProcessed: connections.length,
  };
}

/**
 * Sync transactions for a specific user
 */
export async function syncUserTransactions(userId: string): Promise<{
  synced: number;
  errors: number;
}> {
  console.log(`Starting transaction sync for user ${userId}...`);

  const connections = await BankConnection.find({ userId });
  console.log(`Found ${connections.length} bank connections for user`);

  let totalSynced = 0;
  let totalErrors = 0;

  for (const connection of connections) {
    const result = await syncBankConnection(connection);
    totalSynced += result.synced;
    totalErrors += result.errors;
  }

  return { synced: totalSynced, errors: totalErrors };
}

export default {
  syncAllUsers,
  syncUserTransactions,
};
