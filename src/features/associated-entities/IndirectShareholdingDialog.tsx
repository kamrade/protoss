"use client";

import * as React from "react";

import { Button } from "@/components/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/Dialog";
import { TextField } from "@/components/TextField";

interface IndirectShareholdingDialogProps {
  open: boolean;
  ownerName: string;
  parentName: string;
  onOpenChange: (open: boolean) => void;
  onSubmit: (shareholding: number) => void;
}

export function IndirectShareholdingDialog({
  open,
  ownerName,
  parentName,
  onOpenChange,
  onSubmit,
}: IndirectShareholdingDialogProps) {
  const [value, setValue] = React.useState("");

  React.useEffect(() => {
    if (open) {
      setValue("");
    }
  }, [open]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const parsed = Number(value);
    if (Number.isNaN(parsed)) {
      return;
    }
    onSubmit(parsed);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Make {ownerName} owner of {parentName}
          </DialogTitle>
          <DialogDescription>
            Specify the indirect shareholding percentage for this ownership link.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <TextField
            label="% Shareholding"
            type="number"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            required
          />
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
