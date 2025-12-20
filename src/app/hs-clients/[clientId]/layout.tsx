"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useApiKey } from "@/context/api-key";
import { getHSClients, getHSApplications } from "@/features/hs-clients/api";
import {
  IHSClientOverview,
  IApplication,
  getCategoryShortNameById,
} from "@/features/hs-clients";
import { Badge } from "@/components/Badge";
import {
  HSSidebar,
  HSSidebarAccordion,
  HSSidebarItem,
  HSSidebarSubtitle,
} from "@/features/hs-clients";

export default function ClientPageLayout({ children }: { children: React.ReactNode }) {

  const { apiKey } = useApiKey();
  const [client, setClient] = React.useState<IHSClientOverview | null>(null);
  const [applications, setApplications] = React.useState<IApplication[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const abortRef = React.useRef(false);

  const { clientId } = useParams<{ clientId: string }>();

  const loadClientData = React.useCallback(async () => {
    if (!apiKey || !clientId) {
      return;
    }

    setLoading(true);
    setError(null);
    setApplications([]);

    try {
      const clientData = (await getHSClients({ apiKey, clientId })) as IHSClientOverview;
      if (abortRef.current) return;
      setClient(clientData);

      const applicationsResponse = await getHSApplications(
        apiKey,
        "createdDate",
        "desc",
        "",
        0,
        80,
        clientData.id
      );
      if (abortRef.current) return;
      setApplications(applicationsResponse.content);
    } catch (err) {
      if (abortRef.current) return;
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      if (!abortRef.current) {
        setLoading(false);
      }
    }
  }, [apiKey, clientId]);

  React.useEffect(() => {
    abortRef.current = false;
    loadClientData();
    return () => {
      abortRef.current = true;
    };
  }, [loadClientData]);

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

  const overviewHref = `/hs-clients/${client.id}/overview`;

  const getApplicationTitle = (app: IApplication) => {
    return `${app.kind} ${app.categoryId ? getCategoryShortNameById(app.categoryId) : ''}`;
  }

  return (
    <section className="ClientPageLayout">

      <div className="mx-auto max-w-5xl">
        <header className="border-b border-gray-300 py-6">
          <Link href="/hs-clients" className="text-sm text-gray-500 underline">
            ← Back to clients
          </Link>
          <h1 className="mt-4 text-4xl font-semibold text-gray-900">
            {client.companyName}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Created: {new Date(client.createdDate).toLocaleString()} by{" "}
            {client.createdByName}
          </p>

          <div className="mt-4 flex gap-3">
            <Badge variant="subtle">
              Status:
              <span className="capitalize">{client.status.toLowerCase()}</span>
            </Badge>
            <Badge
              variant="subtle"
              asChild
              className={loading ? "opacity-60" : ""}
            >
              <button
                type="button"
                onClick={loadClientData}
                disabled={loading}
                className="inline-flex items-center gap-1"
              >
                Reload data
              </button>
            </Badge>
          </div>
        </header>
      </div>

       <main className="min-h-screen">
        <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-10 md:flex-row">
          <HSSidebar>
            <HSSidebarItem href={overviewHref} active>
              Overview
            </HSSidebarItem>
            <HSSidebarSubtitle>Applications</HSSidebarSubtitle>
            
            {applications.map((app: IApplication) => (
              <HSSidebarAccordion key={app.id} title={getApplicationTitle(app)}>
                <HSSidebarItem
                  href={`/hs-clients/${client.id}/applications/${app.id}/forms`}
                >
                  Forms
                </HSSidebarItem>
                <HSSidebarItem
                  href={`/hs-clients/${client.id}/applications/${app.id}/documents`}
                >
                  Documents
                </HSSidebarItem>
                <HSSidebarItem
                  href={`/hs-clients/${client.id}/applications/${app.id}/notes`}
                >
                  Notes
                </HSSidebarItem>
              </HSSidebarAccordion>
            ))}
          </HSSidebar>

          <div className="flex-1">
            

            <div>
              {children}
            </div>
            {/* <section className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-gray-200 bg-white p-6">
                <h3 className="text-sm font-semibold text-gray-900">Contact</h3>
                <p className="mt-2 text-sm text-gray-600">
                  {client.contactFirstName} {client.contactMiddleName}{" "}
                  {client.contactLastName}
                </p>
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
                    <p className="text-sm text-gray-700">
                      {client.referralPartner}
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-xs text-gray-500">Applications</p>
                  <ul className="mt-2 grid gap-2">
                    {applications.map((app) => (
                      <li key={app.id} className="inline-flex flex-col gap-0.5">
                        <span className="text-sm text-gray-700">{app.number}</span>
                        <span className="text-xs text-gray-500">{app.kind}</span>
                        {app.categoryId ? (
                          <span className="text-xs text-gray-500">
                            {getCategoryShortNameById(app.categoryId)}
                          </span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section> */}
          </div>
        </div>
      </main>
    </section>
  );
}
