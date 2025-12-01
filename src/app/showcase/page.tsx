import { ButtonShowcase } from "./ButtonShowcase";
import { IconButtonShowcase } from "./IconButtonShowcase";
import { DropdownMenuShowcase } from "./DropdownMenuShowcase";

export default function ShowcasePage() {
  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-12 px-6 py-16">
      <header className="space-y-4">
        <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
          Components
        </p>
        <h1 className="text-4xl font-semibold text-gray-900">
          Interactive Showcase
        </h1>
        <p className="text-lg text-gray-600">
          Reference implementations for our Radix-powered primitives. Copy these
          patterns when crafting new workflows.
        </p>
      </header>
      <ButtonShowcase />
      <IconButtonShowcase />
      <DropdownMenuShowcase />
    </main>
  );
}
