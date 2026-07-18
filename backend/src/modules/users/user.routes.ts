import { Router } from 'express';
import { userController } from '@/modules/users/user.controller';
import { asyncHandler } from '@/utils/async-handler';
import { validate } from '@/middlewares/validate.middleware';
import { authenticate } from '@/middlewares/auth.middleware';
import { updateProfileSchema } from '@/modules/users/user.validator';

const router = Router();

/**
 * @openapi
 * /users/me:
 *   get:
 *     tags: [Users]
 *     summary: Get current authenticated user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile returned successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/me', authenticate, asyncHandler(userController.getMe));
router.get('/me/dashboard', authenticate, asyncHandler(userController.getDashboardStats));
router.get('/leaderboard', asyncHandler(userController.getLeaderboard));

/**
 * @openapi
 * /users/me:
 *   patch:
 *     tags: [Users]
 *     summary: Update current user profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               bio:
 *                 type: string
 *               avatarUrl:
 *                 type: string
 *               country:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Unauthorized
 */
router.patch('/me', authenticate, validate(updateProfileSchema), asyncHandler(userController.updateMe));

/**
 * @openapi
 * /users/{username}:
 *   get:
 *     tags: [Users]
 *     summary: Get public profile of a user by username
 *     security: []
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Public user profile returned
 *       404:
 *         description: User not found
 */
router.get('/:username', asyncHandler(userController.getPublicProfile));

export default router;
