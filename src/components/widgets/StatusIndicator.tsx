interface StatusIndicatorProps {
  searching?: boolean;
  nearbyCount?: number;
  isGuest?: boolean;
}

export function StatusIndicator({
  searching = true,
  nearbyCount = 0,
  isGuest = false,
}: StatusIndicatorProps) {
  const label = searching
    ? "SEARCHING FOR NEARBY DEVICES..."
    : nearbyCount > 0
      ? `${nearbyCount} NEARBY SHARE${nearbyCount === 1 ? "" : "S"} FOUND`
      : "NO NEARBY SHARES RIGHT NOW";

  return (
    <div className="flex flex-col items-center gap-1.5 sm:flex-row sm:gap-2.5">
      <div className="flex items-center gap-2.5">
        <span className="relative flex h-2 w-2">
          <span
            className={[
              "absolute inline-flex h-full w-full animate-pulse-ring rounded-full opacity-75",
              nearbyCount > 0 ? "bg-primary" : "bg-success",
            ].join(" ")}
          />
          <span
            className={[
              "relative inline-flex h-2 w-2 rounded-full animate-status-pulse",
              nearbyCount > 0 ? "bg-primary" : "bg-success",
            ].join(" ")}
          />
        </span>
        <span className="text-label-caps text-muted-light">{label}</span>
      </div>
      {isGuest && (
        <span className="rounded-full bg-primary-light px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
          Guest · 1 KM limit
        </span>
      )}
    </div>
  );
}
