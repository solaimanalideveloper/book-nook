import { LoaderCircleIcon } from "lucide-react";

export function LoadingSpinner({ label = "Loading..." }: { label?: string }) {
  return (
    <div
      role="status"
      className="flex items-center justify-center gap-3 text-sm text-muted-foreground"
    >
      <LoaderCircleIcon className="size-5 animate-spin text-primary" />
      <span>{label}</span>
    </div>
  );
}
