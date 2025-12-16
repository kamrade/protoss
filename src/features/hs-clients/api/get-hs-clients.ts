import { IHSClientResponse } from "@/features/hs-clients";
import type { SortDirection } from "@/features/common-types";

const HS_CLIENTS_ENDPOINT =
  "http://localhost:3030/api/v1/hs-clients";
const DEFAULT_TENANT_ID = "3";

const defaultHeaders = (apiKey: string) => ({
  Authorization: `Bearer ${apiKey}`,
  "x-tenant-id": DEFAULT_TENANT_ID,
});

export type SortField = 'companyName' | 'status' | 'createdDate' | 'kycStatus' | 'pepStatus';

export async function getHSClients(
  apiKey: string,
  sortField: SortField = 'createdDate',
  sortDirection: SortDirection = 'desc',
  search: string = '',
  page: number = 0,
  size: number = 80
): Promise<IHSClientResponse> {

  const url = HS_CLIENTS_ENDPOINT 
    + `?sort=${sortField},${sortDirection}` 
    + (search ? '&search=' + search : '')
    + `&page=${page}`
    + `&size=${size}`;
  const response = await fetch(url, {
    method: "GET",
    headers: defaultHeaders(apiKey),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch Haystack clients (status ${response.status})`
    );
  }

  return (await response.json()) as IHSClientResponse;
}
