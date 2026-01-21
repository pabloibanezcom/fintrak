/**
 * Represents a device token for push notifications.
 *
 * @group Notification Types
 */
export interface DeviceToken {
  /** Device token ID */
  id?: string;

  /** User ID who owns this device */
  userId: string;

  /** Expo push token (ExponentPushToken[xxx]) */
  token: string;

  /** Device platform */
  platform: 'ios' | 'android';

  /** Whether the token is active */
  active: boolean;

  /** When the token was created */
  createdAt?: Date;

  /** When the token was last updated */
  updatedAt?: Date;
}

/**
 * Request payload for registering a device for push notifications.
 *
 * @group Notification Types
 */
export interface RegisterDeviceRequest {
  /** Expo push token */
  token: string;

  /** Device platform */
  platform: 'ios' | 'android';
}

/**
 * Payload for a push notification.
 *
 * @group Notification Types
 */
export interface PushNotificationPayload {
  /** Notification title */
  title: string;

  /** Notification body text */
  body: string;

  /** Additional data to include */
  data?: Record<string, unknown>;
}

/**
 * Represents a stored bank transaction from TrueLayer.
 *
 * @group Transaction Types
 */
export interface StoredBankTransaction {
  /** Internal ID */
  id?: string;

  /** User ID who owns this transaction */
  userId: string;

  /** Bank account ID */
  accountId: string;

  /** Bank identifier (e.g., 'santander', 'bbva') */
  bankId: string;

  /** TrueLayer transaction ID */
  transactionId: string;

  /** Transaction timestamp */
  timestamp: Date;

  /** Transaction amount */
  amount: number;

  /** ISO currency code */
  currency: string;

  /** Transaction type */
  type: 'CREDIT' | 'DEBIT';

  /** Transaction description */
  description: string;

  /** Merchant name if available */
  merchantName?: string;

  /** TrueLayer category */
  trueLayerCategory?: string;

  /** Transaction status */
  status: 'pending' | 'settled';

  /** Whether expense/income has been created */
  processed: boolean;

  /** Whether push notification was sent */
  notified: boolean;

  /** Raw TrueLayer response */
  raw?: object;

  /** When the record was created */
  createdAt?: Date;

  /** When the record was last updated */
  updatedAt?: Date;
}
