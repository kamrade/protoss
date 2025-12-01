import type { AssociatedEntity, CorporateAssociatedEntity, DialogType } from "@/types";
import { ShareholderCard } from "./ShareholderCard";

interface ShareholderStructureProps {
  onAddOwner: (parentId: string | null, type: DialogType) => void;
  existingEntities: AssociatedEntity[];
  onLinkExisting: (parentId: string, ownerId: string) => void;
}

const getDirectShareholding = (entity: AssociatedEntity) =>
  entity.affiliation.find(({ type }) => type === "SHAREHOLDER")?.shareholding;

const starbugzEntity: CorporateAssociatedEntity = {
  id: "root",
  affiliation: [],
  name: "Starbugz",
  tradingName: "",
  companyNumber: "",
  legalEntityType: "",
  countryOfIncorporation: "",
  dateOfIncorporation: "",
};

export function ShareholderStructure({
  onAddOwner,
  existingEntities,
  onLinkExisting,
}: ShareholderStructureProps) {
  const shareholders = existingEntities.filter((entity) =>
    entity.affiliation.some(({ type }) => type === "SHAREHOLDER")
  );

  const totalShareholding = shareholders.reduce(
    (sum, entity) => sum + (getDirectShareholding(entity) ?? 0),
    0
  );

  const indirectMap = new Map<
    string,
    Array<{ entity: AssociatedEntity; shareholding?: number }>
  >();

  existingEntities.forEach((entity) => {
    entity.affiliation
      .filter(
        (aff) => aff.type === "INDIRECT_SHAREHOLDER" && aff.parentEntity
      )
      .forEach((aff) => {
        const list = indirectMap.get(aff.parentEntity!) ?? [];
        list.push({
          entity,
          shareholding: aff.shareholding,
        });
        indirectMap.set(aff.parentEntity!, list);
      });
  });

  const renderNodes = (
    nodes: Array<{ entity: AssociatedEntity; shareholding?: number }>
  ) => {
    if (!nodes.length) {
      return null;
    }
    return (
      <div className="ShareholderCardWrapper space-y-4 border-l border-gray-200 pl-6">
        {nodes.map(({ entity, shareholding }) => (
          <div key={`shareholder-node-${entity.id}`} className="space-y-2">
            <ShareholderCard
              entity={entity}
              showShareholding
              shareholdingOverride={shareholding}
              ownerMenuEntities={existingEntities}
              onAddOwner={(type) => onAddOwner(entity.id, type)}
              onLinkExisting={(ownerId) => onLinkExisting(entity.id, ownerId)}
            />
            {renderNodes(indirectMap.get(entity.id) ?? [])}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="ShareholderStructure rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <ShareholderCard
            entity={starbugzEntity}
            ownerMenuEntities={existingEntities}
            onAddOwner={(type) => onAddOwner(null, type)}
            onLinkExisting={(ownerId) => onLinkExisting("root", ownerId)}
          />
          <p className="mt-1 text-sm text-gray-600">Root entity</p>
        </div>
      </div>
      <p className="mt-2 text-xs text-gray-500">
        Aggregate direct ownership:{" "}
        <span className="font-semibold text-gray-900">
          {totalShareholding.toFixed(2)}%
        </span>
      </p>

      {renderNodes(
        shareholders.map((entity) => ({
          entity,
          shareholding: getDirectShareholding(entity),
        }))
      ) ?? (
        <p className="mt-6 text-sm text-gray-500">
          No direct shareholders yet. Use the Add owner action to attach the first
          record.
        </p>
      )}
    </div>
  );
}
