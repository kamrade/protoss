import Building2LineIcon from "remixicon-react/Building2LineIcon";
import UserLineIcon from "remixicon-react/UserLineIcon";
import type {
  AssociatedEntity,
  IndividualAssociatedEntity,
} from "@/types";

const isIndividualEntity = (
  entity: AssociatedEntity
): entity is IndividualAssociatedEntity => "firstName" in entity;

interface AssociatedEntityCardProps {
  entity: AssociatedEntity;
  className?: string;
  onClick?: () => void;
  showShareholding?: boolean;
  onRemove?: () => void;
}

export function AssociatedEntityCard({
  entity,
  className = "",
  onClick,
  showShareholding = false,
  onRemove,
}: AssociatedEntityCardProps) {
  const shareholding = entity.affiliation.find(
    ({ type }) => type === "SHAREHOLDER"
  )?.shareholding;
  const baseClasses =
    "rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3";
  const interactiveClasses = onClick
    ? "transition hover:border-gray-200 hover:bg-gray-100 cursor-pointer"
    : "";

  const removeButton = onRemove ? (
    <button
      type="button"
      className="text-xs font-semibold text-red-600 hover:underline"
      onClick={(event) => {
        event.stopPropagation();
        onRemove();
      }}
    >
      Delete
    </button>
  ) : null;

  if (isIndividualEntity(entity)) {
    return (
      <div
        onClick={onClick}
        className={`${baseClasses} ${interactiveClasses} ${className} flex items-start justify-between gap-4`}
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
              <span className="font-semibold text-gray-900">
                {shareholding}%
              </span>
            </p>
          )}
        </div>
        {removeButton}
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`${baseClasses} ${interactiveClasses} ${className} flex items-start justify-between gap-4`}
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
            <span className="font-semibold text-gray-900">
              {shareholding}%
            </span>
          </p>
        )}
      </div>
      {removeButton}
    </div>
  );
}
