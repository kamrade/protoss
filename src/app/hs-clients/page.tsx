"use client";

import * as React from "react";
import Link from "next/link";

import { useApiKey } from "@/context/api-key";
import { getHSClients, type SortField, type SortDirection } from "@/features/hs-clients/api";
import { HSClientCard } from "@/features/hs-clients/components/HSClientCard";
import { IHSClientResponse } from "@/features/hs-clients";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/Select";
import { TextField } from "@/components/TextField";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

type LoadState = "idle" | "loading" | "error";

export default function HSClientsPage() {
  const { apiKey } = useApiKey();
  const [clientsData, setClientsData] = React.useState<IHSClientResponse | null>(
    null
  );
  const [loadState, setLoadState] = React.useState<LoadState>("idle");
  const [error, setError] = React.useState<string | null>(null);

  // Sort state
  const [sortField, setSortField] = React.useState<SortField>("createdDate");
  const [sortDirection, setSortDirection] = React.useState<SortDirection>("desc");

  // Search state (debounced)
  const [searchInput, setSearchInput] = React.useState<string>("");
  const [search, setSearch] = React.useState<string>("");

  // debounce search input
  React.useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

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

    getHSClients(apiKey, sortField, sortDirection, search)
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
  }, [apiKey, sortField, sortDirection, search]);

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

          {/* Search + Sort controls */}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-0">
              <TextField
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search clients"
                leadingVisual={<MagnifyingGlassIcon className="h-4 w-4" />}
                wrapperClassName="w-full"
              />
            </div>

            <div className="flex-none md:flex items-center gap-4">
              <div className="flex-1 md:flex-none">
                <div className="flex gap-2">
                  <div className="w-44">
                    <Select value={sortField} onValueChange={(v) => setSortField(v as SortField)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Field" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="companyName">Company name</SelectItem>
                        <SelectItem value="status">Status</SelectItem>
                        <SelectItem value="createdDate">Created date</SelectItem>
                        <SelectItem value="kycStatus">KYC status</SelectItem>
                        <SelectItem value="pepStatus">PEP status</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-36">
                    <Select value={sortDirection} onValueChange={(v) => setSortDirection(v as SortDirection)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Direction" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asc">Ascending</SelectItem>
                        <SelectItem value="desc">Descending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
