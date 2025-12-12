"use client";

import * as React from "react";
import Link from "next/link";

import { useApiKey } from "@/context/api-key";
import { getUsers } from "@/features/users/api";
import { UserCard } from "@/features/users/UserCard";
import { IUser } from "@/types/users";

type LoadState = "idle" | "loading" | "error";

export default function UsersManagementPage() {
  const { apiKey } = useApiKey();
  const [users, setUsers] = React.useState<IUser[]>([]);
  const [loadState, setLoadState] = React.useState<LoadState>("idle");
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!apiKey) {
      setUsers([]);
      setError(null);
      setLoadState("idle");
      return;
    }

    let isActive = true;
    setLoadState("loading");
    setError(null);

    getUsers(apiKey)
      .then((data) => {
        if (!isActive) {
          return;
        }

        setUsers(data);
        setLoadState("idle");
      })
      .catch((fetchError) => {
        if (!isActive) {
          return;
        }

        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Failed to fetch users."
        );
        setLoadState("error");
      });

    return () => {
      isActive = false;
    };
  }, [apiKey]);

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
            to fetch users from Protoss.
          </p>
        </div>
      </main>
    );
  }

  const isLoading = loadState === "loading";
  const hasUsers = users.length > 0;

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-6 py-10">
      <header className="rounded-3xl border border-gray-200 bg-white px-10 py-12 shadow-sm">
        <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
          Directory
        </p>
        <h1 className="mt-4 text-4xl font-semibold text-gray-900">
          Users Management
        </h1>
        <p className="mt-3 text-lg text-gray-600">
          Review every user across tenants, their access state, and the
          permissions assigned to them.
        </p>
      </header>

      <section className="rounded-3xl border border-gray-200 bg-white px-8 py-8 shadow-sm">
        {isLoading && (
          <p className="text-center text-gray-600">Loading users…</p>
        )}

        {loadState === "error" && !isLoading && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error ?? "Unable to load users. Please try again."}
          </div>
        )}

        {!isLoading && !hasUsers && loadState !== "error" && (
          <p className="text-center text-gray-600">No users found.</p>
        )}

        {hasUsers && (
          <ul className="space-y-6">
            {users.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
