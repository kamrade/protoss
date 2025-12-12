import { IUser } from "@/types/users";

const USERS_ENDPOINT = "http://localhost:3030/api/v1/hs-users";
const DEFAULT_TENANT_ID = "3";

export async function getUsers(apiKey: string): Promise<IUser[]> {
  const response = await fetch(USERS_ENDPOINT, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "x-tenant-id": DEFAULT_TENANT_ID,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch users (status ${response.status})`);
  }

  return (await response.json()) as IUser[];
}
