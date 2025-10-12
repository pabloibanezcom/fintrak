import { Router } from 'express';
import * as controller from '../controllers/ProductController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate); // all routes require auth

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get user's financial products
 *     description: Retrieves all financial products (deposits, cash accounts, indexed funds) for the authenticated user from the MI service. Optionally compare with previous snapshots.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: compare
 *         required: false
 *         schema:
 *           type: string
 *           enum: [1d, 7d, 1m, 3m, 1y]
 *         description: Compare current value with snapshot from specified period ago (1d=1 day, 7d=7 days, 1m=1 month, 3m=3 months, 1y=1 year)
 *     responses:
 *       200:
 *         description: User products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProducts'
 *             example:
 *               deposits:
 *                 - id: "dep_123"
 *                   amount: 10000
 *                   currency: "EUR"
 *                   interestRate: 2.5
 *                   maturityDate: "2025-12-31"
 *               cashAccounts:
 *                 - id: "acc_456"
 *                   balance: 5000
 *                   currency: "EUR"
 *                   accountType: "CHECKING"
 *               indexedFunds:
 *                 - id: "fund_789"
 *                   name: "Global Index Fund"
 *                   value: 15000
 *                   currency: "EUR"
 *                   performance: 7.2
 *               comparison:
 *                 period: "1d"
 *                 available: true
 *                 previousValue: 29500
 *                 currentValue: 30000
 *                 valueDifference: 500
 *                 percentageDifference: 1.69
 *                 comparisonDate: "2025-10-11T00:00:00.000Z"
 *       400:
 *         description: Invalid comparison period
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Invalid comparison period. Use: 1d, 7d, 1m, or 1y"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Unauthorized"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Internal server error"
 */
router.get('/products', controller.getProducts);

/**
 * @swagger
 * /api/products/snapshot:
 *   post:
 *     summary: Create a daily snapshot of user's products
 *     description: Saves the current state of all user products to the database for historical tracking
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Snapshot created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 snapshot:
 *                   $ref: '#/components/schemas/UserProducts'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/products/snapshot', controller.createSnapshot);

/**
 * @swagger
 * /api/products/snapshots:
 *   get:
 *     summary: Get product snapshots history
 *     description: Retrieves historical snapshots of user products within a date range
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: End date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Snapshots retrieved successfully
 *       400:
 *         description: Missing required parameters
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/products/snapshots', controller.getSnapshotHistory);

/**
 * @swagger
 * /api/products/snapshot/latest:
 *   get:
 *     summary: Get the most recent product snapshot
 *     description: Retrieves the latest saved snapshot for the authenticated user
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Latest snapshot retrieved successfully
 *       404:
 *         description: No snapshots found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/products/snapshot/latest', controller.getRecentSnapshot);

/**
 * @swagger
 * /api/products/snapshot/date:
 *   get:
 *     summary: Get product snapshot for a specific date
 *     description: Retrieves the snapshot for a specific date
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Snapshot retrieved successfully
 *       400:
 *         description: Missing date parameter
 *       404:
 *         description: No snapshot found for the specified date
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/products/snapshot/date', controller.getSnapshotForDate);

export default router;
