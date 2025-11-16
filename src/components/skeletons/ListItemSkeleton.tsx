import { Skeleton } from "@/components/ui/skeleton";

export const ListItemSkeleton = () => {
  return (
    <div className="flex items-center gap-4 p-4 border-b last:border-0 animate-fade-in">
      <Skeleton className="w-12 h-12 rounded-lg flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="w-8 h-8 rounded" />
    </div>
  );
};

export const ListItemSkeletonList = ({ count = 5 }: { count?: number }) => {
  return (
    <div className="divide-y">
      {Array.from({ length: count }).map((_, i) => (
        <ListItemSkeleton key={i} />
      ))}
    </div>
  );
};

export const GridItemSkeleton = () => {
  return (
    <div className="bg-card rounded-xl shadow-sm border border-border p-4 animate-fade-in">
      <Skeleton className="w-full h-40 rounded-lg mb-4" />
      <div className="space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="flex gap-2 mt-4">
          <Skeleton className="h-9 flex-1 rounded-lg" />
          <Skeleton className="h-9 w-9 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export const GridItemSkeletonList = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <GridItemSkeleton key={i} />
      ))}
    </div>
  );
};
