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
import type { IndividualAssociatedEntity } from "@/types";

interface MakeShareholderProps {
  open: boolean;
  entity: IndividualAssociatedEntity | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (shareholding: number) => void;
}

export function MakeShareholder({
  open,
  entity,
  onOpenChange,
  onSubmit,
}: MakeShareholderProps) {
  const [value, setValue] = React.useState("");

  React.useEffect(() => {
    if (open) {
      setValue("");
    }
  }, [open]);

  if (!entity) {
    return null;
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const parsed = Number(value) || 0;
    onSubmit(parsed);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Edit {entity.firstName} {entity.lastName}
          </DialogTitle>
          <DialogDescription>
            Set shareholder ownership before adding them to the list.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <TextField
            label="% Shareholding"
            type="number"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="0"
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
