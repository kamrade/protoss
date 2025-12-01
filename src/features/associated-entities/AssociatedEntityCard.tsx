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
}

export function AssociatedEntityCard({
  entity,
  className = "",
}: AssociatedEntityCardProps) {
  const baseClasses =
    "rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3";

  if (isIndividualEntity(entity)) {
    return (
      <div className={`${baseClasses} ${className}`}>
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
    <div className={`${baseClasses} ${className}`}>
      <p className="text-sm font-semibold text-gray-900">{entity.name}</p>
      <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
        Corporate
      </p>
    </div>
  );
}
