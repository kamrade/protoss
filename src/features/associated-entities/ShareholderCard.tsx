import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/DropdownMenu";
import Building2LineIcon from "remixicon-react/Building2LineIcon";
import UserLineIcon from "remixicon-react/UserLineIcon";
import type {
  AssociatedEntity,
  DialogType,
  IndividualAssociatedEntity,
} from "@/types";
import { entitySections } from "@/const";

const shareholderSection = entitySections.find(
  (section) => section.affiliation === "SHAREHOLDER"
);

const isIndividualEntity = (
  entity: AssociatedEntity
): entity is IndividualAssociatedEntity => "firstName" in entity;

const getEntityLabel = (entity: AssociatedEntity) =>
  isIndividualEntity(entity)
    ? `${entity.firstName} ${entity.lastName}`
    : entity.name;

interface ShareholderCardProps {
  entity: AssociatedEntity;
  className?: string;
  onClick?: () => void;
  showShareholding?: boolean;
  shareholdingOverride?: number;
  ownerMenuEntities?: AssociatedEntity[];
  onAddOwner?: (type: DialogType) => void;
  onLinkExisting?: (ownerId: string) => void;
  ownerMenuLabel?: string;
}

export function ShareholderCard({
  entity,
  className = "",
  onClick,
  showShareholding = false,
  shareholdingOverride,
  ownerMenuEntities,
  onAddOwner,
  onLinkExisting,
  ownerMenuLabel = "Add owner",
}: ShareholderCardProps) {
  const shareholding =
    shareholdingOverride ??
    entity.affiliation.find(({ type }) => type === "SHAREHOLDER")
      ?.shareholding;
  const baseClasses =
    "rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3";
  const interactiveClasses = onClick
    ? "transition hover:border-gray-200 hover:bg-gray-100 cursor-pointer"
    : "";

  const ownerMenu =
    onAddOwner && onLinkExisting ? (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="text-xs font-semibold text-gray-900 underline-offset-4 hover:underline">
            {ownerMenuLabel}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {shareholderSection?.options.map(({ label, type }) => (
            <DropdownMenuItem key={label} onSelect={() => onAddOwner(type)}>
              {label}
            </DropdownMenuItem>
          ))}
          {ownerMenuEntities && ownerMenuEntities.length > 0 && (
            <>
              <DropdownMenuSeparator />
              {ownerMenuEntities
                .filter((candidate) => candidate.id !== entity.id)
                .map((candidate) => (
                  <DropdownMenuItem
                    key={`owner-menu-${candidate.id}`}
                    onSelect={(event) => {
                      event.preventDefault();
                      onLinkExisting(candidate.id);
                    }}
                  >
                    Add {getEntityLabel(candidate)}
                  </DropdownMenuItem>
                ))}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    ) : null;

  if (isIndividualEntity(entity)) {
    return (
      <div
        onClick={onClick}
        className={`IndividualEntity ${baseClasses} ${interactiveClasses} ${className} flex items-start justify-between gap-4`}
      >
        <div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-gray-900/5 p-2 text-gray-900">
              <UserLineIcon className="h-4 w-4" />
            </span>
            <p className="text-sm font-semibold text-gray-900">
              {entity.firstName} {entity.lastName}
            </p>
          </div>
          {showShareholding && typeof shareholding === "number" && (
            <p className="mt-2 text-xs text-gray-600">
              Direct shareholding:{" "}
              <span>{shareholding}%</span>
            </p>
          )}
        </div>
        {ownerMenu}
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`CorporateEntity ${baseClasses} ${interactiveClasses} ${className} flex items-start justify-between gap-4`}
    >
      <div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-gray-900/5 p-2 text-gray-900">
            <Building2LineIcon className="h-4 w-4" />
          </span>
          <p className="text-sm font-semibold text-gray-900">{entity.name}</p>
        </div>
        {showShareholding && typeof shareholding === "number" && (
          <p className="mt-2 text-xs text-gray-600">
            Direct shareholding:{" "}
            <span>{shareholding}%</span>
          </p>
        )}
      </div>
      {ownerMenu}
    </div>
  );
}
