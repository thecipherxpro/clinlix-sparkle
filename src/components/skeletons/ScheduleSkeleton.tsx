import { Skeleton } from "@/components/ui/skeleton";

export const ScheduleSkeleton = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Date scroller */}
      <div className="flex gap-2 overflow-hidden pb-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex-shrink-0">
            <Skeleton className="w-16 h-20 rounded-xl" />
          </div>
        ))}
      </div>
      
      {/* Time slots */}
      <div className="space-y-3">
        <Skeleton className="h-5 w-32" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-card rounded-lg p-4 border border-border">
            <div className="flex items-center justify-between">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-9 w-20 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
