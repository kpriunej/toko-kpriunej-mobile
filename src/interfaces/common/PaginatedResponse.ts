export default interface PaginatedResponse<T> {
  current_page?: number | string;
  data: T[];
  per_page?: number;
  total?: number;
  from?: number | null;
  to?: number | null;
  last_page?: number;
  next_page_url?: string | null;
  prev_page_url?: string | null;
}
