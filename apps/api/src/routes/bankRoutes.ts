import { Router } from 'express';
import * as controller from '../controllers/BankController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /api/bank/institutions:
 *   get:
 *     summary: Get available banks
 *     description: Retrieves list of available banks for connection (filtered by country)
 *     tags: [Bank Integration]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *           default: ES
 *         description: Country code (defaults to ES for Spain)
 *     responses:
 *       200:
 *         description: Banks retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   bic:
 *                     type: string
 *                   logo:
 *                     type: string
 *                   countries:
 *                     type: array
 *                     items:
 *                       type: string
 */
router.get('/institutions', controller.getInstitutions);

/**
 * @swagger
 * /api/bank/connect:
 *   post:
 *     summary: Initiate bank connection
 *     description: Creates a requisition to connect user's bank account
 *     tags: [Bank Integration]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - institutionId
 *               - redirect
 *             properties:
 *               institutionId:
 *                 type: string
 *                 description: Bank institution ID
 *               redirect:
 *                 type: string
 *                 description: URL to redirect after bank authentication
 *               reference:
 *                 type: string
 *                 description: Custom reference for the requisition
 *     responses:
 *       201:
 *         description: Requisition created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 link:
 *                   type: string
 *                   description: URL to redirect user to complete bank authentication
 *                 status:
 *                   type: string
 */
router.post('/connect', controller.createRequisition);

/**
 * @swagger
 * /api/bank/requisitions/{id}:
 *   get:
 *     summary: Get requisition status
 *     description: Check the status of a bank connection requisition
 *     tags: [Bank Integration]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Requisition ID
 *     responses:
 *       200:
 *         description: Requisition status retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 status:
 *                   type: string
 *                 accounts:
 *                   type: array
 *                   items:
 *                     type: string
 */
router.get('/requisitions/:id', controller.getRequisition);

/**
 * @swagger
 * /api/bank/accounts:
 *   get:
 *     summary: Get connected bank accounts
 *     description: Retrieves user's connected bank accounts
 *     tags: [Bank Integration]
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
 *                   id:
 *                     type: string
 *                   iban:
 *                     type: string
 *                   name:
 *                     type: string
 *                   currency:
 *                     type: string
 *                   status:
 *                     type: string
 */
router.get('/accounts', controller.getAccounts);

/**
 * @swagger
 * /api/bank/accounts/{accountId}/transactions:
 *   get:
 *     summary: Get account transactions
 *     description: Retrieves transactions for a specific bank account
 *     tags: [Bank Integration]
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
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date (YYYY-MM-DD)
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date
 *         description: End date (YYYY-MM-DD)
 *       - in: query
 *         name: sync
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Sync fresh data from bank
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
 *                   id:
 *                     type: string
 *                   transactionId:
 *                     type: string
 *                   bookingDate:
 *                     type: string
 *                   transactionAmount:
 *                     type: object
 *                     properties:
 *                       amount:
 *                         type: string
 *                       currency:
 *                         type: string
 *                   creditorName:
 *                     type: string
 *                   debtorName:
 *                     type: string
 *                   remittanceInformationUnstructured:
 *                     type: string
 */
router.get('/accounts/:accountId/transactions', controller.getTransactions);

/**
 * @swagger
 * /api/bank/accounts/{accountId}/sync:
 *   post:
 *     summary: Sync account transactions
 *     description: Fetches latest transactions from bank and stores in database
 *     tags: [Bank Integration]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: accountId
 *         required: true
 *         schema:
 *           type: string
 *         description: Bank account ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dateFrom:
 *                 type: string
 *                 format: date
 *                 description: Start date for sync (YYYY-MM-DD)
 *               dateTo:
 *                 type: string
 *                 format: date
 *                 description: End date for sync (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Sync completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 synced:
 *                   type: number
 *                 newTransactions:
 *                   type: number
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 */
router.post('/accounts/:accountId/sync', controller.syncTransactions);

/**
 * @swagger
 * /api/bank/accounts/{accountId}/balances:
 *   get:
 *     summary: Get account balances
 *     description: Retrieves current balances for a bank account
 *     tags: [Bank Integration]
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
 *         description: Balances retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 balances:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get('/accounts/:accountId/balances', controller.getBalances);

export default router;