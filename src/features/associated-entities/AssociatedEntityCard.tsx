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
}

export function AssociatedEntityCard({
  entity,
  className = "",
  onClick,
}: AssociatedEntityCardProps) {
  const baseClasses =
    "rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3";
  const interactiveClasses = onClick
    ? "transition hover:border-gray-200 hover:bg-gray-100 cursor-pointer"
    : "";

  if (isIndividualEntity(entity)) {
    return (
      <div
        onClick={onClick}
        className={`${baseClasses} ${interactiveClasses} ${className}`}
      >
        <p className="text-sm font-semibold text-gray-900">
          {entity.firstName} {entity.lastName}
        </p>
        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
          Individual
        </p>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`${baseClasses} ${interactiveClasses} ${className}`}
    >
      <p className="text-sm font-semibold text-gray-900">{entity.name}</p>
      <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
        Corporate
      </p>
    </div>
  );
}
