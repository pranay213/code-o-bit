import { Request, Response } from 'express';
import { authService } from '@/modules/auth/auth.service';
import { sendSuccess } from '@/utils/api-response';
import { SUCCESS_MESSAGES } from '@/constants/success-messages';
import { RegisterInput, LoginInput, RefreshTokenInput } from '@/modules/auth/auth.validator';

export const authController = {
  async register(req: Request, res: Response): Promise<void> {
    const body = req.body as RegisterInput;
    const result = await authService.register(body);
    sendSuccess(res, result, SUCCESS_MESSAGES.REGISTERED, 201);
  },

  async login(req: Request, res: Response): Promise<void> {
    const body = req.body as LoginInput;
    const result = await authService.login(body);
    sendSuccess(res, result, SUCCESS_MESSAGES.LOGGED_IN);
  },

  async refresh(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req.body as RefreshTokenInput;
    const result = await authService.refresh(refreshToken);
    sendSuccess(res, result, SUCCESS_MESSAGES.TOKEN_REFRESHED);
  },

  async logout(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req.body as RefreshTokenInput;
    await authService.logout(refreshToken);
    sendSuccess(res, null, SUCCESS_MESSAGES.LOGGED_OUT);
  },
};
