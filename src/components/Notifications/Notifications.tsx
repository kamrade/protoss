"use client";

import * as React from "react";
import { IconButton } from "@/components/IconButton";
import { BellIcon } from "@radix-ui/react-icons";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from "@/components/Sheet";
import { useApiKey } from "@/context/api-key";
import { getCases } from "@/features/cases/api/get-cases";
import type { ICase, ICaseResponse } from "@/features/cases";
import { Button } from "@/components/Button";
import { Badge } from "@/components/Badge/Badge";
import { NotificationItem } from "./NotificationItem";

type CaseGroup = {
  dateKey: string;
  label: string;
  timestamp: number;
  items: ICase[];
};

export function Notifications() {
  const { apiKey } = useApiKey();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [cases, setCases] = React.useState<ICaseResponse | null>(null);

  const groupedCases = React.useMemo(() => {
    if (!cases) return [];

    const filtered = cases.content.filter(
      (c) =>
        c?.caseMetaData?.applicationCaseType !== "UPDATED_NOTE" &&
        c?.caseMetaData?.applicationCaseType !== "NEW_NOTE"
    );

    const groups = filtered.reduce<Record<string, CaseGroup>>((acc, item) => {
      const createdDate = new Date(item.createdDateTime);
      const dateKey = createdDate.toISOString().split("T")[0];

      if (!acc[dateKey]) {
        const label = createdDate.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
        acc[dateKey] = {
          dateKey,
          label,
          timestamp: new Date(
            createdDate.getFullYear(),
            createdDate.getMonth(),
            createdDate.getDate()
          ).getTime(),
          items: [],
        };
      }

      acc[dateKey].items.push(item);
      return acc;
    }, {});

    return Object.values(groups)
      .map((group) => ({
        ...group,
        items: [...group.items].sort(
          (a, b) =>
            new Date(b.createdDateTime).getTime() -
            new Date(a.createdDateTime).getTime()
        ),
      }))
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [cases]);

  const fetchCases = React.useCallback(async () => {
    if (!apiKey) return;
    setLoading(true);
    setError(null);

    try {
      const data = await getCases({
        apiKey,
        page: 0,
        size: 200,
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

      <SheetContent className="max-w-md overflow-y-auto overflow-x-hidden">
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>Open cases and recent activity.</SheetDescription>
        </SheetHeader>

        <div className="mt-8">
          {loading && <p className="text-sm text-gray-600">Loading cases...</p>}
          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {!loading && !error && groupedCases.length > 0 && (
            <div className="mt-2 space-y-6">
              {groupedCases.map((group) => (
                <div key={group.dateKey}>
                  <Badge variant="subtle" className="text-xs text-gray-600">
                    {group.label}
                  </Badge>
                  <ul>
                    {group.items.map((item) => (
                      <NotificationItem key={item.caseId} item={item} />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {!loading && !error && cases && groupedCases.length === 0 && (
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
