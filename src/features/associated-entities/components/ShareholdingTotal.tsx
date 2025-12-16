interface ShareholdingTotalProps {
  value: number;
}

export function ShareholdingTotal({ value }: ShareholdingTotalProps) {
  const exceedsLimit = value > 100;
  return (
    <div className="ShareholdingTotal uppercase text-gray-600 tracking-wider mt-8 border-t border-gray-200 py-4">
      <p className="text-sm">
        Total shareholding:{" "}
        <span className={exceedsLimit ? "text-red-600" : "text-gray-600"}>
          {value.toFixed(2)}%
        </span>
      </p>
      {exceedsLimit && (
        <p className="mt-1 text-xs text-red-600">
          Aggregate direct ownership cannot exceed 100%.
        </p>
      )}
    </div>
  );
}
