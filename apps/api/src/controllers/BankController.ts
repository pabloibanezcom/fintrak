import type { Request, Response } from 'express';
import TinkService from '../services/TinkService';

export const getProviders = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log('=== GET PROVIDERS REQUEST ===');
    const market = (req.query.market as string) || 'ES';
    console.log('Market:', market);

    // Extract user token if provided (Tink requires USER token for this endpoint)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      TinkService.setUserToken(token);
    }

    const providers = await TinkService.getProviders(market);

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

    if (!redirectUri) {
      res.status(400).json({
        error: 'Missing required field',
        message: 'redirectUri is required',
      });
      return;
    }

    const authUrl = TinkService.getAuthorizationUrl(redirectUri, state);

    res.json({ authorizationUrl: authUrl });
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
    const { code } = req.query;

    if (!code || typeof code !== 'string') {
      res.status(400).json({
        error: 'Missing authorization code',
        message: 'Code parameter is required',
      });
      return;
    }

    const tokenResponse = await TinkService.exchangeAuthorizationCode(code);

    // In a real app, you'd store these tokens securely associated with the user
    res.json({
      message: 'Authorization successful',
      accessToken: tokenResponse.access_token,
      expiresIn: tokenResponse.expires_in,
      refreshToken: tokenResponse.refresh_token,
    });
  } catch (error) {
    console.error('Handle callback error:', error);
    res.status(500).json({
      error: 'Failed to exchange authorization code',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getAccounts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        error: 'Missing authorization token',
        message: 'Please provide a Bearer token',
      });
      return;
    }

    const token = authHeader.substring(7);
    TinkService.setUserToken(token);

    const accounts = await TinkService.getAccounts();

    res.json(accounts);
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
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        error: 'Missing authorization token',
        message: 'Please provide a Bearer token',
      });
      return;
    }

    const token = authHeader.substring(7);
    TinkService.setUserToken(token);

    const transactions = accountId
      ? await TinkService.getTransactions(accountId)
      : await TinkService.getAllTransactions();

    res.json(transactions);
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      error: 'Failed to fetch transactions',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
