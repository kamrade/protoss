export default function LiveProfilePage() {
  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-16">
      <header>
        <p className="text-sm uppercase tracking-wide text-gray-500">Insights</p>
        <h1 className="text-4xl font-semibold text-gray-900">Live Profile</h1>
        <p className="mt-3 text-lg text-gray-600">
          Surface real-time usage, access history, and compliance status for any
          individual profile as events stream in.
        </p>
      </header>
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold text-gray-900">
          Live event stream is idle
        </p>
        <p className="mt-2 text-gray-600">
          Connect telemetry sources to begin populating this feed with in-flight
          activity records.
        </p>
      </section>
    </main>
  );
}
