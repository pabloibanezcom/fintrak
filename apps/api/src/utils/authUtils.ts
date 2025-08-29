import type { Request, Response } from 'express';

export const getUserId = (req: Request): string | null => {
  return req.user?.id || null;
};

export const requireAuth = (req: Request, res: Response): string | null => {
  const userId = getUserId(req);
  if (!userId) {
    res.status(401).json({ error: 'User not authenticated' });
    return null;
  }
  return userId;
};
