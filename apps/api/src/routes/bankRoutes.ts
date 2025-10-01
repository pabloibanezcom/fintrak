import { Router } from 'express';
import * as controller from '../controllers/BankController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /api/bank/providers:
 *   get:
 *     summary: Get available bank providers
 *     description: Retrieves list of available banks/providers via Tink (filtered by market). Requires user authentication token from Tink OAuth flow.
 *     tags: [Bank Integration (Tink)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: market
 *         schema:
 *           type: string
 *           default: ES
 *         description: Market code (defaults to ES for Spain)
 *     responses:
 *       200:
 *         description: Providers retrieved successfully
 *       401:
 *         description: User token required (get token from /authorize flow)
 */
router.get('/providers', controller.getProviders);

/**
 * @swagger
 * /api/bank/authorize:
 *   post:
 *     summary: Get authorization URL
 *     description: Generate Tink authorization URL for user to connect their bank
 *     tags: [Bank Integration (Tink)]
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
 *               state:
 *                 type: string
 *                 description: Optional state parameter for security
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
 */
router.post('/authorize', controller.getAuthorizationUrl);

/**
 * @swagger
 * /api/bank/callback:
 *   get:
 *     summary: Handle OAuth callback
 *     description: Exchange authorization code for access token
 *     tags: [Bank Integration (Tink)]
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Authorization code from Tink
 *     responses:
 *       200:
 *         description: Authorization successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 accessToken:
 *                   type: string
 *                 expiresIn:
 *                   type: number
 *                 refreshToken:
 *                   type: string
 */
router.get('/callback', controller.handleCallback);

/**
 * @swagger
 * /api/bank/accounts:
 *   get:
 *     summary: Get connected bank accounts
 *     description: Retrieves user's connected bank accounts from Tink
 *     tags: [Bank Integration (Tink)]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Connected accounts retrieved
 */
router.get('/accounts', controller.getAccounts);

/**
 * @swagger
 * /api/bank/transactions:
 *   get:
 *     summary: Get all transactions
 *     description: Retrieves all transactions from all connected accounts
 *     tags: [Bank Integration (Tink)]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Transactions retrieved successfully
 */
router.get('/transactions', controller.getTransactions);

/**
 * @swagger
 * /api/bank/accounts/{accountId}/transactions:
 *   get:
 *     summary: Get account transactions
 *     description: Retrieves transactions for a specific bank account from Tink
 *     tags: [Bank Integration (Tink)]
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
 *         description: Transactions retrieved successfully
 */
router.get('/accounts/:accountId/transactions', controller.getTransactions);

export default router;
