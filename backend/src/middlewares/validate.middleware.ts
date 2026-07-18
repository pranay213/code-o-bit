import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { AppError } from '@/types/api';
import { ERROR_MESSAGES } from '@/constants/error-messages';

type ValidateTarget = 'body' | 'query' | 'params';

export function validate(schema: ZodSchema, target: ValidateTarget = 'body'): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      const errors = (result.error as ZodError).errors.map(
        (e) => `${e.path.join('.')}: ${e.message}`,
      );
      return next(new AppError(ERROR_MESSAGES.VALIDATION_FAILED, 400, errors));
    }

    // Replace raw input with the validated and transformed value
    req[target] = result.data as typeof req[typeof target];
    next();
  };
}
