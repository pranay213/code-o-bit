import { FilterQuery, SortOrder } from 'mongoose';
import { PAGINATION } from '@/constants/pagination';

export interface BaseQueryInput {
  page?: string | number;
  limit?: string | number;
  sort?: string;
  search?: string;
  [key: string]: any;
}

export interface MongoQueryOptions<T> {
  filter: FilterQuery<T>;
  sort: Record<string, SortOrder>;
  skip: number;
  limit: number;
}

/**
 * Builds a generic MongoDB query (Filter, Sort, Skip, Limit) from raw URL parameters.
 */
export function buildMongoQuery<T>(query: BaseQueryInput, allowedFilters: string[] = []): MongoQueryOptions<T> {
  // 1. Pagination
  const page = Math.max(1, parseInt(String(query.page ?? PAGINATION.DEFAULT_PAGE), 10));
  const limit = Math.min(
    PAGINATION.MAX_LIMIT,
    Math.max(1, parseInt(String(query.limit ?? PAGINATION.DEFAULT_LIMIT), 10))
  );
  const skip = (page - 1) * limit;

  // 2. Sorting
  // Default sort is descending by createdAt (newest first)
  const sortParams = query.sort ? String(query.sort).split(',') : ['-createdAt'];
  const sort: Record<string, SortOrder> = {};
  
  sortParams.forEach((param) => {
    if (param.startsWith('-')) {
      sort[param.substring(1)] = -1;
    } else {
      sort[param] = 1;
    }
  });

  // 3. Search & Filters
  const filter: FilterQuery<T> = {};

  // Text Index Search
  if (query.search) {
    filter.$text = { $search: String(query.search) };
  }

  // Dynamic allowed filters (e.g., exact matches for difficulty, tag, role)
  allowedFilters.forEach((key) => {
    if (query[key] !== undefined && query[key] !== '') {
      (filter as any)[key] = query[key];
    }
  });

  return { filter, sort, skip, limit };
}
