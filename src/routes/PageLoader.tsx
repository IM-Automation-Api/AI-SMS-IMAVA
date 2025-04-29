
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const PageLoader = () => (
  <div className="flex min-h-[80vh] items-center justify-center">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-12 h-12 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin"></div>
      <p className="text-sm text-muted-foreground animate-pulse">Loading...</p>
    </div>
  </div>
);

// More granular skeleton loader for content areas
export const ContentLoader = () => (
  <div className="space-y-4 w-full max-w-3xl mx-auto">
    <Skeleton className="h-8 w-1/3" />
    <Skeleton className="h-32 w-full" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Skeleton className="h-24" />
      <Skeleton className="h-24" />
    </div>
  </div>
);
