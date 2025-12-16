import { IHSClientResponse, IHSClientOverview } from "@/features/hs-clients";
import type { SortDirection } from "@/features/common-types";

const HS_CLIENTS_ENDPOINT =
  "http://localhost:3030/api/v1/hs-clients";
const DEFAULT_TENANT_ID = "3";

const defaultHeaders = (apiKey: string) => ({
  Authorization: `Bearer ${apiKey}`,
  "x-tenant-id": DEFAULT_TENANT_ID,
});

export type SortField = 'companyName' | 'status' | 'createdDate' | 'kycStatus' | 'pepStatus';

export interface GetHSClientsOptions {
  apiKey: string;
  sortField?: SortField;
  sortDirection?: SortDirection;
  search?: string;
  page?: number;
  size?: number;
  clientId?: string;
}

export function getHSClients(
  opts: GetHSClientsOptions & { clientId: string }
): Promise<IHSClientOverview>;
export function getHSClients(
  opts: GetHSClientsOptions & { clientId?: undefined }
): Promise<IHSClientResponse>;
export async function getHSClients({
  apiKey,
  sortField = 'createdDate',
  sortDirection = 'desc',
  search = '',
  page = 0,
  size = 80,
  clientId,
}: GetHSClientsOptions): Promise<IHSClientResponse | IHSClientOverview> {
  // If a clientId is provided, fetch the single client resource and return its overview
  if (clientId) {
    const url = `${HS_CLIENTS_ENDPOINT}/${encodeURIComponent(clientId)}`;
    const response = await fetch(url, {
      method: "GET",
      headers: defaultHeaders(apiKey),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch Haystack client ${clientId} (status ${response.status})`
      );
    }
    return (await response.json()) as IHSClientOverview;
  }

  const url =
    HS_CLIENTS_ENDPOINT + `?sort=${sortField},${sortDirection}` +
    (search ? "&search=" + encodeURIComponent(search) : "") +
    `&page=${page}` +
    `&size=${size}`;
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
