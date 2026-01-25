import { Router } from 'express';
import {
  deleteAccount,
  getAccountById,
  getAllAccounts,
  updateAccount,
} from '../controllers/BankAccountController';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/bank-accounts:
 *   get:
 *     summary: Get all bank accounts
 *     tags: [Bank Accounts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: bankId
 *         schema:
 *           type: string
 *         description: Filter by bank ID (e.g., 'santander', 'bbva')
 *     responses:
 *       200:
 *         description: List of bank accounts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BankAccount'
 *       401:
 *         description: Unauthorized
 */
router.get('/', getAllAccounts);

/**
 * @swagger
 * /api/bank-accounts/{accountId}:
 *   get:
 *     summary: Get a bank account by account ID
 *     tags: [Bank Accounts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: accountId
 *         required: true
 *         schema:
 *           type: string
 *         description: Account ID
 *     responses:
 *       200:
 *         description: Bank account details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BankAccount'
 *       404:
 *         description: Account not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:accountId', getAccountById);

/**
 * @swagger
 * /api/bank-accounts/{accountId}:
 *   patch:
 *     summary: Update a bank account
 *     tags: [Bank Accounts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: accountId
 *         required: true
 *         schema:
 *           type: string
 *         description: Account ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               alias:
 *                 type: string
 *                 description: Custom alias for the account
 *     responses:
 *       200:
 *         description: Updated bank account
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BankAccount'
 *       404:
 *         description: Account not found
 *       401:
 *         description: Unauthorized
 */
router.patch('/:accountId', updateAccount);

/**
 * @swagger
 * /api/bank-accounts/{accountId}:
 *   delete:
 *     summary: Delete a bank account
 *     tags: [Bank Accounts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: accountId
 *         required: true
 *         schema:
 *           type: string
 *         description: Account ID
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Account deleted successfully
 *       404:
 *         description: Account not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/:accountId', deleteAccount);

export default router;
