
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

export const ThreadSkeleton = () => (
  <div className="space-y-3">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="flex items-start space-x-3 p-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-full" />
        </div>
      </div>
    ))}
  </div>
);
