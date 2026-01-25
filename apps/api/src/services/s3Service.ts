import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import crypto from 'crypto';
import path from 'path';

const REGION = process.env.AWS_REGION || 'eu-west-1';
const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'fintrak-media-prod';

// Initialize S3 Client
// AWS SDK will automatically pick up credentials from:
// 1. Environment variables (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)
// 2. AWS credentials file (~/.aws/credentials)
// 3. IAM role (if running on AWS)
const s3Client = new S3Client({
  region: REGION,
});

export type MediaType =
  | 'bank-logo'
  | 'counterparty-logo'
  | 'profile-picture'
  | 'receipt'
  | 'document'
  | 'other';

export interface UploadOptions {
  userId: string;
  mediaType: MediaType;
  contentType?: string;
  fileName?: string;
}

/**
 * Upload a file to S3 organized by user ID and media type
 */
export async function uploadFile(
  fileBuffer: Buffer,
  originalFileName: string,
  options: UploadOptions
): Promise<string> {
  const { userId, mediaType, contentType, fileName } = options;

  // Generate unique filename
  const fileExtension = path.extname(originalFileName);
  const uniqueFileName =
    fileName || `${crypto.randomBytes(16).toString('hex')}${fileExtension}`;

  // Organize files: users/{userId}/{mediaType}/{filename}
  const key = `users/${userId}/${mediaType}/${uniqueFileName}`;

  // Determine content type
  const finalContentType =
    contentType || getContentTypeFromExtension(fileExtension);

  try {
    // Use Upload for better handling of large files
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: BUCKET_NAME,
        Key: key,
        Body: fileBuffer,
        ContentType: finalContentType,
      },
    });

    await upload.done();

    // Return the public URL
    return `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${key}`;
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw new Error(`Failed to upload file to S3: ${error}`);
  }
}

/**
 * Delete a file from S3
 */
export async function deleteFile(fileUrl: string): Promise<void> {
  try {
    // Extract key from URL
    const url = new URL(fileUrl);
    const key = url.pathname.substring(1); // Remove leading slash

    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
  } catch (error) {
    console.error('Error deleting from S3:', error);
    throw new Error(`Failed to delete file from S3: ${error}`);
  }
}

/**
 * Get content type from file extension
 */
function getContentTypeFromExtension(extension: string): string {
  const contentTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
  };

  return contentTypes[extension.toLowerCase()] || 'application/octet-stream';
}
