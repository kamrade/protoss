"use client";

import { useClientContext } from "@/features/hs-clients/context/client-context";

export default function OverviewPage() {
  const client = useClientContext();

  const renderedFields = (
    <div className="space-y-6 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">

      <FieldRow label="Company" value={client.companyName} />
      <FieldRow label="Business address" value={client.businessAddress} />

      <div className="space-y-4">
        {[
          { label: "Title", value: client.contactTitle },
          { label: "First name", value: client.contactFirstName },
          { label: "Middle name", value: client.contactMiddleName },
          { label: "Last name", value: client.contactLastName },
          { label: "Position", value: client.contactPosition },
          { label: "Phone", value: client.contactPhone },
          { label: "Email", value: client.contactEmail },
        ].map((field) => (
          <FieldRow key={field.label} label={field.label} value={field.value} />
        ))}
      </div>

      <div className="space-y-4 border-t border-gray-100 pt-4">
        <FieldRow label="Sales manager" value={client.salesManager} />
        <FieldRow
          label="Sales person & referral partner"
          value={`${client.salesPersonEmail || "—"} • ${client.referralPartner || "—"}`}
        />
        <FieldRow
          label="Relationship manager email"
          value={client.relationshipManagerEmail}
        />
      </div>
    </div>
  );

  return (
    <main className="mx-auto max-w-5xl px-6 py-8">
      <p className="text-sm uppercase tracking-[0.25em] text-gray-500">Overview</p>
      <div className="mt-6">{renderedFields}</div>
    </main>
  );
}

interface FieldRowProps {
  label: string;
  value?: string | null;
}

function FieldRow({ label, value }: FieldRowProps) {
  return (
    <div>
      <p className="text-xs text-gray-500">
        {label}
      </p>
      <p className="text-sm text-gray-900">{value || "—"}</p>
    </div>
  );
}
