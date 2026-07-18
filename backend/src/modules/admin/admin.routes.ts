import { Router } from 'express';
import { adminController } from '@/modules/admin/admin.controller';
import { asyncHandler } from '@/utils/async-handler';
import { validate } from '@/middlewares/validate.middleware';
import { authenticate } from '@/middlewares/auth.middleware';
import { requireRole } from '@/middlewares/role.middleware';
import { updateRoleSchema } from '@/modules/users/user.validator';
import { ROLES } from '@/constants/roles';

const router = Router();

// All admin routes require authentication + admin role
router.use(authenticate, requireRole(ROLES.ADMIN));

/**
 * @openapi
 * /admin/users:
 *   get:
 *     tags: [Admin]
 *     summary: List all users (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Paginated list of all users
 *       403:
 *         description: Forbidden
 */
router.get('/users', asyncHandler(adminController.listUsers));

/**
 * @openapi
 * /admin/users/{id}/role:
 *   patch:
 *     tags: [Admin]
 *     summary: Update a user's role (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [role]
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 *     responses:
 *       200:
 *         description: Role updated successfully
 *       404:
 *         description: User not found
 */
router.patch('/users/:id/role', validate(updateRoleSchema), asyncHandler(adminController.updateUserRole));

/**
 * @openapi
 * /admin/users/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Delete a user (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: User deleted
 *       400:
 *         description: Cannot delete own account
 *       404:
 *         description: User not found
 */
router.delete('/users/:id', asyncHandler(adminController.deleteUser));

export default router;
