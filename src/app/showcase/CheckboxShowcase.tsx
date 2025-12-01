"use client";

import * as React from "react";

import { Checkbox } from "@/components/Checkbox";
import { Button } from "@/components/Button";

const permissions = [
  {
    id: "billing",
    title: "Billing access",
    description: "Can view invoices and update payment methods.",
  },
  {
    id: "approvals",
    title: "Approvals",
    description: "Receives requests for deal desk approvals.",
  },
  {
    id: "security",
    title: "Security events",
    description: "Gets notified when new devices sign in.",
  },
] as const;

export function CheckboxShowcase() {
  const [selected, setSelected] = React.useState<Record<string, boolean>>({
    billing: true,
    approvals: false,
    security: true,
  });

  const toggle = (id: string) => (checked: boolean) => {
    setSelected((prev) => ({ ...prev, [id]: Boolean(checked) }));
  };

  return (
    <section className="flex flex-col gap-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
          Component
        </p>
        <h2 className="text-3xl font-semibold text-gray-900">Checkbox</h2>
        <p className="mt-2 text-sm text-gray-600">
          Radix checkbox primitive with label/description pairing for form
          surfaces.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900">Permissions</h3>
        <p className="mt-1 text-sm text-gray-600">
          Controlled usage for managing workspace-level rules.
        </p>
        <div className="mt-4 space-y-4">
          {permissions.map((permission) => (
            <Checkbox
              key={permission.id}
              checked={selected[permission.id]}
              onCheckedChange={toggle(permission.id)}
              label={permission.title}
              description={permission.description}
            />
          ))}
        </div>
        <div className="mt-4 text-sm text-gray-500">
          Enabled:{" "}
          {Object.entries(selected)
            .filter(([, value]) => value)
            .map(([key]) => key)
            .join(", ") || "none"}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900">Inline use</h3>
        <p className="mt-1 text-sm text-gray-600">
          Works without description when paired with quick actions.
        </p>
        <div className="mt-4 flex items-center gap-4">
          <Checkbox label="Remember selection" defaultChecked />
          <Button size="sm">Apply</Button>
        </div>
      </div>
    </section>
  );
}
