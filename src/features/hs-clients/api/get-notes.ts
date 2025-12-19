import type { INote } from "@/features/hs-clients";

const HS_APPLICATIONS_ENDPOINT =
  "http://localhost:3030/api/v1/hs-applications";
const DEFAULT_TENANT_ID = "3";

const defaultHeaders = (apiKey: string) => ({
  Authorization: `Bearer ${apiKey}`,
  "x-tenant-id": DEFAULT_TENANT_ID,
});

export async function getApplicationNotes(
  apiKey: string,
  applicationId: string
): Promise<INote[]> {
  if (!applicationId) {
    throw new Error("applicationId is required to fetch notes.");
  }

  const url = `${HS_APPLICATIONS_ENDPOINT}/${encodeURIComponent(
    applicationId
  )}/notes`;

  const response = await fetch(url, {
    method: "GET",
    headers: defaultHeaders(apiKey),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch notes for application ${applicationId} (status ${response.status})`
    );
  }

  return (await response.json()) as INote[];
}
