import type {
  BankAccount,
  CashAccount,
  TrueLayerAccount,
  TrueLayerBalance,
} from "@fintrak/types";
import BankAccountModel from "../models/BankAccountModel";
import BankConnection, {
  type IBankConnection,
} from "../models/BankConnectionModel";
import TrueLayerService from "./TrueLayerService";

// Bank logo URLs stored in public assets path
const MYINVESTOR_LOGO =
  "https://fintrak-media-prod.s3.eu-west-1.amazonaws.com/assets/bank-logos/myinvestor.png";

interface AggregatorResult {
  accounts: BankAccount[];
  errors: { source: string; message: string }[];
}

/**
 * Helper to refresh token if needed and return valid access token
 */
async function getValidAccessToken(
  connection: IBankConnection,
): Promise<string> {
  if (new Date() >= new Date(connection.expiresAt.getTime() - 60000)) {
    const tokenResponse = await TrueLayerService.refreshAccessToken(
      connection.refreshToken,
    );

    connection.accessToken = tokenResponse.access_token;
    connection.refreshToken = tokenResponse.refresh_token;
    connection.expiresAt = new Date(
      Date.now() + tokenResponse.expires_in * 1000,
    );
    await connection.save();

    return tokenResponse.access_token;
  }
  return connection.accessToken;
}

/**
 * Transform MyInvestor CashAccount to unified BankAccount
 */
function transformMICashAccount(account: CashAccount): BankAccount {
  return {
    accountId: account.accountId,
    source: "myinvestor",
    bankName: "MyInvestor",
    bankId: "myinvestor",
    logo: MYINVESTOR_LOGO,
    displayName: account.alias,
    iban: account.iban,
    accountType: "CASH",
    currency: account.currency,
    balance: account.balance,
  };
}

/**
 * Map TrueLayer account type to unified account type
 */
function mapAccountType(
  trueLayerType: string,
): "TRANSACTION" | "SAVINGS" | "CASH" | "OTHER" {
  switch (trueLayerType) {
    case "TRANSACTION":
      return "TRANSACTION";
    case "SAVINGS":
      return "SAVINGS";
    default:
      return "OTHER";
  }
}

/**
 * Transform TrueLayer account + balance to unified BankAccount
 */
function transformTrueLayerAccount(
  account: TrueLayerAccount,
  balance: TrueLayerBalance,
  connection: { bankId: string; bankName: string; logo?: string; alias?: string },
): BankAccount {
  return {
    accountId: account.account_id,
    source: "truelayer",
    bankName: connection.bankName,
    bankId: connection.bankId,
    logo: connection.logo,
    displayName: connection.alias || account.display_name || "Bank Account",
    iban: account.account_number?.iban,
    accountType: mapAccountType(account.account_type),
    currency: account.currency,
    balance: balance.current,
    availableBalance: balance.available,
  };
}

/**
 * Fetch all TrueLayer accounts with balances for a user
 */
async function fetchTrueLayerAccounts(userId: string): Promise<{
  accounts: BankAccount[];
  errors: { source: string; message: string }[];
}> {
  const connections = await BankConnection.find({ userId });
  const accounts: BankAccount[] = [];
  const errors: { source: string; message: string }[] = [];

  // Fetch stored account aliases from BankAccount model
  const storedAccounts = await BankAccountModel.find({ userId });
  const accountAliasMap = new Map(
    storedAccounts.map((acc) => [acc.accountId, acc.alias])
  );

  for (const connection of connections) {
    try {
      const accessToken = await getValidAccessToken(connection);
      const trueLayerAccounts = await TrueLayerService.getAccounts(accessToken);

      // Fetch balances for each account in parallel
      const accountsWithBalances = await Promise.all(
        trueLayerAccounts.map(async (account) => {
          const accountAlias = accountAliasMap.get(account.account_id);
          try {
            const balance = await TrueLayerService.getBalance(
              accessToken,
              account.account_id,
            );
            return transformTrueLayerAccount(account, balance, {
              bankId: connection.bankId,
              bankName: connection.bankName,
              logo: connection.logo,
              alias: accountAlias,
            });
          } catch (err) {
            console.error(
              `Failed to fetch balance for account ${account.account_id}:`,
              err,
            );
            // Return account with 0 balance if balance fetch fails
            return transformTrueLayerAccount(
              account,
              { current: 0, available: 0, currency: account.currency },
              {
                bankId: connection.bankId,
                bankName: connection.bankName,
                logo: connection.logo,
                alias: accountAlias,
              },
            );
          }
        }),
      );

      accounts.push(...accountsWithBalances);
    } catch (err) {
      console.error(
        `Failed to fetch accounts from ${connection.bankName}:`,
        err,
      );
      errors.push({
        source: `truelayer:${connection.bankId}`,
        message:
          err instanceof Error ? err.message : "Failed to fetch accounts",
      });
    }
  }

  return { accounts, errors };
}

/**
 * Aggregates bank accounts from all sources (MyInvestor and TrueLayer)
 */
export async function aggregateBankAccounts(
  userId: string,
  miCashAccounts: CashAccount[],
): Promise<AggregatorResult> {
  const errors: { source: string; message: string }[] = [];

  // Transform MyInvestor cash accounts
  const miBankAccounts = miCashAccounts.map(transformMICashAccount);

  // Fetch TrueLayer accounts
  const trueLayerResult = await fetchTrueLayerAccounts(userId);
  errors.push(...trueLayerResult.errors);

  // Combine all accounts and filter out zero-balance accounts
  // (negative balances are kept as they indicate active/overdrawn accounts)
  const allAccounts = [...miBankAccounts, ...trueLayerResult.accounts].filter(
    (account) => account.balance !== 0
  );

  return {
    accounts: allAccounts,
    errors,
  };
}

export default {
  aggregateBankAccounts,
};
