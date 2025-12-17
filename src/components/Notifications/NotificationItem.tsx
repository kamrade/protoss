import * as React from "react";
import type { ICase } from "@/features/cases";

interface NotificationItemProps {
  item: ICase;
}

export function NotificationItem({ item }: NotificationItemProps) {
  const createdAt = React.useMemo(
    () => new Date(item.createdDateTime).toLocaleString(),
    [item.createdDateTime]
  );

  return (
    <li className="py-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-900">{item.caseMetaData.companyName}</p>
          <p className="text-sm text-gray-500">
            {item.caseType} - {item.caseStatus}
          </p>
        </div>
        <div className="text-right text-sm text-gray-500">
          <div>{createdAt}</div>
          <div className="text-xs">
            ID: <span className="font-mono">{item.caseId}</span>
          </div>
        </div>
      </div>
    </li>
  );
}
