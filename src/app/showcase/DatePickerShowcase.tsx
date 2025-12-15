"use client";

import * as React from "react";

import { DatePicker } from "@/components/DatePicker";
import { Button } from "@/components/Button";

const formatDate = (date: Date | null) => {
  if (!date) return "Not scheduled";
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

export function DatePickerShowcase() {
  const [reviewDate, setReviewDate] = React.useState<Date | null>(null);
  const [offboardingDate, setOffboardingDate] = React.useState<Date | null>(new Date());

  return (
    <section className="flex flex-col gap-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
          Component
        </p>
        <h2 className="text-3xl font-semibold text-gray-900">Date Picker</h2>
        <p className="mt-2 text-sm text-gray-600">
          Calendar-driven selection built on Radix Popover primitives. Surfaces
          match the rest of the input system.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900">Quarterly review</h3>
        <p className="mt-1 text-sm text-gray-600">
          Inline usage with state lifting through <code>value</code> and{" "}
          <code>onChange</code>.
        </p>
        <div className="mt-4 max-w-xs">
          <DatePicker value={reviewDate} onChange={setReviewDate} placeholder="Select review date" />
        </div>
        <p className="mt-3 text-sm text-gray-500">{formatDate(reviewDate)}</p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900">Offboarding workflow</h3>
        <p className="mt-1 text-sm text-gray-600">
          Compose with other primitives to capture handoff schedules.
        </p>
        <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end">
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
              Effective date
            </p>
            <div className="mt-2">
              <DatePicker value={offboardingDate} onChange={setOffboardingDate} />
            </div>
          </div>
          <Button size='lg'>Schedule</Button>
        </div>
      </div>
    </section>
  );
}
