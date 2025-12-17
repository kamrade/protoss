import * as React from "react";
import Link from "next/link";
import ArrowRightUpLineIcon from "remixicon-react/ArrowRightUpLineIcon";
import type { ICase } from "@/features/cases";

interface NotificationItemProps {
  item: ICase;
}

export function NotificationItem({ item }: NotificationItemProps) {

  const createdAt = React.useMemo(() => {
    return new Date(item.createdDateTime).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, [item.createdDateTime]);

  return (
    <li className="my-1">
      <div className="NotificationItem rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-gray-900">
              {createdAt} : {item.description}
            </p>

            <p className="mt-1 text-xs text-gray-600">
              {item.caseMetaData.companyName}
            </p>
          </div>

          {item.caseMetaData.haystackClientId && (
            <Link
              href={`/hs-clients/${item.caseMetaData.haystackClientId}`}
              className="text-gray-400 transition hover:text-gray-600"
              aria-label="Open haystack client"
            >
              <ArrowRightUpLineIcon className="h-5 w-5" />
            </Link>
          )}
        </div>
      </div>
    </li>
  );
}
