import { Router } from 'express';
import * as controller from '../controllers/CronController';

const router = Router();

/**
 * @swagger
 * /api/cron/snapshots/daily:
 *   post:
 *     summary: Create daily snapshots for all users (Cron job)
 *     description: Internal endpoint to be called by AWS EventBridge or scheduler. Requires API key authentication.
 *     tags: [Cron]
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         required: true
 *         schema:
 *           type: string
 *         description: Internal API key for cron jobs
 *     responses:
 *       200:
 *         description: Snapshots created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 results:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 *                     successful:
 *                       type: number
 *                     failed:
 *                       type: number
 *                     errors:
 *                       type: array
 *       401:
 *         description: Unauthorized - Invalid API key
 *       500:
 *         description: Internal server error
 */
router.post(
  '/cron/snapshots/daily',
  controller.createDailySnapshotsForAllUsers
);

/**
 * @swagger
 * /api/cron/sync-transactions:
 *   post:
 *     summary: Sync bank transactions for all users (Cron job)
 *     description: |
 *       Internal endpoint to be called by AWS EventBridge every hour at :05.
 *       Fetches new transactions from TrueLayer, stores them, creates expenses/incomes,
 *       and sends push notifications. Requires API key authentication.
 *     tags: [Cron]
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         required: true
 *         schema:
 *           type: string
 *         description: Internal API key for cron jobs
 *     responses:
 *       200:
 *         description: Transaction sync completed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Transaction sync completed"
 *                 results:
 *                   type: object
 *                   properties:
 *                     totalSynced:
 *                       type: number
 *                       description: Number of new transactions processed
 *                     totalErrors:
 *                       type: number
 *                       description: Number of errors encountered
 *                     usersProcessed:
 *                       type: number
 *                       description: Number of bank connections synced
 *       401:
 *         description: Unauthorized - Invalid API key
 *       500:
 *         description: Internal server error
 */
router.post('/cron/sync-transactions', controller.syncTransactions);

export default router;
