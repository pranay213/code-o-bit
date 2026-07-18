import { Request, Response, NextFunction, RequestHandler } from 'express';
import { Role } from '@/constants/roles';
import { AppError } from '@/types/api';
import { ERROR_MESSAGES } from '@/constants/error-messages';

export function requireRole(...roles: Role[]): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError(ERROR_MESSAGES.UNAUTHORIZED, 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError(ERROR_MESSAGES.FORBIDDEN, 403));
    }

    next();
  };
}
