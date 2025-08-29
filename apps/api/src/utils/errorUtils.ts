import type { Response } from 'express';

export const handleAuthError = (res: Response): Response => {
  return res.status(401).json({ error: 'User not authenticated' });
};

export const handleNotFoundError = (
  res: Response,
  resourceName: string
): Response => {
  return res.status(404).json({ error: `${resourceName} not found` });
};

export const handleValidationError = (
  res: Response,
  error: any,
  resourceName?: string
): Response => {
  if (
    error instanceof Error &&
    'name' in error &&
    error.name === 'ValidationError'
  ) {
    return res
      .status(400)
      .json({ error: 'Validation failed', details: error.message });
  }
  return res
    .status(500)
    .json({ error: `Failed to process ${resourceName || 'request'}` });
};

export const handleGenericError = (
  res: Response,
  operation: string,
  error: any
): Response => {
  console.error(`Error ${operation}:`, error);
  return res.status(500).json({ error: `Failed to ${operation}` });
};
