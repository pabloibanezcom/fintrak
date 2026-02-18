import type { UserProducts } from './UserProducts';

/**
 * Daily snapshot of a user's aggregated products.
 *
 * @group Financial Types
 */
export interface ProductSnapshot {
  /** Snapshot identifier */
  id?: string;

  /** Owner user ID */
  userId: string;

  /** Snapshot date (normalized day) */
  date: Date;

  /** Stored product payload */
  snapshot: UserProducts;

  /** Creation timestamp */
  createdAt?: Date;
}
