import { Skeleton } from "@/components/ui/skeleton";

export const DashboardStatsSkeleton = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-card rounded-xl p-4 shadow-sm border border-border">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="w-8 h-8 rounded-lg" />
            </div>
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const DashboardCardSkeleton = () => {
  return (
    <div className="bg-card rounded-xl shadow-sm border border-border p-6 animate-fade-in">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-9 w-24 rounded-lg" />
        </div>
        
        {/* Content */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </div>
    </div>
  );
};

export const DashboardActivitySkeleton = () => {
  return (
    <div className="space-y-4 animate-fade-in">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
          <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-3 w-16" />
        </div>
      ))}
    </div>
  );
};
