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

const sectionRolePreset: Record<string, boolean> = {
  Shareholders: true,
};

const legalEntityTypes = [
  { value: "llc", label: "Limited Liability Company" },
  { value: "plc", label: "Public Limited Company" },
  { value: "ltd", label: "Private Limited Company" },
  { value: "partnership", label: "Partnership" },
] as const;

interface AddCorporateProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  section: string;
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

const createInitialState = (section: string): FormState => ({
  legalEntityName: "",
  tradingName: "",
  registrationNumber: "",
  legalEntityType: "",
  roleShareholder: Boolean(sectionRolePreset[section]),
  shareholdingPercent: "",
});

export function AddCorporate({
  open,
  onOpenChange,
  section,
  onSubmit,
}: AddCorporateProps) {
  const [form, setForm] = React.useState<FormState>(() => createInitialState(section));

  React.useEffect(() => {
    if (open) {
      setForm(createInitialState(section));
    }
  }, [open, section]);

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

    const entity: CorporateAssociatedEntity = {
      id: globalThis.crypto?.randomUUID
        ? globalThis.crypto.randomUUID()
        : Math.random().toString(36).slice(2),
      affiliation,
      name: form.legalEntityName,
      tradingName: form.tradingName,
      companyNumber: form.registrationNumber,
      legalEntityType: form.legalEntityType,
      countryOfIncorporation: "",
      dateOfIncorporation: "",
    };

    onSubmit(entity);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[75vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Corporate</DialogTitle>
          <DialogDescription>
            Create a corporate entity record for the {section.toLowerCase()} section.
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
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setForm(createInitialState(section));
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit">Add Corporate</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
