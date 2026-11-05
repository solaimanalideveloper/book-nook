import { LoadingSpinner } from "@/components/shared/loading-spinner";

export default function Loading() {
  return (
    <div className="flex min-h-[65svh] items-center justify-center px-4 py-16">
      <LoadingSpinner label="Loading BookNook..." />
    </div>
  );
}
