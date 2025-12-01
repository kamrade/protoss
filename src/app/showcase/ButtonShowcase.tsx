import Link from "next/link";
import { Button } from "@/components/Button";

const variantExamples = [
  { variant: "primary", label: "Primary" },
  { variant: "secondary", label: "Secondary" },
  { variant: "ghost", label: "Ghost" },
] as const;

const sizeExamples = [
  { size: "sm", label: "Small" },
  { size: "md", label: "Medium" },
  { size: "lg", label: "Large" },
] as const;

export function ButtonShowcase() {
  return (
    <>
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Variants</h2>
          <Link
            href="/"
            className="text-sm font-medium text-gray-500 hover:text-gray-900"
          >
            Back home
          </Link>
        </div>
        <div className="mt-4 flex flex-wrap gap-4">
          {variantExamples.map(({ variant, label }) => (
            <Button key={variant} variant={variant}>
              {label}
            </Button>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">Sizes</h2>
        <div className="mt-4 flex flex-wrap items-end gap-4">
          {sizeExamples.map(({ size, label }) => (
            <Button key={size} size={size} variant="primary">
              {label}
            </Button>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">States</h2>
        <div className="mt-4 flex flex-wrap gap-4">
          <Button>Default</Button>
          <Button disabled>Disabled</Button>
          <Button asChild>
            <Link href="/associated-entities">As Child Link</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
