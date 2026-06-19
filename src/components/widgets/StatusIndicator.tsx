export function StatusIndicator() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-success opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-success animate-status-pulse" />
      </span>
      <span className="text-label-caps text-muted-light">
        SEARCHING FOR NEARBY DEVICES...
      </span>
    </div>
  );
}
