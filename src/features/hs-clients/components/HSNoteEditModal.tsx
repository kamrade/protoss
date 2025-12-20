"use client";

import * as React from "react";
import type { INote } from "@/features/hs-clients";
import { decodeNoteText } from "@/utils";
import { Button } from "@/components/Button";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
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
  const placeholderHtml = "<p class='text-gray-400'>No content available</p>";
  const initialContent = noteBodyHtml || placeholderHtml;

  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[240px] rounded-xl border border-gray-200 bg-white p-4 text-gray-800 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900",
      },
    },
  });

  React.useEffect(() => {
    if (!editor) {
      return;
    }
    editor.commands.setContent(initialContent, false);
  }, [editor, initialContent]);

  const handleSave = React.useCallback(() => {
    // TODO: wire this handler to persist editor content via API when available.
    onOpenChange(false);
  }, [onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] w-full max-w-xl space-y-6 overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Note</DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-sm text-gray-600">
          Update note details or metadata once this editor is wired up.
        </DialogDescription>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2 rounded-xl border border-gray-200 bg-gray-50/80 p-2">
            <ToolbarButton
              label="Bold"
              active={editor?.isActive("bold")}
              onClick={() => editor?.chain().focus().toggleBold().run()}
              disabled={!editor?.can().chain().focus().toggleBold().run()}
            >
              Bold
            </ToolbarButton>
            <ToolbarButton
              label="Italic"
              active={editor?.isActive("italic")}
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              disabled={!editor?.can().chain().focus().toggleItalic().run()}
            >
              Italic
            </ToolbarButton>
            <ToolbarButton
              label="Bullet list"
              active={editor?.isActive("bulletList")}
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              disabled={!editor?.can().chain().focus().toggleBulletList().run()}
            >
              • List
            </ToolbarButton>
            <ToolbarButton
              label="Ordered list"
              active={editor?.isActive("orderedList")}
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
              disabled={!editor?.can().chain().focus().toggleOrderedList().run()}
            >
              1. List
            </ToolbarButton>
            <ToolbarButton
              label="Quote"
              active={editor?.isActive("blockquote")}
              onClick={() => editor?.chain().focus().toggleBlockquote().run()}
              disabled={!editor?.can().chain().focus().toggleBlockquote().run()}
            >
              Quote
            </ToolbarButton>
            <ToolbarButton
              label="Code"
              active={editor?.isActive("codeBlock")}
              onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
              disabled={!editor?.can().chain().focus().toggleCodeBlock().run()}
            >
              Code
            </ToolbarButton>
            <div className="ml-auto flex gap-2">
              <ToolbarButton
                label="Undo"
                onClick={() => editor?.chain().focus().undo().run()}
                disabled={!editor?.can().chain().focus().undo().run()}
              >
                Undo
              </ToolbarButton>
              <ToolbarButton
                label="Redo"
                onClick={() => editor?.chain().focus().redo().run()}
                disabled={!editor?.can().chain().focus().redo().run()}
              >
                Redo
              </ToolbarButton>
            </div>
          </div>
          <EditorContent editor={editor} />
        </div>
        <DialogFooter className="flex items-center gap-2">
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSave} disabled={!editor}>
            Save (UI only)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface ToolbarButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

function ToolbarButton({ active, children, ...props }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      className={`rounded-lg px-3 py-1 text-sm font-medium transition ${
        active
          ? "bg-gray-900 text-white"
          : "bg-white text-gray-800 hover:bg-gray-100 active:bg-gray-200"
      } disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400`}
      {...props}
    >
      {children}
    </button>
  );
}
