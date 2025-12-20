import type { INote, INoteUpdateHeader } from "@/features/hs-clients";

const HS_APPLICATIONS_ENDPOINT =
  "http://localhost:3030/api/v1/hs-applications";
const DEFAULT_TENANT_ID = "3";

const defaultHeaders = (apiKey: string) => ({
  Authorization: `Bearer ${apiKey}`,
  "x-tenant-id": DEFAULT_TENANT_ID,
  "Content-Type": "application/json",
});

export interface UpdateNoteParams {
  isDraft: boolean;
  isInternal: boolean;
  isSummary: boolean;
  text: string;
  title: string;
}

export async function updateNote(
  apiKey: string,
  applicationId: string,
  noteId: string,
  params: UpdateNoteParams
): Promise<INote> {
  if (!applicationId) {
    throw new Error("applicationId is required to update a note.");
  }

  if (!noteId) {
    throw new Error("noteId is required to update a note.");
  }

  const url = `${HS_APPLICATIONS_ENDPOINT}/${encodeURIComponent(
    applicationId
  )}/notes/${encodeURIComponent(noteId)}`;

  const body: INoteUpdateHeader = {
    filterParams: {},
    isDraft: params.isDraft,
    isInternal: params.isInternal,
    isSummary: params.isSummary,
    referenceId: null,
    referenceType: null,
    taggedUsers: [],
    text: params.text,
    title: params.title,
  };

  const response = await fetch(url, {
    method: "PUT",
    headers: defaultHeaders(apiKey),
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Failed to update note ${noteId} for application ${applicationId} (status ${response.status})`
    );
  }

  return (await response.json()) as INote;
}
