"use client";

import * as React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs";
import { AssociatedEntitySections } from "@/features/associated-entities/AssociatedEntitySections";
import { ShareholderStructure } from "@/features/associated-entities/ShareholderStructure";
import { AddIndividual } from "@/features/associated-entities/AddIndividual";
import { AddCorporate } from "@/features/associated-entities/AddCorporate";
import { EditIndividual } from "@/features/associated-entities/EditIndividual";
import { EditCorporate } from "@/features/associated-entities/EditCorporate";
import { MakeShareholder } from "@/features/associated-entities/MakeShareholder";
import { MakeUser } from "@/features/associated-entities/MakeUser";
import type {
  AssociatedEntity,
  CorporateAssociatedEntity,
  DialogType,
  EntitySectionAffiliation,
  IndividualAssociatedEntity,
} from "@/types";

const isIndividualEntity = (
  entity: AssociatedEntity
): entity is IndividualAssociatedEntity => "firstName" in entity;

const appendAffiliation = (
  entity: IndividualAssociatedEntity,
  affiliation: EntitySectionAffiliation,
  extras?: Partial<{ shareholding?: number }>
) => {
  if (entity.affiliation.some(({ type }) => type === affiliation)) {
    return entity;
  }
  return {
    ...entity,
    affiliation: [...entity.affiliation, { type: affiliation, ...extras }],
  };
};

export default function AssociatedEntitiesPage() {
  const [associatedEntities, setAssociatedEntities] =
    React.useState<AssociatedEntity[]>([]);
  const [activeDialog, setActiveDialog] = React.useState<{
    type: DialogType;
    section: string;
  } | null>(null);
  const [editingIndividual, setEditingIndividual] =
    React.useState<IndividualAssociatedEntity | null>(null);
  const [editingCorporate, setEditingCorporate] =
    React.useState<CorporateAssociatedEntity | null>(null);
  const [shareholderTarget, setShareholderTarget] =
    React.useState<IndividualAssociatedEntity | null>(null);
  const [userTarget, setUserTarget] =
    React.useState<IndividualAssociatedEntity | null>(null);

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

  const assignAffiliation = (
    entity: IndividualAssociatedEntity,
    affiliation: EntitySectionAffiliation
  ) => {
    const updated = appendAffiliation(entity, affiliation);
    handleUpdateIndividual(updated);
  };

  const handleExistingSelection = (
    individual: IndividualAssociatedEntity,
    affiliation: EntitySectionAffiliation
  ) => {
    switch (affiliation) {
      case "SHAREHOLDER":
        setShareholderTarget(individual);
        break;
      case "USER":
        setUserTarget(individual);
        break;
      case "DIRECTOR":
      case "AUTHORISED_SIGNATORY":
        assignAffiliation(individual, affiliation);
        break;
      default:
        break;
    }
  };

  const handleMakeShareholder = (shareholding: number) => {
    if (!shareholderTarget) {
      return;
    }
    const updated = appendAffiliation(shareholderTarget, "SHAREHOLDER", {
      shareholding,
    });
    handleUpdateIndividual(updated);
    setShareholderTarget(null);
  };

  const handleMakeUser = ({
    mobileNumber,
    accessRights,
  }: {
    mobileNumber: string;
    accessRights: string;
  }) => {
    if (!userTarget) {
      return;
    }
    const updated = appendAffiliation(userTarget, "USER");
    handleUpdateIndividual({
      ...updated,
      mobileNumber,
      accessRights,
    });
    setUserTarget(null);
  };

  const handleCardClick = (entity: AssociatedEntity) => {
    if (isIndividualEntity(entity)) {
      setEditingIndividual(entity);
    } else {
      setEditingCorporate(entity);
    }
  };

  const shareholderAvailableIndividuals = associatedEntities.filter(
    (entity) =>
      isIndividualEntity(entity) &&
      !entity.affiliation.some(({ type }) => type === "SHAREHOLDER")
  );

  const shareholderEntities = associatedEntities.filter((entity) =>
    entity.affiliation.some(({ type }) => type === "SHAREHOLDER")
  );

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

      <Tabs defaultValue="entities" className="flex flex-col gap-4">
        <TabsList className="self-start bg-white">
          <TabsTrigger value="entities">Associated Entities</TabsTrigger>
          <TabsTrigger value="structure">Shareholder Structure</TabsTrigger>
        </TabsList>
        <TabsContent value="entities">
          <AssociatedEntitySections
            associatedEntities={associatedEntities}
            onOpenDialog={openDialog}
            onSelectExisting={handleExistingSelection}
            onCardClick={handleCardClick}
          />
        </TabsContent>
        <TabsContent value="structure">
          <ShareholderStructure
            onOpenDialog={openDialog}
            availableIndividuals={shareholderAvailableIndividuals as IndividualAssociatedEntity[]}
            shareholders={shareholderEntities}
            onSelectExisting={(individual) =>
              handleExistingSelection(individual, "SHAREHOLDER")
            }
          />
        </TabsContent>
      </Tabs>

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
      <MakeShareholder
        open={Boolean(shareholderTarget)}
        entity={shareholderTarget}
        onOpenChange={(open) => {
          if (!open) {
            setShareholderTarget(null);
          }
        }}
        onSubmit={handleMakeShareholder}
      />
      <MakeUser
        open={Boolean(userTarget)}
        entity={userTarget}
        onOpenChange={(open) => {
          if (!open) {
            setUserTarget(null);
          }
        }}
        onSubmit={handleMakeUser}
      />

      <p className="text-sm text-gray-500">
        Records captured this session: {associatedEntities.length}
      </p>
    </main>
  );
}
