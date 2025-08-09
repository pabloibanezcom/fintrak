import type { Request, Response } from 'express';
import { fetchUserProducts } from '../services/MI';

export const getProducts = async (_req: Request, res: Response) => {
  try {
    const userData = await fetchUserProducts();
    res.json(userData);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
};
