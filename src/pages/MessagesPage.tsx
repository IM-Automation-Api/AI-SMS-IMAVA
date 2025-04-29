
import React, { Suspense } from 'react';
import { MessagesLayout } from "@/components/messages/MessagesLayout";
import { Skeleton } from "@/components/ui/skeleton";

const MessagesLoadingSkeleton = () => (
  <div className="w-full h-full flex flex-col">
    <div className="h-16 border-b flex items-center px-4">
      <Skeleton className="w-48 h-6" />
    </div>
    <div className="flex-1 flex overflow-hidden">
      <div className="w-1/4 border-r p-4 space-y-4">
        <Skeleton className="w-full h-10" />
        <div className="space-y-3">
          <Skeleton className="w-full h-14 rounded-lg" />
          <Skeleton className="w-full h-14 rounded-lg" />
          <Skeleton className="w-full h-14 rounded-lg" />
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-6 space-y-4">
          <Skeleton className="w-2/3 h-16 ml-auto rounded-lg" />
          <Skeleton className="w-3/4 h-16 rounded-lg" />
          <Skeleton className="w-2/3 h-16 ml-auto rounded-lg" />
        </div>
        <div className="border-t p-4">
          <Skeleton className="w-full h-12 rounded-lg" />
        </div>
      </div>
    </div>
  </div>
);

export default function MessagesPage() {
  return (
    <Suspense fallback={<MessagesLoadingSkeleton />}>
      <MessagesLayout />
    </Suspense>
  );
}
