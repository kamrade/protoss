"use client";

import * as React from "react";
import type { INote, ICaseDocument } from "@/features/hs-clients";
import { decodeNoteText } from "@/utils";

interface HSNoteCardProps {
  note: INote;
}

export function HSNoteCard({ note }: HSNoteCardProps) {
  const documents: ICaseDocument[] =
    // API may return either `document` or `documents`; support both.
    (note as any).documents ?? note.document ?? [];

  const noteBodyHtml =
    decodeNoteText(note.text) || "<p>No description provided.</p>";

  return (
    <li
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
            {note.modifiedDate && (
              <>
                Updated {new Date(note.modifiedDate).toLocaleString()} by{" "}
              </>
            )}
            {note.modifiedByName ?? note.modifiedBy}
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
          __html: noteBodyHtml,
        }}
      />

      {documents.length > 0 && (
        <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50/60 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Documents
          </p>
          <ul className="mt-2 space-y-1">
            {documents.map((doc) => (
              <li key={doc.id} className="text-sm text-gray-600">
                {doc.fileName} ({Math.round(doc.fileSize / 1024)} KB)
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}
