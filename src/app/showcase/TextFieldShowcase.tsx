import { TextField } from "@/components/TextField";
import {
  EnvelopeClosedIcon,
  Link2Icon,
  LockClosedIcon,
  MagnifyingGlassIcon,
  PersonIcon,
} from "@radix-ui/react-icons";

const stateExamples = [
  {
    label: "Work email",
    description: "Notifications and invites land here.",
    placeholder: "team@workspace.com",
    leadingVisual: <EnvelopeClosedIcon className="h-4 w-4" />,
  },
  {
    label: "Invite link",
    description: "Share-only link, not editable.",
    value: "https://app.protoss.com/invite/team-alpha",
    disabled: true,
    leadingVisual: <Link2Icon className="h-4 w-4" />,
  },
  {
    label: "Workspace slug",
    placeholder: "acme-co",
    errorMessage: "This slug is already taken.",
    leadingVisual: <LockClosedIcon className="h-4 w-4" />,
  },
] as const;

const intentExamples = [
  {
    label: "Owner",
    description: "Synced from the CRM record.",
    value: "miran.jiang@acme.com",
    intent: "success",
    leadingVisual: <PersonIcon className="h-4 w-4" />,
  },
  {
    label: "Seats remaining",
    description: "Higher tiers unlock more seats.",
    value: "2 of 5",
    intent: "warning",
    trailingVisual: "Upgrade",
  },
] as const;

const decoratorExamples = [
  {
    label: "Search members",
    placeholder: "Search by name, email, or tag",
    description: "Supports fuzzy lookup across the workspace.",
    leadingVisual: <MagnifyingGlassIcon className="h-4 w-4" />,
  },
  {
    label: "Billing currency",
    placeholder: "0.00",
    description: "Optional, defaults to USD.",
    trailingVisual: <span className="text-xs font-semibold text-gray-500">USD</span>,
  },
] as const;

export function TextFieldShowcase() {
  return (
    <section className="flex flex-col gap-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
          Component
        </p>
        <h2 className="text-3xl font-semibold text-gray-900">Text Fields</h2>
        <p className="mt-2 text-sm text-gray-600">
          Radix-powered inputs with helper messaging, validation tone, and slots
          for icons or inline actions.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900">States</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {stateExamples.map((field) => (
            <TextField key={field.label} {...field} />
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900">Validation tone</h3>
        <p className="mt-1 text-sm text-gray-600">
          Communicate read-only or success states without relying on error
          styling alone.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {intentExamples.map((field) => (
            <TextField key={field.label} {...field} />
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900">Slots</h3>
        <p className="mt-1 text-sm text-gray-600">
          Prefix or suffix content plugs in via Radix Slot for icons, badges, or
          actions.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {decoratorExamples.map((field) => (
            <TextField key={field.label} {...field} />
          ))}
        </div>
      </div>
    </section>
  );
}
