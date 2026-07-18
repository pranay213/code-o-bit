import { Router } from 'express';
import { submissionController } from '@/modules/submissions/submission.controller';
import { asyncHandler } from '@/utils/async-handler';
import { validate } from '@/middlewares/validate.middleware';
import { authenticate } from '@/middlewares/auth.middleware';
import {
  createSubmissionSchema,
  submissionListQuerySchema,
} from '@/modules/submissions/submission.validator';

const router = Router();

/**
 * @openapi
 * /submissions:
 *   post:
 *     tags: [Submissions]
 *     summary: Submit code for a problem
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [problemId, language, code]
 *             properties:
 *               problemId:
 *                 type: string
 *               contestId:
 *                 type: string
 *               language:
 *                 type: string
 *               code:
 *                 type: string
 *     responses:
 *       201:
 *         description: Submission created with PENDING status
 *       404:
 *         description: Problem not found
 */
router.post(
  '/',
  authenticate,
  validate(createSubmissionSchema),
  asyncHandler(submissionController.createSubmission),
);

/**
 * @openapi
 * /submissions:
 *   get:
 *     tags: [Submissions]
 *     summary: List own submissions with optional filters
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: problemId
 *         schema: { type: string }
 *       - in: query
 *         name: contestId
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Paginated list of own submissions
 */
router.get(
  '/',
  authenticate,
  validate(submissionListQuerySchema, 'query'),
  asyncHandler(submissionController.listMySubmissions),
);

/**
 * @openapi
 * /submissions/{id}:
 *   get:
 *     tags: [Submissions]
 *     summary: Get a submission by ID (owner only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Submission details
 *       403:
 *         description: Not the owner of this submission
 *       404:
 *         description: Submission not found
 */
router.get('/:id', authenticate, asyncHandler(submissionController.getSubmission));

export default router;
