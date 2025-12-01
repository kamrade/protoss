"use client";

import * as React from "react";

import { Button } from "@/components/Button";
import { Checkbox } from "@/components/Checkbox";
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
import type { CorporateAssociatedEntity } from "@/types";

const legalEntityTypes = [
  { value: "llc", label: "Limited Liability Company" },
  { value: "plc", label: "Public Limited Company" },
  { value: "ltd", label: "Private Limited Company" },
  { value: "partnership", label: "Partnership" },
] as const;

const getShareholdingPercent = (entity: CorporateAssociatedEntity | null) => {
  const shareholdingEntry = entity?.affiliation.find(
    (aff) => aff.type === "SHAREHOLDER"
  );
  return shareholdingEntry?.shareholding
    ? String(shareholdingEntry.shareholding)
    : "";
};

interface EditCorporateProps {
  open: boolean;
  entity: CorporateAssociatedEntity | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (entity: CorporateAssociatedEntity) => void;
}

interface FormState {
  legalEntityName: string;
  tradingName: string;
  registrationNumber: string;
  legalEntityType: string;
  roleShareholder: boolean;
  shareholdingPercent: string;
}

const createFormState = (entity: CorporateAssociatedEntity | null): FormState => ({
  legalEntityName: entity?.name ?? "",
  tradingName: entity?.tradingName ?? "",
  registrationNumber: entity?.companyNumber ?? "",
  legalEntityType: entity?.legalEntityType ?? "",
  roleShareholder: Boolean(
    entity?.affiliation.some((aff) => aff.type === "SHAREHOLDER")
  ),
  shareholdingPercent: getShareholdingPercent(entity),
});

export function EditCorporate({
  open,
  entity,
  onOpenChange,
  onSubmit,
}: EditCorporateProps) {
  const [form, setForm] = React.useState<FormState>(() =>
    createFormState(entity)
  );

  React.useEffect(() => {
    if (entity && open) {
      setForm(createFormState(entity));
    }
  }, [entity, open]);

  if (!entity) {
    return null;
  }

  const handleChange = (field: keyof FormState, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const affiliation = form.roleShareholder
      ? [
          {
            type: "SHAREHOLDER" as const,
            shareholding: form.shareholdingPercent
              ? Number(form.shareholdingPercent)
              : undefined,
          },
        ]
      : [];

    const updatedEntity: CorporateAssociatedEntity = {
      ...entity,
      name: form.legalEntityName,
      tradingName: form.tradingName,
      companyNumber: form.registrationNumber,
      legalEntityType: form.legalEntityType,
      affiliation,
    };

    onSubmit(updatedEntity);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[70vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Corporate</DialogTitle>
          <DialogDescription>
            Update information for {entity.name}.
          </DialogDescription>
        </DialogHeader>

        <form className="mt-4 space-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <TextField
              label="Legal entity name"
              value={form.legalEntityName}
              onChange={(event) => handleChange("legalEntityName", event.target.value)}
            />
            <TextField
              label="Trading name (if different)"
              value={form.tradingName}
              onChange={(event) => handleChange("tradingName", event.target.value)}
            />
            <TextField
              label="Company registration number"
              value={form.registrationNumber}
              onChange={(event) => handleChange("registrationNumber", event.target.value)}
            />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
                Legal entity type
              </p>
              <div className="mt-2">
                <Select
                  value={form.legalEntityType || undefined}
                  onValueChange={(value) => handleChange("legalEntityType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {legalEntityTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
              Roles
            </p>
            <Checkbox
              label="Shareholder"
              checked={form.roleShareholder}
              onCheckedChange={(value) =>
                handleChange("roleShareholder", Boolean(value))
              }
            />
          </div>

          {form.roleShareholder && (
            <TextField
              label="% Shareholding"
              type="number"
              value={form.shareholdingPercent}
              onChange={(event) => handleChange("shareholdingPercent", event.target.value)}
            />
          )}

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
