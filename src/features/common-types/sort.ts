export type SortDirection = "asc" | "desc";

export interface ISort {
  ascending: boolean;
  descending: boolean;
  direction: 'ASC' | 'DESC';
  ignoreCase: boolean;
  nullHandling: 'NATIVE';
  property: string;
}