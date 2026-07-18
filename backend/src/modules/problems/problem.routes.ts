import { Router } from 'express';
import { problemController } from '@/modules/problems/problem.controller';
import { asyncHandler } from '@/utils/async-handler';
import { validate } from '@/middlewares/validate.middleware';
import { authenticate } from '@/middlewares/auth.middleware';
import { requireRole } from '@/middlewares/role.middleware';
import {
  createProblemSchema,
  updateProblemSchema,
  problemListQuerySchema,
} from '@/modules/problems/problem.validator';
import { ROLES } from '@/constants/roles';

const router = Router();

/**
 * @openapi
 * /problems:
 *   get:
 *     tags: [Problems]
 *     summary: List problems with optional filters
 *     security: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: difficulty
 *         schema: { type: string, enum: [easy, medium, hard] }
 *       - in: query
 *         name: tag
 *         schema: { type: string }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Paginated list of problems
 */
router.get('/', validate(problemListQuerySchema, 'query'), asyncHandler(problemController.listProblems));

/**
 * @openapi
 * /problems/generate-ai:
 *   post:
 *     tags: [Problems]
 *     summary: Generate a problem using AI (Cron endpoint)
 *     security: []
 *     responses:
 *       201:
 *         description: Problem generated
 *       401:
 *         description: Unauthorized
 */
router.post('/generate-ai', asyncHandler(problemController.generateDailyProblem));

/**
 * @openapi
 * /problems/{id}:
 *   get:
 *     tags: [Problems]
 *     summary: Get a problem by ID
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Problem details
 *       404:
 *         description: Problem not found
 */
router.get('/:id', asyncHandler(problemController.getProblem));

/**
 * @openapi
 * /problems:
 *   post:
 *     tags: [Problems]
 *     summary: Create a new problem (admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Problem created
 *       403:
 *         description: Forbidden
 */
router.post(
  '/',
  authenticate,
  requireRole(ROLES.ADMIN),
  validate(createProblemSchema),
  asyncHandler(problemController.createProblem),
);

/**
 * @openapi
 * /problems/{id}:
 *   patch:
 *     tags: [Problems]
 *     summary: Update a problem (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Problem updated
 *       404:
 *         description: Problem not found
 */
router.patch(
  '/:id',
  authenticate,
  requireRole(ROLES.ADMIN),
  validate(updateProblemSchema),
  asyncHandler(problemController.updateProblem),
);

/**
 * @openapi
 * /problems/{id}:
 *   delete:
 *     tags: [Problems]
 *     summary: Delete a problem (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Problem deleted
 *       404:
 *         description: Problem not found
 */
router.delete(
  '/:id',
  authenticate,
  requireRole(ROLES.ADMIN),
  asyncHandler(problemController.deleteProblem),
);

export default router;
