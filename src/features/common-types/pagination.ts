import type { ISort } from './sort';

export interface IPagination {
  offset: number;
  pageNumber: number;
  pageSize: number;
  paged: true;
  sort: ISort[];
}