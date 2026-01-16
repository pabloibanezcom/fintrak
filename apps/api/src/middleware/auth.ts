/// <reference path="../index.d.ts" />
import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'defaultsecret';

/**
 * Authentication middleware for protected routes
 *
 * Validates JWT tokens and attaches authenticated user data to the request object.
 * Tokens must be provided in the Authorization header using the Bearer scheme.
 *
 * @example
 * // Protecting a route
 * router.get('/protected', authenticate, protectedHandler);
 *
 * // Accessing user in controller
 * function protectedHandler(req: Request, res: Response) {
 *   const userId = req.user.id; // Available after authentication
 * }
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 *
 * @throws {401} Missing or invalid token - When Authorization header is missing or malformed
 * @throws {401} Invalid token - When JWT verification fails (expired, wrong signature, etc.)
 *
 * @security
 * - Only accepts "Bearer" prefix (case-sensitive)
 * - Validates token using JWT_SECRET environment variable
 * - Does not support other authentication schemes
 */
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ error: 'Missing or invalid token' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    req.user = { id: decoded.userId }; // Add `user` to req type
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};
