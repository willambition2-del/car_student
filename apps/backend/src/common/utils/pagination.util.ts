import { PaginationQuery, PaginatedResult } from '../types';

export function getPaginationArgs(query: PaginationQuery) {
  const page = query.page && query.page > 0 ? query.page : 1;
  const limit = query.limit && query.limit > 0 ? query.limit : 10;
  
  const skip = (page - 1) * limit;
  const take = limit;
  
  return { skip, take, page, limit };
}

export function buildPaginatedResponse<T>(
  data: T[], 
  total: number, 
  page: number, 
  limit: number
): PaginatedResult<T> {
  const totalPages = Math.ceil(total / limit);
  
  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages,
    },
  };
}
