export default function AssociatedEntitiesPage() {
  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-16">
      <header>
        <p className="text-sm uppercase tracking-wide text-gray-500">
          Operations
        </p>
        <h1 className="text-4xl font-semibold text-gray-900">
          Associated Entities
        </h1>
        <p className="mt-3 text-lg text-gray-600">
          Track and review every partner, vendor, and subsidiary linked to your
          organization with clear ownership context.
        </p>
      </header>
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold text-gray-900">
          Nothing to review yet
        </p>
        <p className="mt-2 text-gray-600">
          Start by uploading entity information to get a consolidated picture of
          your ecosystem relationships.
        </p>
      </section>
    </main>
  );
}
