import { AppError } from '@/types/api';
import { UserProfile, UpdateProfileDto } from '@/types/user';
import { userRepository } from '@/modules/users/user.repository';
import { ERROR_MESSAGES } from '@/constants/error-messages';
import { IUser, UserModel } from '@/modules/users/user.model';
import { SubmissionModel } from '@/modules/submissions/submission.model';
import { buildMongoQuery } from '@/utils/query-builder';
import mongoose from 'mongoose';

function toUserProfile(user: IUser): UserProfile {
  return {
    id: String(user._id),
    username: user.username,
    email: user.email,
    role: user.role as UserProfile['role'],
    bio: user.bio,
    avatarUrl: user.avatarUrl,
    country: user.country,
    solvedCount: user.solvedCount,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export const userService = {
  async getMe(userId: string): Promise<UserProfile> {
    const user = await userRepository.findById(userId);
    if (!user) throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, 404);
    return toUserProfile(user);
  },

  async getPublicProfile(username: string): Promise<UserProfile> {
    const user = await userRepository.findByUsername(username);
    if (!user) throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, 404);
    return toUserProfile(user);
  },

  async updateMe(userId: string, data: UpdateProfileDto): Promise<UserProfile> {
    const user = await userRepository.updateById(userId, data);
    if (!user) throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, 404);
    return toUserProfile(user);
  },

  async getDashboardStats(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, 404);

    // 1. Global Rank (count users with rating > user.rating)
    const rank = await UserModel.countDocuments({ rating: { $gt: user.rating } }) + 1;

    // 2. Acceptance Rate
    const totalSubmissions = await SubmissionModel.countDocuments({ userId: new mongoose.Types.ObjectId(userId) });
    const acceptedSubmissions = await SubmissionModel.countDocuments({ 
      userId: new mongoose.Types.ObjectId(userId), 
      status: 'Accepted' 
    });
    const acceptanceRate = totalSubmissions === 0 ? 0 : Math.round((acceptedSubmissions / totalSubmissions) * 100);

    // 3. Recent Submissions
    const recentSubmissions = await SubmissionModel.find({ userId: new mongoose.Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('problemId', 'title difficulty')
      .lean();

    // 4. Heatmap Data (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const heatmapData = await SubmissionModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          date: "$_id",
          count: 1,
          _id: 0
        }
      }
    ]);

    // 5. Fake Rating History (since we don't have a model)
    const ratingHistory = Array.from({ length: 6 }, (_, i) => ({
      name: `Month ${i + 1}`,
      rating: user.rating - (5 - i) * 50 + Math.floor(Math.random() * 40 - 20)
    }));
    ratingHistory.push({ name: 'Current', rating: user.rating });

    return {
      profile: toUserProfile(user),
      stats: {
        solvedCount: user.solvedCount,
        rating: user.rating,
        globalRank: rank,
        acceptanceRate: acceptanceRate
      },
      recentSubmissions: recentSubmissions.map(sub => ({
        id: sub._id,
        problemTitle: (sub.problemId as any)?.title || 'Unknown',
        status: sub.status,
        language: sub.language,
        createdAt: sub.createdAt
      })),
      heatmapData,
      ratingHistory
    };
  },

  async getLeaderboard(query: Record<string, any>) {
    // Default sort by rating descending
    if (!query.sort) query.sort = '-rating';
    
    const { filter, sort, skip, limit } = buildMongoQuery(query);
    
    const users = await UserModel.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select('username avatarUrl country solvedCount rating')
      .lean();
      
    const total = await UserModel.countDocuments(filter);
    
    return {
      users,
      meta: {
        page: query.page ? parseInt(query.page as string) : 1,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    };
  }
};
