import { Router } from 'express';
import { pickLogo, proxyLogo, searchLogos } from '../controllers/LogoController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /api/logos/search:
 *   get:
 *     summary: Search for logos via DuckDuckGo Images
 *     description: >
 *       Searches DuckDuckGo images for logo images matching the query.
 *       No API key required.
 *     tags: [Logos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search term (e.g. "Apple"). The API appends "logo png" automatically.
 *     responses:
 *       200:
 *         description: Logo search results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       thumbnail:
 *                         type: string
 *                         description: Thumbnail image URL
 *                       url:
 *                         type: string
 *                         description: Full image URL
 *                       title:
 *                         type: string
 *                         description: Image title
 *       400:
 *         description: Missing query parameter
 *       401:
 *         description: Unauthorized
 *       502:
 *         description: DuckDuckGo image search failed
 */
router.get('/logos/search', searchLogos);

/**
 * @swagger
 * /api/logos/proxy:
 *   get:
 *     summary: Proxy an image URL server-side and return it as a base64 data URL
 *     description: >
 *       Downloads an image from an external URL server-side to avoid browser CORS
 *       restrictions. Used by the frontend crop UI before uploading to S3.
 *     tags: [Logos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: url
 *         required: true
 *         schema:
 *           type: string
 *         description: External image URL to proxy
 *     responses:
 *       200:
 *         description: Image as base64 data URL
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 dataUrl:
 *                   type: string
 *                   description: data:image/...;base64,... string
 *       400:
 *         description: Missing url parameter
 *       401:
 *         description: Unauthorized
 *       413:
 *         description: Image too large (max 5 MB)
 *       502:
 *         description: Failed to fetch image
 */
router.get('/logos/proxy', proxyLogo);

/**
 * @swagger
 * /api/logos/pick:
 *   post:
 *     summary: Download an image URL and upload it to S3 as a counterparty logo
 *     tags: [Logos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - url
 *             properties:
 *               url:
 *                 type: string
 *                 description: External image URL to download and store
 *     responses:
 *       200:
 *         description: Image uploaded to S3
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   description: S3 URL of the stored logo
 *       400:
 *         description: Missing url field
 *       401:
 *         description: Unauthorized
 *       502:
 *         description: Failed to download image
 */
router.post('/logos/pick', pickLogo);

export default router;
