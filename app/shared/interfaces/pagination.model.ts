export interface IQueryParamsPayload {
  page: number;
  pageSize: number;
  sortByAsc?: boolean;
}

export interface IPaginationResponse<T> {
  count: number;
  items: Array<T>;
}
