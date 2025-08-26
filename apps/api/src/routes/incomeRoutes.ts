import { Router } from 'express';
import {
  createIncome,
  deleteIncome,
  getIncomeById,
  searchIncomes,
  updateIncome,
} from '../controllers/IncomeController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate); // all routes require auth

/**
 * @swagger
 * /api/incomes/search:
 *   get:
 *     summary: Search incomes with filters
 *     description: Search and filter incomes for the authenticated user
 *     tags: [Incomes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Search in income title (case-insensitive)
 *       - in: query
 *         name: description
 *         schema:
 *           type: string
 *         description: Search in income description (case-insensitive)
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter incomes from this date
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter incomes until this date
 *       - in: query
 *         name: amountMin
 *         schema:
 *           type: number
 *         description: Minimum amount filter
 *       - in: query
 *         name: amountMax
 *         schema:
 *           type: number
 *         description: Maximum amount filter
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
 *         name: source
 *         schema:
 *           type: string
 *         description: Source/Counterparty ID filter
 *       - in: query
 *         name: periodicity
 *         schema:
 *           type: string
 *           enum: [NOT_RECURRING, RECURRING_VARIABLE_AMOUNT, RECURRING_FIXED_AMOUNT]
 *         description: Periodicity filter
 *       - in: query
 *         name: tags
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: Tag keys filter (matches any)
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
 *           enum: [date, amount, title, createdAt]
 *           default: date
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
 *         description: Incomes retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 incomes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Income'
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
router.get('/incomes/search', searchIncomes);

/**
 * @swagger
 * /api/incomes/{id}:
 *   get:
 *     summary: Get income by ID
 *     description: Retrieves a specific income by ID for the authenticated user
 *     tags: [Incomes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The income ID
 *     responses:
 *       200:
 *         description: Income retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Income'
 *       404:
 *         description: Income not found
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
router.get('/incomes/:id', getIncomeById);

/**
 * @swagger
 * /api/incomes:
 *   post:
 *     summary: Create a new income
 *     description: Creates a new income for the authenticated user
 *     tags: [Incomes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateIncomeRequest'
 *           example:
 *             title: "Freelance Project"
 *             amount: 1500.00
 *             category:
 *               id: "freelance"
 *               name: "Freelance Work"
 *               color: "#4CAF50"
 *               icon: "briefcase"
 *             date: "2024-01-15T00:00:00.000Z"
 *             description: "Web development project"
 *     responses:
 *       201:
 *         description: Income created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Income'
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
router.post('/incomes', createIncome);

/**
 * @swagger
 * /api/incomes/{id}:
 *   put:
 *     summary: Update an income
 *     description: Updates an existing income for the authenticated user
 *     tags: [Incomes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The income ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateIncomeRequest'
 *           example:
 *             title: "Updated Freelance Project"
 *             amount: 1750.00
 *             description: "Extended web development project"
 *     responses:
 *       200:
 *         description: Income updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Income'
 *       404:
 *         description: Income not found
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
router.put('/incomes/:id', updateIncome);

/**
 * @swagger
 * /api/incomes/{id}:
 *   delete:
 *     summary: Delete an income
 *     description: Deletes an existing income for the authenticated user
 *     tags: [Incomes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The income ID
 *     responses:
 *       200:
 *         description: Income deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Income deleted successfully"
 *       404:
 *         description: Income not found
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
router.delete('/incomes/:id', deleteIncome);

export default router;
