import { Router } from 'express';
import * as controller from '../controllers/ImportController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

/**
 * @swagger
 * /api/import/transactions:
 *   post:
 *     summary: Import transactions from Excel file
 *     tags:
 *       - Import
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Excel file containing transactions
 *     responses:
 *       200:
 *         description: Import results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: number
 *                   description: Total number of rows processed
 *                 imported:
 *                   type: number
 *                   description: Number of transactions successfully imported
 *                 expenses:
 *                   type: number
 *                   description: Number of expenses imported
 *                 income:
 *                   type: number
 *                   description: Number of income transactions imported
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: List of errors encountered during import
 *       400:
 *         description: Bad request - no file uploaded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 message:
 *                   type: string
 */
router.post(
  '/transactions',
  controller.upload.single('file'),
  controller.importTransactions
);

export default router;
