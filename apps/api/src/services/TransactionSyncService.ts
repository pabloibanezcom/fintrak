import type { TrueLayerTransaction } from '@fintrak/types';
import BankConnection, {
  type IBankConnection,
} from '../models/BankConnectionModel';
import BankTransaction, {
  type IBankTransaction,
} from '../models/BankTransactionModel';
import Category from '../models/CategoryModel';
import Counterparty from '../models/CounterpartyModel';
import Expense from '../models/ExpenseModel';
import Income from '../models/IncomeModel';
import * as PushNotificationService from './PushNotificationService';
import TrueLayerService from './TrueLayerService';

const UNCATEGORIZED_KEY = 'otros';
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
 * Match transaction description to a category using keywords
 */
async function matchCategory(
  userId: string,
  description: string
): Promise<string | null> {
  const categories = await Category.find({ userId });

  for (const category of categories) {
    if (category.keywords && category.keywords.length > 0) {
      const matched = category.keywords.some((keyword: string) =>
        description.toLowerCase().includes(keyword.toLowerCase())
      );
      if (matched) {
        return String(category._id);
      }
    }
  }

  // Return the "otros" (uncategorized) category
  const uncategorized = await Category.findOne({
    userId,
    key: UNCATEGORIZED_KEY,
  });
  return uncategorized ? String(uncategorized._id) : null;
}

/**
 * Find existing counterparty by merchant name
 */
async function findCounterparty(
  userId: string,
  merchantName: string | undefined
): Promise<string | null> {
  if (!merchantName) return null;

  const counterparty = await Counterparty.findOne({
    userId,
    name: { $regex: merchantName, $options: 'i' },
  });

  return counterparty ? String(counterparty._id) : null;
}

/**
 * Process a new bank transaction - create expense/income and send notification
 */
async function processNewTransaction(
  txn: IBankTransaction,
  accountName: string
): Promise<void> {
  // 1. Match category
  const categoryId = await matchCategory(txn.userId, txn.description);
  if (!categoryId) {
    console.warn(
      `No category found for user ${txn.userId}, skipping expense/income creation`
    );
    return;
  }

  // 2. Find counterparty
  const counterpartyId = await findCounterparty(txn.userId, txn.merchantName);

  // 3. Create expense or income
  const commonFields = {
    title: txn.description,
    amount: Math.abs(txn.amount),
    currency: txn.currency,
    category: categoryId,
    date: txn.timestamp,
    periodicity: 'NOT_RECURRING',
    description: `Auto-imported from ${txn.bankId}`,
    bankTransactionId: txn._id,
    userId: txn.userId,
  };

  if (txn.type === 'DEBIT') {
    await Expense.create({
      ...commonFields,
      payee: counterpartyId || undefined,
    });
    console.log(`Created expense for transaction ${txn.transactionId}`);
  } else {
    await Income.create({
      ...commonFields,
      source: counterpartyId || undefined,
    });
    console.log(`Created income for transaction ${txn.transactionId}`);
  }

  // 4. Mark as processed
  txn.processed = true;
  await txn.save();

  // 5. Send push notification
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
            // Try to insert (will fail silently if duplicate)
            const bankTxn = await BankTransaction.findOneAndUpdate(
              {
                userId: connection.userId,
                transactionId: txn.transaction_id,
              },
              {
                $setOnInsert: mapTrueLayerTransaction(
                  connection.userId,
                  account.accountId,
                  connection.bankId,
                  txn
                ),
              },
              { upsert: true, new: true }
            );

            // If this is a new transaction (not processed yet), process it
            if (!bankTxn.processed) {
              await processNewTransaction(
                bankTxn,
                account.name || 'Bank Account'
              );
              synced++;
            }
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
