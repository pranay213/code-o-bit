import { Response } from 'express';
import { ApiResponse, ApiErrorResponse } from '@/types/api';
import { PaginationMeta } from '@/types/pagination';

export function sendSuccess<T>(
  res: Response,
  data: T,
  message: string,
  statusCode = 200,
  meta?: PaginationMeta | Record<string, unknown>,
): void {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
    ...(meta && { meta }),
  };
  res.status(statusCode).json(response);
}

export function sendError(
  res: Response,
  message: string,
  statusCode: number,
  errors: string[] = [],
): void {
  const response: ApiErrorResponse = {
    success: false,
    message,
    errors,
    statusCode,
  };
  res.status(statusCode).json(response);
}
