"use client";

import * as React from "react";
import { useParams } from "next/navigation";

import { useApiKey } from "@/context/api-key";
import { getApplicationNotes } from "@/features/hs-clients/api/get-notes";
import type { INote } from "@/features/hs-clients";
import { Checkbox } from "@/components/Checkbox";
import { HSNoteCard } from "@/features/hs-clients/components";

export default function HSApplicationNotesPage() {
  const { apiKey } = useApiKey();
  const { applicationId } = useParams<{ applicationId: string }>();

  const [notes, setNotes] = React.useState<INote[] | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [hideInternal, setHideInternal] = React.useState(false);

  const fetchNotes = React.useCallback(async () => {
    if (!apiKey || !applicationId) {
      setNotes(null);
      setError(apiKey ? null : "Provide API key to fetch notes.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getApplicationNotes(apiKey, applicationId);
      setNotes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [apiKey, applicationId]);

  React.useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return (
    <main className="mx-auto max-w-5xl px-6 space-y-6">
      <header className="space-y-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
            Notes
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-gray-900">
            Application {applicationId}
          </h1>
        </div>
        <Checkbox
          checked={hideInternal}
          onCheckedChange={(value) => setHideInternal(Boolean(value))}
          label="Hide internal notes"
          containerClassName="items-center text-sm text-gray-700"
        />
      </header>

      {!apiKey ? (
        <div className="rounded-3xl border border-dashed border-gray-300 bg-white/80 px-10 py-12 text-center text-gray-600">
          Provide an API key on the home page to view notes.
        </div>
      ) : loading ? (
        <p className="text-sm text-gray-600">Loading notes…</p>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : notes && notes.length > 0 ? (
        <ul className="space-y-4">
          {notes
            .filter((note) => (hideInternal ? !note.isInternal : true))
            .map((note) => (
              <HSNoteCard key={note.id} note={note} onNoteUpdated={fetchNotes} />
            ))}
        </ul>
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-600">
          No notes for this application yet.
        </div>
      )}
    </main>
  );
}
