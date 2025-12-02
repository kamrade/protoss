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

type TreeNode = {
  entity: AssociatedEntity;
  shareholding?: number;
  depth: number;
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

  const flattenTree = (
    entity: AssociatedEntity,
    depth: number,
    shareholding?: number
  ): TreeNode[] => {
    const current: TreeNode = { entity, shareholding, depth };
    const children = (indirectMap.get(entity.id) ?? []).flatMap((child) =>
      flattenTree(child.entity, depth + 1, child.shareholding)
    );
    return [current, ...children];
  };

  const nodes = shareholders.flatMap((entity) =>
    flattenTree(entity, 1, getDirectShareholding(entity))
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="grid auto-cols-max gap-x-8 gap-y-4">
        <div style={{ gridColumnStart: 1 }} className="relative pr-8">
          {nodes.length > 0 && (
            <span className="absolute right-0 top-1/2 h-px w-8 bg-gray-200" />
          )}
          <ShareholderCard
            entity={starbugzEntity}
            showShareholding={false}
            ownerMenuEntities={existingEntities}
            onAddOwner={(type) => onAddOwner(null, type)}
            onLinkExisting={(ownerId) => onLinkExisting("root", ownerId)}
          />
          <p className="mt-1 text-sm text-gray-600">Root entity</p>
        </div>
        {nodes.length === 0 ? null : (
          <>
            {nodes.map(({ entity, shareholding, depth }) => (
              <div
                key={`shareholder-node-${entity.id}-${depth}`}
                style={{ gridColumnStart: depth + 1 }}
                className="relative pl-8"
              >
                {depth > 0 && (
                  <>
                    <span className="absolute left-0 top-1/2 h-px w-8 -translate-x-8 bg-gray-200" />
                    <span className="absolute left-[-32px] top-0 h-full w-px bg-gray-200" />
                  </>
                )}
                <ShareholderCard
                  entity={entity}
                  showShareholding
                  shareholdingOverride={shareholding}
                  ownerMenuEntities={existingEntities}
                  onAddOwner={(type) => onAddOwner(entity.id, type)}
                  onLinkExisting={(ownerId) =>
                    onLinkExisting(entity.id, ownerId)
                  }
                />
              </div>
            ))}
          </>
        )}
      </div>

      <p className="mt-4 text-xs text-gray-500">
        Aggregate direct ownership:{" "}
        <span className="font-semibold text-gray-900">
          {totalShareholding.toFixed(2)}%
        </span>
      </p>

      {nodes.length === 0 && (
        <p className="mt-6 text-sm text-gray-500">
          No direct shareholders yet. Use the Add owner action to attach the first
          record.
        </p>
      )}
    </div>
  );
}
