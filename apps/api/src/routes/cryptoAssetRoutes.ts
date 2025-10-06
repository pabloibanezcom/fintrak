import { Router } from 'express';
import {
  createCryptoAsset,
  deleteCryptoAsset,
  getAllCryptoAssets,
  getCryptoAssetById,
  updateCryptoAsset,
} from '../controllers/CryptoAssetController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate); // all routes require auth

/**
 * @swagger
 * /api/crypto-assets:
 *   get:
 *     summary: Get all crypto assets
 *     description: Retrieves all crypto assets for the authenticated user
 *     tags: [CryptoAssets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Crypto assets retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CryptoAsset'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */
router.get('/crypto-assets', getAllCryptoAssets);

/**
 * @swagger
 * /api/crypto-assets/{id}:
 *   get:
 *     summary: Get crypto asset by ID
 *     description: Retrieves a specific crypto asset by ID for the authenticated user
 *     tags: [CryptoAssets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The crypto asset ID
 *     responses:
 *       200:
 *         description: Crypto asset retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CryptoAsset'
 *       404:
 *         description: Crypto asset not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */
router.get('/crypto-assets/:id', getCryptoAssetById);

/**
 * @swagger
 * /api/crypto-assets:
 *   post:
 *     summary: Create a new crypto asset
 *     description: Creates a new crypto asset for the authenticated user
 *     tags: [CryptoAssets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - code
 *               - amount
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Bitcoin"
 *               code:
 *                 type: string
 *                 example: "BTC"
 *               amount:
 *                 type: number
 *                 example: 0.5
 *     responses:
 *       201:
 *         description: Crypto asset created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CryptoAsset'
 *       400:
 *         description: Bad request - Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */
router.post('/crypto-assets', createCryptoAsset);

/**
 * @swagger
 * /api/crypto-assets/{id}:
 *   put:
 *     summary: Update a crypto asset
 *     description: Updates an existing crypto asset for the authenticated user
 *     tags: [CryptoAssets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The crypto asset ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Bitcoin"
 *               code:
 *                 type: string
 *                 example: "BTC"
 *               amount:
 *                 type: number
 *                 example: 0.75
 *     responses:
 *       200:
 *         description: Crypto asset updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CryptoAsset'
 *       404:
 *         description: Crypto asset not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */
router.put('/crypto-assets/:id', updateCryptoAsset);

/**
 * @swagger
 * /api/crypto-assets/{id}:
 *   delete:
 *     summary: Delete a crypto asset
 *     description: Deletes an existing crypto asset for the authenticated user
 *     tags: [CryptoAssets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The crypto asset ID
 *     responses:
 *       200:
 *         description: Crypto asset deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Crypto asset deleted successfully"
 *       404:
 *         description: Crypto asset not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */
router.delete('/crypto-assets/:id', deleteCryptoAsset);

export default router;
