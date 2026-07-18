import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/types/api';
import { verifyAccessToken } from '@/utils/token';
import { ERROR_MESSAGES } from '@/constants/error-messages';
import { authLogger } from '@/config/logger';
import { LOG_MESSAGES } from '@/constants/log-messages';

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    authLogger.debug(LOG_MESSAGES.AUTH_TOKEN_MISSING, {
      requestId: req.context?.requestId,
      ip: req.context?.location.ip,
    });
    return next(new AppError(ERROR_MESSAGES.ACCESS_TOKEN_MISSING, 401));
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    authLogger.debug(LOG_MESSAGES.AUTH_TOKEN_VERIFIED, {
      requestId: req.context?.requestId,
      userId: payload.sub,
    });
    next();
  } catch {
    authLogger.debug(LOG_MESSAGES.AUTH_TOKEN_INVALID, {
      requestId: req.context?.requestId,
      ip: req.context?.location.ip,
    });
    next(new AppError(ERROR_MESSAGES.ACCESS_TOKEN_INVALID, 401));
  }
}
