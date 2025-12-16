"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { useApiKey } from "@/context/api-key";
import { getUserDetails } from "@/features/users/api";
import { IUser, UserTenant, UserPermission } from "@/features/users";

type LoadState = "idle" | "loading" | "error";

const toReadableDate = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
};

export default function UserDetailPage() {
  const params = useParams<{ userId: string }>();
  const userIdParam = params?.userId;
  const userId = Array.isArray(userIdParam) ? userIdParam[0] : userIdParam;
  const { apiKey } = useApiKey();

  const [user, setUser] = React.useState<IUser | null>(null);
  const [loadState, setLoadState] = React.useState<LoadState>("idle");
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!apiKey || !userId) {
      setUser(null);
      setError(null);
      setLoadState("idle");
      return;
    }

    let isActive = true;
    setLoadState("loading");
    setError(null);

    getUserDetails(apiKey, userId)
      .then((data) => {
        if (!isActive) {
          return;
        }

        setUser(data);
        setLoadState("idle");
      })
      .catch((fetchError) => {
        if (!isActive) {
          return;
        }

        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Failed to fetch user details."
        );
        setLoadState("error");
      });

    return () => {
      isActive = false;
    };
  }, [apiKey, userId]);

  if (!userId) {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
        <div className="space-y-4 rounded-3xl border border-dashed border-gray-300 bg-white/80 px-10 py-12">
          <h1 className="text-3xl font-semibold text-gray-900">
            User not found
          </h1>
          <p className="text-gray-600">
            Please return to the{" "}
            <Link href="/users-management" className="text-blue-600 underline">
              users directory
            </Link>{" "}
            and select a profile again.
          </p>
        </div>
      </main>
    );
  }

  if (!apiKey) {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
        <div className="space-y-4 rounded-3xl border border-dashed border-gray-300 bg-white/80 px-10 py-12">
          <h1 className="text-3xl font-semibold text-gray-900">
            Users Management
          </h1>
          <p className="text-gray-600">
            Provide an API key on the{" "}
            <Link href="/" className="text-blue-600 underline">
              home page
            </Link>{" "}
            to fetch user details from Protoss.
          </p>
        </div>
      </main>
    );
  }

  const isLoading = loadState === "loading";

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-6 py-10">
      <header className="rounded-3xl border border-gray-200 bg-white px-10 py-12 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
              Directory · User
            </p>
            <h1 className="mt-4 text-4xl font-semibold text-gray-900">
              {user ? `${user.firstName} ${user.lastName}` : "Loading user…"}
            </h1>
            {user && (
              <p className="mt-2 text-lg text-gray-600">{user.email}</p>
            )}
          </div>
          <Link
            href="/users-management"
            className="inline-flex items-center justify-center rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:text-gray-900"
          >
            ← Back to users
          </Link>
        </div>
      </header>

      <section className="rounded-3xl border border-gray-200 bg-white px-8 py-8 shadow-sm">
        {isLoading && (
          <p className="text-center text-gray-600">Loading user…</p>
        )}

        {loadState === "error" && !isLoading && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error ?? "Unable to load user. Please try again."}
          </div>
        )}

        {!isLoading && loadState !== "error" && user && (
          <div className="space-y-8">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Profile summary
              </h2>
              <dl className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
                  <dt className="text-xs uppercase tracking-wide text-gray-500">
                    Status
                  </dt>
                  <dd className="mt-1 text-base font-semibold text-gray-900">
                    {user.enabled ? "Enabled" : "Disabled"}
                  </dd>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
                  <dt className="text-xs uppercase tracking-wide text-gray-500">
                    Email verified
                  </dt>
                  <dd className="mt-1 text-base font-semibold text-gray-900">
                    {user.emailVerified ? "Yes" : "No"}
                  </dd>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
                  <dt className="text-xs uppercase tracking-wide text-gray-500">
                    User ID
                  </dt>
                  <dd className="mt-1 font-mono text-sm text-gray-800">
                    {user.id}
                  </dd>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
                  <dt className="text-xs uppercase tracking-wide text-gray-500">
                    Keycloak ID
                  </dt>
                  <dd className="mt-1 font-mono text-sm text-gray-800">
                    {user.keycloakId}
                  </dd>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
                  <dt className="text-xs uppercase tracking-wide text-gray-500">
                    Created
                  </dt>
                  <dd className="mt-1 text-sm text-gray-800">
                    {toReadableDate(user.createdDate)} by {user.createdByName}
                  </dd>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
                  <dt className="text-xs uppercase tracking-wide text-gray-500">
                    Modified
                  </dt>
                  <dd className="mt-1 text-sm text-gray-800">
                    {toReadableDate(user.modifiedDate)} by {user.modifiedByName}
                  </dd>
                </div>
              </dl>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">Tenants</h2>
              {user.tenants.length === 0 ? (
                <p className="mt-2 text-sm text-gray-600">
                  No tenant assignments found for this user.
                </p>
              ) : (
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {user.tenants.map((tenant: UserTenant) => (
                    <div
                      key={tenant.id}
                      className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-4"
                    >
                      <p className="text-base font-semibold text-gray-900">
                        {tenant.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        Base currency: {tenant.baseCurrency}
                      </p>
                      <p className="text-xs text-gray-500">
                        API: {tenant.productApi.apiName} · Index:{" "}
                        {tenant.indexPattern}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Permissions
              </h2>
              {user.permissions.length === 0 ? (
                <p className="mt-2 text-sm text-gray-600">
                  This user has no permissions assigned.
                </p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {user.permissions.map((permission: UserPermission) => (
                    <li
                      key={permission.id}
                      className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3"
                    >
                      <p className="font-semibold text-gray-900">
                        {permission.name}
                      </p>
                      <p className="text-xs uppercase tracking-wide text-gray-500">
                        {permission.scope}
                        {permission.type ? ` · ${permission.type}` : ""}
                      </p>
                      {permission.description && (
                        <p className="mt-1 text-sm text-gray-600">
                          {permission.description}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
