"use client";

import * as React from "react";
import Link from "next/link";
import { useApiKey } from "@/context/api-key";
import { getHSClients } from "@/features/hs-clients/api";
import { IHSClientOverview } from "@/features/hs-clients";
import { Badge } from "@/components/Badge";

interface Props {
  clientId: string;
}

export function HSClientDetails({ clientId }: Props) {
  const { apiKey } = useApiKey();
  const [client, setClient] = React.useState<IHSClientOverview | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!apiKey) return;
    let active = true;
    setLoading(true);
    setError(null);

    getHSClients({ apiKey, clientId })
      .then((data) => {
        if (!active) return;
        setClient(data as IHSClientOverview);
        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : String(err));
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [apiKey, clientId]);

  if (!apiKey) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-10 text-center">
        <p className="text-gray-600">
          Provide an API key on the <Link href="/">home page</Link> to view client details.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-10">
        <p className="text-center text-gray-600">Loading client details…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (!client) {
    return null;
  }

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <header className="py-6 border-b-1 border-gray-300">
          <Link href="/hs-clients" className="text-sm text-gray-500 underline">← Back to clients</Link>
          <h1 className="mt-4 text-4xl font-semibold text-gray-900">{client.companyName}</h1>
          <p className="mt-2 text-sm text-gray-500">Created: {new Date(client.createdDate).toLocaleString()}</p>

          <div className="mt-4 flex gap-3">
            <Badge variant="subtle">{client.status}</Badge>
          </div>
        </header>

        <section className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h3 className="text-sm font-semibold text-gray-900">Contact</h3>
            <p className="mt-2 text-sm text-gray-600">{client.contactFirstName} {client.contactMiddleName} {client.contactLastName}</p>
            <p className="mt-1 text-sm text-gray-600">{client.contactEmail}</p>
            <p className="mt-1 text-sm text-gray-600">{client.contactPhone}</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 md:col-span-2">
            <h3 className="text-sm font-semibold text-gray-900">Overview</h3>
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div>
                <p className="text-xs text-gray-500">Sales manager</p>
                <p className="text-sm text-gray-700">{client.salesManager}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Referral partner</p>
                <p className="text-sm text-gray-700">{client.referralPartner}</p>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-xs text-gray-500">Applications</p>
              <ul className="mt-2 grid gap-2">
                {client.applications.map((a) => (
                  <li key={a} className="inline-flex items-center gap-2">
                    <span className="text-sm text-gray-700">{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
