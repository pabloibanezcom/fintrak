import { Router } from 'express';
import {
  createTransactionFromBankTransaction,
  deleteTransaction,
  getAllTransactions,
  getLinkedTransaction,
  getTransactionById,
  getTransactionStats,
  updateTransaction,
} from '../controllers/BankTransactionController';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/bank-transactions:
 *   get:
 *     summary: Get all bank transactions
 *     tags: [Bank Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: accountId
 *         schema:
 *           type: string
 *         description: Filter by account ID
 *       - in: query
 *         name: bankId
 *         schema:
 *           type: string
 *         description: Filter by bank ID (e.g., 'santander', 'bbva')
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [CREDIT, DEBIT]
 *         description: Filter by transaction type
 *       - in: query
 *         name: processed
 *         schema:
 *           type: boolean
 *         description: Filter by processed status
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter transactions from this date (ISO 8601)
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter transactions until this date (ISO 8601)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Number of transactions to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of transactions to skip
 *     responses:
 *       200:
 *         description: List of bank transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transactions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BankTransaction'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     offset:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 */
router.get('/', getAllTransactions);

/**
 * @swagger
 * /api/bank-transactions/stats:
 *   get:
 *     summary: Get transaction statistics
 *     tags: [Bank Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: bankId
 *         schema:
 *           type: string
 *         description: Filter by bank ID
 *       - in: query
 *         name: accountId
 *         schema:
 *           type: string
 *         description: Filter by account ID
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for statistics
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for statistics
 *     responses:
 *       200:
 *         description: Transaction statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalTransactions:
 *                   type: integer
 *                 totalCredits:
 *                   type: number
 *                 totalDebits:
 *                   type: number
 *                 creditCount:
 *                   type: integer
 *                 debitCount:
 *                   type: integer
 *                 processedCount:
 *                   type: integer
 *                 unprocessedCount:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 */
router.get('/stats', getTransactionStats);

/**
 * @swagger
 * /api/bank-transactions/{id}:
 *   get:
 *     summary: Get a bank transaction by ID
 *     tags: [Bank Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction ID
 *     responses:
 *       200:
 *         description: Bank transaction details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BankTransaction'
 *       404:
 *         description: Transaction not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:id', getTransactionById);

/**
 * @swagger
 * /api/bank-transactions/{id}:
 *   patch:
 *     summary: Update a bank transaction
 *     tags: [Bank Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               processed:
 *                 type: boolean
 *                 description: Mark transaction as processed/unprocessed
 *               notified:
 *                 type: boolean
 *                 description: Mark transaction as notified/not notified
 *               dismissed:
 *                 type: boolean
 *                 description: Mark transaction as dismissed/restored
 *               dismissNote:
 *                 type: string
 *                 nullable: true
 *                 description: Optional note explaining why a transaction was dismissed
 *     responses:
 *       200:
 *         description: Updated bank transaction
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BankTransaction'
 *       404:
 *         description: Transaction not found
 *       401:
 *         description: Unauthorized
 */
router.patch('/:id', updateTransaction);

/**
 * @swagger
 * /api/bank-transactions/{id}:
 *   delete:
 *     summary: Delete a bank transaction
 *     tags: [Bank Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction ID
 *     responses:
 *       200:
 *         description: Transaction deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Transaction deleted successfully
 *       404:
 *         description: Transaction not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id', deleteTransaction);

/**
 * @swagger
 * /api/bank-transactions/{id}/linked:
 *   get:
 *     summary: Get linked user transaction for a bank transaction
 *     tags: [Bank Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bank transaction ID
 *     responses:
 *       200:
 *         description: Linked user transaction (or null if not linked)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 linked:
 *                   type: boolean
 *                 transaction:
 *                   $ref: '#/components/schemas/UserTransaction'
 *       404:
 *         description: Bank transaction not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:id/linked', getLinkedTransaction);

/**
 * @swagger
 * /api/bank-transactions/{id}/create-transaction:
 *   post:
 *     summary: Create a user transaction (expense/income) from a bank transaction
 *     description: |
 *       Creates a user transaction linked to the bank transaction.
 *       The transaction type is automatically determined:
 *       - DEBIT bank transactions become expenses
 *       - CREDIT bank transactions become incomes
 *     tags: [Bank Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bank transaction ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - category
 *             properties:
 *               category:
 *                 type: string
 *                 description: Category key (required)
 *               counterparty:
 *                 type: string
 *                 description: Counterparty key (optional)
 *               title:
 *                 type: string
 *                 description: Override title (defaults to merchant name or description)
 *               description:
 *                 type: string
 *                 description: Additional description
 *               tags:
 *                 type: array
 *                 items:
 *                   type: object
 *                 description: Tags to apply
 *     responses:
 *       201:
 *         description: User transaction created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserTransaction'
 *       400:
 *         description: Invalid request (missing or invalid category/counterparty)
 *       404:
 *         description: Bank transaction not found
 *       409:
 *         description: Bank transaction already linked to a user transaction
 *       401:
 *         description: Unauthorized
 */
router.post('/:id/create-transaction', createTransactionFromBankTransaction);

export default router;
