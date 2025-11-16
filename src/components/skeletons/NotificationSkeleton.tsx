import { Skeleton } from "@/components/ui/skeleton";

export const NotificationSkeleton = () => {
  return (
    <div className="p-4 border-b animate-fade-in">
      <div className="flex gap-3">
        {/* Icon skeleton */}
        <Skeleton className="w-9 h-9 rounded-full flex-shrink-0 mt-1" />
        
        <div className="flex-1 space-y-2">
          {/* Title */}
          <Skeleton className="h-4 w-3/4" />
          
          {/* Body */}
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
          
          {/* Timestamp */}
          <Skeleton className="h-3 w-24 mt-2" />
        </div>
        
        {/* Unread dot */}
        <Skeleton className="w-2 h-2 rounded-full mt-2" />
      </div>
    </div>
  );
};

export const NotificationSkeletonList = ({ count = 5 }: { count?: number }) => {
  return (
    <div>
      {Array.from({ length: count }).map((_, i) => (
        <NotificationSkeleton key={i} />
      ))}
    </div>
  );
};
