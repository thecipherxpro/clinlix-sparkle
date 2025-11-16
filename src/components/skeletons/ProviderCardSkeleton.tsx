import { Skeleton } from "@/components/ui/skeleton";

export const ProviderCardSkeleton = () => {
  return (
    <div className="bg-card rounded-xl shadow-sm border border-border p-4 animate-fade-in">
      <div className="flex items-start gap-4">
        {/* Avatar skeleton */}
        <Skeleton className="w-16 h-16 rounded-full flex-shrink-0" />
        
        <div className="flex-1 space-y-3">
          {/* Name and verified badge */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-4 rounded-full" />
          </div>
          
          {/* Rating */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
          
          {/* Bio */}
          <div className="space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
          </div>
          
          {/* Tags/Skills */}
          <div className="flex gap-2 flex-wrap">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-14 rounded-full" />
          </div>
          
          {/* Action buttons */}
          <div className="flex gap-2 mt-4">
            <Skeleton className="h-10 flex-1 rounded-lg" />
            <Skeleton className="h-10 w-10 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProviderCardSkeletonList = ({ count = 3 }: { count?: number }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProviderCardSkeleton key={i} />
      ))}
    </div>
  );
};
