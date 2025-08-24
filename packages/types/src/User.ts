import type { UserProducts } from "./UserProducts";

/**
 * Represents a user in the Fintrak system with their financial products.
 * 
 * @group Core Types
 */
export interface User {
  /** All financial products owned by the user */
  products: UserProducts;
}
