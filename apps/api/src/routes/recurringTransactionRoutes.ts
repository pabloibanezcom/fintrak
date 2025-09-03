import { Router } from 'express';
import {
  createRecurringTransaction,
  deleteRecurringTransaction,
  getRecurringTransactionById,
  searchRecurringTransactions,
  updateRecurringTransaction,
} from '../controllers/RecurringTransactionController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate); // all routes require auth

/**
 * @swagger
 * /api/recurring-transactions/search:
 *   get:
 *     summary: Search recurring transactions with filters
 *     description: Search and filter recurring transactions for the authenticated user
 *     tags: [Recurring Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Search in recurring transaction title (case-insensitive)
 *       - in: query
 *         name: currency
 *         schema:
 *           type: string
 *           enum: [EUR, GBP, USD]
 *         description: Currency filter
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Category ID filter
 *       - in: query
 *         name: transactionType
 *         schema:
 *           type: string
 *           enum: [EXPENSE, INCOME]
 *         description: Transaction type filter
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 50
 *         description: Number of results to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Number of results to skip
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [title, createdAt]
 *           default: createdAt
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Recurring transactions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 recurringTransactions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/RecurringTransaction'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     offset:
 *                       type: integer
 *                     hasMore:
 *                       type: boolean
 *                 filters:
 *                   type: object
 *                 sort:
 *                   type: object
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */
router.get('/recurring-transactions/search', searchRecurringTransactions);

/**
 * @swagger
 * /api/recurring-transactions/{id}:
 *   get:
 *     summary: Get recurring transaction by ID
 *     description: Retrieves a specific recurring transaction by ID for the authenticated user
 *     tags: [Recurring Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The recurring transaction ID
 *     responses:
 *       200:
 *         description: Recurring transaction retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RecurringTransaction'
 *       404:
 *         description: Recurring transaction not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/recurring-transactions/:id', getRecurringTransactionById);

/**
 * @swagger
 * /api/recurring-transactions:
 *   post:
 *     summary: Create a new recurring transaction
 *     description: Creates a new recurring transaction for the authenticated user
 *     tags: [Recurring Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRecurringTransactionRequest'
 *           example:
 *             title: "Monthly Rent"
 *             currency: "EUR"
 *             category: "housing"
 *             transactionType: "EXPENSE"
 *     responses:
 *       201:
 *         description: Recurring transaction created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RecurringTransaction'
 *       400:
 *         description: Bad request - Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/recurring-transactions', createRecurringTransaction);

/**
 * @swagger
 * /api/recurring-transactions/{id}:
 *   put:
 *     summary: Update a recurring transaction
 *     description: Updates an existing recurring transaction for the authenticated user
 *     tags: [Recurring Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The recurring transaction ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateRecurringTransactionRequest'
 *           example:
 *             title: "Updated Monthly Rent"
 *             currency: "USD"
 *             transactionType: "EXPENSE"
 *     responses:
 *       200:
 *         description: Recurring transaction updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RecurringTransaction'
 *       404:
 *         description: Recurring transaction not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       400:
 *         description: Bad request - Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/recurring-transactions/:id', updateRecurringTransaction);

/**
 * @swagger
 * /api/recurring-transactions/{id}:
 *   delete:
 *     summary: Delete a recurring transaction
 *     description: Deletes an existing recurring transaction for the authenticated user
 *     tags: [Recurring Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The recurring transaction ID
 *     responses:
 *       200:
 *         description: Recurring transaction deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Recurring transaction deleted successfully"
 *       404:
 *         description: Recurring transaction not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/recurring-transactions/:id', deleteRecurringTransaction);

export default router;
