import { IUser } from "@/types/users";

const USERS_ENDPOINT = "http://localhost:3030/api/v1/hs-users";
const DEFAULT_TENANT_ID = "3";

const defaultHeaders = (apiKey: string) => ({
  Authorization: `Bearer ${apiKey}`,
  "x-tenant-id": DEFAULT_TENANT_ID,
});

export async function getUsers(apiKey: string): Promise<IUser[]> {
  const response = await fetch(USERS_ENDPOINT, {
    method: "GET",
    headers: defaultHeaders(apiKey),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch users (status ${response.status})`);
  }

  return (await response.json()) as IUser[];
}

export async function getUserDetails(
  apiKey: string,
  userId: string
): Promise<IUser> {
  const response = await fetch(`${USERS_ENDPOINT}/${userId}`, {
    method: "GET",
    headers: defaultHeaders(apiKey),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch user ${userId} (status ${response.status})`
    );
  }

  return (await response.json()) as IUser;
}
