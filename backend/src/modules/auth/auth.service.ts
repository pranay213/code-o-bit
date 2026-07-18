import bcrypt from 'bcryptjs';
import { AppError } from '@/types/api';
import { AuthTokens, JwtPayload } from '@/types/auth';
import { UserProfile } from '@/types/user';
import { authRepository } from '@/modules/auth/auth.repository';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '@/utils/token';
import { env } from '@/config/env';
import { ROLES } from '@/constants/roles';
import { ERROR_MESSAGES } from '@/constants/error-messages';

function buildRefreshTokenExpiry(): Date {
  // Parses JWT expiry string like "7d" into a Date
  const expiry = env.jwt.refreshExpiresIn;
  const match = expiry.match(/^(\d+)([smhd])$/);
  if (!match) return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const value = parseInt(match[1], 10);
  const unit = match[2];
  const multipliers: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return new Date(Date.now() + value * multipliers[unit]);
}

function buildTokenPayload(user: { id: string; email: string; role: string }): Omit<JwtPayload, 'iat' | 'exp'> {
  return {
    sub: user.id as string,
    email: user.email,
    role: user.role as (typeof ROLES)[keyof typeof ROLES],
  };
}

export const authService = {
  async register(data: {
    username: string;
    email: string;
    password: string;
  }): Promise<{ user: UserProfile; tokens: AuthTokens }> {
    const [existingEmail, existingUsername] = await Promise.all([
      authRepository.findUserByEmail(data.email),
      authRepository.findUserByUsername(data.username),
    ]);

    if (existingEmail) {
      throw new AppError(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS, 409);
    }

    if (existingUsername) {
      throw new AppError('Username is already taken.', 409);
    }

    const passwordHash = await bcrypt.hash(data.password, env.bcryptSaltRounds);
    const user = await authRepository.createUser({
      username: data.username,
      email: data.email,
      passwordHash,
    });

    const payload = buildTokenPayload({ id: String(user._id), email: user.email, role: user.role });
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    await authRepository.createRefreshToken({
      userId: String(user._id),
      token: refreshToken,
      expiresAt: buildRefreshTokenExpiry(),
    });

    const userProfile: UserProfile = {
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

    return { user: userProfile, tokens: { accessToken, refreshToken } };
  },

  async login(data: {
    email: string;
    password: string;
  }): Promise<{ user: UserProfile; tokens: AuthTokens }> {
    const user = await authRepository.findUserByEmail(data.email);

    if (!user) {
      throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, 401);
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, 401);
    }

    const payload = buildTokenPayload({ id: String(user._id), email: user.email, role: user.role });
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    await authRepository.createRefreshToken({
      userId: String(user._id),
      token: refreshToken,
      expiresAt: buildRefreshTokenExpiry(),
    });

    const userProfile: UserProfile = {
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

    return { user: userProfile, tokens: { accessToken, refreshToken } };
  },

  async refresh(refreshToken: string): Promise<{ accessToken: string }> {
    let payload: JwtPayload;

    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw new AppError(ERROR_MESSAGES.INVALID_REFRESH_TOKEN, 401);
    }

    const storedToken = await authRepository.findRefreshToken(refreshToken);

    if (!storedToken) {
      throw new AppError(ERROR_MESSAGES.REFRESH_TOKEN_NOT_FOUND, 401);
    }

    const user = await authRepository.findUserById(payload.sub);

    if (!user) {
      throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, 404);
    }

    const newPayload = buildTokenPayload({ id: String(user._id), email: user.email, role: user.role });
    const accessToken = signAccessToken(newPayload);

    return { accessToken };
  },

  async logout(refreshToken: string): Promise<void> {
    await authRepository.deleteRefreshToken(refreshToken);
  },
};
