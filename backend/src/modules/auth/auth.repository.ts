import { UserModel, IUser } from '@/modules/users/user.model';
import { RefreshTokenModel, IRefreshToken } from '@/modules/auth/auth.model';

export const authRepository = {
  async findUserByEmail(email: string): Promise<IUser | null> {
    return UserModel.findOne({ email }).exec();
  },

  async findUserByUsername(username: string): Promise<IUser | null> {
    return UserModel.findOne({ username }).exec();
  },

  async findUserById(id: string): Promise<IUser | null> {
    return UserModel.findById(id).exec();
  },

  async createUser(data: {
    username: string;
    email: string;
    passwordHash: string;
  }): Promise<IUser> {
    const user = new UserModel(data);
    return user.save();
  },

  async createRefreshToken(data: {
    userId: string;
    token: string;
    expiresAt: Date;
  }): Promise<IRefreshToken> {
    const refreshToken = new RefreshTokenModel(data);
    return refreshToken.save();
  },

  async findRefreshToken(token: string): Promise<IRefreshToken | null> {
    return RefreshTokenModel.findOne({ token }).exec();
  },

  async deleteRefreshToken(token: string): Promise<void> {
    await RefreshTokenModel.deleteOne({ token }).exec();
  },

  async deleteAllUserRefreshTokens(userId: string): Promise<void> {
    await RefreshTokenModel.deleteMany({ userId }).exec();
  },
};
