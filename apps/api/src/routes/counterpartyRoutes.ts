import { Router } from 'express';
import {
  createCounterparty,
  deleteCounterparty,
  getCounterpartyById,
  searchCounterparties,
  updateCounterparty,
} from '../controllers/CounterpartyController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate); // all routes require auth

/**
 * @swagger
 * /api/counterparties/search:
 *   get:
 *     summary: Search counterparties with filters
 *     description: Search and filter counterparties for the authenticated user
 *     tags: [Counterparties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Search in counterparty names (case-insensitive)
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [company, person, institution, other]
 *         description: Filter by counterparty type
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Search in email addresses (case-insensitive)
 *       - in: query
 *         name: phone
 *         schema:
 *           type: string
 *         description: Search in phone numbers (case-insensitive)
 *       - in: query
 *         name: address
 *         schema:
 *           type: string
 *         description: Search in addresses (case-insensitive)
 *       - in: query
 *         name: notes
 *         schema:
 *           type: string
 *         description: Search in notes (case-insensitive)
 *       - in: query
 *         name: titleTemplate
 *         schema:
 *           type: string
 *         description: Search in title templates (case-insensitive)
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
 *           enum: [name, type, key, createdAt, updatedAt]
 *           default: name
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Counterparties retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 counterparties:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Counterparty'
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
router.get('/counterparties/search', searchCounterparties);

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
router.get('/counterparties/:id', getCounterpartyById);

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
router.post('/counterparties', createCounterparty);

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
router.put('/counterparties/:id', updateCounterparty);

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
router.delete('/counterparties/:id', deleteCounterparty);

export default router;
