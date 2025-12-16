import { Badge } from "@/components/Badge";

const variantExamples = [
  { variant: "subtle", label: "Subtle" },
  { variant: "solid", label: "Solid" },
] as const;

const sizeExamples = [
  { size: "sm", label: "Small" },
  { size: "md", label: "Medium" },
] as const;

export function BadgeShowcase() {
  return (
    <section className="flex flex-col gap-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
          Component
        </p>
        <h2 className="text-3xl font-semibold text-gray-900">Badges</h2>
        <p className="mt-2 text-sm text-gray-600">
          Compact status labels for counts, states, or metadata. Built with a
          small API surface for variants, sizes, and slot composition.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900">Variants</h3>
        <div className="mt-4 flex flex-wrap gap-4 items-center">
          {variantExamples.map(({ variant, label }) => (
            <div key={variant} className="flex flex-col items-start gap-2">
              <Badge variant={variant}>{label}</Badge>
              <span className="text-xs font-medium text-gray-500">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900">Sizes</h3>
        <div className="mt-4 flex flex-wrap gap-4 items-center">
          {sizeExamples.map(({ size, label }) => (
            <div key={size} className="flex flex-col items-start gap-2">
              <Badge size={size}>{label}</Badge>
              <span className="text-xs font-medium text-gray-500">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900">Usage</h3>
        <div className="mt-4 flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700">Messages</span>
            <Badge variant="solid">12</Badge>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700">Status</span>
            <Badge variant="subtle">Active</Badge>
          </div>
        </div>
      </div>
    </section>
  );
}
