import { Router } from 'express';
import multer from 'multer';
import * as controller from '../controllers/BankController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Configure multer for bank logo uploads
const logoUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit for logos
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PNG, JPEG, WebP, and SVG images are allowed'));
    }
  },
});

// Callback route must be BEFORE authenticate middleware (it's a redirect from TrueLayer)
/**
 * @swagger
 * /api/bank/callback:
 *   get:
 *     summary: Handle OAuth callback
 *     description: Exchange authorization code for access token and store bank connection. The state parameter contains the user ID.
 *     tags: [Bank Integration (TrueLayer)]
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Authorization code from TrueLayer
 *       - in: query
 *         name: state
 *         required: true
 *         schema:
 *           type: string
 *         description: State parameter containing user ID
 *     responses:
 *       200:
 *         description: Bank connection successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Bank connection successful
 *                 accountsConnected:
 *                   type: number
 *                   example: 2
 *                 accounts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       accountId:
 *                         type: string
 *                       iban:
 *                         type: string
 *                       name:
 *                         type: string
 *                       type:
 *                         type: string
 *                       provider:
 *                         type: string
 *       400:
 *         description: Missing authorization code or state
 */
router.get('/callback', controller.handleCallback);

// All routes below require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/bank/providers:
 *   get:
 *     summary: Get available bank providers
 *     description: Retrieves list of supported Spanish banks (Santander, BBVA) via TrueLayer.
 *     tags: [Bank Integration (TrueLayer)]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Providers retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: es-santander-oauth2
 *                   name:
 *                     type: string
 *                     example: Santander
 *                   logo:
 *                     type: string
 *                     example: https://truelayer-provider-assets.s3.amazonaws.com/es/logos/santander.svg
 *       401:
 *         description: User not authenticated
 */
router.get('/providers', controller.getProviders);

/**
 * @swagger
 * /api/bank/authorize:
 *   post:
 *     summary: Get authorization URL
 *     description: Generate TrueLayer authorization URL for user to connect their bank account
 *     tags: [Bank Integration (TrueLayer)]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - redirectUri
 *             properties:
 *               redirectUri:
 *                 type: string
 *                 description: URL to redirect after bank authentication
 *                 example: https://yourapp.com/bank-callback
 *               state:
 *                 type: string
 *                 description: Optional state parameter for security (CSRF protection)
 *     responses:
 *       200:
 *         description: Authorization URL generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 authorizationUrl:
 *                   type: string
 *                   example: https://auth.truelayer-sandbox.com/?response_type=code&client_id=...
 *       400:
 *         description: Missing required field
 *       401:
 *         description: User not authenticated
 */
router.post('/authorize', controller.getAuthorizationUrl);

/**
 * @swagger
 * /api/bank/connections:
 *   get:
 *     summary: Get all bank connections
 *     description: Retrieves all connected banks for the user (Santander, BBVA, etc.)
 *     tags: [Bank Integration (TrueLayer)]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bank connections retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   bankId:
 *                     type: string
 *                     example: santander
 *                   bankName:
 *                     type: string
 *                     example: Santander
 *                   connectedAccounts:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         accountId:
 *                           type: string
 *                         iban:
 *                           type: string
 *                         name:
 *                           type: string
 *                         type:
 *                           type: string
 *                         currency:
 *                           type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: User not authenticated
 */
router.get('/connections', controller.getConnections);

/**
 * @swagger
 * /api/bank/connections/{bankId}:
 *   delete:
 *     summary: Delete a bank connection
 *     description: Removes a bank connection and all associated data
 *     tags: [Bank Integration (TrueLayer)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bankId
 *         required: true
 *         schema:
 *           type: string
 *         description: Bank ID (e.g., santander, bbva)
 *     responses:
 *       200:
 *         description: Bank connection deleted successfully
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: Connection not found
 */
router.delete('/connections/:bankId', controller.deleteConnection);

/**
 * @swagger
 * /api/bank/connections/{bankId}:
 *   patch:
 *     summary: Update a bank connection
 *     description: Update bank connection details (alias, logo). Logo can be uploaded as a file.
 *     tags: [Bank Integration (TrueLayer)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bankId
 *         required: true
 *         schema:
 *           type: string
 *         description: Bank ID (e.g., santander, bbva)
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               alias:
 *                 type: string
 *                 description: Custom alias for this bank connection
 *               logo:
 *                 type: string
 *                 format: binary
 *                 description: Image file for bank logo (PNG, JPEG, WebP, SVG)
 *     responses:
 *       200:
 *         description: Bank connection updated successfully
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: Connection not found
 */
router.patch(
  '/connections/:bankId',
  logoUpload.single('logo'),
  controller.updateConnection
);

/**
 * @swagger
 * /api/bank/accounts:
 *   get:
 *     summary: Get connected bank accounts
 *     description: Retrieves user's connected bank accounts from TrueLayer
 *     tags: [Bank Integration (TrueLayer)]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Connected accounts retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   account_id:
 *                     type: string
 *                   account_type:
 *                     type: string
 *                     enum: [TRANSACTION, SAVINGS, BUSINESS, OTHER]
 *                   display_name:
 *                     type: string
 *                   currency:
 *                     type: string
 *                   account_number:
 *                     type: object
 *                     properties:
 *                       iban:
 *                         type: string
 *                   provider:
 *                     type: object
 *                     properties:
 *                       display_name:
 *                         type: string
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: No bank connection found
 */
router.get('/accounts', controller.getAccounts);

/**
 * @swagger
 * /api/bank/accounts/{accountId}/balance:
 *   get:
 *     summary: Get account balance
 *     description: Retrieves current balance for a specific bank account
 *     tags: [Bank Integration (TrueLayer)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: accountId
 *         required: true
 *         schema:
 *           type: string
 *         description: Bank account ID
 *     responses:
 *       200:
 *         description: Balance retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 currency:
 *                   type: string
 *                   example: EUR
 *                 available:
 *                   type: number
 *                   example: 1234.56
 *                 current:
 *                   type: number
 *                   example: 1234.56
 *                 overdraft:
 *                   type: number
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: No bank connection found
 */
router.get('/accounts/:accountId/balance', controller.getBalance);

/**
 * @swagger
 * /api/bank/accounts/{accountId}/transactions:
 *   get:
 *     summary: Get account transactions
 *     description: Retrieves transactions for a specific bank account from TrueLayer
 *     tags: [Bank Integration (TrueLayer)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: accountId
 *         required: true
 *         schema:
 *           type: string
 *         description: Bank account ID
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for transactions (ISO 8601)
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for transactions (ISO 8601)
 *     responses:
 *       200:
 *         description: Transactions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   transaction_id:
 *                     type: string
 *                   timestamp:
 *                     type: string
 *                   description:
 *                     type: string
 *                   transaction_type:
 *                     type: string
 *                     enum: [DEBIT, CREDIT]
 *                   transaction_category:
 *                     type: string
 *                   amount:
 *                     type: number
 *                   currency:
 *                     type: string
 *                   merchant_name:
 *                     type: string
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: No bank connection found
 */
router.get('/accounts/:accountId/transactions', controller.getTransactions);

/**
 * @swagger
 * /api/bank/sync:
 *   post:
 *     summary: Sync bank transactions
 *     description: Fetches new transactions from connected banks and stores them locally. Creates expenses/incomes automatically.
 *     tags: [Bank Integration (TrueLayer)]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Transactions synced successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Transactions synced successfully
 *                 synced:
 *                   type: number
 *                   description: Number of new transactions synced
 *                 errors:
 *                   type: number
 *                   description: Number of errors encountered
 *       401:
 *         description: User not authenticated
 *       500:
 *         description: Failed to sync transactions
 */
router.post('/sync', controller.syncUserTransactions);

export default router;
