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
import { DatePicker } from "@/components/DatePicker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Select";
import { TextField } from "@/components/TextField";
import type {
  CorporateAssociatedEntity,
  IndividualAssociatedEntity,
  Affiliation
} from "@/features/associated-entities";

type RoleId = "shareholder" | "director" | "associatedEntity" | "user";

const sectionRolePreset: Record<string, RoleId | undefined> = {
  Shareholders: "shareholder",
  Directors: "director",
  "Authorised Signatories": "associatedEntity",
  Users: "user",
};

const roleOptions: Array<{
  id: RoleId;
  label: string;
}> = [
  { id: "shareholder", label: "Shareholder" },
  { id: "director", label: "Director" },
  { id: "associatedEntity", label: "Associated Entity" },
  { id: "user", label: "User" },
];

const roleToAffiliation = {
  shareholder: "SHAREHOLDER",
  director: "DIRECTOR",
  associatedEntity: "AUTHORISED_SIGNATORY",
  user: "USER",
} as const;

const countryOptions = [
  { value: "united-states", label: "United States" },
  { value: "united-kingdom", label: "United Kingdom" },
  { value: "singapore", label: "Singapore" },
  { value: "australia", label: "Australia" },
] as const;

const accessRightsOptions = [
  { value: "viewer", label: "Viewer" },
  { value: "reviewer", label: "Reviewer" },
  { value: "admin", label: "Admin" },
] as const;

interface AddIndividualProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  section: string;
  onSubmit: (entity: IndividualAssociatedEntity) => void;
  enableIndirectShareholding?: boolean;
  corporateOptions?: CorporateAssociatedEntity[];
  prefillIndirectShareholdings?: Array<{ parentId: string; shareholding?: string }>;
}

interface FormState {
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: Date | null;
  placeOfBirth: string;
  nationality: string;
  idNumber: string;
  address: string;
  city: string;
  country: string;
  postcode: string;
  email: string;
  mobileNumber: string;
  accessRights: string;
  shareholdingPercent: string;
  roles: Record<RoleId, boolean>;
  indirectShareholdings: Array<{ parentId: string; shareholding: string }>;
  indirectShareholdingEnabled: boolean;
}

const createInitialFormState = (
  section: string,
  existing?: IndividualAssociatedEntity,
  enableIndirect?: boolean,
  prefillIndirect?: Array<{ parentId: string; shareholding?: string }>
): FormState => {
  const preset = sectionRolePreset[section];
  const roles: Record<RoleId, boolean> = {
    shareholder: preset === "shareholder",
    director: preset === "director",
    associatedEntity: preset === "associatedEntity",
    user: preset === "user",
  };

  if (existing) {
    existing.affiliation.forEach((aff: Affiliation) => {
      switch (aff.type) {
        case "SHAREHOLDER":
          roles.shareholder = true;
          break;
        case "DIRECTOR":
          roles.director = true;
          break;
        case "AUTHORISED_SIGNATORY":
          roles.associatedEntity = true;
          break;
        case "USER":
          roles.user = true;
          break;
        default:
          break;
      }
    });
  }

  const indirectShareholdings =
    enableIndirect && (existing || prefillIndirect?.length)
      ? existing
        ? existing.affiliation
            .filter((aff: Affiliation) => aff.type === "INDIRECT_SHAREHOLDER")
            .map((aff: Affiliation) => ({
              parentId: aff.parentEntity ?? "",
              shareholding: aff.shareholding?.toString() ?? "",
            }))
        : prefillIndirect?.map((item) => ({
            parentId: item.parentId,
            shareholding: item.shareholding ?? "",
          })) ?? []
      : [];

  const indirectShareholdingEnabled = indirectShareholdings.length > 0;

  return {
    firstName: existing?.firstName ?? "",
    middleName: existing?.middleName ?? "",
    lastName: existing?.lastName ?? "",
    dateOfBirth: existing?.dateOfBirth ? new Date(existing.dateOfBirth) : null,
    placeOfBirth: existing?.placeOfBirth ?? "",
    nationality: existing?.nationality ?? "",
    idNumber: existing?.idNumber ?? "",
    address: existing?.address ?? "",
    city: existing?.city ?? "",
    country: existing?.country ?? "",
    postcode: existing?.postcode ?? "",
    email: existing?.email ?? "",
    mobileNumber: existing?.mobileNumber ?? "",
    accessRights: existing?.accessRights ?? "",
    shareholdingPercent:
      existing?.affiliation.find((aff: Affiliation) => aff.type === "SHAREHOLDER")
        ?.shareholding?.toString() ?? "",
    roles,
    indirectShareholdings,
    indirectShareholdingEnabled,
  };
};

export function AddIndividual({
  open,
  onOpenChange,
  section,
  onSubmit,
  enableIndirectShareholding = true,
  corporateOptions = [],
  prefillIndirectShareholdings,
}: AddIndividualProps) {
  const [form, setForm] = React.useState<FormState>(() =>
    createInitialFormState(
      section,
      undefined,
      enableIndirectShareholding,
      prefillIndirectShareholdings
    )
  );

  React.useEffect(() => {
    if (open) {
      setForm(
        createInitialFormState(
          section,
          undefined,
          enableIndirectShareholding,
          prefillIndirectShareholdings
        )
      );
    }
  }, [open, section, enableIndirectShareholding, prefillIndirectShareholdings]);

  const handleFieldChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleRole = (role: RoleId, value: boolean) => {
    setForm((prev) => ({
      ...prev,
      roles: {
        ...prev.roles,
        [role]: value,
      },
    }));
  };

  const closeDialog = () => {
    onOpenChange(false);
  };

  const addIndirectShareholdingBlock = () => {
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

    const selectedRoles = roleOptions.filter(({ id }) => form.roles[id]);
    const affiliation = selectedRoles.map(({ id }) => ({
      type: roleToAffiliation[id],
      shareholding:
        id === "shareholder" && form.shareholdingPercent
          ? Number(form.shareholdingPercent)
          : undefined,
    }));

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

    const newEntity: IndividualAssociatedEntity = {
      id: globalThis.crypto?.randomUUID
        ? globalThis.crypto.randomUUID()
        : Math.random().toString(36).slice(2),
      firstName: form.firstName,
      middleName: form.middleName,
      lastName: form.lastName,
      dateOfBirth: form.dateOfBirth
        ? form.dateOfBirth.toISOString().split("T")[0]
        : "",
      placeOfBirth: form.placeOfBirth,
      nationality: form.nationality,
      idNumber: form.idNumber,
      address: form.address,
      city: form.city,
      country: form.country,
      postcode: form.postcode,
      email: form.email,
      mobileNumber: form.roles.user ? form.mobileNumber : "",
      accessRights: form.roles.user ? form.accessRights : "",
      affiliation: [...affiliation, ...indirectAffiliations],
    };

    onSubmit(newEntity);
    closeDialog();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Individual</DialogTitle>
          <DialogDescription>
            Complete the profile for this associated individual.
          </DialogDescription>
        </DialogHeader>

        <form className="mt-4 space-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              label="First name"
              value={form.firstName}
              onChange={(event) => handleFieldChange("firstName", event.target.value)}
            />
            <TextField
              label="Middle name"
              value={form.middleName}
              onChange={(event) => handleFieldChange("middleName", event.target.value)}
            />
            <TextField
              label="Last name"
              value={form.lastName}
              onChange={(event) => handleFieldChange("lastName", event.target.value)}
            />
            <div>
              <p className="text-xs text-gray-500">
                Date of birth
              </p>
              <div className="mt-2">
                <DatePicker
                  value={form.dateOfBirth}
                  onChange={(date) =>
                    setForm((prev) => ({ ...prev, dateOfBirth: date }))
                  }
                />
              </div>
            </div>
            <TextField
              label="Place of birth"
              value={form.placeOfBirth}
              onChange={(event) => handleFieldChange("placeOfBirth", event.target.value)}
            />
            <div>
              <p className="text-xs text-gray-500">
                Nationality
              </p>
              <div className="mt-2">
                <Select
                  value={form.nationality || undefined}
                  onValueChange={(value) => handleFieldChange("nationality", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select nationality" />
                  </SelectTrigger>
                  <SelectContent>
                    {countryOptions.map((country) => (
                      <SelectItem key={country.value} value={country.value}>
                        {country.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <TextField
              label="ID number"
              value={form.idNumber}
              onChange={(event) => handleFieldChange("idNumber", event.target.value)}
            />
            <TextField
              label="Email"
              type="email"
              value={form.email}
              onChange={(event) => handleFieldChange("email", event.target.value)}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              label="Address"
              value={form.address}
              onChange={(event) => handleFieldChange("address", event.target.value)}
            />
            <TextField
              label="City"
              value={form.city}
              onChange={(event) => handleFieldChange("city", event.target.value)}
            />
            <div>
              <p className="text-xs text-gray-500">
                Country
              </p>
              <div className="mt-2">
                <Select
                  value={form.country || undefined}
                  onValueChange={(value) => handleFieldChange("country", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countryOptions.map((country) => (
                      <SelectItem key={country.value} value={country.value}>
                        {country.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <TextField
              label="Postcode"
              value={form.postcode}
              onChange={(event) => handleFieldChange("postcode", event.target.value)}
            />
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
              Roles
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              {roleOptions.map((role) => (
                <Checkbox
                  key={role.id}
                  label={role.label}
                  checked={form.roles[role.id]}
                  onCheckedChange={(value) => toggleRole(role.id, Boolean(value))}
                />
              ))}
            </div>
          </div>

          {form.roles.shareholder && (
            <TextField
              label="% Shareholding"
              type="number"
              value={form.shareholdingPercent}
              onChange={(event) => handleFieldChange("shareholdingPercent", event.target.value)}
            />
          )}

          {enableIndirectShareholding && (
            <div className="space-y-3">
              <Checkbox
                label="Indirect shareholding"
                checked={form.indirectShareholdingEnabled}
                onCheckedChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    indirectShareholdingEnabled: Boolean(value),
                  }))
                }
              />
              {form.indirectShareholdingEnabled && (
                <div className="space-y-3">
                  {form.indirectShareholdings.length === 0 ? (
                    <button
                      type="button"
                      className="rounded-xl border border-dashed border-gray-300 py-3 px-4 text-sm text-gray-500 disabled:text-gray-300"
                      onClick={addIndirectShareholdingBlock}
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
                              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
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
                                    {corporateOptions.map((corp) => (
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
                        onClick={addIndirectShareholdingBlock}
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

          {form.roles.user && (
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                label="Mobile number"
                value={form.mobileNumber}
                onChange={(event) => handleFieldChange("mobileNumber", event.target.value)}
              />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
                  Access rights
                </p>
                <div className="mt-2">
                  <Select
                    value={form.accessRights || undefined}
                    onValueChange={(value) => handleFieldChange("accessRights", value)}
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
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setForm(
                  createInitialFormState(
                    section,
                    undefined,
                    enableIndirectShareholding,
                    prefillIndirectShareholdings
                  )
                );
                closeDialog();
              }}
            >
              Cancel
            </Button>
            <Button type="submit">Add Individual</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
