import { Skeleton } from "@/components/ui/skeleton";

export const ReviewSkeleton = () => {
  return (
    <div className="bg-card rounded-xl shadow-sm border border-border p-4 animate-fade-in">
      <div className="space-y-3">
        {/* Header with avatar and name */}
        <div className="flex items-center gap-3">
          <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        
        {/* Star rating */}
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="w-4 h-4 rounded" />
          ))}
        </div>
        
        {/* Comment */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        
        {/* Date */}
        <Skeleton className="h-3 w-28" />
      </div>
    </div>
  );
};

export const ReviewSkeletonList = ({ count = 3 }: { count?: number }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <ReviewSkeleton key={i} />
      ))}
    </div>
  );
};
