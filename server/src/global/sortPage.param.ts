export class SortPageParam<T> {
  page: number = 1;
  limit: number = 10;
  sort: 'asc' | 'desc' = 'asc';
  sortColumn: keyof T;
}
