import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className }: SkeletonProps) => {
  return <div className={cn("skeleton-shimmer rounded-lg", className)} />;
};

export const PropertyCardSkeleton = () => {
  return (
    <div className="bg-card rounded-2xl overflow-hidden shadow-card border border-border/50">
      <Skeleton className="aspect-[4/3] rounded-none" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-14 rounded-full" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-md" />
          <Skeleton className="h-6 w-16 rounded-md" />
          <Skeleton className="h-6 w-16 rounded-md" />
        </div>
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-9 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export const PropertyDetailSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Gallery Skeleton */}
      <div className="grid grid-cols-4 gap-2 aspect-[16/6]">
        <Skeleton className="col-span-2 row-span-2 rounded-l-2xl rounded-r-none" />
        <Skeleton className="rounded-none" />
        <Skeleton className="rounded-tr-2xl rounded-l-none rounded-bl-none" />
        <Skeleton className="rounded-none" />
        <Skeleton className="rounded-br-2xl rounded-l-none rounded-tl-none" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-3">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
            <div className="flex gap-2">
              <Skeleton className="h-7 w-24 rounded-full" />
              <Skeleton className="h-7 w-20 rounded-full" />
              <Skeleton className="h-7 w-28 rounded-full" />
            </div>
          </div>

          <Skeleton className="h-32 w-full rounded-xl" />

          <div className="space-y-3">
            <Skeleton className="h-7 w-32" />
            <div className="grid grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-12 rounded-xl" />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
};
