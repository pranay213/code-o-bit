import { Router } from 'express';
import { leaderboardController } from '@/modules/leaderboard/leaderboard.controller';
import { asyncHandler } from '@/utils/async-handler';

const router = Router();

/**
 * @openapi
 * /leaderboard:
 *   get:
 *     tags: [Leaderboard]
 *     summary: Get global leaderboard rankings
 *     security: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: country
 *         schema: { type: string }
 *         description: Filter by country name
 *     responses:
 *       200:
 *         description: Paginated leaderboard entries sorted by rating
 */
router.get('/', asyncHandler(leaderboardController.getLeaderboard));

export default router;
