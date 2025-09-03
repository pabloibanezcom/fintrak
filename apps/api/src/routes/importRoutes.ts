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

/**
 * @swagger
 * /api/import/categories:
 *   post:
 *     summary: Import categories from JSON file
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
 *                 description: JSON file containing categories
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
 *                   description: Total number of categories processed
 *                 imported:
 *                   type: number
 *                   description: Number of categories successfully imported
 *                 updated:
 *                   type: number
 *                   description: Number of categories updated
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: List of errors encountered during import
 *       400:
 *         description: Bad request - no file uploaded or invalid JSON
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post(
  '/categories',
  controller.upload.single('file'),
  controller.importCategories
);

/**
 * @swagger
 * /api/import/tags:
 *   post:
 *     summary: Import tags from JSON file
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
 *                 description: JSON file containing tags
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
 *                   description: Total number of tags processed
 *                 imported:
 *                   type: number
 *                   description: Number of tags successfully imported
 *                 updated:
 *                   type: number
 *                   description: Number of tags updated
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: List of errors encountered during import
 *       400:
 *         description: Bad request - no file uploaded or invalid JSON
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/tags', controller.upload.single('file'), controller.importTags);

/**
 * @swagger
 * /api/import/counterparties:
 *   post:
 *     summary: Import counterparties from JSON file
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
 *                 description: JSON file containing counterparties
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
 *                   description: Total number of counterparties processed
 *                 imported:
 *                   type: number
 *                   description: Number of counterparties successfully imported
 *                 updated:
 *                   type: number
 *                   description: Number of counterparties updated
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: List of errors encountered during import
 *       400:
 *         description: Bad request - no file uploaded or invalid JSON
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post(
  '/counterparties',
  controller.upload.single('file'),
  controller.importCounterparties
);

/**
 * @swagger
 * /api/import/recurring-transactions:
 *   post:
 *     summary: Import recurring transactions from JSON file
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
 *                 description: JSON file containing recurring transactions
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
 *                   description: Total number of recurring transactions processed
 *                 imported:
 *                   type: number
 *                   description: Number of recurring transactions successfully imported
 *                 updated:
 *                   type: number
 *                   description: Number of recurring transactions updated
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: List of errors encountered during import
 *       400:
 *         description: Bad request - no file uploaded or invalid JSON
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post(
  '/recurring-transactions',
  controller.upload.single('file'),
  controller.importRecurringTransactions
);

export default router;
