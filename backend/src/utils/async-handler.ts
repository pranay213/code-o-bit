import { Request, Response, NextFunction, RequestHandler } from 'express';

type AsyncRouteHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

/**
 * Wraps an async route handler so that any rejected promise or thrown error
 * is forwarded to Express's global error middleware via next().
 * Eliminates boilerplate try/catch in every controller method.
 */
export function asyncHandler(fn: AsyncRouteHandler): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };
}
