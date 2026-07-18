import { Request, Response } from 'express';
import { adminService } from '@/modules/admin/admin.service';
import { sendSuccess } from '@/utils/api-response';
import { SUCCESS_MESSAGES } from '@/constants/success-messages';
import { AppError } from '@/types/api';
import { ERROR_MESSAGES } from '@/constants/error-messages';
import { UpdateRoleInput } from '@/modules/users/user.validator';

export const adminController = {
  async listUsers(req: Request, res: Response): Promise<void> {
    const result = await adminService.listUsers({
      page: req.query['page'] as string | undefined,
      limit: req.query['limit'] as string | undefined,
    });
    sendSuccess(res, result.items, SUCCESS_MESSAGES.USERS_FETCHED, 200, result.meta);
  },

  async updateUserRole(req: Request, res: Response): Promise<void> {
    const requestingUserId = req.user?.sub;
    if (!requestingUserId) throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, 401);

    const body = req.body as UpdateRoleInput;
    const user = await adminService.updateUserRole(req.params['id'] ?? '', requestingUserId, body);
    sendSuccess(res, user, SUCCESS_MESSAGES.ROLE_UPDATED);
  },

  async deleteUser(req: Request, res: Response): Promise<void> {
    const requestingUserId = req.user?.sub;
    if (!requestingUserId) throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, 401);

    await adminService.deleteUser(req.params['id'] ?? '', requestingUserId);
    sendSuccess(res, null, SUCCESS_MESSAGES.USER_DELETED);
  },
};
