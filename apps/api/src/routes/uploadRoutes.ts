import { Router } from 'express';
import multer from 'multer';
import { authenticate } from '../middleware/auth';
import { uploadMedia } from '../controllers/UploadController';

const router = Router();

// Configure multer to store files in memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept image files and PDFs
    const allowedTypes = ['image/', 'application/pdf'];
    const isAllowed = allowedTypes.some(type => file.mimetype.startsWith(type));

    if (isAllowed) {
      cb(null, true);
    } else {
      cb(new Error('Only image files and PDFs are allowed'));
    }
  },
});

/**
 * @swagger
 * /api/upload/media:
 *   post:
 *     summary: Upload media file (organized by user ID)
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - type
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to upload
 *               type:
 *                 type: string
 *                 enum: [counterparty-logo, profile-picture, receipt, document, other]
 *                 description: Type of media being uploaded
 *     responses:
 *       200:
 *         description: Media uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   description: Public URL of the uploaded file
 *                 type:
 *                   type: string
 *                   description: Media type
 *                 userId:
 *                   type: string
 *                   description: User ID who uploaded the file
 *       400:
 *         description: Bad request (no file or invalid type)
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post(
  '/media',
  authenticate,
  upload.single('file'),
  uploadMedia
);

export default router;
