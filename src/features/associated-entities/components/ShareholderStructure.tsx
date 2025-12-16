import type { Affiliation, AssociatedEntity, CorporateAssociatedEntity, DialogType } from "@/features/associated-entities";
import { ShareholderCard } from "./ShareholderCard";
import { ShareholdingTotal } from "./ShareholdingTotal";
import './ShareholderStructure.css';
import { AffiliationType } from "../types";

interface ShareholderStructureProps {
  onAddOwner: (parentId: string | null, type: DialogType) => void;
  existingEntities: AssociatedEntity[];
  onLinkExisting: (parentId: string, ownerId: string) => void;
  onCardClick?: (entity: AssociatedEntity) => void;
}

const getDirectShareholding = (entity: AssociatedEntity) =>
  entity.affiliation.find(({ type }: { type: AffiliationType}) => type === "SHAREHOLDER")?.shareholding;

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
  onCardClick,
}: ShareholderStructureProps) {
  const shareholders = existingEntities.filter((entity) =>
    entity.affiliation.some(({ type }: { type: AffiliationType }) => type === "SHAREHOLDER")
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
        (aff: Affiliation) => aff.type === "INDIRECT_SHAREHOLDER" && aff.parentEntity
      )
      .forEach((aff: Affiliation) => {
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
    <div>
      <div className="ShareholderStructure grid auto-cols-max gap-x-8 gap-y-4">
        
        
        
        {/* ROOT ENTITY */}
        <div style={{ gridColumnStart: 1 }} className="relative">
          {nodes.length > 0 && (
            <span className="ConnectorParent absolute top-1/2 h-px bg-gray-200" />
          )}
          <ShareholderCard
            entity={starbugzEntity}
            showShareholding={false}
            ownerMenuEntities={existingEntities}
            onAddOwner={(type) => onAddOwner(null, type)}
            onLinkExisting={(ownerId) => onLinkExisting("root", ownerId)}
          />
        </div>

        {/* <div>
          {(() => {
            console.log("Nodes", nodes);
            return null;
          })()}
        </div> */}


        {nodes.length === 0 ? null : (
          <>
            {nodes.map(({ entity, shareholding, depth }) => (
              <div
                key={`shareholder-node-${entity.id}-${depth}`}
                style={{ gridColumnStart: depth + 1 }}
                className="relative"
              >
                {depth > 0 && (
                  <>
                    <span className="ConnectorH absolute top-1/2 h-px -translate-x-8 bg-gray-200" />
                    <span className="ConnectorV absolute w-px bg-gray-200" />
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
                  onClick={
                    onCardClick ? () => onCardClick(entity) : undefined
                  }
                />
              </div>
            ))}
          </>
        )}
      </div>



      <ShareholdingTotal value={totalShareholding} />



      {nodes.length === 0 && (
        <p className="mt-6 text-sm text-gray-500">
          No direct shareholders yet. Use the Add owner action to attach the first
          record.
        </p>
      )}


    </div>
  );
}
