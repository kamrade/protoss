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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Select";
import { TextField } from "@/components/TextField";
import type { IndividualAssociatedEntity } from "@/types";

const accessRightsOptions = [
  { value: "viewer", label: "Viewer" },
  { value: "reviewer", label: "Reviewer" },
  { value: "admin", label: "Admin" },
] as const;

interface MakeUserProps {
  open: boolean;
  entity: IndividualAssociatedEntity | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (params: { mobileNumber: string; accessRights: string }) => void;
}

export function MakeUser({
  open,
  entity,
  onOpenChange,
  onSubmit,
}: MakeUserProps) {
  const [mobileNumber, setMobileNumber] = React.useState("");
  const [accessRights, setAccessRights] = React.useState("");

  React.useEffect(() => {
    if (entity && open) {
      setMobileNumber(entity.mobileNumber ?? "");
      setAccessRights(entity.accessRights ?? "");
    }
  }, [entity, open]);

  if (!entity) {
    return null;
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit({ mobileNumber, accessRights });
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
            Provide user contact details and assign workspace access level.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <TextField
            label="Mobile number"
            value={mobileNumber}
            onChange={(event) => setMobileNumber(event.target.value)}
          />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
              Access rights
            </p>
            <div className="mt-2">
              <Select
                value={accessRights || undefined}
                onValueChange={(value) => setAccessRights(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select rights" />
                </SelectTrigger>
                <SelectContent>
                  {accessRightsOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
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
