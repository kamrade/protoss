import type { ICaseResponse } from "@/features/cases";

const CASES_ENDPOINT = "http://localhost:3030/api/v1/cases";
const DEFAULT_TENANT_ID = "3";

const defaultHeaders = (apiKey: string, tenantId = DEFAULT_TENANT_ID) => ({
  Authorization: `Bearer ${apiKey}`,
  "x-tenant-id": tenantId,
});

export interface GetCasesOptions {
  apiKey: string;
  page?: number;
  size?: number;
  tenantId?: string;
  sortField?: string;
  sortDirection?: "asc" | "desc";
  caseStatus?: string;
  caseType?: string;
  assigneeId?: string;
  search?: string;
}

export async function getCases({
  apiKey,
  page = 0,
  size = 100,
  tenantId = DEFAULT_TENANT_ID,
  sortField = "createdDateTime",
  sortDirection = "desc",
  caseStatus,
  caseType,
  assigneeId,
  search,
}: GetCasesOptions): Promise<ICaseResponse> {
  const url = new URL(CASES_ENDPOINT);
  const params = new URLSearchParams();

  params.set("page", String(page));
  params.set("size", String(size));
  params.set("tenantId", tenantId);
  params.set("sort", `${sortField},${sortDirection}`);

  if (caseStatus) params.set("caseStatus", caseStatus);
  if (caseType) params.set("caseType", caseType);
  if (assigneeId) params.set("assigneeId", assigneeId);
  if (search) params.set("search", search);

  url.search = params.toString();

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: defaultHeaders(apiKey, tenantId),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch cases (status ${res.status})`);
  }

  return (await res.json()) as ICaseResponse;
}
