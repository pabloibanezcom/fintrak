import type { Request, Response } from 'express';
import { type MediaType, uploadFile } from '../services/s3Service';
import { logError } from '../utils/logging';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

/**
 * Upload media file to S3
 */
export async function uploadMedia(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    if (!req.user?.id) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const { buffer, originalname } = req.file;
    const { type } = req.body;

    // Validate media type
    const validTypes: MediaType[] = [
      'counterparty-logo',
      'profile-picture',
      'receipt',
      'document',
      'other',
    ];
    const mediaType: MediaType = validTypes.includes(type) ? type : 'other';

    // Upload to S3
    const url = await uploadFile(buffer, originalname, {
      userId: req.user.id,
      mediaType,
    });

    res.status(200).json({
      url,
      type: mediaType,
      userId: req.user.id,
    });
  } catch (error) {
    logError('Error uploading media:', error);
    res.status(500).json({
      error: 'Failed to upload media',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
