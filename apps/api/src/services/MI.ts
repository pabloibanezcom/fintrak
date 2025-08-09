import type {
  CashAccount,
  Deposit,
  IndexedFund,
  UserProducts,
} from '@fintrak/types';
import axios from 'axios';
import {
  MICashAccountsToUserCashAccounts,
  MIDepositsToUserDeposits,
  MIIndexedFundsToIndexedFunds,
} from './MICast';

let token: string | null = null;
let expiresAt = 0;

async function loginToMI(): Promise<{
  token: string;
  refreshToken: string;
  expiresIn: number;
  refreshExpiresIn: number;
}> {
  if (!process.env.MI_AUTH_UI) {
    throw new Error('MI_AUTH_UI environment variable is not defined');
  }
  const response = await axios.post(process.env.MI_AUTH_UI, {
    accessType: 'USERNAME',
    customerId: process.env.MI_USER,
    password: process.env.MI_PASS,
  });

  const accessToken = response.data.payload.data.accessToken;
  const refreshToken = response.data.payload.data.refreshToken;
  const expiresIn = response.data.payload.data.expiresIn || 3600;
  const refreshExpiresIn = response.data.payload.data.refreshExpiresIn || 3600;

  return { token: accessToken, refreshToken, expiresIn, refreshExpiresIn };
}

async function getToken(): Promise<string> {
  const now = Date.now();
  if (!token || now >= expiresAt) {
    const result = await loginToMI();
    token = result.token;
    expiresAt = now + result.expiresIn * 1000;
  }
  return token;
}

async function fetchDeposits(): Promise<Deposit[]> {
  try {
    const accessToken = await getToken();
    const response = await axios.get(`${process.env.MI_API}/deposits/self`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return MIDepositsToUserDeposits(response.data?.payload?.data);
  } catch (err: any) {
    console.error('Error fetching deposits:', err.message);
    if (err.response?.status === 401) {
      token = null; // clear token and retry
      return fetchDeposits();
    }
    return [];
  }
}

async function fetchCashAccounts(): Promise<CashAccount[]> {
  try {
    const accessToken = await getToken();
    const response = await axios.get(
      `${process.env.MI_API}/cash-accounts/self`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return MICashAccountsToUserCashAccounts(response.data?.payload?.data);
  } catch (err: any) {
    console.error('Error fetching cash accounts:', err.message);
    if (err.response?.status === 401) {
      token = null; // clear token and retry
      return fetchCashAccounts();
    }
    return [];
  }
}

async function fetchIndexedFunds(): Promise<IndexedFund[]> {
  try {
    const accessToken = await getToken();
    const response = await axios.get(
      `${process.env.MI_API}/securities-accounts/self`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return MIIndexedFundsToIndexedFunds(
      response.data?.payload?.data?.find(
        (e: any) => e.accountType === 'SECURITIES_ACCOUNT'
      )?.securitiesAccountInvestments?.INDEXED_FUND?.investmentList || []
    );
  } catch (err: any) {
    console.error('Error fetching indexed funds:', err.message);
    if (err.response?.status === 401) {
      token = null; // clear token and retry
      return fetchIndexedFunds();
    }
    return [];
  }
}

export const fetchUserProducts = async (): Promise<UserProducts> => {
  try {
    console.log('Fetching user products...');
    const deposits = await fetchDeposits();
    const cashAccounts = await fetchCashAccounts();
    const indexedFunds = await fetchIndexedFunds();
    return {
      cashAccounts,
      deposits,
      indexedFunds,
    };
  } catch (err: any) {
    console.error('Error fetching user products:', err.message);
    // Handle error appropriately, e.g., return empty products or throw
    return { deposits: [], cashAccounts: [], indexedFunds: [] };
  }
};
