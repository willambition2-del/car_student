import { UserRole } from '../enums';

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: any;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole | string;
  userType?: 'platform' | 'school' | string;
  schoolId?: string;
  permissions?: string[];
  type?: string;
}
