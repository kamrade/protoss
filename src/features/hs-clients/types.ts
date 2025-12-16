export interface ISort {
  ascending: boolean;
  descending: boolean;
  direction: 'ASC' | 'DESC';
  ignoreCase: boolean;
  nullHandling: 'NATIVE';
  property: string;
}

export interface IPagination {
  offset: number;
  pageNumber: number;
  pageSize: number;
  paged: true;
  sort: ISort[];
}

export interface IHSClient {
  companyName: string;
  contactEmail: string;
  createdDate: string;
  id: string;
  kycStatus: string; // TODO: add type
  pepStatus: string; // TODO: add type
  status: string;    // TODO: add type
  tenantId: number;
}

export interface IHSClientResponse {
  content: IHSClient[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable: IPagination;
  size: number;
  sort: ISort[];
  totalElements: number;
  totalPages: number;
}