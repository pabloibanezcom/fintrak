/**
 * Authentication and API response types.
 * 
 * @group Authentication Types
 */

/**
 * Request payload for user login.
 */
export interface LoginRequest {
  /** User's email address */
  email: string;
  /** User's password */
  password: string;
}

/**
 * Response from successful login.
 */
export interface AuthResponse {
  /** JWT authentication token */
  token: string;
}

/**
 * Request payload for user registration.
 */
export interface RegisterRequest {
  /** User's email address */
  email: string;
  /** User's password */
  password: string;
}

/**
 * Response from successful registration.
 */
export interface RegisterResponse {
  /** User's unique identifier */
  id: string;
  /** User's email address */
  email: string;
}

/**
 * Pagination metadata for API responses.
 */
export interface PaginationInfo {
  /** Total number of items available */
  total: number;
  /** Number of items per page */
  limit: number;
  /** Number of items to skip */
  offset: number;
  /** Whether there are more items available */
  hasMore: boolean;
}

/**
 * Response structure for expense search endpoint.
 */
export interface ExpensesResponse {
  /** Array of expense records */
  expenses: import('./Expense').Expense[];
  /** Pagination information */
  pagination: PaginationInfo;
  /** Applied filters (optional) */
  filters?: Record<string, any>;
  /** Applied sorting (optional) */
  sort?: Record<string, any>;
  /** Total amount of all matching expenses (when includeTotal=true) */
  totalAmount?: number;
}