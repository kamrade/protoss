import { IHSClientResponse } from "@/types/hs-clients";

const HS_CLIENTS_ENDPOINT =
  "http://localhost:3030/api/v1/hs-clients";
const DEFAULT_TENANT_ID = "3";

const defaultHeaders = (apiKey: string) => ({
  Authorization: `Bearer ${apiKey}`,
  "x-tenant-id": DEFAULT_TENANT_ID,
});

export async function getHSClients(
  apiKey: string
): Promise<IHSClientResponse> {
  const response = await fetch(HS_CLIENTS_ENDPOINT, {
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
