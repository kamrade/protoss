export default function ClientsManagementPage() {
  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-16">
      <header>
        <p className="text-sm uppercase tracking-wide text-gray-500">
          Relationships
        </p>
        <h1 className="text-4xl font-semibold text-gray-900">
          Clients Management
        </h1>
        <p className="mt-3 text-lg text-gray-600">
          Oversee onboarding progress, retention signals, and active requests
          for every client account in a single view.
        </p>
      </header>
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold text-gray-900">Coming soon</p>
        <p className="mt-2 text-gray-600">
          We are preparing dashboards for health scores, renewal timelines, and
          milestone tracking.
        </p>
      </section>
    </main>
  );
}
