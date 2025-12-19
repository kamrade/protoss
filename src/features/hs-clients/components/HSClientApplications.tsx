"use client";

import * as React from "react";
import { useApiKey } from "@/context/api-key";
import { getHSApplications } from "@/features/hs-clients/api";
import type { IApplication } from "@/features/hs-clients";

interface Props {
  clientId: string;
}

export function HSClientApplications({ clientId }: Props) {
  const { apiKey } = useApiKey();
  const [applications, setApplications] = React.useState<IApplication[] | null>(
    null
  );
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!apiKey) {
      setApplications(null);
      setError(null);
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    setError(null);

    getHSApplications(apiKey, "createdDate", "desc", "", 0, 50, clientId)
      .then((response) => {
        if (!active) return;
        setApplications(response.content);
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
      <div className="rounded-3xl border border-dashed border-gray-300 bg-white/80 px-10 py-12 text-center text-gray-600">
        Provide an API key on the home page to view client applications.
      </div>
    );
  }

  if (loading) {
    return (
      <p className="text-center text-sm text-gray-600">
        Loading client applications…
      </p>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-600">
        No applications found for this client yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((app) => (
        <article
          key={app.id}
          className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {app.companyName}
              </p>
              <p className="text-xs text-gray-500">#{app.number}</p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs uppercase tracking-wide text-gray-500">
              <span>KYC: {app.kycStatus}</span>
              <span>PEP: {app.pepStatus}</span>
              <span>Status: {app.mainStatus}</span>
            </div>
          </div>
          <div className="mt-3 text-sm text-gray-600">
            Risk status: {app.riskStatus ?? "Not available"}
          </div>
        </article>
      ))}
    </div>
  );
}
