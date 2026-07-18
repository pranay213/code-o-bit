import { Router } from 'express';
import { contestController } from '@/modules/contests/contest.controller';
import { asyncHandler } from '@/utils/async-handler';
import { validate } from '@/middlewares/validate.middleware';
import { authenticate } from '@/middlewares/auth.middleware';
import { requireRole } from '@/middlewares/role.middleware';
import {
  createContestSchema,
  updateContestSchema,
  contestListQuerySchema,
} from '@/modules/contests/contest.validator';
import { ROLES } from '@/constants/roles';

const router = Router();

/**
 * @openapi
 * /contests:
 *   get:
 *     tags: [Contests]
 *     summary: List all contests
 *     security: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [upcoming, ongoing, ended] }
 *     responses:
 *       200:
 *         description: Paginated list of contests
 */
router.get('/', validate(contestListQuerySchema, 'query'), asyncHandler(contestController.listContests));

/**
 * @openapi
 * /contests/{id}:
 *   get:
 *     tags: [Contests]
 *     summary: Get a contest by ID
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Contest details
 *       404:
 *         description: Contest not found
 */
router.get('/:id', asyncHandler(contestController.getContest));

/**
 * @openapi
 * /contests:
 *   post:
 *     tags: [Contests]
 *     summary: Create a new contest (admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Contest created
 */
router.post(
  '/',
  authenticate,
  requireRole(ROLES.ADMIN),
  validate(createContestSchema),
  asyncHandler(contestController.createContest),
);

/**
 * @openapi
 * /contests/{id}:
 *   patch:
 *     tags: [Contests]
 *     summary: Update a contest (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Contest updated
 */
router.patch(
  '/:id',
  authenticate,
  requireRole(ROLES.ADMIN),
  validate(updateContestSchema),
  asyncHandler(contestController.updateContest),
);

/**
 * @openapi
 * /contests/{id}:
 *   delete:
 *     tags: [Contests]
 *     summary: Delete a contest (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Contest deleted
 */
router.delete(
  '/:id',
  authenticate,
  requireRole(ROLES.ADMIN),
  asyncHandler(contestController.deleteContest),
);

/**
 * @openapi
 * /contests/{id}/register:
 *   post:
 *     tags: [Contests]
 *     summary: Register for a contest
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Registered successfully
 *       400:
 *         description: Registration closed or already registered
 */
router.post('/:id/register', authenticate, asyncHandler(contestController.registerForContest));

/**
 * @openapi
 * /contests/{id}/standings:
 *   get:
 *     tags: [Contests]
 *     summary: Get contest standings
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Contest standings
 */
router.get('/:id/standings', asyncHandler(contestController.getContestStandings));

export default router;
