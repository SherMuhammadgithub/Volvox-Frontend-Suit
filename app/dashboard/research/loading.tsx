import { Skeleton } from "@heroui/skeleton";

export default function LoadingResearchPage() {
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Skeleton className="h-10 w-1/2 mb-4" />
      <Skeleton className="h-16 w-full mb-4" />
      <Skeleton className="h-32 w-full mb-4" />
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    </div>
  );
}
