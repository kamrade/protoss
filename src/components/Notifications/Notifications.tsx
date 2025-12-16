"use client";

import * as React from "react";
import { IconButton } from "@/components/IconButton";
import { BellIcon } from "@radix-ui/react-icons";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from "@/components/Sheet";
import { useApiKey } from "@/context/api-key";
import { getCases } from "@/features/cases/api/get-cases";
import type { ICaseResponse } from "@/features/cases";
import { Button } from "@/components/Button";

export function Notifications() {
  const { apiKey } = useApiKey();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [cases, setCases] = React.useState<ICaseResponse | null>(null);

  const fetchCases = React.useCallback(async () => {
    if (!apiKey) return;
    setLoading(true);
    setError(null);

    try {
      const data = await getCases({
        apiKey,
        page: 0,
        size: 20,
        caseStatus: "OPEN",
        caseType: "APPLICATION",
      });
      setCases(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [apiKey]);

  React.useEffect(() => {
    if (open) {
      fetchCases();
    }
  }, [open, fetchCases]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <IconButton aria-label="Notifications">
          <BellIcon />
        </IconButton>
      </SheetTrigger>

      <SheetContent className="max-w-md" style={{ overflowY: 'scroll' }}>
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>Open cases and recent activity.</SheetDescription>
        </SheetHeader>

        <div className="mt-4">
          {loading && <p className="text-sm text-gray-600">Loading cases…</p>}
          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {!loading && !error && cases && (
            <ul className="mt-2 divide-y divide-gray-100">
              {cases.content.map((c) => (
                <li key={c.caseId} className="py-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{c.caseMetaData.companyName}</p>
                      <p className="text-sm text-gray-500">{c.caseType} — {c.caseStatus}</p>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <div>{new Date(c.createdDateTime).toLocaleString()}</div>
                      <div className="text-xs">ID: <span className="font-mono">{c.caseId}</span></div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {!loading && !error && cases && cases.content.length === 0 && (
            <p className="text-sm text-gray-600">No open cases.</p>
          )}
        </div>

        <SheetFooter>
          <div className="flex w-full justify-between">
            <Button asChild>
              <a href="/cases">View all cases</a>
            </Button>
            <div className="flex gap-2">
              <SheetClose asChild>
                <Button variant="secondary">Close</Button>
              </SheetClose>
            </div>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
