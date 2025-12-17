import * as React from "react";
import Link from "next/link";
import ArrowRightUpLineIcon from "remixicon-react/ArrowRightUpLineIcon";
import type { ICase } from "@/features/cases";

interface NotificationItemProps {
  item: ICase;
}

export function NotificationItem({ item }: NotificationItemProps) {

  const createdAt = React.useMemo(() => {
    return new Date(item.createdDateTime).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
    });
  }, [item.createdDateTime]);

  return (
    <li className="py-3">
      <div className="NotificationItem flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-gray-900">{item.caseMetaData.companyName}</p>

          <p className="text-xs text-gray-500">
            {item.description}
          </p>

        </div>

        {item.caseMetaData.haystackClientId && (
          <Link
            href={`/hs-clients/${item.caseMetaData.haystackClientId}`}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Open haystack client"
          >
            <ArrowRightUpLineIcon className="h-5 w-5" />
          </Link>
        )}
      </div>
    </li>
  );
}
