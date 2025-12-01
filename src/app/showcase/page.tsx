import { ButtonShowcase } from "./ButtonShowcase";

export default function ShowcasePage() {
  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-16">
      <header className="space-y-4">
        <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
          Components
        </p>
        <h1 className="text-4xl font-semibold text-gray-900">
          Button Showcase
        </h1>
        <p className="text-lg text-gray-600">
          Examples of the Radix-based Button component across variants, sizes,
          and states. Use this as a reference while building new flows.
        </p>
      </header>
      <ButtonShowcase />;
    </main>
  )
}
