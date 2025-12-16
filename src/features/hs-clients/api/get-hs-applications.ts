import { IApplicationsResponse } from "@/features/hs-clients";
import type { SortDirection } from "@/features/common-types";

const HS_APPLICATIONS_ENDPOINT =
  "http://localhost:3030/api/v1/hs-applications";
const DEFAULT_TENANT_ID = "3";

const defaultHeaders = (apiKey: string) => ({
  Authorization: `Bearer ${apiKey}`,
  "x-tenant-id": DEFAULT_TENANT_ID,
});

export type ApplicationsSortField =
  | "companyName"
  | "createdDate"
  | "mainStatus"
  | "kycStatus"
  | "pepStatus";


export async function getHSApplications(
  apiKey: string,
  sortField: ApplicationsSortField = "createdDate",
  sortDirection: SortDirection = "desc",
  search: string = "",
  page: number = 0,
  size: number = 80
): Promise<IApplicationsResponse> {
  const url =
    HS_APPLICATIONS_ENDPOINT + `?sort=${sortField},${sortDirection}` +
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
      `Failed to fetch Haystack applications (status ${response.status})`
    );
  }

  return (await response.json()) as IApplicationsResponse;
}
