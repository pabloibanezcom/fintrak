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
 *     description: Retrieves all financial products (deposits, cash accounts, indexed funds) for the authenticated user from the MI service
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
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

export default router;
