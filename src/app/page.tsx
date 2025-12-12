"use client";

import * as React from "react";
import Link from "next/link";

import { Button } from "@/components/Button";
import { TextField } from "@/components/TextField";
import { useApiKey } from "@/context/api-key";

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
    href: "/users-management",
    title: "Users Management",
    description:
      "List every user across tenants with their permissions and access state.",
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
  const { apiKey, setApiKey } = useApiKey();
  const [inputValue, setInputValue] = React.useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = inputValue.trim();

    if (!trimmed) {
      return;
    }

    setApiKey(trimmed);
  };

  if (!apiKey) {
    const isDisabled = inputValue.trim().length === 0;

    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
        <section className="rounded-3xl border border-gray-200 bg-white px-8 py-10 shadow-sm">
          <p className="text-sm uppercase tracking-[0.3em] text-gray-500">
            Protoss Access
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-gray-900">
            Enter your API key
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Provide the workspace API key from your administrator to unlock the
            operations dashboard.
          </p>
          <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
            <TextField
              label="API key"
              type="password"
              placeholder="sk-..."
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              autoFocus
            />
            <Button type="submit" disabled={isDisabled} className="w-full">
              Continue
            </Button>
          </form>
        </section>
      </main>
    );
  }

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
