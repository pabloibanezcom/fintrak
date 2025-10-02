import { Router } from 'express';
import { getPeriodSummary } from '../controllers/AnalyticsController';
import { authenticate } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * /api/analytics/period-summary:
 *   get:
 *     summary: Get period summary with expenses and incomes by category
 *     description: Fetch all expenses and incomes for a specific time period with totals grouped by category and latest transactions
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: dateFrom
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date of the period
 *       - in: query
 *         name: dateTo
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: End date of the period
 *       - in: query
 *         name: currency
 *         schema:
 *           type: string
 *           enum: [EUR, GBP, USD]
 *         description: Optional currency filter
 *       - in: query
 *         name: latestCount
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Number of latest transactions to include (default 5)
 *     responses:
 *       200:
 *         description: Period summary retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 period:
 *                   type: object
 *                   properties:
 *                     from:
 *                       type: string
 *                       format: date
 *                     to:
 *                       type: string
 *                       format: date
 *                     currency:
 *                       type: string
 *                 expenses:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 *                     byCategory:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           categoryId:
 *                             type: string
 *                           categoryKey:
 *                             type: string
 *                           categoryName:
 *                             type: string
 *                           categoryColor:
 *                             type: string
 *                           categoryIcon:
 *                             type: string
 *                           total:
 *                             type: number
 *                           count:
 *                             type: integer
 *                 incomes:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 *                     byCategory:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           categoryId:
 *                             type: string
 *                           categoryKey:
 *                             type: string
 *                           categoryName:
 *                             type: string
 *                           categoryColor:
 *                             type: string
 *                           categoryIcon:
 *                             type: string
 *                           total:
 *                             type: number
 *                           count:
 *                             type: integer
 *                 balance:
 *                   type: number
 *                 latestTransactions:
 *                   type: array
 *                   description: Latest transactions (expenses and incomes combined) sorted by date
 *                   items:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                         enum: [expense, income]
 *       400:
 *         description: Bad request - Missing required parameters
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */
router.get('/analytics/period-summary', authenticate, getPeriodSummary);

export default router;
