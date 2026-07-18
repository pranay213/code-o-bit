import { Request, Response } from 'express';
import { userService } from '@/modules/users/user.service';
import { sendSuccess } from '@/utils/api-response';
import { SUCCESS_MESSAGES } from '@/constants/success-messages';
import { UpdateProfileInput } from '@/modules/users/user.validator';
import { AppError } from '@/types/api';
import { ERROR_MESSAGES } from '@/constants/error-messages';

export const userController = {
  async getMe(req: Request, res: Response): Promise<void> {
    const userId = req.user!.sub;
    const profile = await userService.getMe(userId);
    sendSuccess(res, profile, SUCCESS_MESSAGES.PROFILE_FETCHED);
  },

  async updateMe(req: Request, res: Response): Promise<void> {
    const userId = req.user!.sub;
    const body = req.body as UpdateProfileInput;
    const profile = await userService.updateMe(userId, body);
    sendSuccess(res, profile, SUCCESS_MESSAGES.PROFILE_UPDATED);
  },

  async getPublicProfile(req: Request, res: Response): Promise<void> {
    const { username } = req.params;
    if (!username) throw new AppError(ERROR_MESSAGES.NOT_FOUND, 404);
    const profile = await userService.getPublicProfile(username);
    sendSuccess(res, profile, SUCCESS_MESSAGES.PUBLIC_PROFILE_FETCHED);
  },

  async getDashboardStats(req: Request, res: Response): Promise<void> {
    const userId = req.user!.sub;
    const stats = await userService.getDashboardStats(userId);
    sendSuccess(res, stats, 'Dashboard stats fetched successfully');
  },

  async getLeaderboard(req: Request, res: Response): Promise<void> {
    const leaderboard = await userService.getLeaderboard(req.query);
    sendSuccess(res, leaderboard.users, 'Leaderboard fetched successfully', 200, leaderboard.meta);
  },
};
