"use client";

import { useClientContext } from "@/features/hs-clients/context/client-context";

export default function OverviewPage() {
  const client = useClientContext();

  const renderedFields = (
    <div className="space-y-6">

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
    <main className="mx-auto max-w-5xl px-3">
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
    <div className="grid grid-cols-[150px_1fr] gap-2 text-sm text-gray-900 border-b border-dashed border-gray-200 pb-3 last:border-b-0 last:pb-0">
      <p className="text-sm text-gray-500">{label}</p>
      <p>{value || "—"}</p>
    </div>
  );
}
