"use client";

import * as React from "react";
import { useParams } from "next/navigation";

import { useApiKey } from "@/context/api-key";
import { getApplicationNotes } from "@/features/hs-clients/api/get-notes";
import type { INote } from "@/features/hs-clients";
import { decodeNoteText } from "@/utils";

export default function HSApplicationNotesPage() {
  const { apiKey } = useApiKey();
  const { applicationId } = useParams<{ applicationId: string }>();

  const [notes, setNotes] = React.useState<INote[] | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!apiKey || !applicationId) {
      setNotes(null);
      setError(apiKey ? null : "Provide API key to fetch notes.");
      return;
    }

    let active = true;
    setLoading(true);
    setError(null);

    getApplicationNotes(apiKey, applicationId)
      .then((data) => {
        if (!active) return;
        setNotes(data);
        setLoading(false);
        console.log(data);
      })
      .catch((err) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : String(err));
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [apiKey, applicationId]);

  return (
    <main className="mx-auto max-w-5xl px-6 space-y-6">
      <header>
        <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
          Notes
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-gray-900">
          Application {applicationId}
        </h1>
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
          {notes.map((note) => (
            <li
              key={note.id}
              className={`rounded-2xl border border-gray-200 p-5 shadow-sm ${
                note.isInternal ? "bg-gray-50" : "bg-white"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {note.title || "Untitled note"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {note.modifiedDate &&
                      <>
                        Updated {new Date(note.modifiedDate).toLocaleString()} by{" "}
                      </>
                    }
                    {note.modifiedByName ?? note.modifiedByName}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 text-xs uppercase tracking-wide text-gray-500">
                  {note.isSummary && (
                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-yellow-900">
                      Summary
                    </span>
                  )}
                  {note.isInternal && (
                    <span className="rounded-full bg-gray-200 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-gray-800">
                      Internal
                    </span>
                  )}
                  {note.isDraft && <span>Draft</span>}
                </div>
              </div>
              <div
                className="prose prose-sm mt-4 max-w-none break-words text-gray-700"
                style={{ overflowWrap: "anywhere" }}
                dangerouslySetInnerHTML={{
                  __html: decodeNoteText(note.text) || "<p>No description provided.</p>",
                }}
              />

              {note.documents && note.documents.length > 0 && (
                <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50/60 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Documents
                  </p>
                  <ul className="mt-2 space-y-1">
                    {note.documents.map((doc) => (
                      <li
                        key={doc.id}
                        className="text-sm text-gray-600"
                      >
                        {doc.fileName} ({Math.round(doc.fileSize / 1024)} KB)
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
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
