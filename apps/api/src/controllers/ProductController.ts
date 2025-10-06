import type { Request, Response } from 'express';
import { fetchUserProducts } from '../services/MI';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const userData = await fetchUserProducts(userId);
    res.json(userData);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
};
