export type SortOrder = "asc" | "desc";

export interface ListQueryParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  order?: SortOrder;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    totalRecords: number;
    totalPages: number;
  };
}
