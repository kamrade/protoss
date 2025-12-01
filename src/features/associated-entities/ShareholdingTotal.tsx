interface ShareholdingTotalProps {
  value: number;
}

export function ShareholdingTotal({ value }: ShareholdingTotalProps) {
  const exceedsLimit = value > 100;
  return (
    <div className="mt-4 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
      <p className="text-sm font-semibold text-gray-900">
        Total shareholding:{" "}
        <span className={exceedsLimit ? "text-red-600" : "text-gray-900"}>
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
