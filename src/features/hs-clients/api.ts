import { IHSClientResponse } from "@/types/hs-clients";

const HS_CLIENTS_ENDPOINT =
  "http://localhost:3030/api/v1/hs-clients";
const DEFAULT_TENANT_ID = "3";

const defaultHeaders = (apiKey: string) => ({
  Authorization: `Bearer ${apiKey}`,
  "x-tenant-id": DEFAULT_TENANT_ID,
});

type SortField = 'companyName' | 'status' | 'createdDate' | 'kycStatus' | 'pepStatus';
type SortDirection = 'asc' | 'desc';

export async function getHSClients(
  apiKey: string,
  sortField: SortField = 'createdDate',
  sortDirection: SortDirection = 'desc'
): Promise<IHSClientResponse> {

  const url = HS_CLIENTS_ENDPOINT + "?" + `sort=${sortField},${sortDirection}`
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
