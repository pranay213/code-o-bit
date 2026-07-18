import { LeaderboardEntry, LeaderboardQuery } from '@/types/leaderboard';
import { PaginatedResponse } from '@/types/pagination';
import { UserModel } from '@/modules/users/user.model';
import { parsePagination, buildPaginationMeta } from '@/utils/pagination';
import { FilterQuery } from 'mongoose';
import { IUser } from '@/modules/users/user.model';

export const leaderboardService = {
  async getGlobalLeaderboard(query: LeaderboardQuery): Promise<PaginatedResponse<LeaderboardEntry>> {
    const { page, limit, skip } = parsePagination(query);

    const filter: FilterQuery<IUser> = {};
    if (query.country) filter.country = query.country;

    const [users, total] = await Promise.all([
      UserModel.find(filter)
        .select('username avatarUrl country solvedCount rating')
        .sort({ rating: -1, solvedCount: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      UserModel.countDocuments(filter).exec(),
    ]);

    const items: LeaderboardEntry[] = users.map((user, index) => ({
      rank: skip + index + 1,
      userId: String(user._id),
      username: user.username,
      avatarUrl: user.avatarUrl,
      country: user.country,
      solvedCount: user.solvedCount,
      rating: user.rating,
    }));

    return {
      items,
      meta: buildPaginationMeta(total, page, limit),
    };
  },
};
