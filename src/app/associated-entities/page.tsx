"use client";

import * as React from "react";

import { IconButton } from "@/components/IconButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/DropdownMenu";
import { PlusIcon } from "@radix-ui/react-icons";
import { AddCorporate } from "@/features/associated-entities/AddCorporate";
import { AddIndividual } from "@/features/associated-entities/AddIndividual";
import { AssociatedEntityCard } from "@/features/associated-entities/AssociatedEntityCard";
import { EditIndividual } from "@/features/associated-entities/EditIndividual";
import { EditCorporate } from "@/features/associated-entities/EditCorporate";

import type {
  AssociatedEntity,
  CorporateAssociatedEntity,
  IndividualAssociatedEntity,
  DialogType
} from "@/types";

import { entitySections } from "@/const";

const isIndividualEntity = (
  entity: AssociatedEntity
): entity is IndividualAssociatedEntity => "firstName" in entity;

export default function AssociatedEntitiesPage() {
  const [associatedEntities, setAssociatedEntities] = React.useState<AssociatedEntity[]>([]);
  const [activeDialog, setActiveDialog] = React.useState<{
    type: DialogType;
    section: string;
  } | null>(null);
  const [editingIndividual, setEditingIndividual] =
    React.useState<IndividualAssociatedEntity | null>(null);
  const [editingCorporate, setEditingCorporate] =
    React.useState<CorporateAssociatedEntity | null>(null);

  const openDialog = (type: DialogType, section: string) => {
    setActiveDialog({ type, section });
  };

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      setActiveDialog(null);
    }
  };

  const handleAddIndividual = (entity: IndividualAssociatedEntity) => {
    setAssociatedEntities((prev) => [...prev, entity]);
  };

  const handleAddCorporate = (entity: CorporateAssociatedEntity) => {
    setAssociatedEntities((prev) => [...prev, entity]);
  };

  const handleUpdateIndividual = (updated: IndividualAssociatedEntity) => {
    setAssociatedEntities((prev) =>
      prev.map((entity) => (entity.id === updated.id ? updated : entity))
    );
  };

  const handleUpdateCorporate = (updated: CorporateAssociatedEntity) => {
    setAssociatedEntities((prev) =>
      prev.map((entity) => (entity.id === updated.id ? updated : entity))
    );
  };

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-16">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-semibold text-gray-900">
          Associated Entities
        </h1>
        <p className="text-sm text-gray-600">
          Centralized records for every partner connected to this workspace.
        </p>
      </header>

      <div className="flex flex-col gap-4">
        {entitySections.map(({ title, affiliation, options }) => {
          const sectionEntities = associatedEntities.filter((entity) =>
            entity.affiliation.some(({ type }) => type === affiliation)
          );

          return (
            <section
              key={title}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <IconButton aria-label={`Add ${title}`}>
                    <PlusIcon />
                  </IconButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {options.map(({ label, type }) => (
                    <DropdownMenuItem
                      key={label}
                      onSelect={() => openDialog(type, title)}
                    >
                      {label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="mt-4 space-y-3">
              {sectionEntities.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No records yet. Use the add button to create the first entry.
                </p>
              ) : (
                sectionEntities.map((entity) => (
                  <AssociatedEntityCard
                    key={`${title}-${entity.id}`}
                    entity={entity}
                    onClick={() => {
                      if (isIndividualEntity(entity)) {
                        setEditingIndividual(entity);
                      } else {
                        setEditingCorporate(entity);
                      }
                    }}
                  />
                ))
              )}
            </div>
          </section>
        );
        })}
      </div>

      <AddIndividual
        open={activeDialog?.type === "individual"}
        onOpenChange={handleDialogChange}
        section={activeDialog?.section ?? ""}
        onSubmit={handleAddIndividual}
      />
      <AddCorporate
        open={activeDialog?.type === "corporate"}
        onOpenChange={handleDialogChange}
        section={activeDialog?.section ?? ""}
        onSubmit={handleAddCorporate}
      />

      <EditIndividual
        open={Boolean(editingIndividual)}
        entity={editingIndividual}
        onOpenChange={(open) => {
          if (!open) {
            setEditingIndividual(null);
          }
        }}
        onSubmit={(entity) => {
          handleUpdateIndividual(entity);
          setEditingIndividual(null);
        }}
      />
      <EditCorporate
        open={Boolean(editingCorporate)}
        entity={editingCorporate}
        onOpenChange={(open) => {
          if (!open) {
            setEditingCorporate(null);
          }
        }}
        onSubmit={(entity) => {
          handleUpdateCorporate(entity);
          setEditingCorporate(null);
        }}
      />

      <p className="text-sm text-gray-500">
        Records captured this session: {associatedEntities.length}
      </p>
    </main>
  );
}
