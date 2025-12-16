"use client";

import * as React from "react";
import Link from "next/link";

import { useApiKey } from "@/context/api-key";
import { getHSClients } from "@/features/hs-clients/api";
import { HSClientCard } from "@/features/hs-clients/components/HSClientCard";
import { IHSClientResponse } from "@/types/hs-clients";

type LoadState = "idle" | "loading" | "error";

export default function HSClientsPage() {
  const { apiKey } = useApiKey();
  const [clientsData, setClientsData] = React.useState<IHSClientResponse | null>(
    null
  );
  const [loadState, setLoadState] = React.useState<LoadState>("idle");
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!apiKey) {
      setClientsData(null);
      setError(null);
      setLoadState("idle");
      return;
    }

    let isActive = true;
    setLoadState("loading");
    setError(null);

    getHSClients(apiKey)
      .then((data) => {
        if (!isActive) {
          return;
        }
        setClientsData(data);
        setLoadState("idle");
      })
      .catch((fetchError) => {
        if (!isActive) {
          return;
        }
        setClientsData(null);
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Failed to fetch Haystack clients."
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
          <h1 className="text-3xl font-semibold text-gray-900">HS Clients</h1>
          <p className="text-gray-600">
            Provide an API key on the{" "}
            <Link href="/" className="text-blue-600 underline">
              home page
            </Link>{" "}
            to fetch Haystack clients.
          </p>
        </div>
      </main>
    );
  }

  const isLoading = loadState === "loading";
  const clients = clientsData?.content ?? [];
  const hasClients = clients.length > 0;
  const totalClients = clientsData?.totalElements ?? 0;

  return (
    <main className="min-h-screen">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-10">
        <header className="py-6 border-b-1 border-gray-300">
          <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
            Directory
          </p>
          <h1 className="mt-4 text-4xl font-semibold text-gray-900">
            Haystack Clients
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Review onboarding data, KYC, and PEP statuses for every connected
            client.
          </p>
          {clientsData && (
            <p className="mt-4 text-sm text-gray-500">
              Showing {clients.length} of {totalClients} clients
            </p>
          )}
        </header>
      </div>

      <section>
        {isLoading && (
          <div className="mx-auto max-w-5xl flex-col gap-8 px-6 py-10">
            <p className="text-center text-gray-600">Loading Haystack clients…</p>
          </div>
        )}

        {loadState === "error" && !isLoading && (
          <div className="mx-auto max-w-5xl flex-col gap-8 px-6 py-10">
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error ?? "Unable to load Haystack clients. Please try again."}
            </div>
          </div>
        )}

        {!isLoading && !hasClients && loadState !== "error" && (
          <div className="mx-auto max-w-5xl flex-col gap-8 px-6 py-10">
            <p className="text-center text-gray-600">
              No Haystack clients found.
            </p>
          </div>
        )}

        {hasClients && (
          <ul className="space-y-1">
            {clients.map((client) => (
              <HSClientCard key={client.id} client={client} />
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
