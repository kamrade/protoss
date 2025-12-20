"use client";

import * as React from "react";
import type { INote } from "@/features/hs-clients";
import { decodeNoteText } from "@/utils";
import { Button } from "@/components/Button";
import { TextField } from "@/components/TextField";
import { Checkbox } from "@/components/Checkbox";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  CodeIcon,
  CounterClockwiseClockIcon,
  FontBoldIcon,
  FontItalicIcon,
  ListBulletIcon,
  QuoteIcon,
  ReloadIcon,
} from "@radix-ui/react-icons";
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

  const [title, setTitle] = React.useState(note.title ?? "");
  const [isInternal, setIsInternal] = React.useState(!!note.isInternal);
  const [isSummary, setIsSummary] = React.useState(!!note.isSummary);

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
    editor.commands.setContent(initialContent, { emitUpdate: false });
  }, [editor, initialContent]);

  React.useEffect(() => {
    setTitle(note.title ?? "");
    setIsInternal(!!note.isInternal);
    setIsSummary(!!note.isSummary);
  }, [note]);

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
        <div className="space-y-4">
          <TextField
            label="Title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Enter note title"
          />
          <div className="flex flex-wrap gap-4">
            <Checkbox
              label="Internal"
              checked={isInternal}
              onCheckedChange={(value) => setIsInternal(Boolean(value))}
            />
            <Checkbox
              label="Summary"
              checked={isSummary}
              onCheckedChange={(value) => setIsSummary(Boolean(value))}
            />
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2 rounded-xl border border-gray-200 bg-gray-50/80 p-2">
            <ToolbarButton
              label="Bold"
              icon={<FontBoldIcon className="h-4 w-4" />}
              active={editor?.isActive("bold")}
              onClick={() => editor?.chain().focus().toggleBold().run()}
              disabled={!editor?.can().chain().focus().toggleBold().run()}
            />
            <ToolbarButton
              label="Italic"
              icon={<FontItalicIcon className="h-4 w-4" />}
              active={editor?.isActive("italic")}
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              disabled={!editor?.can().chain().focus().toggleItalic().run()}
            />
            <ToolbarButton
              label="Bullet list"
              icon={<ListBulletIcon className="h-4 w-4" />}
              active={editor?.isActive("bulletList")}
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              disabled={!editor?.can().chain().focus().toggleBulletList().run()}
            />
            <ToolbarButton
              label="Ordered list"
              icon={<ListBulletIcon className="h-4 w-4" />}
              active={editor?.isActive("orderedList")}
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
              disabled={!editor?.can().chain().focus().toggleOrderedList().run()}
            />
            <ToolbarButton
              label="Quote"
              icon={<QuoteIcon className="h-4 w-4" />}
              active={editor?.isActive("blockquote")}
              onClick={() => editor?.chain().focus().toggleBlockquote().run()}
              disabled={!editor?.can().chain().focus().toggleBlockquote().run()}
            />
            <ToolbarButton
              label="Code"
              icon={<CodeIcon className="h-4 w-4" />}
              active={editor?.isActive("codeBlock")}
              onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
              disabled={!editor?.can().chain().focus().toggleCodeBlock().run()}
            />
            <div className="ml-auto flex gap-2">
              <ToolbarButton
                label="Undo"
                icon={<CounterClockwiseClockIcon className="h-4 w-4" />}
                onClick={() => editor?.chain().focus().undo().run()}
                disabled={!editor?.can().chain().focus().undo().run()}
              />
              <ToolbarButton
                label="Redo"
                icon={<ReloadIcon className="h-4 w-4" />}
                onClick={() => editor?.chain().focus().redo().run()}
                disabled={!editor?.can().chain().focus().redo().run()}
              />
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
  icon?: React.ReactNode;
  label: string;
}

function ToolbarButton({ active, icon, label, ...props }: ToolbarButtonProps) {
  const content = icon ?? <span className="text-xs">{label}</span>;
  return (
    <button
      type="button"
      className={`rounded-lg px-3 py-1 text-sm font-medium transition ${
        active
          ? "bg-gray-900 text-white"
          : "bg-white text-gray-800 hover:bg-gray-100 active:bg-gray-200"
      } disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400`}
      aria-label={label}
      title={label}
      {...props}
    >
      <span className="flex items-center justify-center gap-1.5">
        {content}
        <span className="sr-only">{label}</span>
      </span>
    </button>
  );
}
