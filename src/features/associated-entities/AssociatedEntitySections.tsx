import { IconButton } from "@/components/IconButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/DropdownMenu";
import { PlusIcon } from "@radix-ui/react-icons";
import type {
  AssociatedEntity,
  DialogType,
  EntitySectionAffiliation,
  IndividualAssociatedEntity,
} from "@/types";
import { entitySections } from "@/const";
import { AssociatedEntityCard } from "./AssociatedEntityCard";
import { ShareholdingTotal } from "./ShareholdingTotal";

interface AssociatedEntitySectionsProps {
  associatedEntities: AssociatedEntity[];
  onOpenDialog: (type: DialogType, section: string) => void;
  onSelectExisting: (
    entity: IndividualAssociatedEntity,
    affiliation: EntitySectionAffiliation
  ) => void;
  onCardClick: (entity: AssociatedEntity) => void;
}

const isIndividual = (
  entity: AssociatedEntity
): entity is IndividualAssociatedEntity => "firstName" in entity;

export function AssociatedEntitySections({
  associatedEntities,
  onOpenDialog,
  onSelectExisting,
  onCardClick,
}: AssociatedEntitySectionsProps) {
  return (
    <div className="flex flex-col gap-4">
      {entitySections.map(({ title, affiliation, options }) => {
        const sectionEntities = associatedEntities.filter((entity) =>
          entity.affiliation.some(({ type }) => type === affiliation)
        );

        const availableIndividuals = associatedEntities.filter(
          (entity) =>
            isIndividual(entity) &&
            !entity.affiliation.some(({ type }) => type === affiliation)
        );

        const totalShareholding =
          affiliation === "SHAREHOLDER"
            ? sectionEntities.reduce((sum, entity) => {
                const share = entity.affiliation.find(
                  ({ type }) => type === "SHAREHOLDER"
                )?.shareholding;
                return sum + (typeof share === "number" ? share : 0);
              }, 0)
            : null;

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
                      onSelect={() => onOpenDialog(type, title)}
                    >
                      {label}
                    </DropdownMenuItem>
                  ))}
                  {availableIndividuals.length > 0 && (
                    <>
                      <DropdownMenuSeparator />
                      {availableIndividuals.map((individual) => (
                        <DropdownMenuItem
                          key={`existing-${individual.id}`}
                          onSelect={(event) => {
                            event.preventDefault();
                            onSelectExisting(
                              individual as IndividualAssociatedEntity,
                              affiliation
                            );
                          }}
                        >
                          Add{" "}
                          {(individual as IndividualAssociatedEntity).firstName}{" "}
                          {(individual as IndividualAssociatedEntity).lastName}
                        </DropdownMenuItem>
                      ))}
                    </>
                  )}
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
                    showShareholding={affiliation === "SHAREHOLDER"}
                    onClick={() => onCardClick(entity)}
                  />
                ))
              )}
            </div>
            {affiliation === "SHAREHOLDER" && totalShareholding !== null && (
              <ShareholdingTotal value={totalShareholding} />
            )}
          </section>
        );
      })}
    </div>
  );
}
