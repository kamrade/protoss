import { IconButton } from "@/components/IconButton";
import {
  DotsHorizontalIcon,
  MixerHorizontalIcon,
  PlusIcon,
  ReloadIcon,
} from "@radix-ui/react-icons";

const variantExamples = [
  { variant: "solid", icon: PlusIcon, label: "Add" },
  { variant: "outline", icon: MixerHorizontalIcon, label: "Filters" },
  { variant: "ghost", icon: DotsHorizontalIcon, label: "More" },
] as const;

const sizeExamples = [
  { size: "sm", label: "Small" },
  { size: "md", label: "Medium" },
  { size: "lg", label: "Large" },
] as const;

export function IconButtonShowcase() {
  return (
    <section className="flex flex-col gap-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
          Component
        </p>
        <h2 className="text-3xl font-semibold text-gray-900">Icon Buttons</h2>
        <p className="mt-2 text-sm text-gray-600">
          Circular buttons for compact icon-only actions. Supports the same slot
          composition and sizing scale as standard buttons.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900">Variants</h3>
        <div className="mt-4 flex flex-wrap gap-4">
          {variantExamples.map(({ variant, icon: Icon, label }) => (
            <div key={variant} className="flex flex-col items-center gap-2">
              <IconButton variant={variant} aria-label={label}>
                <Icon />
              </IconButton>
              <span className="text-xs font-medium text-gray-500">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900">Sizes</h3>
        <div className="mt-4 flex flex-wrap items-end gap-4">
          {sizeExamples.map(({ size, label }) => (
            <div key={size} className="flex flex-col items-center gap-2">
              <IconButton size={size} aria-label={`${label} icon button`}>
                <PlusIcon />
              </IconButton>
              <span className="text-xs font-medium text-gray-500">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900">States</h3>
        <div className="mt-4 flex flex-wrap gap-4">
          <IconButton aria-label="Default add">
            <PlusIcon />
          </IconButton>
          <IconButton disabled aria-label="Disabled filters">
            <MixerHorizontalIcon />
          </IconButton>
          <IconButton aria-label="Refreshing data">
            <ReloadIcon className="animate-spin" />
          </IconButton>
        </div>
      </div>
    </section>
  );
}
