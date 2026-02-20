import type { PushNotificationPayload } from '@fintrak/types';
import Expo, {
  type ExpoPushMessage,
  type ExpoPushTicket,
} from 'expo-server-sdk';
import type { IBankTransaction } from '../models/BankTransactionModel';
import DeviceToken, { type IDeviceToken } from '../models/DeviceTokenModel';

const expo = new Expo({
  accessToken: process.env.EXPO_ACCESS_TOKEN,
});

/**
 * Register a device for push notifications
 */
export async function registerDevice(
  userId: string,
  token: string,
  platform: 'ios' | 'android'
): Promise<IDeviceToken> {
  // Validate the token format
  if (!Expo.isExpoPushToken(token)) {
    throw new Error(`Invalid Expo push token: ${token}`);
  }

  // Upsert the device token (reactivate if it was previously deactivated)
  const deviceToken = await DeviceToken.findOneAndUpdate(
    { userId, token },
    { userId, token, platform, active: true },
    { upsert: true, new: true }
  );

  return deviceToken;
}

/**
 * Unregister a device from push notifications
 */
export async function unregisterDevice(
  userId: string,
  token: string
): Promise<void> {
  await DeviceToken.findOneAndUpdate({ userId, token }, { active: false });
}

/**
 * Send push notification to all active devices for a user
 */
export async function sendNotification(
  userId: string,
  notification: PushNotificationPayload
): Promise<ExpoPushTicket[]> {
  const tokens = await DeviceToken.find({ userId, active: true });

  if (tokens.length === 0) {
    console.log(`No active devices for user ${userId}`);
    return [];
  }

  const messages: ExpoPushMessage[] = tokens.map((t) => ({
    to: t.token,
    sound: 'default' as const,
    title: notification.title,
    body: notification.body,
    data: notification.data,
  }));

  // Send in chunks (Expo recommends max 100 per request)
  const chunks = expo.chunkPushNotifications(messages);
  const tickets: ExpoPushTicket[] = [];

  for (const chunk of chunks) {
    try {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);

      // Handle invalid tokens
      for (let i = 0; i < ticketChunk.length; i++) {
        const ticket = ticketChunk[i];
        if (ticket.status === 'error') {
          const token = tokens[i];
          console.error(
            `Error sending notification to ${token.token}:`,
            ticket.message
          );

          // Deactivate invalid tokens
          if (
            ticket.details?.error === 'DeviceNotRegistered' ||
            ticket.details?.error === 'InvalidCredentials'
          ) {
            await DeviceToken.findByIdAndUpdate(token._id, { active: false });
            console.log(`Deactivated invalid token: ${token.token}`);
          }
        }
      }
    } catch (error) {
      console.error('Error sending push notification chunk:', error);
    }
  }

  return tickets;
}

/**
 * Send a transaction notification to a user
 */
export async function sendTransactionNotification(
  userId: string,
  transaction: IBankTransaction,
  accountName: string
): Promise<ExpoPushTicket[]> {
  const isCredit = transaction.type === 'CREDIT';
  const sign = isCredit ? '+' : '-';
  const emoji = isCredit ? '💰' : '💸';
  const title = isCredit ? `${emoji} Money received` : `${emoji} Payment made`;

  const formattedAmount = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: transaction.currency,
  }).format(Math.abs(transaction.amount));

  const body = `${sign}${formattedAmount} - ${transaction.description}`;

  return sendNotification(userId, {
    title,
    body,
    data: {
      type: 'new_transaction',
      transactionId: transaction.transactionId,
      accountId: transaction.accountId,
      bankId: transaction.bankId,
      accountName,
    },
  });
}

export default {
  registerDevice,
  unregisterDevice,
  sendNotification,
  sendTransactionNotification,
};
