import { PAGINATION } from '@/constants/pagination';
import { PaginationMeta } from '@/types/pagination';

export interface ParsedPagination {
  page: number;
  limit: number;
  skip: number;
}

export function parsePagination(query: {
  page?: string | number;
  limit?: string | number;
}): ParsedPagination {
  const page = Math.max(1, parseInt(String(query.page ?? PAGINATION.DEFAULT_PAGE), 10));
  const limit = Math.min(
    PAGINATION.MAX_LIMIT,
    Math.max(1, parseInt(String(query.limit ?? PAGINATION.DEFAULT_LIMIT), 10)),
  );
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

export function buildPaginationMeta(total: number, page: number, limit: number): PaginationMeta {
  const totalPages = Math.ceil(total / limit);

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}
