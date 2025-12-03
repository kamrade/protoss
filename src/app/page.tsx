import Link from "next/link";

const sections = [
  {
    href: "/associated-entities",
    title: "Associated Parties",
    description:
      "Maintain full visibility over every partner, vendor, and subsidiary.",
  },
  {
    href: "/clients-management",
    title: "Clients Management",
    description:
      "Review account health, onboarding status, and upcoming renewals.",
  },
  {
    href: "/live-profile",
    title: "Live Profile",
    description:
      "Monitor individual activity streams and compliance approvals in real time.",
  },
  {
    href: "/showcase",
    title: "Showcase",
    description:
      "Preview Radix-based components and usage guidelines for new screens.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-6 py-16">
      <section className="rounded-3xl border border-gray-200 bg-white px-10 py-16 shadow-sm">
        <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
          Protoss Operations
        </p>
        <h1 className="mt-4 text-4xl font-semibold text-gray-900">
          One workspace for entity, client, and live profile oversight.
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Choose a focus area below to dive into detailed records and real-time
          insights tailored to your team.
        </p>
      </section>
      <section className="grid gap-6 md:grid-cols-2">
        {sections.map(({ href, title, description }) => (
          <Link
            key={href}
            href={href}
            className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-gray-300"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
              <span className="text-sm font-medium text-gray-400 group-hover:text-gray-600">
                →
              </span>
            </div>
            <p className="mt-3 text-gray-600">{description}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
