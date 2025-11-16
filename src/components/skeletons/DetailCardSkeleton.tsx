import { Skeleton } from "@/components/ui/skeleton";

export const DetailCardSkeleton = () => {
  return (
    <div className="bg-card rounded-xl shadow-sm border border-border p-6 animate-fade-in">
      <div className="space-y-4">
        {/* Title */}
        <Skeleton className="h-6 w-48" />
        
        {/* Details grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
        
        {/* Divider */}
        <Skeleton className="h-px w-full" />
        
        {/* Additional section */}
        <div className="space-y-3">
          <Skeleton className="h-5 w-32" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex gap-3 pt-4">
          <Skeleton className="h-10 flex-1 rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export const DetailCardSkeletonList = ({ count = 2 }: { count?: number }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <DetailCardSkeleton key={i} />
      ))}
    </div>
  );
};
