"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { IUser } from "@/features/users";

interface UserCardProps {
  user: IUser;
}

export function UserCard({ user }: UserCardProps) {
  const router = useRouter();
  const hasTenants = user.tenants.length > 0;
  const hasPermissions = user.permissions.length > 0;

  const navigateToDetails = React.useCallback(() => {
    router.push(`/users-management/${user.id}`);
  }, [router, user.id]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLLIElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      navigateToDetails();
    }
  };

  return (
    <li
      role="link"
      tabIndex={0}
      onClick={navigateToDetails}
      onKeyDown={handleKeyDown}
      className="rounded-2xl border border-gray-100 bg-gray-50 px-6 py-5 outline-none transition hover:border-gray-200 hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {user.firstName} {user.lastName}
          </h2>
          <p className="text-sm text-gray-500">{user.email}</p>
          <p className="mt-1 text-sm text-gray-500">
            Keycloak ID:{" "}
            <span className="font-mono text-gray-700">{user.keycloakId}</span>
          </p>
        </div>
        <div className="flex items-center gap-3 self-start rounded-full bg-white px-4 py-1 text-sm font-medium">
          <span
            className={`inline-flex h-2 w-2 rounded-full ${
              user.enabled ? "bg-green-400" : "bg-red-400"
            }`}
          />
          {user.enabled ? "Enabled" : "Disabled"}
        </div>
      </div>

      {hasTenants && (
        <div className="mt-4 flex flex-wrap gap-2">
          {user.tenants.map((tenant) => (
            <span
              key={tenant.id}
              className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700"
            >
              {tenant.name}
            </span>
          ))}
        </div>
      )}

      {hasPermissions && (
        <details
          className="mt-4 rounded-xl bg-white px-4 py-3"
          onClick={(event) => event.stopPropagation()}
          onKeyDown={(event) => event.stopPropagation()}
        >
          <summary className="cursor-pointer text-sm font-semibold text-gray-800">
            Permissions ({user.permissions.length})
          </summary>
          <ul className="mt-3 space-y-2 text-sm text-gray-700">
            {user.permissions.map((permission) => (
              <li
                key={`${user.id}-${permission.id}`}
                className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2"
              >
                <p className="font-medium text-gray-900">{permission.name}</p>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  {permission.scope}
                  {permission.type ? ` · ${permission.type}` : ""}
                </p>
                {permission.description && (
                  <p className="text-xs text-gray-600">
                    {permission.description}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </details>
      )}
    </li>
  );
}
