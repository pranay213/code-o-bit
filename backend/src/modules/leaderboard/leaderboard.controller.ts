import { Request, Response } from 'express';
import { leaderboardService } from '@/modules/leaderboard/leaderboard.service';
import { sendSuccess } from '@/utils/api-response';
import { LeaderboardQuery } from '@/types/leaderboard';
import { SUCCESS_MESSAGES } from '@/constants/success-messages';

export const leaderboardController = {
  async getLeaderboard(req: Request, res: Response): Promise<void> {
    const query: LeaderboardQuery = {
      page: req.query['page'] ? parseInt(String(req.query['page']), 10) : undefined,
      limit: req.query['limit'] ? parseInt(String(req.query['limit']), 10) : undefined,
      country: req.query['country'] as string | undefined,
    };

    const result = await leaderboardService.getGlobalLeaderboard(query);
    sendSuccess(res, result.items, SUCCESS_MESSAGES.LEADERBOARD_FETCHED, 200, result.meta);
  },
};
