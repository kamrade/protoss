import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Select";
import { Button } from "@/components/Button";

const roleOptions = [
  { value: "admin", label: "Admin" },
  { value: "editor", label: "Editor" },
  { value: "reviewer", label: "Reviewer" },
] as const;

const timezoneOptions = [
  { value: "utc", label: "UTC" },
  { value: "pst", label: "Pacific (PST)" },
  { value: "est", label: "Eastern (EST)" },
  { value: "cet", label: "Central Europe (CET)" },
] as const;

export function SelectShowcase() {
  return (
    <section className="flex flex-col gap-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
          Component
        </p>
        <h2 className="text-3xl font-semibold text-gray-900">Select</h2>
        <p className="mt-2 text-sm text-gray-600">
          Styled Radix Select primitive with surface-ready trigger, content, and
          focus states.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900">Roles</h3>
        <p className="mt-1 text-sm text-gray-600">
          Inline value selection with consistent input affordances.
        </p>
        <div className="mt-4 max-w-xs">
          <Select defaultValue="editor">
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              {roleOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900">Form section</h3>
        <p className="mt-1 text-sm text-gray-600">
          Pair Select with other primitives for inline form actions.
        </p>
        <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end">
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
              Default timezone
            </p>
            <div className="mt-2">
              <Select defaultValue="utc">
                <SelectTrigger>
                  <SelectValue placeholder="Choose timezone" />
                </SelectTrigger>
                <SelectContent>
                  {timezoneOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button size='lg'>Save</Button>
        </div>
      </div>
    </section>
  );
}
