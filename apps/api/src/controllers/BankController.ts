import type { Request, Response } from 'express';
import BankAccount from '../models/BankAccountModel';
import BankConnection, {
  type IBankConnection,
} from '../models/BankConnectionModel';
import { deleteFile, uploadFile } from '../services/s3Service';
import TransactionSyncService from '../services/TransactionSyncService';
import TrueLayerService from '../services/TrueLayerService';

export const getProviders = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const providers = TrueLayerService.getSupportedProviders();
    res.json(providers);
  } catch (error) {
    console.error('Get providers error:', error);
    res.status(500).json({
      error: 'Failed to fetch providers',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getAuthorizationUrl = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { redirectUri, state } = req.body;

    // Use env variable as default, fall back to request body
    const finalRedirectUri = process.env.TRUELAYER_REDIRECT_URI || redirectUri;

    if (!finalRedirectUri) {
      res.status(400).json({
        error: 'Missing redirect URI',
        message:
          'Set TRUELAYER_REDIRECT_URI env variable or provide redirectUri in request body',
      });
      return;
    }

    const authUrl = TrueLayerService.getAuthorizationUrl(
      finalRedirectUri,
      state
    );

    res.json({ authorizationUrl: authUrl, redirectUri: finalRedirectUri });
  } catch (error) {
    console.error('Get authorization URL error:', error);
    res.status(500).json({
      error: 'Failed to generate authorization URL',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const handleCallback = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { code, state } = req.query;

    // User ID is passed via state parameter since this is a redirect (no JWT)
    const userId = state as string;

    if (!userId) {
      res.status(400).json({
        error: 'Missing state parameter',
        message: 'State parameter containing user ID is required',
      });
      return;
    }

    if (!code || typeof code !== 'string') {
      res.status(400).json({
        error: 'Missing authorization code',
        message: 'Code parameter is required',
      });
      return;
    }

    const redirectUri =
      process.env.TRUELAYER_REDIRECT_URI ||
      `${req.protocol}://${req.get('host')}/api/bank/callback`;

    const tokenResponse = await TrueLayerService.exchangeCode(
      code,
      redirectUri
    );

    const accounts = await TrueLayerService.getAccounts(
      tokenResponse.access_token
    );

    if (accounts.length === 0) {
      res.status(400).json({
        error: 'No accounts found',
        message: 'No bank accounts were returned from the provider',
      });
      return;
    }

    // Get bank info from the first account's provider
    const bankName = accounts[0].provider?.display_name || 'Unknown Bank';
    // Create a normalized bank ID from the provider name
    const bankId = bankName.toLowerCase().replace(/\s+/g, '-');

    const connectedAccounts = accounts.map((account) => ({
      accountId: account.account_id,
      iban: account.account_number?.iban,
      name: account.display_name,
      type: account.account_type,
      currency: account.currency,
    }));

    // Store connection per bank (not per provider)
    await BankConnection.findOneAndUpdate(
      { userId, bankId },
      {
        bankName,
        accessToken: tokenResponse.access_token,
        refreshToken: tokenResponse.refresh_token,
        expiresAt: new Date(Date.now() + tokenResponse.expires_in * 1000),
        connectedAccounts,
      },
      { upsert: true, new: true }
    );

    // Create or update BankAccount records for each account
    for (const account of connectedAccounts) {
      await BankAccount.findOneAndUpdate(
        { userId, accountId: account.accountId },
        {
          bankId,
          bankName,
          name: account.name || 'Unknown Account',
          iban: account.iban,
          type: account.type,
          currency: account.currency || 'EUR',
        },
        { upsert: true, new: true }
      );
    }

    res.json({
      message: 'Bank connection successful',
      bank: bankName,
      accountsConnected: connectedAccounts.length,
      accounts: connectedAccounts,
    });
  } catch (error) {
    console.error('Handle callback error:', error);
    res.status(500).json({
      error: 'Failed to exchange authorization code',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Helper to refresh token if needed and return valid access token
 */
async function getValidAccessToken(
  connection: IBankConnection
): Promise<string> {
  if (new Date() >= new Date(connection.expiresAt.getTime() - 60000)) {
    const tokenResponse = await TrueLayerService.refreshAccessToken(
      connection.refreshToken
    );

    connection.accessToken = tokenResponse.access_token;
    connection.refreshToken = tokenResponse.refresh_token;
    connection.expiresAt = new Date(
      Date.now() + tokenResponse.expires_in * 1000
    );
    await connection.save();

    return tokenResponse.access_token;
  }
  return connection.accessToken;
}

/**
 * Find the connection that owns a specific account
 */
async function findConnectionByAccountId(
  userId: string,
  accountId: string
): Promise<IBankConnection | null> {
  return BankConnection.findOne({
    userId,
    'connectedAccounts.accountId': accountId,
  });
}

export const getConnections = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const connections = await BankConnection.find({ userId }).select(
      'bankId bankName alias logo connectedAccounts createdAt updatedAt'
    );

    res.json(connections);
  } catch (error) {
    console.error('Get connections error:', error);
    res.status(500).json({
      error: 'Failed to fetch connections',
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

    // Get all bank connections for the user
    const connections = await BankConnection.find({ userId });

    if (connections.length === 0) {
      res.status(404).json({
        error: 'No bank connections found',
        message: 'Please connect your bank account first',
      });
      return;
    }

    // Fetch accounts from all connected banks
    const allAccounts = [];

    for (const connection of connections) {
      try {
        const accessToken = await getValidAccessToken(connection);
        const accounts = await TrueLayerService.getAccounts(accessToken);

        // Add bank info to each account
        const accountsWithBank = accounts.map((account) => ({
          ...account,
          bankId: connection.bankId,
          bankName: connection.bankName,
        }));

        allAccounts.push(...accountsWithBank);
      } catch (err) {
        console.error(
          `Failed to fetch accounts from ${connection.bankName}:`,
          err
        );
        // Continue with other banks even if one fails
      }
    }

    res.json(allAccounts);
  } catch (error) {
    console.error('Get accounts error:', error);
    res.status(500).json({
      error: 'Failed to fetch accounts',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getBalance = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { accountId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    if (!accountId) {
      res.status(400).json({
        error: 'Missing account ID',
        message: 'Account ID is required',
      });
      return;
    }

    // Find which bank connection owns this account
    const connection = await findConnectionByAccountId(userId, accountId);

    if (!connection) {
      res.status(404).json({
        error: 'Account not found',
        message: 'No bank connection found for this account',
      });
      return;
    }

    const accessToken = await getValidAccessToken(connection);
    const balance = await TrueLayerService.getBalance(accessToken, accountId);

    res.json(balance);
  } catch (error) {
    console.error('Get balance error:', error);
    res.status(500).json({
      error: 'Failed to fetch balance',
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
    const { from, to } = req.query;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    if (!accountId) {
      res.status(400).json({
        error: 'Missing account ID',
        message: 'Account ID is required',
      });
      return;
    }

    // Find which bank connection owns this account
    const connection = await findConnectionByAccountId(userId, accountId);

    if (!connection) {
      res.status(404).json({
        error: 'Account not found',
        message: 'No bank connection found for this account',
      });
      return;
    }

    const accessToken = await getValidAccessToken(connection);
    const transactions = await TrueLayerService.getTransactions(
      accessToken,
      accountId,
      from as string | undefined,
      to as string | undefined
    );

    res.json(transactions);
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      error: 'Failed to fetch transactions',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const updateConnection = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { bankId } = req.params;
    const { alias } = req.body;
    const userId = req.user?.id;
    const logoFile = req.file;

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const updateFields: Record<string, string | undefined> = {};
    if (alias !== undefined) updateFields.alias = alias;

    // Handle logo file upload
    if (logoFile) {
      // Get current connection to check for old logo
      const currentConnection = await BankConnection.findOne({ userId, bankId });
      if (
        currentConnection?.logo?.includes('s3.') &&
        currentConnection.logo.includes('bank-logo')
      ) {
        try {
          await deleteFile(currentConnection.logo);
        } catch (err) {
          console.error('Failed to delete old bank logo:', err);
        }
      }

      // Upload new logo
      const logoUrl = await uploadFile(logoFile.buffer, logoFile.originalname, {
        userId,
        mediaType: 'bank-logo',
        fileName: `${bankId}-logo${getExtensionFromMimetype(logoFile.mimetype)}`,
      });

      updateFields.logo = logoUrl;
    }

    const connection = await BankConnection.findOneAndUpdate(
      { userId, bankId },
      { $set: updateFields },
      { new: true }
    ).select('bankId bankName alias logo connectedAccounts createdAt updatedAt');

    if (!connection) {
      res.status(404).json({
        error: 'Connection not found',
        message: 'No bank connection found with this ID',
      });
      return;
    }

    res.json(connection);
  } catch (error) {
    console.error('Update connection error:', error);
    res.status(500).json({
      error: 'Failed to update connection',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

function getExtensionFromMimetype(mimetype: string): string {
  const map: Record<string, string> = {
    'image/png': '.png',
    'image/jpeg': '.jpg',
    'image/webp': '.webp',
    'image/svg+xml': '.svg',
  };
  return map[mimetype] || '.png';
}

export const deleteConnection = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { bankId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const result = await BankConnection.findOneAndDelete({ userId, bankId });

    if (!result) {
      res.status(404).json({
        error: 'Connection not found',
        message: 'No bank connection found with this ID',
      });
      return;
    }

    res.json({ message: 'Bank connection deleted successfully' });
  } catch (error) {
    console.error('Delete connection error:', error);
    res.status(500).json({
      error: 'Failed to delete connection',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const syncUserTransactions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const result = await TransactionSyncService.syncUserTransactions(userId);

    res.json({
      message: 'Transactions synced successfully',
      ...result,
    });
  } catch (error) {
    console.error('Sync transactions error:', error);
    res.status(500).json({
      error: 'Failed to sync transactions',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
