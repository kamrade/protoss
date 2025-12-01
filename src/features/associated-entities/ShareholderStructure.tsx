import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/DropdownMenu";
import type { AssociatedEntity, DialogType, IndividualAssociatedEntity } from "@/types";
import { entitySections } from "@/const";
import { AssociatedEntityCard } from "./AssociatedEntityCard";

interface ShareholderStructureProps {
  onOpenDialog: (type: DialogType, section: string) => void;
  availableIndividuals: IndividualAssociatedEntity[];
  shareholders: AssociatedEntity[];
  onSelectExisting: (entity: IndividualAssociatedEntity) => void;
}

const shareholderSection = entitySections.find(
  (section) => section.affiliation === "SHAREHOLDER"
);

export function ShareholderStructure({
  onOpenDialog,
  availableIndividuals,
  shareholders,
  onSelectExisting,
}: ShareholderStructureProps) {
  const totalShareholding = shareholders.reduce((sum, entity) => {
    const share = entity.affiliation.find(
      ({ type }) => type === "SHAREHOLDER"
    )?.shareholding;
    return sum + (typeof share === "number" ? share : 0);
  }, 0);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Starbugz</h2>
          <p className="text-sm text-gray-600">Root entity</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="text-sm font-semibold text-gray-900 underline-offset-4 hover:underline">
              Add owner
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {shareholderSection?.options.map(({ label, type }) => (
              <DropdownMenuItem
                key={label}
                onSelect={() => onOpenDialog(type, shareholderSection.title)}
              >
                {label}
              </DropdownMenuItem>
            ))}
            {availableIndividuals.length > 0 && (
              <>
                <DropdownMenuSeparator />
                {availableIndividuals.map((individual) => (
                  <DropdownMenuItem
                    key={individual.id}
                    onSelect={(event) => {
                      event.preventDefault();
                      onSelectExisting(individual);
                    }}
                  >
                    Add {individual.firstName} {individual.lastName}
                  </DropdownMenuItem>
                ))}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <p className="mt-2 text-xs text-gray-500">
        Aggregate direct ownership:{" "}
        <span className="font-semibold text-gray-900">
          {totalShareholding.toFixed(2)}%
        </span>
      </p>

      {shareholders.length > 0 ? (
        <div className="mt-6 space-y-4 border-l border-gray-200 pl-6">
          {shareholders.map((entity) => (
            <AssociatedEntityCard
              key={`structure-${entity.id}`}
              entity={entity}
              showShareholding
            />
          ))}
        </div>
      ) : (
        <p className="mt-6 text-sm text-gray-500">
          No direct shareholders yet. Use the Add owner action to attach the first
          record.
        </p>
      )}
    </div>
  );
}
