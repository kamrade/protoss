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
  enableIndirectShareholding?: boolean;
  corporateOptions?: CorporateAssociatedEntity[];
}

interface FormState {
  legalEntityName: string;
  tradingName: string;
  registrationNumber: string;
  legalEntityType: string;
  roleShareholder: boolean;
  shareholdingPercent: string;
  indirectShareholdings: Array<{ parentId: string; shareholding: string }>;
  indirectShareholdingEnabled: boolean;
}

const createFormState = (
  entity: CorporateAssociatedEntity | null
): FormState => {
  const indirectShareholdings =
    entity?.affiliation
      .filter((aff) => aff.type === "INDIRECT_SHAREHOLDER")
      .map((aff) => ({
        parentId: aff.parentEntity ?? "",
        shareholding: aff.shareholding?.toString() ?? "",
      })) ?? [];

  return {
    legalEntityName: entity?.name ?? "",
    tradingName: entity?.tradingName ?? "",
    registrationNumber: entity?.companyNumber ?? "",
    legalEntityType: entity?.legalEntityType ?? "",
    roleShareholder: Boolean(
      entity?.affiliation.some((aff) => aff.type === "SHAREHOLDER")
    ),
    shareholdingPercent: getShareholdingPercent(entity),
    indirectShareholdings,
    indirectShareholdingEnabled: indirectShareholdings.length > 0,
  };
};

export function EditCorporate({
  open,
  entity,
  onOpenChange,
  onSubmit,
  enableIndirectShareholding = true,
  corporateOptions = [],
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

  const addIndirectShareholding = () => {
    setForm((prev) => ({
      ...prev,
      indirectShareholdings: [
        ...prev.indirectShareholdings,
        { parentId: "", shareholding: "" },
      ],
    }));
  };

  const updateIndirectShareholding = (
    index: number,
    field: "parentId" | "shareholding",
    value: string
  ) => {
    setForm((prev) => {
      const next = [...prev.indirectShareholdings];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, indirectShareholdings: next };
    });
  };

  const removeIndirectShareholding = (index: number) => {
    setForm((prev) => {
      const next = [...prev.indirectShareholdings];
      next.splice(index, 1);
      return { ...prev, indirectShareholdings: next };
    });
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

    const indirectAffiliations =
      enableIndirectShareholding &&
      form.indirectShareholdingEnabled &&
      form.indirectShareholdings.length > 0
        ? form.indirectShareholdings
            .filter((entry) => entry.parentId && entry.shareholding)
            .map((entry) => ({
              type: "INDIRECT_SHAREHOLDER" as const,
              parentEntity: entry.parentId,
              shareholding: Number(entry.shareholding),
            }))
        : [];

    const updatedEntity: CorporateAssociatedEntity = {
      ...entity,
      name: form.legalEntityName,
      tradingName: form.tradingName,
      companyNumber: form.registrationNumber,
      legalEntityType: form.legalEntityType,
      affiliation: [...affiliation, ...indirectAffiliations],
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
              <p className="text-xs text-gray-500">
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

          {enableIndirectShareholding && (
            <div className="space-y-3">
              <Checkbox
                label="Indirect shareholding"
                checked={form.indirectShareholdingEnabled}
                onCheckedChange={(value) =>
                  handleChange("indirectShareholdingEnabled", Boolean(value))
                }
              />
              {form.indirectShareholdingEnabled && (
                <div className="space-y-3">
                  {form.indirectShareholdings.length === 0 ? (
                    <button
                      type="button"
                      className="rounded-xl border border-dashed border-gray-300 py-3 px-4 text-sm text-gray-500 disabled:text-gray-300"
                      onClick={addIndirectShareholding}
                      disabled={corporateOptions.length === 0}
                    >
                      Add indirect shareholding
                    </button>
                  ) : (
                    <>
                      {form.indirectShareholdings.map((entry, index) => (
                        <div
                          key={`indirect-${index}`}
                          className="rounded-2xl border border-gray-100 p-4"
                        >
                          <div className="grid gap-3 md:grid-cols-2">
                            <div>
                              <p className="text-xs text-gray-500">
                                Parent entity
                              </p>
                              <div className="mt-2">
                                <Select
                                  value={entry.parentId || undefined}
                                  onValueChange={(value) =>
                                    updateIndirectShareholding(index, "parentId", value)
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select corporate" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {corporateOptions
                                      .filter((corp) => corp.id !== entity.id)
                                      .map((corp) => (
                                        <SelectItem key={corp.id} value={corp.id}>
                                          {corp.name}
                                        </SelectItem>
                                      ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <TextField
                              label="% Shareholding"
                              type="number"
                              value={entry.shareholding}
                              onChange={(event) =>
                                updateIndirectShareholding(
                                  index,
                                  "shareholding",
                                  event.target.value
                                )
                              }
                            />
                          </div>
                          <button
                            type="button"
                            className="mt-3 text-xs text-gray-500"
                            onClick={() => removeIndirectShareholding(index)}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="rounded-xl border border-dashed border-gray-300 py-3 px-4 text-sm text-gray-500 disabled:text-gray-300"
                        onClick={addIndirectShareholding}
                        disabled={corporateOptions.length === 0}
                      >
                        Add indirect shareholding
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
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
