"use client";

import * as React from "react";
import type { INote } from "@/features/hs-clients";
import { decodeNoteText } from "@/utils";
import { Button } from "@/components/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/Dialog";

interface HSNoteEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  note: INote;
}

export function HSNoteEditModal({ open, onOpenChange, note }: HSNoteEditModalProps) {
  const noteBodyHtml = React.useMemo(() => decodeNoteText(note.text), [note.text]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] w-full max-w-xl space-y-6 overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Note</DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-sm text-gray-600">
          Update note details or metadata once this editor is wired up.
        </DialogDescription>
        <div
          className="rounded-xl border border-dashed border-gray-200 bg-gray-50/80 p-4 text-sm leading-relaxed text-gray-700"
          style={{ overflowWrap: "anywhere" }}
          dangerouslySetInnerHTML={{
            __html: noteBodyHtml || "<p class='text-gray-400'>No content available</p>",
          }}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
