import { PaginationMeta } from '@/types/pagination';

export interface ApiResponse<T = null> {
  success: boolean;
  message: string;
  data: T | null;
  meta?: Record<string, unknown> | PaginationMeta;
  errors?: string[];
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors: string[];
  statusCode: number;
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errors: string[];
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, errors: string[] = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
