import { Skeleton } from "@/components/ui/skeleton";

export const BookingCardSkeleton = () => {
  return (
    <div className="bg-card rounded-xl shadow-sm border border-border animate-fade-in">
      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1">
            <Skeleton className="h-12 w-12 rounded-full shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Skeleton className="h-6 w-20 rounded-full shrink-0" />
        </div>
        
        {/* Essential Info */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full max-w-xs" />
          <Skeleton className="h-4 w-full max-w-sm" />
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-2 pt-2">
          <Skeleton className="h-9 flex-1 rounded-lg" />
          <Skeleton className="h-9 w-9 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export const BookingCardSkeletonList = ({ count = 3 }: { count?: number }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <BookingCardSkeleton key={i} />
      ))}
    </div>
  );
};
