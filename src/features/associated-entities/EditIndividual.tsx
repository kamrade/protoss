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
import type { IndividualAssociatedEntity } from "@/types";

type RoleId = "shareholder" | "director" | "associatedEntity" | "user";

const roleOptions: Array<{ id: RoleId; label: string }> = [
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

interface EditIndividualProps {
  open: boolean;
  entity: IndividualAssociatedEntity | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (entity: IndividualAssociatedEntity) => void;
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
}

const deriveRolesFromEntity = (
  entity: IndividualAssociatedEntity | null
): Record<RoleId, boolean> => {
  const base: Record<RoleId, boolean> = {
    shareholder: false,
    director: false,
    associatedEntity: false,
    user: false,
  };

  entity?.affiliation.forEach((aff) => {
    switch (aff.type) {
      case "SHAREHOLDER":
        base.shareholder = true;
        break;
      case "DIRECTOR":
        base.director = true;
        break;
      case "AUTHORISED_SIGNATORY":
        base.associatedEntity = true;
        break;
      case "USER":
        base.user = true;
        break;
      default:
        break;
    }
  });

  return base;
};

const getShareholdingPercent = (entity: IndividualAssociatedEntity | null) => {
  const shareholdingEntry = entity?.affiliation.find(
    (aff) => aff.type === "SHAREHOLDER"
  );
  return shareholdingEntry?.shareholding
    ? String(shareholdingEntry.shareholding)
    : "";
};

const createFormState = (entity: IndividualAssociatedEntity | null): FormState => ({
  firstName: entity?.firstName ?? "",
  middleName: entity?.middleName ?? "",
  lastName: entity?.lastName ?? "",
  dateOfBirth: entity?.dateOfBirth ? new Date(entity.dateOfBirth) : null,
  placeOfBirth: entity?.placeOfBirth ?? "",
  nationality: entity?.nationality ?? "",
  idNumber: entity?.idNumber ?? "",
  address: entity?.address ?? "",
  city: entity?.city ?? "",
  country: entity?.country ?? "",
  postcode: entity?.postcode ?? "",
  email: entity?.email ?? "",
  mobileNumber: entity?.mobileNumber ?? "",
  accessRights: entity?.accessRights ?? "",
  shareholdingPercent: getShareholdingPercent(entity),
  roles: deriveRolesFromEntity(entity),
});

export function EditIndividual({
  open,
  entity,
  onOpenChange,
  onSubmit,
}: EditIndividualProps) {
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

  const handleFieldChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleRole = (role: RoleId, checked: boolean) => {
    setForm((prev) => ({
      ...prev,
      roles: {
        ...prev.roles,
        [role]: checked,
      },
    }));
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

    const updatedEntity: IndividualAssociatedEntity = {
      ...entity,
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
      affiliation,
    };

    onSubmit(updatedEntity);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Individual</DialogTitle>
          <DialogDescription>
            Update the profile for {entity.firstName} {entity.lastName}.
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
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
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
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
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
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
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
