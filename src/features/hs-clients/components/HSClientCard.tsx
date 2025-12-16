"use client";

import * as React from "react";

import { IHSClient } from "@/types/hs-clients";

interface HSClientCardProps {
  client: IHSClient;
}

const formatDate = (isoDate: string) => {
  if (!isoDate) {
    return "Unknown date";
  }

  const date = new Date(isoDate);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

const statusBadgeClasses =
  "inline-flex items-center gap-2 rounded-full bg-white px-4 py-1 text-sm font-medium text-gray-800";

export function HSClientCard({ client }: HSClientCardProps) {
  return (
    <li className="rounded-2xl border border-gray-100 bg-gray-50 px-6 py-5 shadow-sm transition hover:border-gray-200 hover:bg-gray-100 focus-within:ring-2 focus-within:ring-gray-400 focus-within:ring-offset-2 focus-within:ring-offset-white">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {client.companyName}
          </h2>
          <p className="text-sm text-gray-600">{client.contactEmail}</p>
          <p className="mt-1 text-sm text-gray-500">
            Tenant ID:{" "}
            <span className="font-mono text-gray-800">{client.tenantId}</span>
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Created: {formatDate(client.createdDate)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className={statusBadgeClasses}>
            <span className="h-2 w-2 rounded-full bg-gray-400" />
            {client.status}
          </span>
          <span className={statusBadgeClasses}>
            <span className="h-2 w-2 rounded-full bg-blue-400" />
            KYC: {client.kycStatus}
          </span>
          <span className={statusBadgeClasses}>
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            PEP: {client.pepStatus}
          </span>
        </div>
      </div>
    </li>
  );
}
