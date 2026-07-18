import { AppError } from '@/types/api';
import { UserProfile, UpdateRoleDto } from '@/types/user';
import { PaginatedResponse } from '@/types/pagination';
import { userRepository } from '@/modules/users/user.repository';
import { parsePagination, buildPaginationMeta } from '@/utils/pagination';
import { ERROR_MESSAGES } from '@/constants/error-messages';
import { IUser } from '@/modules/users/user.model';

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

export const adminService = {
  async listUsers(query: { page?: string; limit?: string }): Promise<PaginatedResponse<UserProfile>> {
    const { page, limit, skip } = parsePagination(query);
    const { users, total } = await userRepository.findAll({ skip, limit });

    return {
      items: users.map(toUserProfile),
      meta: buildPaginationMeta(total, page, limit),
    };
  },

  async updateUserRole(targetUserId: string, requestingUserId: string, data: UpdateRoleDto): Promise<UserProfile> {
    if (targetUserId === requestingUserId) {
      throw new AppError('You cannot change your own role.', 400);
    }

    const user = await userRepository.updateRole(targetUserId, data.role);
    if (!user) throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, 404);

    return toUserProfile(user);
  },

  async deleteUser(targetUserId: string, requestingUserId: string): Promise<void> {
    if (targetUserId === requestingUserId) {
      throw new AppError(ERROR_MESSAGES.CANNOT_DELETE_OWN_ACCOUNT, 400);
    }

    const user = await userRepository.deleteById(targetUserId);
    if (!user) throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, 404);
  },
};
