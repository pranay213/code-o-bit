import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/types/api';
import { env } from '@/config/env';
import { logger } from '@/config/logger';
import { ERROR_MESSAGES } from '@/constants/error-messages';

export function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      logger.error(err.message, {
        statusCode: err.statusCode,
        requestId: req.context?.requestId,
        stack: err.stack,
      });
    }

    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
      statusCode: err.statusCode,
    });
    return;
  }

  // Unexpected/unhandled errors
  logger.error('Unhandled error', {
    message: err.message,
    stack: env.nodeEnv !== 'production' ? err.stack : undefined,
    requestId: req.context?.requestId,
    url: req.originalUrl,
    method: req.method,
  });

  res.status(500).json({
    success: false,
    message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    errors: [],
    statusCode: 500,
  });
}
