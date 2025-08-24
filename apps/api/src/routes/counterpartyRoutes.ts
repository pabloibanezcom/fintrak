import { Router } from 'express';
import * as controller from '../controllers/CounterpartyController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate); // all routes require auth

/**
 * @swagger
 * /api/counterparties:
 *   get:
 *     summary: Get user's counterparties
 *     description: Retrieves all counterparties for the authenticated user
 *     tags: [Counterparties]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Counterparties retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Counterparty'
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
router.get('/counterparties', controller.getCounterparties);

/**
 * @swagger
 * /api/counterparties/{id}:
 *   get:
 *     summary: Get counterparty by ID
 *     description: Retrieves a specific counterparty by ID for the authenticated user
 *     tags: [Counterparties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The counterparty ID
 *     responses:
 *       200:
 *         description: Counterparty retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Counterparty'
 *       404:
 *         description: Counterparty not found
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
router.get('/counterparties/:id', controller.getCounterpartyById);

/**
 * @swagger
 * /api/counterparties:
 *   post:
 *     summary: Create a new counterparty
 *     description: Creates a new counterparty for the authenticated user
 *     tags: [Counterparties]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Counterparty'
 *           example:
 *             id: "amazon"
 *             name: "Amazon"
 *             type: "company"
 *             email: "support@amazon.com"
 *             notes: "Online shopping"
 *     responses:
 *       201:
 *         description: Counterparty created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Counterparty'
 *       409:
 *         description: Counterparty with this ID already exists
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
router.post('/counterparties', controller.createCounterparty);

/**
 * @swagger
 * /api/counterparties/{id}:
 *   put:
 *     summary: Update a counterparty
 *     description: Updates an existing counterparty for the authenticated user
 *     tags: [Counterparties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The counterparty ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [person, company, government, other]
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               notes:
 *                 type: string
 *           example:
 *             name: "Updated Amazon"
 *             email: "updated@amazon.com"
 *             phone: "+1-800-123-4567"
 *     responses:
 *       200:
 *         description: Counterparty updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Counterparty'
 *       404:
 *         description: Counterparty not found
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
router.put('/counterparties/:id', controller.updateCounterparty);

/**
 * @swagger
 * /api/counterparties/{id}:
 *   delete:
 *     summary: Delete a counterparty
 *     description: Deletes an existing counterparty for the authenticated user
 *     tags: [Counterparties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The counterparty ID
 *     responses:
 *       200:
 *         description: Counterparty deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Counterparty deleted successfully"
 *       404:
 *         description: Counterparty not found
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
router.delete('/counterparties/:id', controller.deleteCounterparty);

export default router;