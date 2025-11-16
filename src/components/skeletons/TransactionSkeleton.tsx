import { Skeleton } from "@/components/ui/skeleton";

export const TransactionSkeleton = () => {
  return (
    <div className="flex items-center justify-between p-4 border-b last:border-0 animate-fade-in">
      <div className="flex items-center gap-4 flex-1">
        <Skeleton className="w-10 h-10 rounded-lg flex-shrink-0" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
      <div className="text-right space-y-2">
        <Skeleton className="h-5 w-20 ml-auto" />
        <Skeleton className="h-3 w-16 ml-auto" />
      </div>
    </div>
  );
};

export const TransactionSkeletonList = ({ count = 5 }: { count?: number }) => {
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <TransactionSkeleton key={i} />
      ))}
    </div>
  );
};

export const WalletStatsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="bg-card rounded-xl p-6 shadow-sm border border-border">
          <div className="space-y-3">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
};
