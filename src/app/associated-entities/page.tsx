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
import { IndirectShareholdingDialog } from "@/features/associated-entities/IndirectShareholdingDialog";
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

const isCorporateEntity = (
  entity: AssociatedEntity
): entity is CorporateAssociatedEntity => "name" in entity;

const getEntityLabel = (entity?: AssociatedEntity) => {
  if (!entity) {
    return "";
  }
  return isIndividualEntity(entity)
    ? `${entity.firstName} ${entity.lastName}`
    : entity.name;
};

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
    prefillIndirectShareholdings?: Array<{
      parentId: string;
      shareholding?: string;
    }>;
  } | null>(null);
  const [editingIndividual, setEditingIndividual] =
    React.useState<IndividualAssociatedEntity | null>(null);
  const [editingCorporate, setEditingCorporate] =
    React.useState<CorporateAssociatedEntity | null>(null);
  const [shareholderTarget, setShareholderTarget] =
    React.useState<IndividualAssociatedEntity | null>(null);
  const [userTarget, setUserTarget] =
    React.useState<IndividualAssociatedEntity | null>(null);
  const [indirectLink, setIndirectLink] = React.useState<{
    ownerId: string;
    parentId: string;
  } | null>(null);

  React.useEffect(() => {
    console.log(associatedEntities);
  });


  const openDialog = (
    type: DialogType,
    section: string,
    options?: {
      prefillIndirectShareholdings?: Array<{
        parentId: string;
        shareholding?: string;
      }>;
    }
  ) => {
    setActiveDialog({ type, section, ...options });
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

  const handleAddOwnerFromStructure = (
    parentId: string | null,
    type: DialogType
  ) => {
    if (parentId) {
      openDialog(type, "Shareholders", {
        prefillIndirectShareholdings: [{ parentId }],
      });
    } else {
      openDialog(type, "Shareholders");
    }
  };

  const handleLinkExistingOwner = (parentId: string, ownerId: string) => {
    setIndirectLink({ parentId, ownerId });
  };

  const handleIndirectLinkSubmit = (shareholding: number) => {
    if (!indirectLink) {
      return;
    }
    setAssociatedEntities((prev) =>
      prev.map((entity) =>
        entity.id === indirectLink.ownerId
          ? {
              ...entity,
              affiliation: [
                ...entity.affiliation,
                {
                  type: "INDIRECT_SHAREHOLDER",
                  parentEntity: indirectLink.parentId,
                  shareholding,
                },
              ],
            }
          : entity
      )
    );
    setIndirectLink(null);
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

  const corporateEntities = associatedEntities.filter(isCorporateEntity);

  const handleRemoveAffiliation = (
    entityId: string,
    affiliation: EntitySectionAffiliation
  ) => {
    setAssociatedEntities((prev) =>
      prev.map((entity) =>
        entity.id === entityId
          ? {
              ...entity,
              affiliation: entity.affiliation.filter(
                (aff) => aff.type !== affiliation
              ),
            }
          : entity
      )
    );
  };

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-16">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-semibold text-gray-900">
          Associated Parties
        </h1>
        <p className="text-sm text-gray-600">
          Centralized records for every partner connected to this workspace.
        </p>
      </header>

      <Tabs defaultValue="entities" className="flex flex-col gap-4">
        <TabsList className="self-start bg-white">
          <TabsTrigger value="entities">Associated Parties</TabsTrigger>
          <TabsTrigger value="structure">Shareholder Structure</TabsTrigger>
        </TabsList>
        <TabsContent value="entities">
          <AssociatedEntitySections
            associatedEntities={associatedEntities}
            onOpenDialog={openDialog}
            onSelectExisting={handleExistingSelection}
            onCardClick={handleCardClick}
            onRemoveAffiliation={(entity, affiliation) =>
              handleRemoveAffiliation(entity.id, affiliation)
            }
          />
        </TabsContent>
        <TabsContent value="structure">
          <ShareholderStructure
            onAddOwner={handleAddOwnerFromStructure}
            existingEntities={associatedEntities}
            onLinkExisting={(parentId, ownerId) => {
              if (parentId !== "root") {
                handleLinkExistingOwner(parentId, ownerId);
              }
            }}
            onCardClick={handleCardClick}
          />
        </TabsContent>
      </Tabs>

      <AddIndividual
        open={activeDialog?.type === "individual"}
        onOpenChange={handleDialogChange}
        section={activeDialog?.section ?? ""}
        onSubmit={handleAddIndividual}
        enableIndirectShareholding
        corporateOptions={corporateEntities}
        prefillIndirectShareholdings={activeDialog?.prefillIndirectShareholdings}
      />
      <AddCorporate
        open={activeDialog?.type === "corporate"}
        onOpenChange={handleDialogChange}
        section={activeDialog?.section ?? ""}
        onSubmit={handleAddCorporate}
        enableIndirectShareholding
        corporateOptions={corporateEntities}
        prefillIndirectShareholdings={activeDialog?.prefillIndirectShareholdings}
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
        enableIndirectShareholding
        corporateOptions={corporateEntities}
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
        enableIndirectShareholding
        corporateOptions={corporateEntities}
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
      <IndirectShareholdingDialog
        open={Boolean(indirectLink)}
        ownerName={
          indirectLink
            ? getEntityLabel(
                associatedEntities.find(
                  (entity) => entity.id === indirectLink.ownerId
                )
              )
            : ""
        }
        parentName={
          indirectLink
            ? indirectLink.parentId === "root"
              ? "Starbugz"
              : getEntityLabel(
                  associatedEntities.find(
                    (entity) => entity.id === indirectLink.parentId
                  )
                )
            : ""
        }
        onOpenChange={(open) => {
          if (!open) {
            setIndirectLink(null);
          }
        }}
        onSubmit={handleIndirectLinkSubmit}
      />

      <p className="text-sm text-gray-500">
        Records captured this session: {associatedEntities.length}
      </p>
    </main>
  );
}
